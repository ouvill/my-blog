import { readFile } from "node:fs/promises"
import { join } from "node:path"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import sharp from "sharp"

// process.cwd() is the project root during Astro's build prerender phase.
// This avoids __dirname which resolves to the bundled chunk directory.
const projectRoot = process.cwd()
const fontsDir = join(projectRoot, "src/lib/og/fonts")

// Module-level cached promises so fonts are only read once per build
let fontMediumPromise: Promise<Buffer> | null = null
let fontBoldPromise: Promise<Buffer> | null = null
let avatarDataUriPromise: Promise<string> | null = null
let sakuraDataUriPromise: Promise<string> | null = null
let sakuraLargeDataUriPromise: Promise<string> | null = null

function getFontMedium(): Promise<Buffer> {
  if (!fontMediumPromise) {
    fontMediumPromise = readFile(join(fontsDir, "ZenMaruGothic-Medium.ttf"))
  }
  return fontMediumPromise
}

function getFontBold(): Promise<Buffer> {
  if (!fontBoldPromise) {
    fontBoldPromise = readFile(join(fontsDir, "ZenMaruGothic-Bold.ttf"))
  }
  return fontBoldPromise
}

function getAvatarDataUri(): Promise<string> {
  if (!avatarDataUriPromise) {
    const avatarPath = join(projectRoot, "public/profile-pic.png")
    avatarDataUriPromise = readFile(avatarPath).then(
      (buf) => `data:image/png;base64,${buf.toString("base64")}`
    )
  }
  return avatarDataUriPromise
}

// The brand's real cherry-blossom (桜) mark, also used in the site Header and
// PostCard. Satori's SVG support is limited, so we rasterize it to a PNG once
// with sharp (already a dependency) and embed it as a data URI.
function getSakuraDataUri(): Promise<string> {
  if (!sakuraDataUriPromise) {
    const svgPath = join(projectRoot, "public/cherry-blossom.svg")
    sakuraDataUriPromise = readFile(svgPath).then((svg) =>
      sharp(svg, { density: 300 })
        .resize(600, 600, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer()
        .then((buf) => `data:image/png;base64,${buf.toString("base64")}`)
    )
  }
  return sakuraDataUriPromise
}

// The taller composition: two blossoms plus two scattered petals, used as a
// vertical accent down the right side. Rasterized at native aspect ratio.
function getSakuraLargeDataUri(): Promise<string> {
  if (!sakuraLargeDataUriPromise) {
    const svgPath = join(projectRoot, "public/cherry-blossom-large.svg")
    sakuraLargeDataUriPromise = readFile(svgPath).then((svg) =>
      sharp(svg, { density: 300 })
        .resize({ width: 360 })
        .png()
        .toBuffer()
        .then((buf) => `data:image/png;base64,${buf.toString("base64")}`)
    )
  }
  return sakuraLargeDataUriPromise
}

function titleFontSize(title: string): number {
  const len = title.length
  if (len <= 22) return 68
  if (len <= 40) return 56
  if (len <= 64) return 46
  return 40
}

export interface OgCardInput {
  title: string
  tags?: string[]
}

export async function renderOgCard(input: OgCardInput): Promise<ArrayBuffer> {
  const { title, tags = [] } = input

  const [fontMedium, fontBold, avatarUri, sakuraUri, sakuraLargeUri] =
    await Promise.all([
      getFontMedium(),
      getFontBold(),
      getAvatarDataUri(),
      getSakuraDataUri(),
      getSakuraLargeDataUri(),
    ])

  const fontSize = titleFontSize(title)
  const visibleTags = tags.slice(0, 3)

  // Place one of the brand's cherry-blossom marks. `offset` carries only the
  // defined edge offsets — Satori throws on `undefined` style values.
  function bloom(
    src: string,
    offset: Record<string, number>,
    width: number,
    height: number,
    rotate: number,
    opacity: number
  ) {
    return {
      type: "div",
      props: {
        style: {
          position: "absolute" as const,
          width,
          height,
          opacity,
          transform: `rotate(${rotate}deg)`,
          display: "flex",
          ...offset,
        },
        children: {
          type: "img",
          props: {
            src,
            width,
            height,
            style: { width, height },
          },
        },
      },
    }
  }
  // Single blossom (square asset).
  const sakura = (
    offset: Record<string, number>,
    size: number,
    rotate: number,
    opacity: number
  ) => bloom(sakuraUri, offset, size, size, rotate, opacity)
  // Tall composition (two blossoms + two petals); native aspect ≈ 0.4716.
  const sakuraLarge = (
    offset: Record<string, number>,
    width: number,
    rotate: number,
    opacity: number
  ) =>
    bloom(
      sakuraLargeUri,
      offset,
      width,
      Math.round(width * 2.1205),
      rotate,
      opacity
    )

  const vdom = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column" as const,
        width: 1200,
        height: 630,
        backgroundColor: "#fdfaf8",
        position: "relative" as const,
        overflow: "hidden",
      },
      children: [
        // Soft blossoms peeking from the left corners behind the card
        sakura({ top: -48, left: -52 }, 130, -28, 0.42),
        sakura({ bottom: -64, left: -68 }, 210, -14, 0.48),
        // Inner white card panel
        {
          type: "div",
          props: {
            style: {
              position: "absolute" as const,
              top: 48,
              right: 48,
              bottom: 48,
              left: 48,
              backgroundColor: "#ffffff",
              borderRadius: 36,
              border: "1px solid #ece4e1",
              boxShadow:
                "0 1px 2px rgba(90,60,70,0.06), 0 4px 16px rgba(90,60,70,0.08)",
              padding: 72,
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "space-between" as const,
            },
            children: [
              // Top section: accent bar + tags + title
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: 16,
                  },
                  children: [
                    // Rose accent bar
                    {
                      type: "div",
                      props: {
                        style: {
                          width: 64,
                          height: 8,
                          borderRadius: 9999,
                          backgroundColor: "#c4536f",
                        },
                        children: null,
                      },
                    },
                    // Tag pills row (only if tags exist)
                    ...(visibleTags.length > 0
                      ? [
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                flexDirection: "row" as const,
                                gap: 8,
                              },
                              children: visibleTags.map((tag) => ({
                                type: "div",
                                props: {
                                  style: {
                                    backgroundColor: "#faeef1",
                                    color: "#c4536f",
                                    padding: "6px 18px",
                                    borderRadius: 9999,
                                    fontSize: 26,
                                    fontWeight: 500,
                                    fontFamily: "Zen Maru Gothic",
                                  },
                                  children: tag,
                                },
                              })),
                            },
                          },
                        ]
                      : []),
                    // Title
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize,
                          fontWeight: 700,
                          fontFamily: "Zen Maru Gothic",
                          color: "#3a3335",
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        },
                        children: title,
                      },
                    },
                  ],
                },
              },
              // Bottom footer row
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "row" as const,
                    alignItems: "center" as const,
                    justifyContent: "space-between" as const,
                  },
                  children: [
                    // Avatar + blog name + URL
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "row" as const,
                          alignItems: "center" as const,
                          gap: 16,
                        },
                        children: [
                          // Circular avatar
                          {
                            type: "div",
                            props: {
                              style: {
                                width: 72,
                                height: 72,
                                borderRadius: 9999,
                                border: "3px solid #ffffff",
                                boxShadow: "0 0 0 2px #ece4e1",
                                overflow: "hidden",
                                flexShrink: 0,
                                display: "flex",
                              },
                              children: {
                                type: "img",
                                props: {
                                  src: avatarUri,
                                  width: 72,
                                  height: 72,
                                  style: {
                                    width: 72,
                                    height: 72,
                                    borderRadius: 9999,
                                  },
                                },
                              },
                            },
                          },
                          // Blog name + URL column
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                flexDirection: "column" as const,
                                gap: 2,
                              },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      fontSize: 30,
                                      fontWeight: 700,
                                      fontFamily: "Zen Maru Gothic",
                                      color: "#3a3335",
                                    },
                                    children: "Ouvill のブログ",
                                  },
                                },
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      fontSize: 28,
                                      fontWeight: 500,
                                      fontFamily: "Zen Maru Gothic",
                                      color: "#9a8f93",
                                    },
                                    children: "blog.ouvill.net",
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    // @Ouvill handle
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: 28,
                          fontWeight: 500,
                          fontFamily: "Zen Maru Gothic",
                          color: "#c4536f",
                        },
                        children: "@Ouvill",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Tall blossom-and-petals composition in the upper-right, drawn on top
        // of the card as a faint watermark. Kept high and small so it clears
        // both the title and the @Ouvill footer.
        sakuraLarge({ top: 12, right: -22 }, 172, 4, 0.26),
      ],
    },
  }

  const svg = await satori(vdom, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Zen Maru Gothic",
        data: fontMedium,
        weight: 500,
        style: "normal",
      },
      {
        name: "Zen Maru Gothic",
        data: fontBold,
        weight: 700,
        style: "normal",
      },
    ],
  })

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
    font: { loadSystemFonts: false },
  })

  const png = resvg.render().asPng()
  // Copy into a concrete ArrayBuffer so it matches the BodyInit type
  const buf = png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength)
  return buf as ArrayBuffer
}
