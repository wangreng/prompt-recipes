# Product Brief: Trazo

## Overview & Purpose
Trazo is an interactive web showcase and distribution hub for an open-source collection of hand-drawn, wax-crayon-style SVG sticker illustrations built for React and general web projects. Rather than presenting a static documentation site, the page works as a live playground where visitors explore roughly seventy vector graphics arranged across a pannable sheet, preview global color overrides in real time, inspect and customize individual illustrations to export clean SVG markup, or copy a package-manager installation command for the `trazo-stickers` library.

## Target Audience
Frontend engineers, React developers, indie web builders, and product designers seeking playful, handcrafted decorative graphics that drop cleanly into web interfaces with minimal setup.

## Brand & Attribution Elements
- **Product identity:** Trazo (distributed as `trazo-stickers`), represented by a multicolor looping-squiggle icon alongside the lowercase brand wordmark.
- **Creator credit:** Independent project by Aditya Ojha, linking to the creator's personal site (`akoder.xyz`), with hover details showing full name and domain.
- **Open-source repository:** Links to the public GitHub repository (`AdityaKodez/trazo`), displaying a live star count paired with a repository icon that flips playfully on hover.
- **Sponsorship contact:** A casual direct link inviting potential sponsors to get in touch via the creator's X account.

## Page Structure & Sections

### 1. Top Edge Utility Chrome
Pinned cleanly to opposite upper corners above the canvas:
- **Top-left pill:** Compact creator credit pairing a casual handwritten preposition with a stylized initial mark and the creator's first name; hovering reveals a dark tooltip with the creator's full name and personal website.
- **Top-right pill:** Open-source repository pill combining a monochrome GitHub icon (flipping in 3D on hover to a mini graphic) and a tabular numeric star counter.

### 2. Centered Origin Hero Block
Positioned at the geometric center of the interactive canvas so it greets visitors immediately on load:
- **Primary headline:** Short, direct display statement introducing hand-drawn crayon stickers built for web interfaces.
- **Supporting summary:** Concise two-to-three-line overview noting the range of illustrated subjects (sea creatures, playful felines, arrows, stars, clouds, and editorial accent marks) and the three core workflows: instant live recoloring, clean SVG copying, and package-manager installation.
- **Package installation card:** Compact two-row snippet widget featuring a top tab bar for four JavaScript package managers (`npm`, `pnpm`, `yarn`, `bun`) with their icons and a right-aligned copy button, above a shell-prompt command row showing the install command for `trazo-stickers`.
- **Sponsorship link:** Gently tilted handwritten link with a small diagonal external-link arrow tucked beneath the install card inviting sponsorship messages on X.

### 3. Interactive Spatial Canvas & Thematic Specimen Clusters
A full-viewport, draggable, and keyboard-navigable dot-grid sheet displaying 71 interactive SVG illustrations grouped into seven spatial neighborhoods, each marked by a subtle handwritten category title:
- **Center halo — Marine life:** Encircles the origin hero with sixteen sea creatures and shells (such as a baby squid, conch shell, flapjack octopus, seahorse, sea turtle, shrimp, starfish, octopus, crab, small fish, water bubble, jellyfish, dolphin, pearl clam, scallop shell, and striped fish).
- **West — Directional arrows and flow:** Ten hand-drawn arrows, loops, spirals, ribbons, and zigzags.
- **North — Weather and nature:** Ten outdoor illustrations including a cloud, sun rays, daisies, ocean waves, water splashes, grass tufts, and a globe.
- **East — Hearts and celebratory sparks:** Twelve playful flourishes such as heart bursts, multi-point sparkles, stars, crowns, loops, and lightning.
- **South — Editorial symbols and marks:** Ten punctuation and geometric doodles (question and exclamation marks, emphasis pops, rings, hashtags, triangles, diamonds, and diagonal hatching).
- **Southeast — Playful felines:** Eight charming illustrated cats in affectionate or cheerful poses with small accessories.
- **Southwest — Character figures:** Five whimsical pop-culture-inspired character illustrations.

**Contextual micro-hints:** On desktop screens, a few gently tilted handwritten notes sit near outer illustrations to teach key actions—selecting a graphic to customize it, recoloring via the bottom toolbar, dragging the sheet to browse, and calling out the feline cluster.

### 4. Persistent Bottom Control Dock
Centered along the lower edge of the viewport as three separate floating pill groups:
- **Brand & recenter button (left):** Displays the Trazo mark (plus brand wordmark on wider viewports) and returns the camera smoothly to the centered origin when clicked.
- **Live color palette selector (center):**
  - On desktop, a horizontal radio strip of nine circular swatches: a multicolor wheel restoring original multi-tone colors, default deep ink, and seven bright solid-color presets (red, orange, yellow, green, sky blue, cobalt blue, pink) that tint every canvas illustration in real time.
  - On mobile, collapses into a single compact trigger pill displaying the active swatch and color name, opening a popover selector on tap.
- **Full-catalog launcher (right):** High-contrast dark action button with a four-square grid icon, a catalog label, and a desktop keyboard-shortcut chip opening a searchable browser of all 71 illustrations.

## Key Interactive Capabilities
- **Freeform & keyboard panning:** Click-and-drag panning across open sheet space, arrow keys to pan, `Home` key or dock brand button to recenter, and `Tab` stepping across individual illustrations.
- **Individual inspection & export:** Clicking any illustration opens a customization view to tweak appearance and copy clean SVG code.
- **Global live recoloring:** Selecting a palette swatch updates the entire collection simultaneously across the canvas.
- **Quick package install:** Switching package-manager tabs updates the command line in place with one-click copy.
- **Searchable catalog overlay:** Accessible from the bottom-right primary button or keyboard shortcut to filter and jump to any graphic across all seven categories.
