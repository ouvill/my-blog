# AGENTS.md

## Project facts

- This is a Japanese-language technical blog (blog.ouvill.net) built on **Astro v5**.
- Author GitHub: `Ouvill` / repo: `Ouvill/gatsbyjs_blog`.
- Lockfile is **yarn.lock** only; no package-lock.json exists.
- CI workflow (`.github/workflows/node.js.yml`) runs `yarn install --frozen-lockfile`, `yarn typecheck`, `yarn build` on push/PR to master with Node 22.

## Commands

| Script | Command | Notes |
|---|---|---|
| `yarn dev` | `astro dev --host 0.0.0.0` | Dev server at `http://localhost:4321` |
| `yarn build` | `astro build` | Production build → `dist/` |
| `yarn preview` | `astro preview` | Preview production build locally |
| `yarn typecheck` | `astro check` | Astro type checking (uses `@astrojs/check`) |
| `yarn clean` | `rm -rf dist .astro` | Remove build and dev cache |
| `yarn format` | `prettier --write 'src/**/*.{astro,ts,tsx,js,jsx}'` | Format with Prettier |

## Project structure

```
src/
├── content/
│   ├── blog/         # Blog posts (Markdown, one folder per post)
│   ├── pages/        # Static pages (Markdown)
│   └── config.ts     # Content collection schemas
├── components/       # Astro components
├── lib/              # Utilities (site config, pagination, cover, posts)
├── pages/            # Route pages
└── types/            # Shared TypeScript types
public/               # Static assets (images, redirects, etc.)
dist/                 # Build output (gitignored)
```

## Configuration

- **`astro.config.mjs`**: Site URL, trailing slashes, Sitemap integration, Shiki theme.
- **`tsconfig.json`**: `strict: true`, path aliases `@lib/*` and `@components/*`.
- **`.prettierrc`**: LF, no semicolons, double quotes, tabWidth 2, trailingComma es5.

## Content sources

| Collection | Location | Frontmatter |
|---|---|---|
| Blog posts | `src/content/blog/<slug>/index.md` | `title`, `date`, `tags`, `category`, `cover` |
| Static pages | `src/content/pages/<name>.md` | `title`, `date` |

- Content collections use Zod schemas defined in `src/content/config.ts`.
- The `date` field is normalized to `Date` during collection loading.

## Deploy

- **Cloudflare Pages** (primary): `wrangler.toml` — build output `dist`, Node 22. See `docs/cloudflare-pages.md`.
- Sitemap (`@astrojs/sitemap`) and RSS (`@astrojs/rss`) are generated at build time.
