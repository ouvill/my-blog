/**
 * Cloudflare Pages Function — Contact form handler.
 *
 * Receives a POST from /contact/, validates the input, optionally sends an
 * email via the Cloudflare Email Service Workers binding, and redirects the
 * user to /contact/success/.
 *
 * On validation or server errors the user is redirected back to
 * `/contact/?status=<code>` so the HTML form can display a friendly message.
 * Only non-POST direct access returns a JSON error response.
 *
 * Required bindings / environment variables (set in the Cloudflare dashboard):
 *   EMAIL              – Cloudflare Email Service send_email binding
 *   CONTACT_DB         – D1 database for persisting contact submissions
 *   CONTACT_TO_EMAIL   – Recipient address
 *   CONTACT_FROM_EMAIL – Sender address (must be a verified Email Sending domain)
 */

// ---------------------------------------------------------------------------
// Types — Cloudflare Email Service (minimal local definitions)
// ---------------------------------------------------------------------------

/** Structured e-mail address supported by the Email Sending API. */
interface EmailAddress {
  readonly email: string
  readonly name?: string
}

/**
 * Message shape accepted by `SendEmail.send()`.
 *
 * Only the fields this function actually uses are declared. See the
 * Cloudflare Email Service documentation for the full schema.
 */
interface EmailMessageBuilder {
  readonly to: string | EmailAddress | readonly (string | EmailAddress)[]
  readonly from: string | EmailAddress
  readonly subject: string
  readonly html?: string
  readonly text?: string
  readonly replyTo?: string | EmailAddress
}

/** Workers `send_email` binding exposed as `env.EMAIL`. */
interface SendEmail {
  send(message: EmailMessageBuilder): Promise<{ readonly messageId: string }>
}

// ---------------------------------------------------------------------------
// Types — Cloudflare D1 (minimal local definitions)
// ---------------------------------------------------------------------------

/** Result returned by `D1PreparedStatement.run()`. */
interface D1Result {
  readonly success: boolean
  readonly error?: string
  readonly meta: Readonly<{
    readonly changed_db: boolean
    readonly changes: number
    readonly last_row_id: number | null
    readonly rows_written: number
    readonly duration: number
  }>
}

/**
 * Prepared statement for a D1 SQL query.
 *
 * Only the methods this function actually uses are declared.
 */
interface D1PreparedStatement {
  bind(...values: ReadonlyArray<string | number | null>): D1PreparedStatement
  run(): Promise<D1Result>
}

/** D1 database binding exposed as `env.CONTACT_DB`. */
interface D1Database {
  prepare(query: string): D1PreparedStatement
}

// ---------------------------------------------------------------------------
// Types — Pages Function
// ---------------------------------------------------------------------------

/** Environment variables and bindings bound to this Pages Function. */
interface ContactEnv {
  readonly EMAIL?: SendEmail
  readonly CONTACT_DB?: D1Database
  readonly CONTACT_TO_EMAIL?: string
  readonly CONTACT_FROM_EMAIL?: string
}

/** Minimal subset of the Cloudflare Pages Function context we actually use. */
interface PagesFunctionContext {
  readonly request: Request
  readonly env: ContactEnv
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SUCCESS_REDIRECT_URL = "/contact/success/"
const FORM_REDIRECT_URL = "/contact/"

/** Maximum allowed length for each input field. */
const LIMITS = {
  name: 100,
  email: 254,
  context: 5_000,
}

/**
 * Loose but practical e-mail regex. We are not trying to implement RFC 5322
 * here — the Cloudflare Email Service will reject truly invalid addresses on
 * its own.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
}

function redirect(url: string, status: 303): Response {
  return new Response(null, {
    status,
    headers: { Location: url },
  })
}

/** Build a redirect URL back to the contact form with a status query param. */
function formRedirect(status: string): Response {
  const url = new URL(FORM_REDIRECT_URL, "https://placeholder.invalid")
  url.searchParams.set("status", status)
  return redirect(`${url.pathname}${url.search}`, 303)
}

/**
 * Read a single text field from FormData, returning `undefined` when the key
 * is absent. Throws when the value is not a string (i.e. a File was uploaded
 * for that key — we don't accept file uploads).
 */
function textField(form: FormData, key: string): string | undefined {
  const value = form.get(key)
  if (value === null) return undefined
  if (value instanceof File) {
    throw new Error(`Field "${key}" must be text, got file`)
  }
  return value
}

/** Escape a string for safe inclusion in HTML text content. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

interface ValidatedInput {
  readonly name: string
  readonly email: string
  readonly context: string
}

interface ValidationError {
  readonly field: string
  readonly message: string
}

function validateInput(raw: {
  name: string | undefined
  email: string | undefined
  context: string | undefined
}): { ok: true; data: ValidatedInput } | { ok: false; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  const name = raw.name?.trim() ?? ""
  if (name.length === 0) {
    errors.push({ field: "name", message: "お名前は必須です。" })
  } else if (name.length > LIMITS.name) {
    errors.push({
      field: "name",
      message: `お名前は${LIMITS.name}文字以内にしてください。`,
    })
  }

  const email = raw.email?.trim() ?? ""
  if (email.length === 0) {
    errors.push({ field: "email", message: "メールアドレスは必須です。" })
  } else if (email.length > LIMITS.email) {
    errors.push({
      field: "email",
      message: `メールアドレスは${LIMITS.email}文字以内にしてください。`,
    })
  } else if (!EMAIL_RE.test(email)) {
    errors.push({
      field: "email",
      message: "メールアドレスの形式が正しくありません。",
    })
  }

  const context = raw.context?.trim() ?? ""
  if (context.length === 0) {
    errors.push({ field: "context", message: "お問い合わせ内容は必須です。" })
  } else if (context.length > LIMITS.context) {
    errors.push({
      field: "context",
      message: `お問い合わせ内容は${LIMITS.context}文字以内にしてください。`,
    })
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }
  return { ok: true, data: { name, email, context } }
}

// ---------------------------------------------------------------------------
// Cloudflare Email Service integration
// ---------------------------------------------------------------------------

async function sendEmailViaCloudflare(
  env: ContactEnv,
  input: ValidatedInput,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const emailBinding = env.EMAIL
  const toEmail = env.CONTACT_TO_EMAIL
  const fromEmail = env.CONTACT_FROM_EMAIL

  if (!emailBinding || !toEmail || !fromEmail) {
    return {
      ok: false,
      message:
        "メール送信に必要な環境変数が設定されていません (EMAIL binding, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL)。",
    }
  }

  const subject = `お問い合わせ: ${input.name.replace(/[\r\n]+/g, " ")}`

  const textBody =
    `お問い合わせフォームから新しい問い合わせがありました。\n` +
    `\n` +
    `---\n` +
    `お名前: ${input.name}\n` +
    `メールアドレス: ${input.email}\n` +
    `---\n` +
    `\n` +
    `${input.context}\n`

  const htmlBody =
    `<h2>お問い合わせフォームから新しい問い合わせがありました</h2>` +
    `<dl>` +
    `<dt>お名前</dt><dd>${escapeHtml(input.name)}</dd>` +
    `<dt>メールアドレス</dt><dd>${escapeHtml(input.email)}</dd>` +
    `</dl>` +
    `<h3>お問い合わせ内容</h3>` +
    `<p>${escapeHtml(input.context).replace(/\n/g, "<br />")}</p>`

  try {
    await emailBinding.send({
      to: toEmail,
      from: fromEmail,
      subject,
      text: textBody,
      html: htmlBody,
      replyTo: input.email,
    })
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    return { ok: false, message: `メール送信に失敗しました: ${detail}` }
  }

  return { ok: true }
}

// ---------------------------------------------------------------------------
// Cloudflare D1 integration
// ---------------------------------------------------------------------------

/**
 * Insert a new contact submission into D1 with `email_status = 'pending'`.
 *
 * Returns `{ ok: true; id: number | undefined }` on success where `id` is
 * `result.meta.last_row_id` (zero / missing when SQLite cannot determine it),
 * or `{ ok: false }` on failure (binding missing or DB error).
 * Errors are logged server-side via `console.error`.
 */
async function insertContactSubmission(
  db: D1Database | undefined,
  input: ValidatedInput,
  nowIso: string,
): Promise<
  { ok: true; id: number | undefined } | { ok: false }
> {
  if (!db) {
    console.error(
      "Contact form: CONTACT_DB binding is not configured — cannot persist submission.",
    )
    return { ok: false }
  }
  try {
    const result = await db
      .prepare(
        `INSERT INTO contact_submissions
           (name, email, message, email_status, created_at, updated_at)
         VALUES (?, ?, ?, 'pending', ?, ?)`,
      )
      .bind(input.name, input.email, input.context, nowIso, nowIso)
      .run()
    if (!result.success) {
      console.error(
        "Contact form: D1 insert failed —",
        result.error ?? "unknown error",
      )
      return { ok: false }
    }
    const id =
      typeof result.meta.last_row_id === "number" && result.meta.last_row_id > 0
        ? result.meta.last_row_id
        : undefined
    return { ok: true, id }
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    console.error("Contact form: D1 insert threw —", detail)
    return { ok: false }
  }
}

/**
 * Update `email_status` for a submission by id.
 * Returns `true` on success, `false` on any failure.
 * Errors are logged server-side via `console.error` — never exposed to client.
 */
async function updateContactEmailStatus(
  db: D1Database,
  id: number,
  status: "sent" | "failed",
  nowIso: string,
): Promise<boolean> {
  try {
    const result = await db
      .prepare(
        `UPDATE contact_submissions
         SET email_status = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(status, nowIso, id)
      .run()
    if (!result.success) {
      console.error(
        `Contact form: D1 update to "${status}" failed for id=${id} —`,
        result.error ?? "unknown error",
      )
      return false
    }
    return true
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    console.error(
      `Contact form: D1 update to "${status}" threw for id=${id} —`,
      detail,
    )
    return false
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export const onRequest = async (
  context: PagesFunctionContext,
): Promise<Response> => {
  const { request, env } = context

  // 1. Method check — only POST is accepted.
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method Not Allowed" }, 405)
  }

  // 2. Parse FormData.
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return formRedirect("invalid_request")
  }

  // 3. Read fields.
  let rawName: string | undefined
  let rawEmail: string | undefined
  let rawContext: string | undefined
  let rawBotField: string | undefined
  try {
    rawName = textField(form, "name")
    rawEmail = textField(form, "email")
    rawContext = textField(form, "context")
    rawBotField = textField(form, "botField")
  } catch {
    return formRedirect("invalid_request")
  }

  // 4. Honeypot — if a bot filled in the hidden field, silently pretend success.
  const botField = rawBotField?.trim() ?? ""
  if (botField.length > 0) {
    return redirect(SUCCESS_REDIRECT_URL, 303)
  }

  // 5. Validate.
  const result = validateInput({
    name: rawName,
    email: rawEmail,
    context: rawContext,
  })
  if (!result.ok) {
    return formRedirect("validation_error")
  }

  // 6. Persist to D1 BEFORE sending email.
  //    If we cannot store the submission, we must not send the email —
  //    a contact we cannot record is a contact we cannot follow up on.
  const nowIso = new Date().toISOString()
  const insertResult = await insertContactSubmission(
    env.CONTACT_DB,
    result.data,
    nowIso,
  )
  if (!insertResult.ok) {
    return formRedirect("server_error")
  }

  // Keep a narrowed reference for status updates below.
  const submissionId: number | undefined = insertResult.id
  if (submissionId === undefined) {
    console.error(
      "Contact form: could not determine last_row_id after insert — status updates will be skipped.",
    )
  }

  // 7. Send email via Cloudflare Email Service.
  const sendResult = await sendEmailViaCloudflare(env, result.data)
  if (!sendResult.ok) {
    // Log the detailed error server-side for debugging; do not expose it
    // to the browser to avoid leaking internal configuration details.
    console.error("Contact form: email send failed —", sendResult.message)

    // Best-effort: mark the submission as 'failed' in D1.
    if (submissionId !== undefined && env.CONTACT_DB) {
      const failedAt = new Date().toISOString()
      await updateContactEmailStatus(env.CONTACT_DB, submissionId, "failed", failedAt)
    }
    return formRedirect("server_error")
  }

  // 8. Mark the submission as 'sent' in D1 (best-effort).
  if (submissionId !== undefined && env.CONTACT_DB) {
    const sentAt = new Date().toISOString()
    await updateContactEmailStatus(env.CONTACT_DB, submissionId, "sent", sentAt)
  }

  // 9. Success — redirect to the thank-you page.
  return redirect(SUCCESS_REDIRECT_URL, 303)
}
