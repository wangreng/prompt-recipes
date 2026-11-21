# Design Recipe: Tactile Sketchbook Canvas

## Mood & Core Idea
**One-sentence design idea:** A full-viewport, draggable dot-grid sketchbook where an interactive collection of playful hand-crafted objects orbits a centered editorial title block, framed only by whisper-light floating pills and a tactile tool dock.

The mood is joyful, studio-crafted, and warmly utilitarian—closer to an illustrator's tidy specimen desk than a marketing page. It feels personal, spontaneous, and immediately usable, built for indie makers, design-minded developers, and creative builders who value craft and direct utility over corporate persuasion.

## Typography Logic
Pair three free typefaces separating expressive personality from functional utility:
- **Handwritten display (`Caveat`)** carries all human warmth. Set the centered headline bold and tightly leaded—about two-and-a-half times the subhead and four to five times UI labels. Set the short subhead regular in muted warm gray. Reuse this handwritten voice smaller for faint zone titles, tilted margin hints near canvas items, and casual secondary links.
- **Clean geometric sans (`DM Sans`)** grounds functional chrome—floating pills, tooltips, dock labels, and badges—kept small and crisp so UI stays quiet beside the handwriting.
- **Technical monospace (`Geist Mono`)** is strictly for commands, switcher tabs, and tabular counters.

Use natural sentence case everywhere; never all-caps. Balance line wraps on centered display text, and give casual handwritten notes a subtle tilt so they feel jotted on paper.

## Color Logic
- **Paper canvas:** Bright paper-white ground with a barely visible, evenly spaced cool-gray dot grid.
- **Ink hierarchy:** Deep warm charcoal anchors headlines, active states, and sharp focus; warm mid-gray softens descriptions, inactive tabs, and secondary links, fading lighter for background zone labels.
- **Frosted chrome:** Pills, cards, and dock trays float on translucent frosted white with hair-thin neutral borders and soft ambient shadows.
- **Single inverted anchor:** Reserve one solid deep-ink dark pill with crisp white text and a faint translucent shortcut chip for the primary catalog button in the bottom dock, giving clear hierarchy without loud brand accents.
- **Isolated color joy:** Keep structural chrome monochrome. Saturated rainbow hues appear exclusively in the showcased art and glossy, subtly beveled circular swatches in the bottom toolbar (plus a multicolor wheel swatch for default multi-tone art).

## Spacing, Grid & Layout Moves
Skip vertical scrolling pages. Lock the viewport to a full-bleed, pannable two-dimensional dot-grid canvas centered at origin.
- **Density contrast:** Surround the centered hero and scattered items with very generous open paper, contrasting airy space against tight, jewel-like precision inside every floating widget.
- **Organic framing:** Ring the hero loosely with the opening cluster of interactive items so the product proves itself immediately. Place additional themed clusters off-screen in cardinal and diagonal zones under faint handwritten headings.
- **Edge-pinned chrome:** Float tiny pills in opposite top corners and center a three-part dock along the bottom edge.
- **Responsive shifts:** On mobile, narrow the hero, let outer items clip at screen edges to hint at off-screen space, drop desktop hover hints and captions, and collapse inline swatches into a compact color-trigger pill.

## Component Vocabulary
- **Corner pills:** Frosted capsules at top corners holding maker credit and a tabular community counter; hover shows a dark-ink tooltip.
- **Tabbed command card:** A rounded card under the hero copy pairing a tinted top tab bar (segmented buttons with a raised white active chip and copy icon) over a monospace command row with a faint blueprint-grid wash.
- **Bare spatial specimens:** Borderless illustrated items resting directly on paper at varied tilts—never boxed in cards. Hover lifts items with deeper soft shadows and reveals a tiny dark-ink caption pill below.
- **Whispered margin hints:** Slightly tilted handwritten notes near edge items on desktop teaching clicking, recoloring, and dragging without popups.
- **Segmented bottom dock:** Three centered floating pills—a brand recenter pill, a swatch tray with a dark selection ring, and the solid dark primary catalog button with a subtle shortcut keycap.

## Imagery & Illustration Style
Showcased items share a handmade vector style like chunky wax pastels or colored pencils: thick wobbly outlines, layered translucent fills with soft shading and tiny highlights, minimal charming faces or expressive strokes, and playful tilts. Pair this tactile art with crisp monochrome UI icons. Zero photography or 3D renders.

## Motion & Interaction Feel
Interactions feel light and springy: buttons compress subtly on press, corner marks tilt on hover, canvas items lift smoothly off paper, and panning uses a grab cursor with fluid motion and keyboard navigation. Global controls update the canvas instantaneously.

## What This Site Deliberately Does NOT Do
- No vertical marketing scroll, feature grids, testimonials, pricing tables, or footer.
- No opaque full-width navbar, sidebars, or card frames around showcased items.
- No chrome gradients, hype badges, modal onboarding tours, stock photos, or uppercase UI labels.

## Page Skeleton (Spatial Layers)
1. **Top Edge Utility Layer:** Two corner-pinned frosted pills (creator credit left; live community counter right).
2. **Interactive Paper Stage:** Full-viewport pannable, keyboard-accessible dot-grid canvas extending past viewport bounds.
3. **Origin Hero Cluster:** Centered handwritten headline, short summary, tabbed command card, and tilted secondary link—encircled by an opening specimen halo and subtle gesture hints.
4. **Surrounding Discovery Neighborhoods:** Off-screen themed clusters distributed radially around origin under faint handwritten titles.
5. **Bottom Floating Control Dock:** Centered pill trio combining a recenter pill, a live appearance swatch tray (popover on mobile), and an inverted dark button launching a searchable catalog overlay.
