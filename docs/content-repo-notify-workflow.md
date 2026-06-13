# Content Repository — Notify Blog App on Push

Place this workflow in the **content repository** (e.g., `ouvill/blog-contents`) to
send a `repository_dispatch` event to the blog app repository whenever content changes.

## End-to-end flow

1. A push to `main` on the content repository triggers `notify-blog-app.yml`.
2. That workflow sends a `repository_dispatch` event (`blog-content-updated`) to the blog app repository (`Ouvill/gatsbyjs_blog`).
3. On the app repo, `update-content-submodule.yml` picks up the event, checks out `master`, updates the submodule, and opens a pull request.
4. CI (`ci.yml`) runs on the PR — typecheck + build.
5. The PR is merged to `master` on the app repo.
6. **Cloudflare's Git integration** detects the push to `master` and automatically deploys the site. No GitHub Actions deployment step is involved.

> Cloudflare deployment is managed by Cloudflare's own Git integration, not GitHub Actions. See the [Cloudflare Git integration and submodules](#cloudflare-git-integration-and-submodules) section for submodule access requirements.

## Template — `.github/workflows/notify-blog-app.yml`

```yaml
name: Notify Blog App

on:
  push:
    branches: [main]

jobs:
  notify:
    runs-on: ubuntu-latest

    steps:
      - name: Dispatch blog-content-updated to blog app
        uses: peter-evans/repository-dispatch@v3
        with:
          # Adjust to match your blog app repository owner and name.
          repository: Ouvill/gatsbyjs_blog
          event-type: blog-content-updated
          token: ${{ secrets.BLOG_APP_DISPATCH_TOKEN }}
```

## Required secrets

There are two distinct secrets used across the two repositories:

| Secret | Stored In | Purpose |
|---|---|---|
| `BLOG_APP_DISPATCH_TOKEN` | Content repository (`ouvill/blog-contents`) | Sends `repository_dispatch` to the app repo. |
| `SUBMODULE_UPDATE_TOKEN` | App repository (`Ouvill/gatsbyjs_blog`) | Used by `update-content-submodule.yml` to checkout the app repo, update the submodule, and create/update a pull request. |

> ⚠️ `BLOG_APP_DISPATCH_TOKEN` and `SUBMODULE_UPDATE_TOKEN` are independent tokens stored in different repositories. They may be the same PAT value, but for security isolation they should be separate.

### BLOG_APP_DISPATCH_TOKEN permissions

| PAT Type | Target Repository | Permissions Required |
|---|---|---|
| Fine-grained | `Ouvill/gatsbyjs_blog` | **Contents** read/write |
| Classic | — | `public_repo` (public repo) or `repo` (private repo) |

### SUBMODULE_UPDATE_TOKEN permissions

| PAT Type | Target Repository | Permissions Required |
|---|---|---|
| Fine-grained | `Ouvill/gatsbyjs_blog` | **Contents** read/write **and** **Pull requests** read/write |
| Classic | — | `public_repo` (public repo) or `repo` (private repo) |

If the content repository (`ouvill/blog-contents`) is **private**, this token also needs **Contents** read access on `Ouvill/blog-contents` so the workflow can fetch the submodule during checkout.

## Cloudflare Git integration and submodules

The Cloudflare Pages build clones the app repository (`Ouvill/gatsbyjs_blog`) and fetches its submodule (`src/content/blog`, pointing to the content repository).

- Cloudflare must be able to **clone** `Ouvill/gatsbyjs_blog` — ✓ already configured.
- If the content repository is **private**, Cloudflare must also have access to `Ouvill/blog-contents` to fetch the submodule during build.

**In this environment**, the Cloudflare side has already been granted read/write permissions to both repositories, so no `CLOUDFLARE_API_TOKEN` secret is needed in GitHub Actions. Deployment is handled entirely by Cloudflare's Git integration (not GitHub Actions).

## Branch targeting

- The content repository workflow (`notify-blog-app.yml`) triggers on **main** — the default branch of the content repo.
- The app repository workflows (`update-content-submodule.yml`, `ci.yml`) target **master**, which is the current default branch of the app repo (`Ouvill/gatsbyjs_blog`). If the app repo's default branch is renamed, update the branch references in those workflow files accordingly.
- Cloudflare's Git integration is configured to watch the **master** branch of the app repo and deploy automatically on each push.
