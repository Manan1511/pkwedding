# Artwork sources and web delivery

The original paintings are kept in `artwork/source/`, outside Vite's `public/` folder so they are not copied into the website build. Run `python scripts/prepare-artwork.py` to generate responsive 768 px and 1536 px AVIF/WebP scene variants in `public/images/`. The courtyard doors use AVIF with WebP fallback.

The seven scene environments share a hand-painted gouache and watercolor style. Keep the couple names, ceremony details, monogram, and other live copy in the interface so they remain sharp, accessible, and editable.

`ceremony-art-prompts.md` records the scene prompts. The background soundtrack's source and license are documented in `public/licenses/pixabay-indian-wedding.md`.
