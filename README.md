# ЖАР / ZHAR

A Russian banya concept storefront built with React and Next.js. The dark interface pairs a procedural steam background with animated orbital graphics, React Bits text reveals, spotlight cards, and spring-animated category filters.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Static build for GitHub Pages

```sh
npm run build
```

Every push to `main` runs `.github/workflows/pages.yml`, builds the current source, and deploys the generated `out/` folder to `https://adaydan.github.io/sauna_app/`. GitHub Pages must use **GitHub Actions** as its publishing source. The older committed `docs/` export is no longer used for deployment.

Production builds use the `/sauna_app` base path; local development continues to use `http://localhost:3000`.

The export includes `.nojekyll` so GitHub Pages serves the `_next` assets. Use a static file server to preview the export; `npm start` is for server builds and does not serve this export.

## Features

- Responsive layout and mobile navigation
- Canvas steam that pauses offscreen and respects reduced-motion preferences
- Product details, category filtering, and a shopping bag saved on this device
- React Bits components configured through the shadcn registry

This is a concept storefront. Payments, shipping, and newsletter delivery are not connected.

## Earlier design

The warm steam version is saved in `.design-checkpoints/warm-steam`. Restore it with:

```sh
sh .design-checkpoints/warm-steam/restore.sh
```
