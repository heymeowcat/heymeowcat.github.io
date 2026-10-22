# heymeowcat.github.io

Personal site for Vidura Fernando — mobile app developer and AI engineer.

- **Home** (`/`) — intro, experience, selected work, stack, education and certifications.
- **Resume** (`/resume/`) — print-friendly resume. Use *Print / Save as PDF* in the browser to export it.

Static site built with [Astro](https://astro.build). No client-side JavaScript on the home page, no
external fonts, no trackers.

## Commands

| Command           | Action                                    |
| :---------------- | :--------------------------------------- |
| `npm install`     | Installs dependencies                     |
| `npm run dev`     | Starts the dev server at `localhost:4321` |
| `npm run build`   | Builds the production site to `./dist/`   |
| `npm run preview` | Previews the build locally                |

## Structure

```text
/
├── public/            # static files: favicons, manifest, sitemap, og image
└── src/
    ├── pages/
    │   ├── index.astro    # home
    │   └── resume.astro   # resume (print stylesheet in global.css)
    └── styles/global.css  # design tokens, layout, print rules
```

## Editing content

Page content lives in the frontmatter of each `.astro` file — `work`, `roles`, `stack`,
`education` and `certifications` arrays. Colours, spacing and type scale are CSS custom
properties at the top of `src/styles/global.css`.

The site is deployed to GitHub Pages by `.github/workflows/astro.yml` on every push to `main`.
