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

The two map compositions are optimized for the requested desktop and pocket sizes. The pocket layout draws the upper part of the WebP at a fixed height to keep the title on its island as text reflows. The rest of that same image stretches continuously to the footer. Small place names are easier to inspect in the full plate. “Open full plate” shows the current edition at its original aspect ratio.

## Round 2 verification

Reviewed four screenshot passes in headless Chrome. Each pass included the first viewport and the full page at 1440 × 900 and 390 × 844. After the initial pass, the pocket geography moved below the title card, the compasses gained clearance, and the lighthouse and koi moved into the quick-start margin. The final kit renders report zero overlaps and zero out-of-bounds objects for both editions.

Ran the build with a PATH containing only Node.js. Deleted both generated WebPs, reran the displayed `./build.sh` command with the same restricted PATH, then captured the page again. SHA-256 matched for all six site files and all four screenshots. The final screenshots are in `shots/`.

## Mobile first-screen verification

Captured the first viewport and full page four times at 390 × 844 and 1440 × 900 in headless Chrome. Visual review led to a taller Japan cartouche with room for the scale bar, more clearance for the sailboat, and better alignment between the title, shoreline, and figure caption. The final mobile first screen shows the map, cartouche, compass, border, parchment island, and build command together. Both final specs report zero overlaps and zero out-of-bounds objects.

The final desktop first-screen and full-page PNGs match their pre-revision SHA-256 hashes. After deleting both generated WebPs and running `./build.sh` with only Node.js on PATH, all six site files and all four recaptured screenshots matched the pre-deletion hashes.
