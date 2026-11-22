# Handdrawn Map Kit — Japan field guide

The page is a single long atlas sheet. Japan’s Natural Earth coastline and cultural illustrations sit beside the title and the command that regenerates the site.  
Three paper notes carry the feature overview, agent workflow, and quick start. A shrine gate, survey vessel, and coastal light mark their positions.  
The pocket edition opens with a framed map of Japan, a flag cartouche, and a compass rose. The title and build command sit on an illustrated parchment island below the archipelago, all within the first 390 × 844 viewport.

## Artwork and implementation

- Each viewport uses one non-repeating, kit-rendered WebP across the whole document, including navigation, gaps between notes, and footer. The desktop and pocket YAML specs include the geography, dry-media paper, graticule, waves, compass, lettering, and every scattered illustration.
- The pocket spec uses the kit’s native zebra border and flag cartouche. Its inline SVG coastline goes through the kit’s pencil renderer to form the parchment island beneath the live hero text. HTML and CSS supply selectable text, the lower paper notes, navigation, and code blocks. Roughly 65% of the desktop surface and 55% of the pocket surface is exposed kit artwork. The map continues underneath the notes.
- Open `site/index.html` directly. Both documentation links resolve inside `site/`.
- Run `./build.sh` from this folder. The executable is a Node.js script that calls the kit’s `renderSpec` API and encodes WebP with the canvas package already installed by the kit. The build copies the page sources and reference files into `site/`.

## Display tradeoff

The two map compositions are optimized for the requested desktop and pocket sizes. The pocket layout sizes the geographic portion of the plate to the viewport width. The parchment portion of the same image stretches with the live text, followed by the remaining map down to the footer. Small place names are easier to inspect in the full plate. “Open full plate” shows the current edition at its original aspect ratio.

## Round 2 verification

Reviewed four screenshot passes in headless Chrome. Each pass included the first viewport and the full page at 1440 × 900 and 390 × 844. After the initial pass, the pocket geography moved below the title card, the compasses gained clearance, and the lighthouse and koi moved into the quick-start margin. The final kit renders report zero overlaps and zero out-of-bounds objects for both editions.

Ran the build with a PATH containing only Node.js. Deleted both generated WebPs, reran the displayed `./build.sh` command with the same restricted PATH, then captured the page again. SHA-256 matched for all six site files and all four screenshots. The final screenshots are in `shots/`.

## Mobile first-screen verification

Captured the first viewport and full page four times at 390 × 844 and 1440 × 900 in headless Chrome. Visual review led to a taller Japan cartouche with room for the scale bar, more clearance for the sailboat, and better alignment between the title, shoreline, and figure caption. The final mobile first screen shows the map, cartouche, compass, border, parchment island, and build command together. Both final specs report zero overlaps and zero out-of-bounds objects.

The final desktop first-screen and full-page PNGs match their pre-revision SHA-256 hashes. After deleting both generated WebPs and running `./build.sh` with only Node.js on PATH, all six site files and all four recaptured screenshots matched the pre-deletion hashes.

## Clean-machine typography and reflow

Six bundled Liberation WOFF2 faces supply the serif titles, sans-serif prose, and monospaced commands and labels. Their OFL license ships in `site/FONT-LICENSE.txt`. The build copies the vendored files from `src/fonts/` and embeds their bytes in `site/fonts.css` for direct local-file viewing. The mark, copy, confirmation, and external-link icons are SVG. Font conversion is already complete and adds no build dependency.

The mobile hero uses normal-flow grid rows for the introduction and plate link. The island and its vertical clearances grow with the content while the map above retains its size. At 390 × 844 the title occupies two lines, with 30 px between the command and link. Increasing all hero text to 150% produced three title lines, a taller island, 57 px of clearance, and no horizontal overflow.

Reviewed first-screen and full-page Chrome screenshots at 1440 × 900 and 390 × 844 across multiple passes, including the final rebuild. The final browser used an isolated Fontconfig configuration exposing only an unrelated kit font, with all host font directories excluded. Chrome reported all six WOFF2 faces loaded and only the bundled Liberation webfonts used for rendered page text. An earlier run with a completely empty font database produced unreliable Chrome text rendering, so the final check measures actual glyph usage with a working browser font backend.

Deleted both rendered maps, the output WOFF2 files, and the generated font stylesheet. Rebuilt with `./build.sh` and only Node.js on PATH. SHA-256 hashes matched for all 14 site files and all four recaptured screenshots.
