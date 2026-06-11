# AGENTS.md

## Project facts

- This is a Japanese-language technical blog (blog.ouvill.net) built on Gatsby v5.
- Author GitHub: `Ouvill` / repo: `Ouvill/gatsbyjs_blog`.
- Lockfile is **yarn.lock** only; no package-lock.json exists.
- **No `start` script** exists in package.json. The README "Server Start" section (`nxp ci && yarn start`) is **stale/misleading** — ignore it. Use `yarn develop` for local development.
- CI workflow (`.github/workflows/node.js.yml`) runs `npx ci` + `npm run build --if-present` + `npm test` on push/PR to master with Node 18.x. Note: CI uses npm commands, while the local project lockfile is `yarn.lock` (yarn) and the README references `yarn develop`.

## Commands

| Script | Command | Notes |
|---|---|---|
| `yarn develop` | `gatsby develop --host=0.0.0.0` | Primary dev command; serves at `http://localhost:8000` |
| `yarn build` | `gatsby build` | Production build |
| `yarn serve` | `gatsby serve` | Serve production build locally |
| `yarn clean` | `gatsby clean` | Clear Gatsby cache |
| `yarn typecheck` | `tsc --noEmit` | TypeScript type checking |
| `yarn codegen` | `graphql-codegen  --config codegen.yml` | Requires dev server running first (see "Quirks" below) |
| `yarn format` | `prettier --write src/**/*.{js,jsx}` | **Only JS/JSX** — does not cover TS/TSX |
| `yarn test` | `echo "Write tests!..."` | Placeholder; no real test suite |

## Gatsby wiring

- **`gatsby-node.ts`** (TypeScript, not JS):
  - Exports `createPages` from `src/gatsbyjs/gatsby-node/createPages.ts`
  - Injects `React` globally via webpack `ProvidePlugin` (`onCreateWebpackConfig`)
  - Customizes MarkdownRemark schema: `frontmatter.cover: File @fileByRelativePath`
  - Creates slugs on `onCreateNode`: blog files → `/blog/...`, page files → `/pages/...`
  - Adds `githubURL` field to blog posts (points to `master` branch content path)
- **`createPages.ts`** creates:
  - **Index pages**: 12 posts per page at `/` and `/indexes/{i}`
  - **Blog posts** using `src/templates/BlogPost.tsx`
  - **Static pages** using `src/templates/StaticPage.tsx`
  - Redirects from a separate `redirect.ts` module
- **`gatsby-config.js`**: `graphqlTypegen: true` (auto-generates `src/gatsby-types.d.ts`), sources `content/blog`, `content/assets`, `content/pages`
- **`gatsby-browser.js`**: imports normalize.css, typefaces, Prism solarizedlight CSS, wraps pages with react-pose `PoseGroup`

## Content and type generation quirks

- **Content sources**:
  - `content/blog/<slug>/index.md` — blog posts (frontmatter: `title`, `date`, `tags`, `category`)
  - `content/pages/<name>.md` — static pages (frontmatter: `title`)
  - `content/assets/` — images, site icon, default cover
- **Type generation** (two systems exist):
  1. **Gatsby typegen** (`graphqlTypegen: true` in config) — auto-generates `src/gatsby-types.d.ts` during `develop`/`build` (Gatsby internal)
  2. **graphql-codegen** (`yarn codegen`) — generates `src/graphqlTypes.ts` but requires the Gatsby dev server running first (schema at `http://localhost:8000/___graphql`)
- `src/graphqlTypes.ts` does **not** exist on disk currently — only `src/gatsby-types.d.ts` exists
- tsconfig has `strict: true`, targets `esnext`, includes `./src/**/*`, `./gatsby-node.ts`, `./gatsby-config.ts`, `./plugins/**/*`
- Prettier config: LF, no semicolons, double quotes, tabWidth 2, trailingComma es5
