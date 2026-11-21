/* ==========================================================================
   Trazo — Interactive Canvas, Live Recoloring, Inspector & Catalog Logic
   Works directly as a local file (no build step, no module/fetch dependencies)
   ========================================================================== */

(function () {
  'use strict';

  const STICKERS = window.TRAZO_STICKERS || [];
  const CATEGORIES = window.TRAZO_CATEGORIES || [];
  const PALETTES = window.TRAZO_PALETTES || [];

  const PACKAGE_COMMANDS = {
    npm: 'npm install trazo-stickers',
    pnpm: 'pnpm add trazo-stickers',
    yarn: 'yarn add trazo-stickers',
    bun: 'bun add trazo-stickers'
  };

  // Explicit hex maps for standalone clean SVG export
  const PALETTE_EXPORT_COLORS = {
    ink: { fill: '#e6e3dc', fill2: '#d6d2c9', shade: '#b9b3a8', stroke: '#1c1a18', accent: '#1c1a18', accent2: '#57524b', cheek: '#c8c3ba', eye: '#1c1a18' },
    red: { fill: '#ff8a8e', fill2: '#ffc2c4', shade: '#e5484d', stroke: '#8f1d24', accent: '#e5484d', accent2: '#ff8a8e', cheek: '#ff5c6c', eye: '#6e1419' },
    orange: { fill: '#ffaa6b', fill2: '#ffd4b0', shade: '#f76b15', stroke: '#943908', accent: '#f76b15', accent2: '#ffaa6b', cheek: '#ff7e47', eye: '#732b05' },
    yellow: { fill: '#ffe066', fill2: '#fff1b3', shade: '#e5a000', stroke: '#875800', accent: '#e5a000', accent2: '#f5c211', cheek: '#ffb84d', eye: '#694400' },
    green: { fill: '#8ce99a', fill2: '#c3fae8', shade: '#2f9e44', stroke: '#195927', accent: '#2f9e44', accent2: '#69db7c', cheek: '#51cf66', eye: '#13451e' },
    sky: { fill: '#7dd3fc', fill2: '#bae6fd', shade: '#0ea5e9', stroke: '#075985', accent: '#0ea5e9', accent2: '#38bdf8', cheek: '#38bdf8', eye: '#084366' },
    cobalt: { fill: '#93c5fd', fill2: '#c7d2fe', shade: '#2563eb', stroke: '#1e3a8a', accent: '#2563eb', accent2: '#60a5fa', cheek: '#60a5fa', eye: '#172d6e' },
    pink: { fill: '#faa2c1', fill2: '#ffd6e5', shade: '#e64980', stroke: '#8c1b46', accent: '#e64980', accent2: '#f783ac', cheek: '#f06595', eye: '#6e1336' }
  };

  // DOM References
  const viewport = document.getElementById('canvas-viewport');
  const world = document.getElementById('canvas-world');
  const stickersLayer = document.getElementById('stickers-layer');
  const recenterBtn = document.getElementById('recenter-btn');
  const desktopSwatchTray = document.getElementById('desktop-swatch-tray');
  const mobileColorTrigger = document.getElementById('mobile-color-trigger');
  const mobileColorPopover = document.getElementById('mobile-color-popover');
  const mobileActiveDot = document.getElementById('mobile-active-dot');
  const mobileActiveName = document.getElementById('mobile-active-name');
  const catalogBtn = document.getElementById('catalog-btn');

  // Install Card DOM
  const pmTabs = document.querySelectorAll('.pm-tab');
  const installCmdText = document.getElementById('install-cmd-text');
  const installCmdRow = document.getElementById('install-cmd-row');
  const copyCmdBtn = document.getElementById('copy-cmd-btn');

  // Inspector Modal DOM
  const inspectorBackdrop = document.getElementById('inspector-backdrop');
  const inspectorClose = document.getElementById('inspector-close');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorCategory = document.getElementById('inspector-category');
  const inspectorStage = document.getElementById('inspector-stage');
  const inspectorPreview = document.getElementById('inspector-preview');
  const inspectorSwatches = document.getElementById('inspector-swatches');
  const inspectorSizes = document.getElementById('inspector-sizes');
  const inspectorReactName = document.getElementById('inspector-react-name');
  const inspectorCode = document.getElementById('inspector-code');
  const copySvgBtn = document.getElementById('copy-svg-btn');
  const copyJsxBtn = document.getElementById('copy-jsx-btn');
  const downloadSvgBtn = document.getElementById('download-svg-btn');

  // Catalog Modal DOM
  const catalogBackdrop = document.getElementById('catalog-backdrop');
  const catalogClose = document.getElementById('catalog-close');
  const catalogSearch = document.getElementById('catalog-search');
  const catalogCount = document.getElementById('catalog-count');
  const catalogFilters = document.getElementById('catalog-filters');
  const catalogGrid = document.getElementById('catalog-grid');

  const toastEl = document.getElementById('toast');

  // Application State
  const state = {
    panX: 0,
    panY: 0,
    vx: 0,
    vy: 0,
    isDragging: false,
    dragMoved: false,
    pointerId: null,
    lastClientX: 0,
    lastClientY: 0,
    inertiaRaf: null,
    activePalette: 'original',
    activePm: 'npm',
    inspectedSticker: null,
    inspectorPalette: 'original',
    inspectorSize: 120,
    catalogCategory: 'all',
    catalogQuery: '',
    toastTimer: null
  };

  const PAN_BOUNDS = { minX: -1650, maxX: 1650, minY: -1250, maxY: 1250 };
  const stickerButtonMap = new Map();

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function toPascalCase(str) {
    return str
      .split(/[\s-]+/)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
  }

  function showToast(message) {
    clearTimeout(state.toastTimer);
    toastEl.textContent = message;
    toastEl.hidden = false;
    state.toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2000);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
  }

  function buildStickerInlineSvg(sticker, extraClass) {
    const c = sticker.colors;
    const styleVars = `--o-fill:${c.fill};--o-fill2:${c.fill2};--o-shade:${c.shade};--o-stroke:${c.stroke};--o-cheek:${c.cheek || '#ff8fa3'};`;
    return `<svg class="${extraClass || 'sticker-svg'}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="${styleVars}" aria-hidden="true"><g class="crayon-art">${sticker.svg.trim()}</g></svg>`;
  }

  /**
   * Generates clean, standalone, portable SVG markup with resolved hex colors
   * (no dependency on external CSS variables or page filters).
   */
  function buildCleanExportSvg(sticker, paletteId, size) {
    const pal = paletteId === 'original'
      ? {
          fill: sticker.colors.fill,
          fill2: sticker.colors.fill2,
          shade: sticker.colors.shade,
          stroke: sticker.colors.stroke,
          accent: sticker.colors.fill,
          accent2: sticker.colors.fill2,
          cheek: sticker.colors.cheek || '#ff8fa3',
          eye: sticker.colors.stroke
        }
      : PALETTE_EXPORT_COLORS[paletteId];

    const temp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    temp.innerHTML = sticker.svg.trim();

    temp.querySelectorAll('*').forEach(el => {
      const cls = el.getAttribute('class') || '';
      if (cls.includes('c-stroke-fill2')) {
        el.setAttribute('fill', pal.fill2);
        el.setAttribute('stroke', pal.stroke);
      } else if (cls.includes('c-stroke-fill')) {
        el.setAttribute('fill', pal.fill);
        el.setAttribute('stroke', pal.stroke);
      } else if (cls.includes('c-fill-2')) {
        el.setAttribute('fill', pal.fill2);
      } else if (cls.includes('c-fill')) {
        el.setAttribute('fill', pal.fill);
      } else if (cls.includes('c-shade-stroke')) {
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', pal.shade);
      } else if (cls.includes('c-shade')) {
        el.setAttribute('fill', pal.shade);
      } else if (cls.includes('c-accent2-stroke')) {
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', pal.accent2);
      } else if (cls.includes('c-accent-stroke')) {
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', pal.accent);
      } else if (cls.includes('c-hi-stroke')) {
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', '#ffffff');
      } else if (cls.includes('c-hi')) {
        el.setAttribute('fill', '#ffffff');
      } else if (cls.includes('c-cheek')) {
        el.setAttribute('fill', pal.cheek);
      } else if (cls.includes('c-eye')) {
        el.setAttribute('fill', pal.eye);
      } else if (cls.includes('c-stroke')) {
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', pal.stroke);
      }
      el.removeAttribute('class');
    });

    const inner = temp.innerHTML.replace(/\s+/g, ' ').replace(/> </g, '>\n  <').trim();
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 120 120" fill="none">\n  ${inner}\n</svg>`;
  }

  /* ------------------------------------------------------------------------
     Canvas Panning & Camera
     ------------------------------------------------------------------------ */

  function applyTransform(animate) {
    if (animate) {
      world.classList.add('is-animating');
    } else {
      world.classList.remove('is-animating');
    }
    world.style.transform = `translate3d(${state.panX}px, ${state.panY}px, 0)`;
    viewport.style.backgroundPosition = `${state.panX}px ${state.panY}px`;
  }

  function stopInertia() {
    if (state.inertiaRaf) {
      cancelAnimationFrame(state.inertiaRaf);
      state.inertiaRaf = null;
    }
  }

  function panTo(targetX, targetY, animate = true) {
    stopInertia();
    state.panX = clamp(targetX, PAN_BOUNDS.minX, PAN_BOUNDS.maxX);
    state.panY = clamp(targetY, PAN_BOUNDS.minY, PAN_BOUNDS.maxY);
    applyTransform(animate);
  }

  function runInertia() {
    state.vx *= 0.9;
    state.vy *= 0.9;
    if (Math.abs(state.vx) < 0.25 && Math.abs(state.vy) < 0.25) {
      state.inertiaRaf = null;
      return;
    }
    state.panX = clamp(state.panX + state.vx, PAN_BOUNDS.minX, PAN_BOUNDS.maxX);
    state.panY = clamp(state.panY + state.vy, PAN_BOUNDS.minY, PAN_BOUNDS.maxY);
    applyTransform(false);
    state.inertiaRaf = requestAnimationFrame(runInertia);
  }

  function isInteractiveTarget(target) {
    return Boolean(target.closest('.origin-hero, .sticker-item, .top-chrome, .bottom-dock, .modal-backdrop'));
  }

  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (isInteractiveTarget(e.target)) return;

    stopInertia();
    closeMobilePopover();
    state.isDragging = true;
    state.dragMoved = false;
    state.pointerId = e.pointerId;
    state.lastClientX = e.clientX;
    state.lastClientY = e.clientY;
    state.vx = 0;
    state.vy = 0;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!state.isDragging || e.pointerId !== state.pointerId) return;
    const dx = e.clientX - state.lastClientX;
    const dy = e.clientY - state.lastClientY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      state.dragMoved = true;
    }
    state.lastClientX = e.clientX;
    state.lastClientY = e.clientY;
    state.vx = dx;
    state.vy = dy;
    state.panX = clamp(state.panX + dx, PAN_BOUNDS.minX, PAN_BOUNDS.maxX);
    state.panY = clamp(state.panY + dy, PAN_BOUNDS.minY, PAN_BOUNDS.maxY);
    applyTransform(false);
  });

  function endDrag(e) {
    if (!state.isDragging) return;
    if (e && e.pointerId !== undefined && e.pointerId !== state.pointerId) return;
    state.isDragging = false;
    viewport.classList.remove('is-dragging');
    if (Math.abs(state.vx) > 1.2 || Math.abs(state.vy) > 1.2) {
      state.inertiaRaf = requestAnimationFrame(runInertia);
    }
  }

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  // Smooth two-dimensional wheel / trackpad panning
  viewport.addEventListener('wheel', (e) => {
    if (!inspectorBackdrop.hidden || !catalogBackdrop.hidden) return;
    e.preventDefault();
    stopInertia();
    state.panX = clamp(state.panX - e.deltaX, PAN_BOUNDS.minX, PAN_BOUNDS.maxX);
    state.panY = clamp(state.panY - e.deltaY, PAN_BOUNDS.minY, PAN_BOUNDS.maxY);
    applyTransform(false);
  }, { passive: false });

  // Recenter Button
  recenterBtn.addEventListener('click', () => {
    panTo(0, 0, true);
  });

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    const isTyping = e.target.matches('input, textarea');

    if (e.key === 'Escape') {
      if (!inspectorBackdrop.hidden) closeInspector();
      if (!catalogBackdrop.hidden) closeCatalog();
      closeMobilePopover();
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (catalogBackdrop.hidden) openCatalog();
      else closeCatalog();
      return;
    }

    if (isTyping) return;
    if (!inspectorBackdrop.hidden || !catalogBackdrop.hidden) return;

    if (e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCatalog();
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      panTo(0, 0, true);
      return;
    }

    const step = e.shiftKey ? 240 : 120;
    if (e.key === 'ArrowLeft') { e.preventDefault(); panTo(state.panX + step, state.panY, true); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); panTo(state.panX - step, state.panY, true); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); panTo(state.panX, state.panY + step, true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); panTo(state.panX, state.panY - step, true); }
  });

  /* ------------------------------------------------------------------------
     Render All 71 Stickers onto the Paper Stage
     ------------------------------------------------------------------------ */

  function renderStickers() {
    const frag = document.createDocumentFragment();

    STICKERS.forEach((sticker) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sticker-item';
      btn.dataset.id = sticker.id;
      btn.setAttribute('aria-label', `${sticker.name} (${sticker.categoryLabel}). Click to customize and copy SVG.`);
      btn.style.setProperty('--x', `${sticker.x}px`);
      btn.style.setProperty('--y', `${sticker.y}px`);
      btn.style.setProperty('--rot', `${sticker.rot}deg`);
      btn.style.setProperty('--size', `${sticker.size}px`);

      btn.innerHTML = `${buildStickerInlineSvg(sticker)}<span class="sticker-caption" aria-hidden="true">${sticker.name}</span>`;

      btn.addEventListener('click', () => {
        openInspector(sticker);
      });

      // Auto-pan smoothly if user Tabs to an off-screen sticker
      btn.addEventListener('focus', () => {
        const halfW = window.innerWidth / 2 - 90;
        const halfH = window.innerHeight / 2 - 110;
        const screenX = sticker.x + state.panX;
        const screenY = sticker.y + state.panY;
        if (Math.abs(screenX) > halfW || Math.abs(screenY) > halfH) {
          panTo(-sticker.x, -sticker.y, true);
        }
      });

      stickerButtonMap.set(sticker.id, btn);
      frag.appendChild(btn);
    });

    stickersLayer.appendChild(frag);
  }

  /* ------------------------------------------------------------------------
     Package Manager Install Card
     ------------------------------------------------------------------------ */

  function setPackageManager(pm) {
    state.activePm = pm;
    installCmdText.textContent = PACKAGE_COMMANDS[pm];
    pmTabs.forEach((tab) => {
      const active = tab.dataset.pm === pm;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  }

  pmTabs.forEach((tab) => {
    tab.addEventListener('click', () => setPackageManager(tab.dataset.pm));
  });

  function copyInstallCommand() {
    const cmd = PACKAGE_COMMANDS[state.activePm];
    copyToClipboard(cmd).then(() => {
      copyCmdBtn.classList.add('is-copied');
      showToast(`Copied "${cmd}"`);
      setTimeout(() => copyCmdBtn.classList.remove('is-copied'), 1600);
    });
  }

  copyCmdBtn.addEventListener('click', copyInstallCommand);
  installCmdRow.addEventListener('click', copyInstallCommand);

  /* ------------------------------------------------------------------------
     Global Live Color Palette Swatches (Desktop Strip + Mobile Popover)
     ------------------------------------------------------------------------ */

  function createSwatchButton(palette, isSelected, onSelect, showTooltip) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch-btn';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', String(isSelected));
    btn.setAttribute('aria-label', `${palette.name} color`);
    btn.dataset.color = palette.id;
    btn.innerHTML = `<span class="swatch-dot" data-color="${palette.id}"></span>${showTooltip ? `<span class="swatch-tooltip" role="tooltip">${palette.name}</span>` : ''}`;
    btn.addEventListener('click', () => onSelect(palette.id));
    return btn;
  }

  function setGlobalPalette(paletteId) {
    state.activePalette = paletteId;
    world.dataset.palette = paletteId;
    catalogGrid.dataset.palette = paletteId;

    const palObj = PALETTES.find(p => p.id === paletteId) || PALETTES[0];
    mobileActiveDot.dataset.color = palObj.id;
    mobileActiveName.textContent = palObj.name;

    desktopSwatchTray.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.setAttribute('aria-checked', String(btn.dataset.color === paletteId));
    });
    mobileColorPopover.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.setAttribute('aria-checked', String(btn.dataset.color === paletteId));
    });
  }

  function initPaletteDock() {
    PALETTES.forEach((p) => {
      desktopSwatchTray.appendChild(createSwatchButton(p, p.id === state.activePalette, setGlobalPalette, true));
      mobileColorPopover.appendChild(createSwatchButton(p, p.id === state.activePalette, (id) => {
        setGlobalPalette(id);
        closeMobilePopover();
      }, false));
    });
  }

  function closeMobilePopover() {
    mobileColorPopover.hidden = true;
    mobileColorTrigger.setAttribute('aria-expanded', 'false');
  }

  mobileColorTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const opening = mobileColorPopover.hidden;
    mobileColorPopover.hidden = !opening;
    mobileColorTrigger.setAttribute('aria-expanded', String(opening));
  });

  document.addEventListener('click', (e) => {
    if (!mobileColorPopover.hidden && !e.target.closest('.palette-wrap')) {
      closeMobilePopover();
    }
  });

  /* ------------------------------------------------------------------------
     Sticker Inspector & Export Modal
     ------------------------------------------------------------------------ */

  function updateInspectorOutput() {
    const sticker = state.inspectedSticker;
    if (!sticker) return;
    inspectorStage.dataset.palette = state.inspectorPalette;
    inspectorSwatches.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.setAttribute('aria-checked', String(btn.dataset.color === state.inspectorPalette));
    });
    inspectorSizes.querySelectorAll('.size-pill').forEach(btn => {
      btn.classList.toggle('is-active', Number(btn.dataset.size) === state.inspectorSize);
    });
    const cleanSvg = buildCleanExportSvg(sticker, state.inspectorPalette, state.inspectorSize);
    inspectorCode.textContent = cleanSvg;
  }

  function openInspector(sticker) {
    state.inspectedSticker = sticker;
    state.inspectorPalette = state.activePalette;
    state.inspectorSize = 120;

    inspectorTitle.textContent = sticker.name;
    inspectorCategory.textContent = sticker.categoryLabel;
    inspectorReactName.textContent = `<${toPascalCase(sticker.id)} />`;
    inspectorPreview.innerHTML = buildStickerInlineSvg(sticker, 'inspector-svg');

    // Render swatches once
    if (!inspectorSwatches.children.length) {
      PALETTES.forEach((p) => {
        inspectorSwatches.appendChild(createSwatchButton(p, p.id === state.inspectorPalette, (id) => {
          state.inspectorPalette = id;
          updateInspectorOutput();
        }, false));
      });
    }

    updateInspectorOutput();
    inspectorBackdrop.hidden = false;
    inspectorClose.focus();
  }

  function closeInspector() {
    inspectorBackdrop.hidden = true;
    state.inspectedSticker = null;
  }

  inspectorClose.addEventListener('click', closeInspector);
  inspectorBackdrop.addEventListener('click', (e) => {
    if (e.target === inspectorBackdrop) closeInspector();
  });

  inspectorSizes.addEventListener('click', (e) => {
    const pill = e.target.closest('.size-pill');
    if (!pill) return;
    state.inspectorSize = Number(pill.dataset.size);
    updateInspectorOutput();
  });

  copySvgBtn.addEventListener('click', () => {
    if (!state.inspectedSticker) return;
    const svg = buildCleanExportSvg(state.inspectedSticker, state.inspectorPalette, state.inspectorSize);
    copyToClipboard(svg).then(() => showToast(`Copied ${state.inspectedSticker.name} SVG`));
  });

  copyJsxBtn.addEventListener('click', () => {
    if (!state.inspectedSticker) return;
    const compName = toPascalCase(state.inspectedSticker.id);
    const colorProp = state.inspectorPalette !== 'original' ? ` color="${state.inspectorPalette}"` : '';
    const sizeProp = state.inspectorSize !== 120 ? ` size={${state.inspectorSize}}` : '';
    const snippet = `import { ${compName} } from 'trazo-stickers';\n\n<${compName}${sizeProp}${colorProp} />`;
    copyToClipboard(snippet).then(() => showToast(`Copied <${compName} /> JSX`));
  });

  downloadSvgBtn.addEventListener('click', () => {
    if (!state.inspectedSticker) return;
    const svg = buildCleanExportSvg(state.inspectedSticker, state.inspectorPalette, state.inspectorSize);
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trazo-${state.inspectedSticker.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
    showToast(`Downloaded trazo-${state.inspectedSticker.id}.svg`);
  });

  /* ------------------------------------------------------------------------
     Searchable Full-Catalog Overlay
     ------------------------------------------------------------------------ */

  function renderCatalogFilters() {
    catalogFilters.innerHTML = '';
    CATEGORIES.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-pill${cat.id === state.catalogCategory ? ' is-active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(cat.id === state.catalogCategory));
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
    const filtered = STICKERS.filter((s) => {
      const matchesCat = state.catalogCategory === 'all' || s.category === state.catalogCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q))
      );
    });

    catalogCount.textContent = String(filtered.length);
    catalogGrid.innerHTML = '';

    if (!filtered.length) {
      catalogGrid.innerHTML = `<div class="catalog-empty">No stickers matched "${q}" — try "cat", "star", or "fish"</div>`;
      return;
    }

    const frag = document.createDocumentFragment();
    filtered.forEach((sticker) => {
      const tile = document.createElement('div');
      tile.className = 'catalog-tile';
      tile.tabIndex = 0;
      tile.setAttribute('role', 'button');
      tile.setAttribute('aria-label', `Jump to ${sticker.name} on canvas`);

      tile.innerHTML = `
        <div class="catalog-tile-art">${buildStickerInlineSvg(sticker, 'catalog-svg')}</div>
        <span class="catalog-tile-name">${sticker.name}</span>
        <button type="button" class="catalog-quick-copy" title="Copy clean SVG" aria-label="Copy ${sticker.name} SVG">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/>
            <path d="M3.5 10.5H3a1.5 1.5 0 01-1.5-1.5V3A1.5 1.5 0 013 1.5h6A1.5 1.5 0 0110.5 3v.5"/>
          </svg>
        </button>
      `;

      const quickCopy = tile.querySelector('.catalog-quick-copy');
      quickCopy.addEventListener('click', (e) => {
        e.stopPropagation();
        const svg = buildCleanExportSvg(sticker, state.activePalette, 120);
        copyToClipboard(svg).then(() => showToast(`Copied ${sticker.name} SVG`));
      });

      function jumpToSticker() {
        closeCatalog();
        panTo(-sticker.x, -sticker.y, true);
        const targetBtn = stickerButtonMap.get(sticker.id);
        if (targetBtn) {
          targetBtn.classList.remove('is-pulsing');
          void targetBtn.offsetWidth;
          targetBtn.classList.add('is-pulsing');
          setTimeout(() => targetBtn.classList.remove('is-pulsing'), 1200);
        }
      }

      tile.addEventListener('click', jumpToSticker);
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          jumpToSticker();
        }
      });

      frag.appendChild(tile);
    });

    catalogGrid.appendChild(frag);
  }

  function openCatalog() {
    closeMobilePopover();
    catalogGrid.dataset.palette = state.activePalette;
    renderCatalogFilters();
    renderCatalogGrid();
    catalogBackdrop.hidden = false;
    catalogSearch.focus();
  }

  function closeCatalog() {
    catalogBackdrop.hidden = true;
  }

  catalogBtn.addEventListener('click', openCatalog);
  catalogClose.addEventListener('click', closeCatalog);
  catalogBackdrop.addEventListener('click', (e) => {
    if (e.target === catalogBackdrop) closeCatalog();
  });

  catalogSearch.addEventListener('input', (e) => {
    state.catalogQuery = e.target.value;
    renderCatalogGrid();
  });

  /* ------------------------------------------------------------------------
     Initialize
     ------------------------------------------------------------------------ */

  renderStickers();
  initPaletteDock();
  applyTransform(false);
})();
