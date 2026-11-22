# Atlas source specs

`desktop.yaml` is a 300 × 470 mm continuous illustrated sheet. `mobile.yaml` is a separately composed 100 × 900 mm portrait sheet, not a crop. All positions use the kit's millimetre coordinates. The Italy silhouette is real Natural Earth geography; the lower editorial islands are deliberately fictional.

Design direction:
- Product: help developers and agents understand and run the cultural-map engine.
- Character: curious, tactile, geographically grounded.
- World: field atlases, pencil illustrations, sea-green paper and red annotations.
- Moments: the Italy illustration and the executable command that regenerates the page itself.
- Signature: numbered expedition stops and kit-drawn coastlines around editorial regions.

Run `./build.sh` from the project root. It uses the installed kit CLI and the kit's own canvas dependency for WebP encoding. Source HTML and CSS live in `source/`. Specs, fonts, license, and the agent skill are copied into the output so the page works over file:// without a server or external assets. No package installation, service, API key, or network is required to build or view.

`site/specs/*.diagnostics.json` contains the actual renderer diagnostics. They track map objects; HTML overlays are checked separately in Chrome. The script does not modify the kit.
