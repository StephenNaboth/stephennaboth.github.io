# stephennaboth.github.io

Personal site of **Stephen Naboth** — PhD Candidate in Computational & Applied
Mathematics and Operations Research at Rice University.

One-page portfolio built with [Astro](https://astro.build) — plain CSS, no UI
framework, no backend. Outputs static HTML/CSS.

## Run it locally

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:4321`).

## Edit the content

- `src/pages/index.astro` — all copy (hero, about, education, research interests, contact).
- `src/styles/global.css` — the look (colors and fonts are the variables at the top).
- `public/profile.jpg` — the hero photo.
- `public/Stephen_Naboth_CV.pdf` — **add your CV here** (the "Download CV" button links to it).
- Email + GitHub URL are set at the top of `src/pages/index.astro`.

## Deploy (GitHub Pages)

Deployment is automated by `.github/workflows/deploy.yml`: every push to `main`
builds the Astro site and publishes it to GitHub Pages.

One-time setup on GitHub: **Settings → Pages → Build and deployment → Source →
"GitHub Actions"**. After that, pushing to `main` updates the live site at
`https://stephennaboth.github.io`.
