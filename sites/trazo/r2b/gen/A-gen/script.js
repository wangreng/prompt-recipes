/* ==========================================================================
   Trazo — Interactive Sketchbook Canvas Controller
   Handles 2D panning, spring recenter, keyboard navigation, global live
   recoloring, package manager snippet card, inspector & SVG/JSX export,
   and searchable catalog overlay.
   ========================================================================== */

(function () {
  const { PALETTES, CATEGORIES, HINTS, STICKERS } = window.TRAZO_DATA;

  const state = {
    camX: 0,
    camY: 0,
    targetX: 0,
    targetY: 0,
    isAnimating: false,
    isDragging: false,
    dragMoved: false,
    pointerId: null,
    dragStartX: 0,
    dragStartY: 0,
    camStartX: 0,
    camStartY: 0,
    palette: 'original',
    // Inspector state
    activeSticker: null,
    inspectPalette: 'original',
    inspectSize: 120,
    inspectTilted: true,
    inspectFormat: 'svg',
    // Catalog state
    catalogCategory: 'all',
    catalogQuery: ''
  };

  // DOM references
  const stage = document.getElementById('stage');
  const world = document.getElementById('canvas-world');
  const zoneLayer = document.getElementById('zone-labels-layer');
  const hintsLayer = document.getElementById('hints-layer');
  const stickersLayer = document.getElementById('stickers-layer');

  const recenterBtn = document.getElementById('recenter-btn');
  const desktopSwatchTray = document.getElementById('desktop-swatch-tray');
  const mobileColorTrigger = document.getElementById('mobile-color-trigger');
  const mobileColorPopover = document.getElementById('mobile-color-popover');
  const mobileActiveDot = document.getElementById('mobile-active-dot');
  const mobileActiveName = document.getElementById('mobile-active-name');
  const catalogBtn = document.getElementById('catalog-btn');

  // Install card refs
  const pmTabs = Array.from(document.querySelectorAll('.pm-tab'));
  const installCmdRow = document.getElementById('install-cmd-row');
  const installCmdText = document.getElementById('install-cmd-text');
  const copyCmdBtn = document.getElementById('copy-cmd-btn');
  const copyCmdTip = document.getElementById('copy-cmd-tip');

  // Inspector refs
  const inspectorModal = document.getElementById('inspector-modal');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorCategory = document.getElementById('inspector-category');
  const inspectorPreview = document.getElementById('inspector-preview');
  const inspectorSwatches = document.getElementById('inspector-swatches');
  const inspectorSize = document.getElementById('inspector-size');
  const inspectorSizeVal = document.getElementById('inspector-size-val');
  const tiltTiltedBtn = document.getElementById('tilt-tilted-btn');
  const tiltStraightBtn = document.getElementById('tilt-straight-btn');
  const exportTabs = Array.from(document.querySelectorAll('.export-tab'));
  const inspectorCode = document.getElementById('inspector-code');
  const copySvgBtn = document.getElementById('copy-svg-btn');
  const copySvgLabel = document.getElementById('copy-svg-label');
  const downloadSvgBtn = document.getElementById('download-svg-btn');
  const inspectorLocateBtn = document.getElementById('inspector-locate-btn');

  // Catalog refs
  const catalogModal = document.getElementById('catalog-modal');
  const catalogSearch = document.getElementById('catalog-search');
  const catalogFilters = document.getElementById('catalog-filters');
  const catalogGrid = document.getElementById('catalog-grid');
  const catalogCount = document.getElementById('catalog-count');

  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 1900);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return fallbackCopy(text);
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (_) {}
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function getCategoryLabel(catId) {
    const found = CATEGORIES.find((c) => c.id === catId);
    return found ? found.label : catId;
  }

  function getMobileCoordScale() {
    return window.innerWidth <= 720 ? 0.72 : 1;
  }

  function getStickerPosition(sticker) {
    // On narrow mobile screens, pull the center marine halo slightly closer
    // so outer creatures peek enticingly at screen edges without hiding behind hero.
    if (sticker.category === 'marine' && window.innerWidth <= 720) {
      const sx = sticker.x * 0.56;
      const sy = sticker.y * 0.94;
      // Keep top/bottom halo clear of centered mobile hero
      return { x: sx, y: sy, size: Math.round(sticker.size * 0.84) };
    }
    return { x: sticker.x, y: sticker.y, size: sticker.size };
  }

  /* ------------------------------------------------------------------------
     Camera & Infinite Dot-Grid Transform
     ------------------------------------------------------------------------ */

  function applyCamera() {
    world.style.transform = `translate3d(${-state.camX}px, ${-state.camY}px, 0)`;
    // Keep dot grid anchored to canvas coordinates
    stage.style.backgroundPosition = `${-state.camX}px ${-state.camY}px`;
  }

  function animateCameraTo(x, y) {
    state.targetX = x;
    state.targetY = y;
    if (state.isAnimating) return;
    state.isAnimating = true;

    function tick() {
      const dx = state.targetX - state.camX;
      const dy = state.targetY - state.camY;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        state.camX = state.targetX;
        state.camY = state.targetY;
        applyCamera();
        state.isAnimating = false;
        return;
      }
      state.camX += dx * 0.16;
      state.camY += dy * 0.16;
      applyCamera();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function panBy(dx, dy) {
    state.isAnimating = false;
    state.camX = Math.max(-1650, Math.min(1650, state.camX + dx));
    state.camY = Math.max(-1450, Math.min(1450, state.camY + dy));
    state.targetX = state.camX;
    state.targetY = state.camY;
    applyCamera();
  }

  function recenterCamera() {
    animateCameraTo(0, 0);
  }

  /* ------------------------------------------------------------------------
     Render Canvas Layers (Zones, Hints, 71 Specimens)
     ------------------------------------------------------------------------ */

  function renderZonesAndHints() {
    const zFrag = document.createDocumentFragment();
    CATEGORIES.forEach((cat) => {
      if (!cat.zone) return;
      const el = document.createElement('div');
      el.className = 'zone-label';
      el.textContent = cat.label.toLowerCase();
      el.style.left = `${cat.zone.x}px`;
      el.style.top = `${cat.zone.y}px`;
      el.style.setProperty('--z-rot', `${cat.zone.rot}deg`);
      zFrag.appendChild(el);
    });
    zoneLayer.appendChild(zFrag);

    const hFrag = document.createDocumentFragment();
    HINTS.forEach((h) => {
      const el = document.createElement('div');
      el.className = 'margin-hint';
      el.style.left = `${h.x}px`;
      el.style.top = `${h.y}px`;
      el.style.setProperty('--h-rot', `${h.rot}deg`);
      el.innerHTML = `<span>${h.text}</span>${h.arrow}`;
      hFrag.appendChild(el);
    });
    hintsLayer.appendChild(hFrag);
  }

  const specimenEls = new Map();

  function renderStickers() {
    const frag = document.createDocumentFragment();
    STICKERS.forEach((sticker) => {
      const pos = getStickerPosition(sticker);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'specimen-btn';
      btn.dataset.id = sticker.id;
      btn.setAttribute('aria-label', `${sticker.name} (${getCategoryLabel(sticker.category)}) — click to inspect and export`);
      btn.style.setProperty('--sp-x', `${pos.x}px`);
      btn.style.setProperty('--sp-y', `${pos.y}px`);
      btn.style.setProperty('--sp-size', `${pos.size}px`);
      btn.style.setProperty('--sp-rot', `${sticker.rot}deg`);

      const visual = document.createElement('span');
      visual.className = 'specimen-visual';
      if (sticker.img) {
        const img = document.createElement('img');
        img.src = sticker.img;
        img.alt = '';
        img.className = 'sticker-art-img';
        img.draggable = false;
        visual.appendChild(img);
      } else {
        visual.innerHTML = sticker.svg;
      }

      const caption = document.createElement('span');
      caption.className = 'specimen-caption';
      caption.textContent = sticker.name;

      btn.appendChild(visual);
      btn.appendChild(caption);

      btn.addEventListener('click', (e) => {
        if (state.dragMoved) {
          e.preventDefault();
          return;
        }
        openInspector(sticker);
      });

      // Pan smoothly into view when tabbed to via keyboard
      btn.addEventListener('focus', () => {
        const p = getStickerPosition(sticker);
        const halfW = window.innerWidth * 0.42;
        const halfH = window.innerHeight * 0.38;
        if (Math.abs(p.x - state.camX) > halfW || Math.abs(p.y - state.camY) > halfH) {
          animateCameraTo(p.x, p.y);
        }
      });

      specimenEls.set(sticker.id, btn);
      frag.appendChild(btn);
    });
    stickersLayer.appendChild(frag);
  }

  function updateResponsivePositions() {
    STICKERS.forEach((sticker) => {
      const btn = specimenEls.get(sticker.id);
      if (!btn) return;
      const pos = getStickerPosition(sticker);
      btn.style.setProperty('--sp-x', `${pos.x}px`);
      btn.style.setProperty('--sp-y', `${pos.y}px`);
      btn.style.setProperty('--sp-size', `${pos.size}px`);
    });
  }

  /* ------------------------------------------------------------------------
     Palette Swatches (Desktop Tray, Mobile Popover, Inspector)
     ------------------------------------------------------------------------ */

  function createSwatchButton(pal, isActive, onSelect, showTooltip = true) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch-btn';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', String(isActive));
    btn.setAttribute('aria-label', pal.name);
    btn.dataset.paletteId = pal.id;

    const dot = document.createElement('span');
    dot.className = pal.wheel ? 'swatch-dot is-wheel' : 'swatch-dot';
    if (!pal.wheel) {
      dot.style.backgroundColor = pal.swatch;
    }
    btn.appendChild(dot);

    if (showTooltip) {
      const tip = document.createElement('span');
      tip.className = 'dark-tooltip tooltip-top';
      tip.setAttribute('role', 'tooltip');
      tip.textContent = pal.name;
      btn.appendChild(tip);
    }

    btn.addEventListener('click', () => onSelect(pal.id));
    return btn;
  }

  function setGlobalPalette(palId) {
    state.palette = palId;
    document.body.dataset.palette = palId;
    const pal = PALETTES.find((p) => p.id === palId) || PALETTES[0];

    // Sync desktop & mobile radios
    [desktopSwatchTray, mobileColorPopover].forEach((container) => {
      container.querySelectorAll('.swatch-btn').forEach((b) => {
        b.setAttribute('aria-checked', String(b.dataset.paletteId === palId));
      });
    });

    // Update mobile trigger badge
    mobileActiveName.textContent = pal.name;
    if (pal.wheel) {
      mobileActiveDot.className = 'swatch-dot is-wheel';
      mobileActiveDot.style.backgroundColor = '';
    } else {
      mobileActiveDot.className = 'swatch-dot';
      mobileActiveDot.style.backgroundColor = pal.swatch;
    }
  }

  function initPaletteControls() {
    PALETTES.forEach((pal) => {
      desktopSwatchTray.appendChild(
        createSwatchButton(pal, pal.id === state.palette, setGlobalPalette, true)
      );
      mobileColorPopover.appendChild(
        createSwatchButton(
          pal,
          pal.id === state.palette,
          (id) => {
            setGlobalPalette(id);
            closeMobilePopover();
          },
          false
        )
      );
    });

    mobileColorTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = mobileColorPopover.hidden;
      mobileColorPopover.hidden = !willOpen;
      mobileColorTrigger.setAttribute('aria-expanded', String(willOpen));
    });

    document.addEventListener('click', (e) => {
      if (!mobileColorPopover.hidden && !mobileColorPopover.contains(e.target) && !mobileColorTrigger.contains(e.target)) {
        closeMobilePopover();
      }
    });
  }

  function closeMobilePopover() {
    mobileColorPopover.hidden = true;
    mobileColorTrigger.setAttribute('aria-expanded', 'false');
  }

  /* ------------------------------------------------------------------------
     Package Install Card
     ------------------------------------------------------------------------ */

  function initInstallCard() {
    pmTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        pmTabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        installCmdText.textContent = tab.dataset.cmd;
      });
    });

    let copyResetTimer = null;
    function triggerCopyCommand() {
      const cmd = installCmdText.textContent.trim();
      copyText(cmd).then(() => {
        copyCmdBtn.classList.add('is-copied');
        installCmdRow.classList.add('is-copied');
        copyCmdTip.textContent = 'Copied!';
        clearTimeout(copyResetTimer);
        copyResetTimer = setTimeout(() => {
          copyCmdBtn.classList.remove('is-copied');
          installCmdRow.classList.remove('is-copied');
          copyCmdTip.textContent = 'Copy command';
        }, 1600);
      });
    }

    copyCmdBtn.addEventListener('click', triggerCopyCommand);
    installCmdRow.addEventListener('click', triggerCopyCommand);
  }

  /* ------------------------------------------------------------------------
     Panning (Pointer Drag, Trackpad Wheel, Keyboard Navigation)
     ------------------------------------------------------------------------ */

  function isInteractiveTarget(target) {
    return Boolean(
      target.closest('button, a, input, .install-card, .modal-backdrop, .bottom-dock, .top-chrome')
    );
  }

  function initPanning() {
    stage.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      // Allow dragging even if starting on non-button hero text, but not install card or links
      if (e.target.closest('.install-card, .sponsor-link, .specimen-btn')) {
        return;
      }
      state.isDragging = true;
      state.dragMoved = false;
      state.isAnimating = false;
      state.pointerId = e.pointerId;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.camStartX = state.camX;
      state.camStartY = state.camY;
      stage.classList.add('is-dragging');
      stage.setPointerCapture(e.pointerId);
    });

    stage.addEventListener('pointermove', (e) => {
      if (!state.isDragging || e.pointerId !== state.pointerId) return;
      const dx = e.clientX - state.dragStartX;
      const dy = e.clientY - state.dragStartY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        state.dragMoved = true;
      }
      state.camX = Math.max(-1650, Math.min(1650, state.camStartX - dx));
      state.camY = Math.max(-1450, Math.min(1450, state.camStartY - dy));
      state.targetX = state.camX;
      state.targetY = state.camY;
      applyCamera();
    });

    function endDrag(e) {
      if (!state.isDragging || e.pointerId !== state.pointerId) return;
      state.isDragging = false;
      stage.classList.remove('is-dragging');
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch (_) {}
      setTimeout(() => {
        state.dragMoved = false;
      }, 40);
    }

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    // Smooth wheel / trackpad panning when no modal is open
    stage.addEventListener(
      'wheel',
      (e) => {
        if (!inspectorModal.hidden || !catalogModal.hidden) return;
        e.preventDefault();
        panBy(e.deltaX, e.deltaY);
      },
      { passive: false }
    );

    // Keyboard shortcuts & arrow-key panning
    document.addEventListener('keydown', (e) => {
      const inInput = document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);

      // Cmd/Ctrl + K or '/' opens catalog
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || (!inInput && e.key === '/')) {
        e.preventDefault();
        if (catalogModal.hidden) {
          closeModal(inspectorModal);
          openCatalog();
        } else {
          closeModal(catalogModal);
        }
        return;
      }

      if (e.key === 'Escape') {
        if (!inspectorModal.hidden) closeModal(inspectorModal);
        else if (!catalogModal.hidden) closeModal(catalogModal);
        else if (!mobileColorPopover.hidden) closeMobilePopover();
        return;
      }

      // Skip canvas nav when modal is open or typing
      if (!inspectorModal.hidden || !catalogModal.hidden || inInput) return;

      const step = e.shiftKey ? 220 : 110;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        animateCameraTo(Math.max(-1650, state.targetX - step), state.targetY);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        animateCameraTo(Math.min(1650, state.targetX + step), state.targetY);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        animateCameraTo(state.targetX, Math.max(-1450, state.targetY - step));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        animateCameraTo(state.targetX, Math.min(1450, state.targetY + step));
      } else if (e.key === 'Home') {
        e.preventDefault();
        recenterCamera();
      }
    });

    recenterBtn.addEventListener('click', recenterCamera);
  }

  /* ------------------------------------------------------------------------
     Sticker Inspector & Clean SVG / React JSX Export
     ------------------------------------------------------------------------ */

  function buildExportSvg(sticker, palId, size, tilted) {
    const pal = PALETTES.find((p) => p.id === palId) || PALETTES[0];
    // Parse inner SVG cleanly and bake colors if a monochrome preset is selected
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${size}" height="${size}" fill="none">${sticker.svgInner}</svg>`,
      'image/svg+xml'
    );
    const svgEl = doc.documentElement;
    if (tilted && sticker.rot) {
      svgEl.setAttribute('style', `transform: rotate(${sticker.rot}deg)`);
    }

    if (palId !== 'original') {
      svgEl.querySelectorAll('.c-stroke').forEach((el) => el.setAttribute('stroke', pal.stroke));
      svgEl.querySelectorAll('.c-stroke-fill').forEach((el) => el.setAttribute('fill', pal.stroke));
      svgEl.querySelectorAll('.c-fill').forEach((el) => {
        el.setAttribute('fill', pal.fill);
        el.setAttribute('stroke', pal.stroke);
      });
      svgEl.querySelectorAll('.c-fill-nostroke').forEach((el) => el.setAttribute('fill', pal.fill));
      svgEl.querySelectorAll('.c-fill-alt').forEach((el) => {
        el.setAttribute('fill', pal.fillAlt);
        el.setAttribute('stroke', pal.stroke);
      });
      svgEl.querySelectorAll('.c-fill-alt-nostroke').forEach((el) => el.setAttribute('fill', pal.fillAlt));
      svgEl.querySelectorAll('.c-cheek').forEach((el) => el.setAttribute('fill', pal.cheek));
      svgEl.querySelectorAll('.c-eye').forEach((el) => el.setAttribute('fill', pal.eye));
      svgEl.querySelectorAll('.c-eye-stroke').forEach((el) => el.setAttribute('stroke', pal.eye));
    }

    // Strip internal helper classes for super clean exported SVG markup
    svgEl.querySelectorAll('[class]').forEach((el) => el.removeAttribute('class'));

    const serialized = new XMLSerializer().serializeToString(svgEl);
    return serialized
      .replace(/>\s+</g, '>\n  <')
      .replace('  </svg>', '</svg>');
  }

  function toPascalName(str) {
    return str
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  }

  function buildExportJsx(sticker, palId, size, tilted) {
    const compName = toPascalName(sticker.name) + 'Sticker';
    const props = [];
    if (size !== 120) props.push(`size={${size}}`);
    if (palId !== 'original') props.push(`color="${palId}"`);
    if (!tilted) props.push('tilt={0}');
    const propStr = props.length ? ' ' + props.join(' ') : '';
    return `import { ${compName} } from 'trazo-stickers';\n\nexport function Example() {\n  return <${compName}${propStr} />;\n}`;
  }

  function renderInspectorView() {
    const sticker = state.activeSticker;
    if (!sticker) return;

    inspectorTitle.textContent = sticker.name;
    inspectorCategory.textContent = getCategoryLabel(sticker.category);
    inspectorSize.value = String(state.inspectSize);
    inspectorSizeVal.textContent = `${state.inspectSize}px`;

    // Render visual preview (using authentic art PNG for s01..s08, crisp crayon SVG otherwise)
    const previewPx = Math.min(180, Math.max(84, state.inspectSize));
    inspectorPreview.style.width = `${previewPx}px`;
    inspectorPreview.style.height = `${previewPx}px`;
    inspectorPreview.style.transform = state.inspectTilted ? `rotate(${sticker.rot}deg)` : 'rotate(0deg)';

    if (sticker.img) {
      const img = document.createElement('img');
      img.src = sticker.img;
      img.alt = sticker.name;
      img.className = 'sticker-art-img';
      img.style.filter = state.inspectPalette === 'original' ? 'none' : `url(#tint-${state.inspectPalette})`;
      inspectorPreview.innerHTML = '';
      inspectorPreview.appendChild(img);
    } else {
      inspectorPreview.innerHTML = buildExportSvg(sticker, state.inspectPalette, previewPx, false);
      const svgNode = inspectorPreview.querySelector('svg');
      if (svgNode) {
        svgNode.style.width = '100%';
        svgNode.style.height = '100%';
      }
    }

    // Update swatch checks
    inspectorSwatches.querySelectorAll('.swatch-btn').forEach((b) => {
      b.setAttribute('aria-checked', String(b.dataset.paletteId === state.inspectPalette));
    });

    tiltTiltedBtn.classList.toggle('is-active', state.inspectTilted);
    tiltStraightBtn.classList.toggle('is-active', !state.inspectTilted);

    exportTabs.forEach((t) => t.classList.toggle('is-active', t.dataset.format === state.inspectFormat));

    const code =
      state.inspectFormat === 'svg'
        ? buildExportSvg(sticker, state.inspectPalette, state.inspectSize, state.inspectTilted)
        : buildExportJsx(sticker, state.inspectPalette, state.inspectSize, state.inspectTilted);

    inspectorCode.textContent = code;
    copySvgLabel.textContent = state.inspectFormat === 'svg' ? 'Copy SVG' : 'Copy JSX';
  }

  function openInspector(sticker) {
    state.activeSticker = sticker;
    state.inspectPalette = state.palette;
    state.inspectSize = 120;
    state.inspectTilted = true;
    renderInspectorView();
    inspectorModal.hidden = false;
  }

  function initInspector() {
    PALETTES.forEach((pal) => {
      inspectorSwatches.appendChild(
        createSwatchButton(
          pal,
          false,
          (id) => {
            state.inspectPalette = id;
            renderInspectorView();
          },
          true
        )
      );
    });

    inspectorSize.addEventListener('input', () => {
      state.inspectSize = Number(inspectorSize.value);
      renderInspectorView();
    });

    tiltTiltedBtn.addEventListener('click', () => {
      state.inspectTilted = true;
      renderInspectorView();
    });

    tiltStraightBtn.addEventListener('click', () => {
      state.inspectTilted = false;
      renderInspectorView();
    });

    exportTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        state.inspectFormat = tab.dataset.format;
        renderInspectorView();
      });
    });

    copySvgBtn.addEventListener('click', () => {
      copyText(inspectorCode.textContent).then(() => {
        showToast(state.inspectFormat === 'svg' ? 'Clean SVG copied to clipboard' : 'React JSX copied to clipboard');
      });
    });

    downloadSvgBtn.addEventListener('click', () => {
      const sticker = state.activeSticker;
      if (!sticker) return;
      const svgMarkup = buildExportSvg(sticker, state.inspectPalette, state.inspectSize, state.inspectTilted);
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trazo-${sticker.id}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Downloaded trazo-${sticker.id}.svg`);
    });

    inspectorLocateBtn.addEventListener('click', () => {
      const sticker = state.activeSticker;
      if (!sticker) return;
      closeModal(inspectorModal);
      flyToSticker(sticker);
    });
  }

  function flyToSticker(sticker) {
    const pos = getStickerPosition(sticker);
    animateCameraTo(pos.x, pos.y);
    const el = specimenEls.get(sticker.id);
    if (el) {
      el.classList.remove('is-pulse');
      void el.offsetWidth;
      el.classList.add('is-pulse');
      setTimeout(() => el.classList.remove('is-pulse'), 950);
    }
  }

  /* ------------------------------------------------------------------------
     Searchable Catalog Overlay
     ------------------------------------------------------------------------ */

  function renderCatalogFilters() {
    catalogFilters.innerHTML = '';
    CATEGORIES.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-pill' + (state.catalogCategory === cat.id ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(state.catalogCategory === cat.id));
      btn.textContent = cat.label;
      btn.addEventListener('click', () => {
        state.catalogCategory = cat.id;
        renderCatalogFilters();
        renderCatalogGrid();
      });
      catalogFilters.appendChild(btn);
    });
  }

  function renderCatalogGrid() {
    const q = state.catalogQuery.trim().toLowerCase();
    const matches = STICKERS.filter((s) => {
      const catOk = state.catalogCategory === 'all' || s.category === state.catalogCategory;
      if (!catOk) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        getCategoryLabel(s.category).toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    });

    catalogCount.textContent = `${matches.length} shown`;
    catalogGrid.innerHTML = '';

    if (matches.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'catalog-empty';
      empty.textContent = 'No stickers matched that doodle search — try "whale", "cat", or "star".';
      catalogGrid.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();
    matches.forEach((sticker) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'catalog-item';

      const thumb = document.createElement('span');
      thumb.className = 'catalog-thumb';
      if (sticker.img) {
        const img = document.createElement('img');
        img.src = sticker.img;
        img.alt = '';
        img.className = 'sticker-art-img';
        thumb.appendChild(img);
      } else {
        thumb.innerHTML = sticker.svg;
      }

      const name = document.createElement('span');
      name.className = 'catalog-item-name';
      name.textContent = sticker.name;

      card.appendChild(thumb);
      card.appendChild(name);
      card.addEventListener('click', () => {
        closeModal(catalogModal);
        openInspector(sticker);
      });
      frag.appendChild(card);
    });

    catalogGrid.appendChild(frag);
  }

  function openCatalog() {
    renderCatalogFilters();
    renderCatalogGrid();
    catalogModal.hidden = false;
    setTimeout(() => catalogSearch.focus(), 30);
  }

  function closeModal(modalEl) {
    modalEl.hidden = true;
  }

  function initModals() {
    catalogBtn.addEventListener('click', openCatalog);

    catalogSearch.addEventListener('input', () => {
      state.catalogQuery = catalogSearch.value;
      renderCatalogGrid();
    });

    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-close-modal');
        const el = document.getElementById(id);
        if (el) closeModal(el);
      });
    });

    [inspectorModal, catalogModal].forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal(backdrop);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */

  renderZonesAndHints();
  renderStickers();
  initPaletteControls();
  initInstallCard();
  initPanning();
  initInspector();
  initModals();
  applyCamera();

  window.addEventListener('resize', updateResponsivePositions);
})();
