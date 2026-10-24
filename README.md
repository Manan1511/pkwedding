# Pavgun & Ashmeet Wedding

A static wedding invitation and guest guide for Pavgun Kaur and Ashmeet Singh Sohal. The main page follows the supplied Ranthambore reference: a scroll-scrubbed gate opening, an illustrated celebration timeline, and individual framed event pages.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local preview URL in the terminal. The invitation includes all six celebrations, individual event pages, family details, assembly and venue directions, native sharing, RSVP copy, individual and combined calendar downloads, a generated itinerary PDF, a countdown to Anand Karaj, and optional instrumental music. The opening video is muted and scrubbed by scrolling; reduced-motion settings show the invitation without the scroll animation. Hosting is deferred.

Responsive AVIF/WebP ceremony artwork lives in `public/images/`. The reference site assets used for the gate video, decorative frames, and flourishes are prepared with `python scripts/prepare-ranthambore-assets.py`. The reference source directory is intentionally ignored by Git. Couple portraits and coordinator contacts remain omitted until the family supplies references and real details.

## Checks

```sh
npm run build
```

The local `WEDDING_REFERENCE.md` and five invitation JPEGs are source references and are kept out of this repository.
