/* ==========================================================================
   handdrawn-map-kit — Tactile Sketchbook Interactions
   Vanilla JS · Works cleanly under file:// with zero build step
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Utility: Reliable Clipboard Copy (works on file:// and https://)
     ------------------------------------------------------------------------ */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        return fallbackCopy(text);
      });
    }
    return fallbackCopy(text);
  }

  function fallbackCopy(text) {
    return new Promise(function (resolve) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch (_) {
        // Ignore if blocked
      }
      document.body.removeChild(ta);
      resolve();
    });
  }

  /* Toast Notification */
  const toastEl = document.getElementById('deskToast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 1900);
  }

  function markButtonCopied(btn) {
    const label = btn.querySelector('.copy-label');
    btn.classList.add('is-copied');
    if (label) label.textContent = 'Copied';
    clearTimeout(btn._copyTimer);
    btn._copyTimer = setTimeout(function () {
      btn.classList.remove('is-copied');
      if (label) label.textContent = 'Copy';
    }, 1800);
  }

  /* ------------------------------------------------------------------------
     1. Hero Tabbed Command Card
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-command-card]').forEach(function (card) {
    const tabs = card.querySelectorAll('.tab-btn');
    const cmdText = card.querySelector('.cmd-text');
    const copyBtn = card.querySelector('[data-copy-from-card]');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        if (cmdText) cmdText.textContent = tab.dataset.cmd || '';
      });
    });

    if (copyBtn && cmdText) {
      copyBtn.addEventListener('click', function () {
        copyText(cmdText.textContent.trim()).then(function () {
          markButtonCopied(copyBtn);
          showToast('Copied command to clipboard');
        });
      });
    }
  });

  /* ------------------------------------------------------------------------
     2. Quick Start Code Blocks (YAML/JSON toggle + CLI/Agent toggle + Copy)
     ------------------------------------------------------------------------ */
  const SPEC_SNIPPETS = {
    yaml: [
      'title: "JAPAN"',
      'subtitle: "Archipelago of East Asia"',
      'region:',
      '  country: JPN',
      '  layers: [coast, rivers, peaks]',
      'ornaments:',
      '  border: zebra',
      '  compass: bottom-right',
      'typography:',
      '  font: "ZCOOL XiaoWei"',
      '  autoAvoid: true',
      'pins:',
      '  - icon: mt_fuji',
      '    at: [138.73, 35.36]',
      '    label: "Mt. Fuji · 富士山"',
      '  - icon: pagoda',
      '    at: [135.76, 35.01]',
      '    label: "Kyoto"'
    ].join('\n'),
    json: JSON.stringify(
      {
        title: 'JAPAN',
        subtitle: 'Nippon · Archipelago of East Asia',
        region: { country: 'JPN', layers: ['coast', 'rivers', 'lakes', 'peaks', 'cities'] },
        ornaments: { border: 'zebra', compass: 'bottom-right', cartouche: 'banner' },
        typography: { font: 'ZCOOL XiaoWei', autoAvoid: true },
        pins: [
          { icon: 'mt_fuji', at: [138.73, 35.36], label: 'Mt. Fuji · 富士山' },
          { icon: 'pagoda', at: [135.76, 35.01], label: 'Kyoto' },
          { icon: 'ramen', at: [141.35, 43.06], label: 'Sapporo Ramen' }
        ]
      },
      null,
      2
    )
  };

  const CLI_SNIPPETS = {
    render:
      'npx handdrawn-map-kit render japan.yaml \\\n  --out japan_cultural_map.png \\\n  --diagnostics report.json',
    agent:
      'npx handdrawn-map-kit render japan.yaml --diagnostics report.json\n# Agent inspects overlaps & nudges pins\nnpx handdrawn-map-kit verify report.json --strict'
  };

  const specCodeEl = document.getElementById('specCodeBlock');
  document.querySelectorAll('[data-spec-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const key = btn.dataset.specTab;
      btn.parentElement.querySelectorAll('.tab-btn').forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      if (specCodeEl && SPEC_SNIPPETS[key]) {
        specCodeEl.textContent = SPEC_SNIPPETS[key];
      }
    });
  });

  const cliCodeEl = document.getElementById('cliCodeBlock');
  document.querySelectorAll('[data-cli-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const key = btn.dataset.cliTab;
      btn.parentElement.querySelectorAll('.tab-btn').forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      if (cliCodeEl && CLI_SNIPPETS[key]) {
        cliCodeEl.textContent = CLI_SNIPPETS[key];
      }
    });
  });

  document.querySelectorAll('[data-copy-target]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = document.getElementById(btn.dataset.copyTarget);
      if (!target) return;
      copyText(target.textContent.trim()).then(function () {
        markButtonCopied(btn);
        showToast('Copied code snippet');
      });
    });
  });

  /* ------------------------------------------------------------------------
     3. Orbiting Bare Spatial Stickers (Draggable + Click-to-Copy Glyph ID)
     ------------------------------------------------------------------------ */
  const specimens = Array.from(document.querySelectorAll('.specimen'));

  specimens.forEach(function (el) {
    let startX = 0;
    let startY = 0;
    let origX = 0;
    let origY = 0;
    let moved = false;
    let dragging = false;

    el.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      origX = parseFloat(el.dataset.x || '0');
      origY = parseFloat(el.dataset.y || '0');
      el.classList.add('is-dragging');
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.hypot(dx, dy) > 4) moved = true;
      const nx = origX + dx;
      const ny = origY + dy;
      el.dataset.x = String(nx);
      el.dataset.y = String(ny);
      el.style.setProperty('--dx', nx + 'px');
      el.style.setProperty('--dy', ny + 'px');
    });

    function finishDrag(e) {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('is-dragging');
      try {
        el.releasePointerCapture(e.pointerId);
      } catch (_) {}
      if (!moved) {
        triggerStickerAction(el);
      }
    }

    el.addEventListener('pointerup', finishDrag);
    el.addEventListener('pointercancel', finishDrag);

    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerStickerAction(el);
      }
    });
  });

  function triggerStickerAction(el) {
    const id = el.dataset.glyph || 'glyph';
    el.classList.remove('is-popped');
    void el.offsetWidth;
    el.classList.add('is-popped');
    copyText('icon: ' + id).then(function () {
      showToast('Copied YAML glyph: icon: ' + id);
    });
  }

  function resetAllStickers() {
    specimens.forEach(function (el) {
      el.dataset.x = '0';
      el.dataset.y = '0';
      el.style.setProperty('--dx', '0px');
      el.style.setProperty('--dy', '0px');
    });
  }

  /* ------------------------------------------------------------------------
     4. Bottom Floating Dock: Recenter + Paper Wash Swatches
     ------------------------------------------------------------------------ */
  const recenterBtn = document.getElementById('recenterBtn');
  if (recenterBtn) {
    recenterBtn.addEventListener('click', function () {
      resetAllStickers();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Desk recentered');
    });
  }

  const swatchWrap = document.getElementById('swatchWrap');
  const swatchMobileTrigger = document.getElementById('swatchMobileTrigger');
  const mobileSwatchDot = document.getElementById('mobileSwatchDot');
  const swatchButtons = Array.from(document.querySelectorAll('[data-theme-choice]'));

  swatchButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const theme = btn.dataset.themeChoice;
      document.body.setAttribute('data-theme', theme);
      swatchButtons.forEach(function (b) {
        b.classList.remove('is-selected');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('is-selected');
      btn.setAttribute('aria-checked', 'true');

      if (mobileSwatchDot) {
        mobileSwatchDot.className = 'swatch-dot swatch-dot--' + theme;
      }
      if (swatchWrap) {
        swatchWrap.classList.remove('is-open');
        if (swatchMobileTrigger) swatchMobileTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  if (swatchMobileTrigger && swatchWrap) {
    swatchMobileTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = swatchWrap.classList.toggle('is-open');
      swatchMobileTrigger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!swatchWrap.contains(e.target)) {
        swatchWrap.classList.remove('is-open');
        swatchMobileTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. Map Lightbox (Click to Enlarge + Zoom Toggle + Switch Map)
     ------------------------------------------------------------------------ */
  const MAPS = [
    {
      src: './assets/japan_cultural_map.png',
      title: 'Japan · 日本人文地图',
      meta: '1500 × 1000 px · Natural Earth coastlines · 24 cultural pins · Shinkansen rail · zebra border & Ryukyu inset'
    },
    {
      src: './assets/korea_cultural_map.png',
      title: 'Korea · 韩国人文地图',
      meta: '1500 × 1000 px · Natural Earth peninsula · 19 cultural pins · KTX railway · Gyeongbokgung Palace & Jeju inset'
    }
  ];

  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const lightboxStage = document.getElementById('lightboxStage');
  const lightboxZoomBtn = document.getElementById('lightboxZoomBtn');
  const lightboxSwitchBtn = document.getElementById('lightboxSwitchBtn');
  let activeMapIndex = 0;

  function renderLightboxMap(idx) {
    activeMapIndex = (idx + MAPS.length) % MAPS.length;
    const item = MAPS[activeMapIndex];
    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
    }
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxMeta) lightboxMeta.textContent = item.meta;
    setLightboxZoom(false);
  }

  function setLightboxZoom(zoomed) {
    if (!lightboxStage || !lightboxZoomBtn) return;
    lightboxStage.classList.toggle('is-zoomed', zoomed);
    lightboxZoomBtn.classList.toggle('is-active', zoomed);
    lightboxZoomBtn.querySelector('span').textContent = zoomed ? 'Fit to screen' : 'Zoom 1.6×';
  }

  function openLightbox(src, title, meta) {
    if (!lightboxOverlay) return;
    const foundIdx = MAPS.findIndex(function (m) {
      return m.src === src;
    });
    if (foundIdx >= 0) {
      renderLightboxMap(foundIdx);
    } else {
      if (lightboxImg) {
        lightboxImg.src = src;
        lightboxImg.alt = title || 'Map preview';
      }
      if (lightboxTitle) lightboxTitle.textContent = title || 'Map preview';
      if (lightboxMeta) lightboxMeta.textContent = meta || '';
      setLightboxZoom(false);
    }
    lightboxOverlay.hidden = false;
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxOverlay || lightboxOverlay.hidden) return;
    lightboxOverlay.hidden = true;
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox-src]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      openLightbox(
        trigger.dataset.lightboxSrc,
        trigger.dataset.lightboxTitle,
        trigger.dataset.lightboxMeta
      );
    });
  });

  document.querySelectorAll('[data-close-lightbox]').forEach(function (btn) {
    btn.addEventListener('click', closeLightbox);
  });

  if (lightboxZoomBtn) {
    lightboxZoomBtn.addEventListener('click', function () {
      const zoomed = !lightboxStage.classList.contains('is-zoomed');
      setLightboxZoom(zoomed);
    });
  }

  if (lightboxImg) {
    lightboxImg.addEventListener('click', function () {
      const zoomed = !lightboxStage.classList.contains('is-zoomed');
      setLightboxZoom(zoomed);
    });
  }

  if (lightboxSwitchBtn) {
    lightboxSwitchBtn.addEventListener('click', function () {
      renderLightboxMap(activeMapIndex + 1);
    });
  }

  /* ------------------------------------------------------------------------
     6. Searchable 65-Glyph & Kit Catalog Overlay (K Shortcut)
     ------------------------------------------------------------------------ */
  const CATALOG_ITEMS = [
    { id: 'compass_rose', cat: 'Ornament', img: './art/s01.png' },
    { id: 'giant_panda', cat: 'Wildlife', img: './art/s02.png' },
    { id: 'pagoda', cat: 'Landmark', img: './art/s03.png' },
    { id: 'dumplings', cat: 'Cuisine', img: './art/s04.png' },
    { id: 'mt_fuji', cat: 'Peak', img: './art/s05.png' },
    { id: 'junk_ship', cat: 'Vessel', img: './art/s06.png' },
    { id: 'paper_lantern', cat: 'Culture', img: './art/s07.png' },
    { id: 'map_scroll', cat: 'Ornament', img: './art/s08.png' },
    { id: 'great_wall', cat: 'Landmark', glyph: '城' },
    { id: 'windmill', cat: 'Landmark', glyph: '风' },
    { id: 'shinkansen', cat: 'Transit', glyph: '铁' },
    { id: 'zebra_border', cat: 'Frame', glyph: '框' },
    { id: 'banner_cartouche', cat: 'Frame', glyph: '题' },
    { id: 'natural_earth', cat: 'Geo layer', glyph: '地' },
    { id: 'zcool_xiaowei', cat: 'CJK font', glyph: '字' },
    { id: 'agent_skill', cat: 'Diagnostics', glyph: 'AI' }
  ];

  const catalogOverlay = document.getElementById('catalogOverlay');
  const catalogGrid = document.getElementById('catalogGrid');
  const catalogSearchInput = document.getElementById('catalogSearchInput');
  const catalogCountTag = document.getElementById('catalogCountTag');

  function renderCatalog(query) {
    if (!catalogGrid) return;
    const q = (query || '').trim().toLowerCase();
    const filtered = CATALOG_ITEMS.filter(function (item) {
      return !q || item.id.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q);
    });

    catalogGrid.innerHTML = '';
    filtered.forEach(function (item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'catalog-item';
      const media = item.img
        ? '<img src="' + item.img + '" alt="' + item.id + '" />'
        : '<span class="catalog-item__badge" aria-hidden="true">' + item.glyph + '</span>';
      btn.innerHTML =
        media +
        '<span class="catalog-item__name">' + item.id + '</span>' +
        '<span class="catalog-item__cat">' + item.cat + '</span>';
      btn.addEventListener('click', function () {
        copyText('- icon: ' + item.id).then(function () {
          showToast('Copied YAML snippet: - icon: ' + item.id);
        });
      });
      catalogGrid.appendChild(btn);
    });

    if (catalogCountTag) {
      catalogCountTag.textContent = q
        ? filtered.length + ' matching'
        : '8 illustrated · 65 total';
    }
  }

  function openCatalog() {
    if (!catalogOverlay) return;
    renderCatalog(catalogSearchInput ? catalogSearchInput.value : '');
    catalogOverlay.hidden = false;
    catalogOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (catalogSearchInput) {
      setTimeout(function () {
        catalogSearchInput.focus();
      }, 40);
    }
  }

  function closeCatalog() {
    if (!catalogOverlay || catalogOverlay.hidden) return;
    catalogOverlay.hidden = true;
    catalogOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  ['openCatalogBtn', 'openCatalogInline', 'counterCornerPill'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', openCatalog);
  });

  document.querySelectorAll('[data-close-catalog]').forEach(function (btn) {
    btn.addEventListener('click', closeCatalog);
  });

  if (catalogSearchInput) {
    catalogSearchInput.addEventListener('input', function () {
      renderCatalog(catalogSearchInput.value);
    });
  }

  /* ------------------------------------------------------------------------
     7. Global Keyboard Shortcuts (K, Esc, R)
     ------------------------------------------------------------------------ */
  document.addEventListener('keydown', function (e) {
    const tag = (e.target && e.target.tagName) || '';
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;

    if (e.key === 'Escape') {
      closeLightbox();
      closeCatalog();
      return;
    }

    if (typing) return;

    if ((e.key === 'k' || e.key === 'K') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      if (catalogOverlay && catalogOverlay.hidden) {
        openCatalog();
      } else {
        closeCatalog();
      }
    } else if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      resetAllStickers();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Desk recentered');
    }
  });
})();
