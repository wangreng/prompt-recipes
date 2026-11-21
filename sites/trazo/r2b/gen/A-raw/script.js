/* ==========================================================================
   Trazo — Interactive Sketchbook Canvas Controller
   Handles panning, keyboard nav, package manager tabs, live recoloring,
   sticker inspector + clean SVG export, and searchable 71-item catalog.
   ========================================================================== */

(function () {
  'use strict';

  const ZONES = window.TRAZO_ZONES || [];
  const STICKERS = window.TRAZO_STICKERS || [];
  const PALETTES = window.TRAZO_PALETTES || {};

  const PM_COMMANDS = {
    npm: 'npm install trazo-stickers',
    pnpm: 'pnpm add trazo-stickers',
    yarn: 'yarn add trazo-stickers',
    bun: 'bun add trazo-stickers'
  };

  const PAN_BOUNDS = { minX: -1460, maxX: 1460, minY: -1080, maxY: 1080 };

  const state = {
    panX: 0,
    panY: 0,
    palette: 'original',
    activePm: 'npm',
    inspectorSticker: null,
    inspectorPalette: 'original',
    inspectorSize: 128,
    catalogFilter: 'all',
    catalogQuery: ''
  };

  // DOM References
  const viewport = document.getElementById('canvas-viewport');
  const world = document.getElementById('canvas-world');
  const zoneLayer = document.getElementById('zone-labels-layer');
  const stickersLayer = document.getElementById('stickers-layer');
  const recenterBtn = document.getElementById('recenter-btn');

  const pmTabs = document.querySelectorAll('.pm-tab');
  const cmdText = document.getElementById('install-cmd-text');
  const cmdRow = document.getElementById('install-cmd-row');
  const copyCmdBtn = document.getElementById('copy-cmd-btn');

  const paletteStrip = document.getElementById('palette-strip');
  const mobilePaletteTrigger = document.getElementById('palette-mobile-trigger');
  const mobileActiveDot = document.getElementById('mobile-active-dot');
  const mobileActiveLabel = document.getElementById('mobile-active-label');
  const palettePopover = document.getElementById('palette-popover');

  const catalogBtn = document.getElementById('catalog-btn');
  const catalogOverlay = document.getElementById('catalog-overlay');
  const catalogSearch = document.getElementById('catalog-search');
  const catalogFilters = document.getElementById('catalog-filters');
  const catalogGrid = document.getElementById('catalog-grid');
  const catalogCount = document.getElementById('catalog-count');

  const inspectorOverlay = document.getElementById('inspector-overlay');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorCategory = document.getElementById('inspector-category');
  const inspectorStage = document.getElementById('inspector-stage');
  const inspectorPreview = document.getElementById('inspector-preview');
  const inspectorSwatches = document.getElementById('inspector-swatches');
  const inspectorSizeInput = document.getElementById('inspector-size');
  const inspectorSizeVal = document.getElementById('inspector-size-val');
  const inspectorJsxCode = document.getElementById('inspector-jsx-code');
  const btnCopySvg = document.getElementById('btn-copy-svg');
  const btnCopyJsx = document.getElementById('btn-copy-jsx');
  const btnDownloadSvg = document.getElementById('btn-download-svg');

  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  /* ------------------------------------------------------------------------
     Utility: Toast & Clipboard (works reliably even on file://)
     ------------------------------------------------------------------------ */
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 1800);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
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

  /* ------------------------------------------------------------------------
     Render Visual Markup for a Sticker (art/ref*.png or inline crayon SVG)
     ------------------------------------------------------------------------ */
  function renderStickerVisual(sticker) {
    if (sticker.art) {
      const clipStyle = sticker.clip ? `clip-path: url(#${sticker.clip});` : '';
      return `<img class="ref-art-img" src="${sticker.art}" alt="" draggable="false" style="${clipStyle}" />`;
    }
    return sticker.svg;
  }

  /* Generate clean standalone exportable SVG string for any sticker & palette */
  function buildExportSvg(sticker, paletteKey, size) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(sticker.svg, 'image/svg+xml');
    const svg = doc.documentElement;
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));

    if (paletteKey !== 'original' && PALETTES[paletteKey]) {
      const p = PALETTES[paletteKey];
      svg.querySelectorAll('.s-outline').forEach((el) => el.setAttribute('stroke', p.outline));
      svg.querySelectorAll('.s-outline-fill').forEach((el) => el.setAttribute('fill', p.outline));
      svg.querySelectorAll('.s-fill').forEach((el) => {
        if (el.getAttribute('fill') && el.getAttribute('fill') !== 'none') el.setAttribute('fill', p.fill);
        if (el.getAttribute('stroke') && !el.classList.contains('s-outline')) el.setAttribute('stroke', p.fill);
      });
      svg.querySelectorAll('.s-shade').forEach((el) => {
        if (el.getAttribute('fill') && el.getAttribute('fill') !== 'none') el.setAttribute('fill', p.shade);
        if (el.getAttribute('stroke') && !el.classList.contains('s-outline')) el.setAttribute('stroke', p.shade);
      });
      svg.querySelectorAll('.s-tint').forEach((el) => el.setAttribute('fill', p.tint));
      svg.querySelectorAll('.s-cheek').forEach((el) => {
        el.setAttribute('fill', p.shade);
        el.setAttribute('opacity', '0.45');
      });
    }

    // Strip internal CSS hook classes so exported SVG is clean & portable
    svg.querySelectorAll('[class]').forEach((el) => el.removeAttribute('class'));
    return new XMLSerializer().serializeToString(svg);
  }

  /* ------------------------------------------------------------------------
     Populate Canvas: Neighborhood Titles & All 71 Spatial Specimens
     ------------------------------------------------------------------------ */
  function renderCanvas() {
    const zoneFrag = document.createDocumentFragment();
    ZONES.forEach((zone) => {
      const el = document.createElement('div');
      el.className = 'zone-title';
      el.style.left = `${zone.x}px`;
      el.style.top = `${zone.y}px`;
      el.style.setProperty('--zrot', `${zone.rot}deg`);
      el.textContent = zone.heading;
      zoneFrag.appendChild(el);
    });
    zoneLayer.appendChild(zoneFrag);

    const stickerFrag = document.createDocumentFragment();
    STICKERS.forEach((sticker) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sticker-item';
      btn.dataset.id = sticker.id;
      btn.setAttribute('aria-label', `${sticker.name} — click to customize and copy SVG`);
      btn.style.setProperty('--sx', `${sticker.x}px`);
      btn.style.setProperty('--sy', `${sticker.y}px`);
      btn.style.setProperty('--ssize', `${sticker.size}px`);
      btn.style.setProperty('--srot', `${sticker.rot}deg`);

      btn.innerHTML = `
        <span class="sticker-visual">${renderStickerVisual(sticker)}</span>
        <span class="sticker-caption">${sticker.name}</span>
      `;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (didDragRecently) return;
        openInspector(sticker);
      });

      btn.addEventListener('focus', () => {
        // Keep keyboard-tabbed stickers smoothly in view
        const targetPanX = -sticker.x;
        const targetPanY = -sticker.y;
        const dx = Math.abs(targetPanX - state.panX);
        const dy = Math.abs(targetPanY - state.panY);
        if (dx > window.innerWidth * 0.36 || dy > window.innerHeight * 0.34) {
          panTo(targetPanX, targetPanY, true);
        }
      });

      stickerFrag.appendChild(btn);
    });
    stickersLayer.appendChild(stickerFrag);
  }

  /* ------------------------------------------------------------------------
     Canvas Panning (Pointer drag, Trackpad Wheel, Arrow Keys, Home Recenter)
     ------------------------------------------------------------------------ */
  function clampPan(x, y) {
    return {
      x: Math.max(PAN_BOUNDS.minX, Math.min(PAN_BOUNDS.maxX, x)),
      y: Math.max(PAN_BOUNDS.minY, Math.min(PAN_BOUNDS.maxY, y))
    };
  }

  function applyPan() {
    viewport.style.setProperty('--pan-x', `${Math.round(state.panX * 10) / 10}px`);
    viewport.style.setProperty('--pan-y', `${Math.round(state.panY * 10) / 10}px`);
    const dist = Math.hypot(state.panX, state.panY);
    recenterBtn.classList.toggle('is-panned', dist > 28);
  }

  let animTimer = null;
  function panTo(x, y, animate = true) {
    const clamped = clampPan(x, y);
    state.panX = clamped.x;
    state.panY = clamped.y;
    if (animate) {
      viewport.classList.add('is-animating');
      clearTimeout(animTimer);
      animTimer = setTimeout(() => viewport.classList.remove('is-animating'), 560);
    } else {
      viewport.classList.remove('is-animating');
    }
    applyPan();
  }

  let isPointerDown = false;
  let didDragRecently = false;
  let startPtrX = 0;
  let startPtrY = 0;
  let startPanX = 0;
  let startPanY = 0;
  let velX = 0;
  let velY = 0;
  let lastPtrX = 0;
  let lastPtrY = 0;
  let inertiaRaf = null;

  function stopInertia() {
    if (inertiaRaf) {
      cancelAnimationFrame(inertiaRaf);
      inertiaRaf = null;
    }
  }

  viewport.addEventListener('pointerdown', (e) => {
    // Allow normal interaction inside hero install card & links
    if (e.target.closest('.install-card, .sponsor-link')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    stopInertia();
    viewport.classList.remove('is-animating');
    isPointerDown = true;
    didDragRecently = false;
    startPtrX = lastPtrX = e.clientX;
    startPtrY = lastPtrY = e.clientY;
    startPanX = state.panX;
    startPanY = state.panY;
    velX = 0;
    velY = 0;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const dx = e.clientX - startPtrX;
    const dy = e.clientY - startPtrY;

    if (!didDragRecently && Math.hypot(dx, dy) > 5) {
      didDragRecently = true;
      viewport.classList.add('is-dragging');
      closeMobilePalettePopover();
    }

    if (didDragRecently) {
      velX = e.clientX - lastPtrX;
      velY = e.clientY - lastPtrY;
      lastPtrX = e.clientX;
      lastPtrY = e.clientY;
      panTo(startPanX + dx, startPanY + dy, false);
    }
  });

  window.addEventListener('pointerup', () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    viewport.classList.remove('is-dragging');

    if (didDragRecently && Math.hypot(velX, velY) > 1.8) {
      const glide = () => {
        velX *= 0.92;
        velY *= 0.92;
        if (Math.hypot(velX, velY) < 0.35) {
          inertiaRaf = null;
          return;
        }
        panTo(state.panX + velX, state.panY + velY, false);
        inertiaRaf = requestAnimationFrame(glide);
      };
      inertiaRaf = requestAnimationFrame(glide);
    }

    setTimeout(() => {
      didDragRecently = false;
    }, 30);
  });

  // Trackpad / wheel panning across the open paper stage
  viewport.addEventListener(
    'wheel',
    (e) => {
      if (!catalogOverlay.hidden || !inspectorOverlay.hidden) return;
      e.preventDefault();
      stopInertia();
      panTo(state.panX - e.deltaX, state.panY - e.deltaY, false);
    },
    { passive: false }
  );

  // Recenter via brand pill
  recenterBtn.addEventListener('click', () => {
    stopInertia();
    panTo(0, 0, true);
  });

  /* ------------------------------------------------------------------------
     Package Manager Snippet Switcher & Copy
     ------------------------------------------------------------------------ */
  pmTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const pm = tab.dataset.pm;
      state.activePm = pm;
      pmTabs.forEach((t) => {
        const active = t.dataset.pm === pm;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      cmdText.textContent = PM_COMMANDS[pm];
    });
  });

  let copyCmdTimer = null;
  function handleCopyCommand() {
    const cmd = PM_COMMANDS[state.activePm];
    copyToClipboard(cmd).then(() => {
      copyCmdBtn.classList.add('is-copied');
      showToast(`Copied: ${cmd}`);
      clearTimeout(copyCmdTimer);
      copyCmdTimer = setTimeout(() => copyCmdBtn.classList.remove('is-copied'), 1600);
    });
  }

  copyCmdBtn.addEventListener('click', handleCopyCommand);
  cmdRow.addEventListener('click', handleCopyCommand);

  /* ------------------------------------------------------------------------
     Global Live Color Palette Selector (Desktop Strip + Mobile Popover)
     ------------------------------------------------------------------------ */
  function setGlobalPalette(paletteKey) {
    if (!PALETTES[paletteKey]) return;
    state.palette = paletteKey;
    world.setAttribute('data-palette', paletteKey);
    catalogGrid.setAttribute('data-palette', paletteKey);

    // Update desktop strip & mobile popover buttons
    document.querySelectorAll('#palette-strip .swatch-btn, #palette-popover .swatch-btn').forEach((btn) => {
      const active = btn.dataset.palette === paletteKey;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-checked', String(active));
    });

    // Update mobile trigger pill
    const meta = PALETTES[paletteKey];
    mobileActiveLabel.textContent = meta.label;
    if (paletteKey === 'original') {
      mobileActiveDot.classList.add('swatch-original');
      mobileActiveDot.style.background = '';
    } else {
      mobileActiveDot.classList.remove('swatch-original');
      mobileActiveDot.style.background = meta.swatch;
    }
  }

  function buildMobilePopover() {
    palettePopover.innerHTML = '';
    Object.entries(PALETTES).forEach(([key, meta]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `swatch-btn ${key === 'original' ? 'swatch-original' : ''} ${key === state.palette ? 'is-active' : ''}`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(key === state.palette));
      btn.setAttribute('aria-label', meta.label);
      btn.dataset.palette = key;
      if (key !== 'original') btn.style.setProperty('--sw', meta.swatch);
      btn.addEventListener('click', () => {
        setGlobalPalette(key);
        closeMobilePalettePopover();
      });
      palettePopover.appendChild(btn);
    });
  }

  function closeMobilePalettePopover() {
    palettePopover.hidden = true;
    mobilePaletteTrigger.setAttribute('aria-expanded', 'false');
  }

  paletteStrip.addEventListener('click', (e) => {
    const btn = e.target.closest('.swatch-btn');
    if (!btn) return;
    setGlobalPalette(btn.dataset.palette);
  });

  mobilePaletteTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const opening = palettePopover.hidden;
    palettePopover.hidden = !opening;
    mobilePaletteTrigger.setAttribute('aria-expanded', String(opening));
  });

  document.addEventListener('click', (e) => {
    if (!palettePopover.hidden && !e.target.closest('.palette-pill')) {
      closeMobilePalettePopover();
    }
  });

  /* ------------------------------------------------------------------------
     Individual Sticker Inspector & Clean SVG Export
     ------------------------------------------------------------------------ */
  function buildInspectorSwatches() {
    inspectorSwatches.innerHTML = '';
    Object.entries(PALETTES).forEach(([key, meta]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `swatch-btn ${key === 'original' ? 'swatch-original' : ''} ${key === state.inspectorPalette ? 'is-active' : ''}`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(key === state.inspectorPalette));
      btn.setAttribute('aria-label', meta.label);
      btn.dataset.palette = key;
      if (key !== 'original') btn.style.setProperty('--sw', meta.swatch);
      btn.addEventListener('click', () => {
        state.inspectorPalette = key;
        updateInspectorView();
      });
      inspectorSwatches.appendChild(btn);
    });
  }

  function updateInspectorView() {
    const sticker = state.inspectorSticker;
    if (!sticker) return;
    inspectorStage.setAttribute('data-palette', state.inspectorPalette);
    inspectorSizeVal.textContent = `${state.inspectorSize}px`;

    const colorProp =
      state.inspectorPalette === 'original'
        ? ''
        : ` color="${PALETTES[state.inspectorPalette].swatch}"`;
    inspectorJsxCode.textContent = `import { ${sticker.component} } from 'trazo-stickers'`;
    inspectorJsxCode.title = `<${sticker.component} size={${state.inspectorSize}}${colorProp} />`;

    inspectorSwatches.querySelectorAll('.swatch-btn').forEach((btn) => {
      const active = btn.dataset.palette === state.inspectorPalette;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-checked', String(active));
    });
  }

  function openInspector(sticker) {
    state.inspectorSticker = sticker;
    state.inspectorPalette = state.palette;
    state.inspectorSize = 128;
    inspectorSizeInput.value = '128';

    const zoneObj = ZONES.find((z) => z.id === sticker.zone);
    inspectorTitle.textContent = sticker.name;
    inspectorCategory.textContent = zoneObj ? zoneObj.label : sticker.zone;
    inspectorPreview.innerHTML = renderStickerVisual(sticker);

    buildInspectorSwatches();
    updateInspectorView();
    inspectorOverlay.hidden = false;
  }

  function closeInspector() {
    inspectorOverlay.hidden = true;
    state.inspectorSticker = null;
  }

  inspectorSizeInput.addEventListener('input', () => {
    state.inspectorSize = Number(inspectorSizeInput.value);
    updateInspectorView();
  });

  btnCopySvg.addEventListener('click', () => {
    if (!state.inspectorSticker) return;
    const markup = buildExportSvg(state.inspectorSticker, state.inspectorPalette, state.inspectorSize);
    copyToClipboard(markup).then(() => showToast(`Copied ${state.inspectorSticker.name} SVG`));
  });

  btnCopyJsx.addEventListener('click', () => {
    if (!state.inspectorSticker) return;
    const s = state.inspectorSticker;
    const colorProp =
      state.inspectorPalette === 'original'
        ? ''
        : ` color="${PALETTES[state.inspectorPalette].swatch}"`;
    const snippet = `<${s.component} size={${state.inspectorSize}}${colorProp} />`;
    copyToClipboard(snippet).then(() => showToast('Copied React JSX snippet'));
  });

  btnDownloadSvg.addEventListener('click', () => {
    if (!state.inspectorSticker) return;
    const markup = buildExportSvg(state.inspectorSticker, state.inspectorPalette, state.inspectorSize);
    const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trazo-${state.inspectorSticker.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded trazo-${state.inspectorSticker.id}.svg`);
  });

  /* ------------------------------------------------------------------------
     Searchable 71-Sticker Catalog Overlay
     ------------------------------------------------------------------------ */
  function buildCatalogFilters() {
    catalogFilters.innerHTML = '';
    const allChip = document.createElement('button');
    allChip.type = 'button';
    allChip.className = 'filter-chip is-active';
    allChip.dataset.zone = 'all';
    allChip.textContent = `All (${STICKERS.length})`;
    catalogFilters.appendChild(allChip);

    ZONES.forEach((zone) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'filter-chip';
      chip.dataset.zone = zone.id;
      chip.textContent = `${zone.label} (${zone.count})`;
      catalogFilters.appendChild(chip);
    });

    catalogFilters.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      state.catalogFilter = chip.dataset.zone;
      catalogFilters.querySelectorAll('.filter-chip').forEach((c) => {
        c.classList.toggle('is-active', c.dataset.zone === state.catalogFilter);
      });
      renderCatalogGrid();
    });
  }

  function renderCatalogGrid() {
    const q = state.catalogQuery.trim().toLowerCase();
    const filtered = STICKERS.filter((s) => {
      const matchZone = state.catalogFilter === 'all' || s.zone === state.catalogFilter;
      if (!matchZone) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.zone.toLowerCase().includes(q) ||
        (s.tags && s.tags.some((t) => t.includes(q)))
      );
    });

    catalogCount.textContent = String(filtered.length);
    catalogGrid.innerHTML = '';

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'catalog-empty';
      empty.textContent = 'No stickers match that search yet...';
      catalogGrid.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();
    filtered.forEach((sticker) => {
      const tile = document.createElement('div');
      tile.className = 'catalog-tile';
      tile.tabIndex = 0;
      tile.setAttribute('role', 'button');
      tile.setAttribute('aria-label', `Inspect ${sticker.name}`);

      tile.innerHTML = `
        <button type="button" class="catalog-tile-locate" title="Jump to on canvas" aria-label="Jump to ${sticker.name} on canvas">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 1.8v2.4M8 11.8v2.4M1.8 8h2.4M11.8 8h2.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="catalog-tile-art">${renderStickerVisual(sticker)}</div>
        <div class="catalog-tile-name">${sticker.name}</div>
      `;

      const locateBtn = tile.querySelector('.catalog-tile-locate');
      locateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCatalog();
        panTo(-sticker.x, -sticker.y, true);
      });

      tile.addEventListener('click', () => {
        closeCatalog();
        openInspector(sticker);
      });

      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          closeCatalog();
          openInspector(sticker);
        }
      });

      frag.appendChild(tile);
    });
    catalogGrid.appendChild(frag);
  }

  function openCatalog() {
    closeMobilePalettePopover();
    catalogGrid.setAttribute('data-palette', state.palette);
    catalogOverlay.hidden = false;
    renderCatalogGrid();
    setTimeout(() => catalogSearch.focus(), 40);
  }

  function closeCatalog() {
    catalogOverlay.hidden = true;
  }

  catalogBtn.addEventListener('click', openCatalog);
  catalogSearch.addEventListener('input', () => {
    state.catalogQuery = catalogSearch.value;
    renderCatalogGrid();
  });

  // Modal close buttons & backdrop clicks
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.closeModal;
      if (target === 'inspector') closeInspector();
      if (target === 'catalog') closeCatalog();
    });
  });

  inspectorOverlay.addEventListener('click', (e) => {
    if (e.target === inspectorOverlay) closeInspector();
  });

  catalogOverlay.addEventListener('click', (e) => {
    if (e.target === catalogOverlay) closeCatalog();
  });

  /* ------------------------------------------------------------------------
     Keyboard Navigation (Arrows, Home, K / Cmd+K, Escape)
     ------------------------------------------------------------------------ */
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement && document.activeElement.tagName;
    const isTyping = tag === 'INPUT' || tag === 'TEXTAREA';

    if (e.key === 'Escape') {
      if (!inspectorOverlay.hidden) return closeInspector();
      if (!catalogOverlay.hidden) return closeCatalog();
      if (!palettePopover.hidden) return closeMobilePalettePopover();
      return;
    }

    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey || !isTyping)) {
      if (!inspectorOverlay.hidden) return;
      e.preventDefault();
      if (catalogOverlay.hidden) openCatalog();
      else closeCatalog();
      return;
    }

    if (isTyping || !catalogOverlay.hidden || !inspectorOverlay.hidden) return;

    const step = e.shiftKey ? 240 : 120;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      panTo(state.panX + step, state.panY, true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      panTo(state.panX - step, state.panY, true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      panTo(state.panX, state.panY + step, true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      panTo(state.panX, state.panY - step, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      panTo(0, 0, true);
    }
  });

  /* ------------------------------------------------------------------------
     Initialize
     ------------------------------------------------------------------------ */
  renderCanvas();
  buildMobilePopover();
  buildCatalogFilters();
  applyPan();
})();
