# Pavgun & Ashmeet Wedding

A local, static wedding invitation and guest guide for Pavgun Kaur and Ashmeet Singh Sohal.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local preview URL in the terminal. The invitation now includes the courtyard opening, welcome, illustrated countdown, all six animated ceremonies in date order, and the family closing. Each ceremony includes venue and assembly directions and a calendar download. The closing includes combined dates, a freshly generated itinerary PDF, and native sharing with a copy-link fallback. Hosting is deferred.

Original paintings and responsive WebP artwork live in `public/images/`. The five new scene prompts are recorded in `docs/ceremony-art-prompts.md`. Couple portraits and coordinator contacts require the family's supplied references and details.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

The local `WEDDING_REFERENCE.md` and five invitation JPEGs are source references and are kept out of this repository.
