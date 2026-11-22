(() => {
  'use strict';

  /* ========================================================================
     Data: YAML Specs, CLI/Diagnostics, Lightbox Maps, 65-Stamp Manifest
     ======================================================================== */

  const SPECS = {
    japan: {
      yaml: `map:
  title: "JAPAN"
  subtitle: "Nippon · East Asia"
  region: "JPN"
  size: [1500, 1000]
style:
  medium: [pencil, ink, watercolor]
  border: zebra-vintage
  compass: bottom-right
  font: ZCOOL XiaoWei
layers:
  natural_earth: [borders, rivers, peaks]
stamps:
  - { id: mt_fuji, at: [138.7, 35.4] }
  - { id: torii_gate, at: [132.3, 34.3] }
  - { id: ramen_bowl, at: [141.3, 43.1] }
layout:
  avoid_collisions: true`,
      cli: `npx handdrawn-map-kit render japan.yaml \\
  --out japan_cultural_map.png \\
  --diagnostics report.json

# → 1500×1000 PNG · 0 overlaps`,
      diag: `{
  "spec": "japan.yaml",
  "size": [1500, 1000],
  "placedStamps": 28,
  "placedLabels": 41,
  "overlaps": 0,
  "warnings": []
}`,
      img: 'assets/japan_cultural_map.png',
      file: 'japan_cultural_map.png',
      lightboxKey: 'japan'
    },
    korea: {
      yaml: `map:
  title: "KOREA"
  subtitle: "Daehan Minguk"
  region: "KOR"
  size: [1500, 1000]
style:
  medium: [pencil, ink, watercolor]
  border: zebra-vintage
  compass: top-right
  font: ZCOOL XiaoWei
layers:
  natural_earth: [borders, rivers, peaks]
stamps:
  - { id: gyeongbokgung, at: [127.0, 37.6] }
  - { id: turtle_ship, at: [127.7, 34.7] }
  - { id: bibimbap, at: [127.1, 35.8] }
layout:
  avoid_collisions: true`,
      cli: `npx handdrawn-map-kit render korea.yaml \\
  --out korea_cultural_map.png \\
  --diagnostics report.json

# → 1500×1000 PNG · 0 overlaps`,
      diag: `{
  "spec": "korea.yaml",
  "size": [1500, 1000],
  "placedStamps": 19,
  "placedLabels": 33,
  "overlaps": 0,
  "warnings": []
}`,
      img: 'assets/korea_cultural_map.png',
      file: 'korea_cultural_map.png',
      lightboxKey: 'korea'
    }
  };

  const MAPS = {
    japan: {
      title: 'Japan Cultural Map · 日本人文地图',
      sub: 'japan.yaml · 1500×1000 · 28 illustrated stamps',
      src: 'assets/japan_cultural_map.png',
      alt: 'Hand-drawn cultural map of Japan',
      otherKey: 'korea',
      otherLabel: 'Switch to Korea'
    },
    korea: {
      title: 'Korea Cultural Map · 韩国人文地图',
      sub: 'korea.yaml · 1500×1000 · 19 illustrated stamps',
      src: 'assets/korea_cultural_map.png',
      alt: 'Hand-drawn cultural map of Korea',
      otherKey: 'japan',
      otherLabel: 'Switch to Japan'
    }
  };

  const FEATURED_ART = [
    { id: 'compass_rose', name: 'Compass Rose', cat: 'maritime', img: 'art/s01.png', coords: '[143.2, 31.4]' },
    { id: 'giant_panda', name: 'Giant Panda', cat: 'wildlife', img: 'art/s02.png', coords: '[104.06, 30.67]' },
    { id: 'pagoda_tier', name: 'Red Pagoda', cat: 'landmarks', img: 'art/s03.png', coords: '[135.76, 35.01]' },
    { id: 'steamed_bao', name: 'Steamed Dumplings', cat: 'cuisine', img: 'art/s04.png', coords: '[121.47, 31.23]' },
    { id: 'mt_fuji', name: 'Snowy Peak', cat: 'landmarks', img: 'art/s05.png', coords: '[138.73, 35.36]' },
    { id: 'junk_ship', name: 'Wooden Sailing Ship', cat: 'maritime', img: 'art/s06.png', coords: '[133.4, 38.2]' },
    { id: 'red_lantern', name: 'Festive Lantern', cat: 'landmarks', img: 'art/s07.png', coords: '[116.40, 39.90]' },
    { id: 'atlas_scroll', name: 'Map Scroll', cat: 'maritime', img: 'art/s08.png', coords: '[126.97, 37.56]' }
  ];

  /* Complete 65-stamp catalog (8 featured + 57 additional manifest entries) */
  const EXTRA_STAMPS = [
    ['great_wall', 'Great Wall', 'landmarks', 'China'],
    ['torii_gate', 'Miyajima Torii', 'landmarks', 'Japan'],
    ['gyeongbokgung', 'Gyeongbokgung', 'landmarks', 'Korea'],
    ['windmill', 'Dutch Windmill', 'landmarks', 'Europe'],
    ['eiffel_tower', 'Eiffel Tower', 'landmarks', 'Europe'],
    ['tokyo_tower', 'Tokyo Tower', 'landmarks', 'Japan'],
    ['n_seoul_tower', 'N Seoul Tower', 'landmarks', 'Korea'],
    ['himeji_castle', 'Himeji Castle', 'landmarks', 'Japan'],
    ['colosseum', 'Colosseum', 'landmarks', 'Europe'],
    ['lighthouse', 'Coastal Lighthouse', 'maritime', 'Global'],
    ['shinkansen', 'Shinkansen Train', 'maritime', 'Japan'],
    ['ktx_train', 'KTX Express', 'maritime', 'Korea'],
    ['turtle_ship', 'Yeosu Turtle Ship', 'maritime', 'Korea'],
    ['kitamaebune', 'Kitamaebune Boat', 'maritime', 'Japan'],
    ['gondola', 'Venetian Gondola', 'maritime', 'Europe'],
    ['hot_air_balloon', 'Hot Air Balloon', 'maritime', 'Global'],
    ['steam_locomotive', 'Steam Train', 'maritime', 'Global'],
    ['zebra_frame', 'Zebra Map Border', 'maritime', 'Ornament'],
    ['ribbon_banner', 'Title Cartouche', 'maritime', 'Ornament'],
    ['wave_crest', 'Ocean Wave Crest', 'maritime', 'Ornament'],
    ['shiba_inu', 'Shiba Inu', 'wildlife', 'Japan'],
    ['red_crowned_crane', 'Red-Crowned Crane', 'wildlife', 'Japan'],
    ['nara_deer', 'Nara Deer', 'wildlife', 'Japan'],
    ['pacific_whale', 'Pacific Whale', 'wildlife', 'Ocean'],
    ['nishikigoi', 'Nishikigoi Carp', 'wildlife', 'Japan'],
    ['korean_tiger', 'Folk Tiger', 'wildlife', 'Korea'],
    ['snow_crab', 'Yeongdeok Crab', 'wildlife', 'Korea'],
    ['yak', 'Highland Yak', 'wildlife', 'Tibet'],
    ['camel_caravan', 'Silk Road Camel', 'wildlife', 'Asia'],
    ['polar_bear', 'Arctic Bear', 'wildlife', 'North'],
    ['kangaroo', 'Outback Kangaroo', 'wildlife', 'Oceania'],
    ['puffin', 'Atlantic Puffin', 'wildlife', 'North'],
    ['ramen_bowl', 'Sapporo Ramen', 'cuisine', 'Japan'],
    ['edo_sushi', 'Edo Nigiri', 'cuisine', 'Japan'],
    ['hanami_dango', 'Kyoto Dango', 'cuisine', 'Japan'],
    ['shizuoka_tea', 'Matcha Bowl', 'cuisine', 'Japan'],
    ['jeonju_bibimbap', 'Jeonju Bibimbap', 'cuisine', 'Korea'],
    ['kimchi_onggi', 'Kimchi Jars', 'cuisine', 'Korea'],
    ['jeju_tangerines', 'Jeju Tangerines', 'cuisine', 'Korea'],
    ['gimbap_roll', 'Gimbap Slices', 'cuisine', 'Korea'],
    ['hotpot_cauldron', 'Sichuan Hotpot', 'cuisine', 'China'],
    ['mooncake', 'Mid-Autumn Mooncake', 'cuisine', 'China'],
    ['croissant', 'Parisian Croissant', 'cuisine', 'Europe'],
    ['gelato_cone', 'Italian Gelato', 'cuisine', 'Europe'],
    ['boseong_tea', 'Tea Terraces', 'cuisine', 'Korea'],
    ['cherry_blossom', 'Sakura Branch', 'landmarks', 'Japan'],
    ['mugunghwa', 'Mugunghwa Bloom', 'landmarks', 'Korea'],
    ['bamboo_grove', 'Bamboo Grove', 'landmarks', 'Asia'],
    ['pine_forest', 'Alpine Pines', 'landmarks', 'Global'],
    ['dol_hareubang', 'Dol Hareubang', 'landmarks', 'Korea'],
    ['andong_mask', 'Andong Mask', 'landmarks', 'Korea'],
    ['daruma_doll', 'Daruma Doll', 'landmarks', 'Japan'],
    ['koinobori', 'Koinobori Streamers', 'landmarks', 'Japan'],
    ['onsen_steam', 'Hot Spring Onsen', 'landmarks', 'Japan'],
    ['sumo_ring', 'Sumo Wrestlers', 'landmarks', 'Japan'],
    ['origami_crane', 'Peace Origami', 'landmarks', 'Japan'],
    ['terracotta_warrior', 'Terracotta Warrior', 'landmarks', 'China']
  ].map(([id, name, cat, region]) => ({ id, name, cat, region }));

  /* ========================================================================
     Clipboard Utility (works on https AND file://)
     ======================================================================== */

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // Fall through to execCommand fallback for local file://
      }
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (_) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  let toastTimer = null;
  const toastEl = document.getElementById('ink-toast');
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2000);
  }

  /* ========================================================================
     Copy Buttons (Hero command + YAML spec + CLI/diagnostics)
     ======================================================================== */

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetSel = btn.getAttribute('data-copy-target');
      const target = targetSel ? document.querySelector(targetSel) : null;
      if (!target) return;

      await copyText(target.textContent.trim());
      btn.classList.add('is-copied');
      const label = btn.querySelector('.copy-label');
      if (label) label.textContent = 'Copied';

      clearTimeout(btn._copyTimer);
      btn._copyTimer = setTimeout(() => {
        btn.classList.remove('is-copied');
        if (label) label.textContent = 'Copy';
      }, 1800);
    });
  });

  /* ========================================================================
     Hero Tabbed Command Card
     ======================================================================== */

  const heroCmdCard = document.querySelector('[data-command-tabs]');
  const heroCmdText = document.getElementById('hero-cmd-text');
  if (heroCmdCard && heroCmdText) {
    const tabs = heroCmdCard.querySelectorAll('.seg-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        heroCmdText.textContent = tab.dataset.cmd;
      });
    });
  }

  /* ========================================================================
     Quick Start YAML & CLI Switchers (Synced with Step 3 Preview)
     ======================================================================== */

  let activeSpecKey = 'japan';
  let activeCliMode = 'render';

  const yamlCodeEl = document.getElementById('yaml-spec-code');
  const cliCodeEl = document.getElementById('cli-step-code');
  const outImgEl = document.getElementById('workflow-output-img');
  const outBtnEl = document.getElementById('workflow-output-btn');
  const outFileChip = document.getElementById('output-file-chip');

  function syncWorkflowUI() {
    const spec = SPECS[activeSpecKey];
    if (!spec) return;
    if (yamlCodeEl) yamlCodeEl.textContent = spec.yaml;
    if (cliCodeEl) cliCodeEl.textContent = activeCliMode === 'render' ? spec.cli : spec.diag;
    if (outImgEl) outImgEl.src = spec.img;
    if (outBtnEl) outBtnEl.setAttribute('data-lightbox', spec.lightboxKey);
    if (outFileChip) outFileChip.textContent = spec.file;
  }

  const specSwitcher = document.querySelector('[data-spec-switcher]');
  if (specSwitcher) {
    const tabs = specSwitcher.querySelectorAll('.seg-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        activeSpecKey = tab.dataset.spec;
        syncWorkflowUI();
      });
    });
  }

  const cliSwitcher = document.querySelector('[data-cli-switcher]');
  if (cliSwitcher) {
    const tabs = cliSwitcher.querySelectorAll('.seg-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        activeCliMode = tab.dataset.cli;
        syncWorkflowUI();
      });
    });
  }

  /* ========================================================================
     Draggable + Click-to-Copy Bare Sticker Specimens
     ======================================================================== */

  const specimens = Array.from(document.querySelectorAll('.specimen'));

  function copyStampSnippet(stampId) {
    const art = FEATURED_ART.find((a) => a.id === stampId);
    const coords = art ? art.coords : '[138.73, 35.36]';
    const snippet = `- { id: ${stampId}, at: ${coords} }`;
    copyText(snippet);
    showToast(`Copied YAML: ${snippet}`);
  }

  specimens.forEach((el) => {
    let startX = 0;
    let startY = 0;
    let baseDx = 0;
    let baseDy = 0;
    let moved = false;
    let activePointer = null;

    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      activePointer = e.pointerId;
      el.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      baseDx = parseFloat(el.style.getPropertyValue('--dx')) || 0;
      baseDy = parseFloat(el.style.getPropertyValue('--dy')) || 0;
      moved = false;
      el.classList.add('is-dragging');
    });

    el.addEventListener('pointermove', (e) => {
      if (activePointer !== e.pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.hypot(dx, dy) > 4) moved = true;
      el.style.setProperty('--dx', `${baseDx + dx}px`);
      el.style.setProperty('--dy', `${baseDy + dy}px`);
    });

    const endDrag = (e) => {
      if (activePointer !== e.pointerId) return;
      activePointer = null;
      el.classList.remove('is-dragging');
      if (!moved) {
        copyStampSnippet(el.dataset.stamp || 'compass_rose');
      }
    };

    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyStampSnippet(el.dataset.stamp || 'compass_rose');
      }
    });
  });

  /* Recenter: scroll to origin & spring all dragged stickers back home */
  document.querySelectorAll('[data-recenter]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      specimens.forEach((el) => {
        el.style.setProperty('--dx', '0px');
        el.style.setProperty('--dy', '0px');
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ========================================================================
     Bottom Dock Appearance Swatches
     ======================================================================== */

  const swatchButtons = document.querySelectorAll('.swatch-btn');
  const swatchTray = document.getElementById('swatch-tray');
  const swatchMobileBtn = document.getElementById('swatch-mobile-btn');
  const mobileSwatchPreview = document.getElementById('mobile-swatch-preview');

  swatchButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.themeSet || 'multi';
      document.documentElement.setAttribute('data-theme', theme);
      swatchButtons.forEach((b) => {
        const selected = b === btn;
        b.classList.toggle('is-selected', selected);
        b.setAttribute('aria-checked', selected ? 'true' : 'false');
      });
      if (mobileSwatchPreview) {
        mobileSwatchPreview.className = `swatch-dot swatch-${theme}`;
      }
      if (swatchTray) swatchTray.classList.remove('is-open');
      if (swatchMobileBtn) swatchMobileBtn.setAttribute('aria-expanded', 'false');
    });
  });

  if (swatchMobileBtn && swatchTray) {
    swatchMobileBtn.addEventListener('click', () => {
      const open = swatchTray.classList.toggle('is-open');
      swatchMobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ========================================================================
     Map Inspection Lightbox
     ======================================================================== */

  const lightbox = document.getElementById('map-lightbox');
  const lbTitle = document.getElementById('lightbox-title');
  const lbSub = document.getElementById('lightbox-sub');
  const lbImg = document.getElementById('lightbox-img');
  const lbCanvas = document.getElementById('lightbox-canvas');
  const lbSwitchBtn = document.getElementById('lb-switch-btn');
  const lbZoomBtn = document.getElementById('lb-zoom-btn');

  let currentMapKey = 'japan';

  function renderLightbox(key) {
    const data = MAPS[key] || MAPS.japan;
    currentMapKey = key;
    if (lbTitle) lbTitle.textContent = data.title;
    if (lbSub) lbSub.textContent = data.sub;
    if (lbImg) {
      lbImg.src = data.src;
      lbImg.alt = data.alt;
    }
    if (lbSwitchBtn) lbSwitchBtn.textContent = data.otherLabel;
    if (lbCanvas) lbCanvas.classList.remove('is-zoomed');
    if (lbZoomBtn) lbZoomBtn.textContent = 'Zoom 150%';
  }

  function openLightbox(key) {
    if (!lightbox) return;
    renderLightbox(key);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeOverlays() {
    if (lightbox) lightbox.hidden = true;
    if (catalogOverlay) catalogOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openLightbox(trigger.getAttribute('data-lightbox') || 'japan');
    });
  });

  if (lbSwitchBtn) {
    lbSwitchBtn.addEventListener('click', () => {
      renderLightbox(MAPS[currentMapKey].otherKey);
    });
  }

  if (lbZoomBtn && lbCanvas) {
    lbZoomBtn.addEventListener('click', () => {
      const zoomed = lbCanvas.classList.toggle('is-zoomed');
      lbZoomBtn.textContent = zoomed ? 'Fit view' : 'Zoom 150%';
    });
  }

  /* ========================================================================
     Searchable 65-Stamp Catalog Overlay (Shortcut: K)
     ======================================================================== */

  const catalogOverlay = document.getElementById('catalog-overlay');
  const catalogSearch = document.getElementById('catalog-search');
  const catalogCount = document.getElementById('catalog-count');
  const catalogFeaturedGrid = document.getElementById('catalog-featured-grid');
  const catalogManifest = document.getElementById('catalog-manifest');
  const catalogFilters = document.getElementById('catalog-filters');

  let activeCat = 'all';

  function renderCatalog() {
    const q = (catalogSearch ? catalogSearch.value : '').trim().toLowerCase();

    const filteredArt = FEATURED_ART.filter((item) => {
      const catMatch = activeCat === 'all' || activeCat === 'featured' || item.cat === activeCat;
      const qMatch = !q || item.id.includes(q) || item.name.toLowerCase().includes(q) || item.cat.includes(q);
      return catMatch && qMatch;
    });

    const filteredExtra = activeCat === 'featured'
      ? []
      : EXTRA_STAMPS.filter((item) => {
          const catMatch = activeCat === 'all' || item.cat === activeCat;
          const qMatch = !q || item.id.includes(q) || item.name.toLowerCase().includes(q) || item.region.toLowerCase().includes(q);
          return catMatch && qMatch;
        });

    if (catalogCount) {
      catalogCount.textContent = `${filteredArt.length + filteredExtra.length} / 65`;
    }

    if (catalogFeaturedGrid) {
      catalogFeaturedGrid.innerHTML = '';
      catalogFeaturedGrid.style.display = filteredArt.length ? 'grid' : 'none';
      filteredArt.forEach((item) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'catalog-art-item';
        btn.innerHTML = `
          <img src="${item.img}" alt="${item.name}">
          <span class="catalog-art-id">${item.id}</span>
          <span class="catalog-art-name">${item.name}</span>
        `;
        btn.addEventListener('click', () => copyStampSnippet(item.id));
        catalogFeaturedGrid.appendChild(btn);
      });
    }

    if (catalogManifest) {
      catalogManifest.innerHTML = '';
      filteredExtra.forEach((item) => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'manifest-pill';
        pill.innerHTML = `<span>${item.id}</span><span class="manifest-region">${item.region}</span>`;
        pill.addEventListener('click', () => {
          const snippet = `- { id: ${item.id}, label: "${item.name}" }`;
          copyText(snippet);
          showToast(`Copied YAML: ${snippet}`);
        });
        catalogManifest.appendChild(pill);
      });
    }
  }

  function openCatalog() {
    if (!catalogOverlay) return;
    renderCatalog();
    catalogOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    if (catalogSearch) setTimeout(() => catalogSearch.focus(), 40);
  }

  document.querySelectorAll('[data-open-catalog]').forEach((btn) => {
    btn.addEventListener('click', openCatalog);
  });

  if (catalogSearch) {
    catalogSearch.addEventListener('input', renderCatalog);
  }

  if (catalogFilters) {
    catalogFilters.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        catalogFilters.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        activeCat = chip.dataset.cat || 'all';
        renderCatalog();
      });
    });
  }

  document.querySelectorAll('[data-close-overlay]').forEach((btn) => {
    btn.addEventListener('click', closeOverlays);
  });

  [lightbox, catalogOverlay].forEach((overlay) => {
    if (!overlay) return;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOverlays();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOverlays();
      return;
    }
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if ((e.key === 'k' || e.key === 'K') && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      if (catalogOverlay && !catalogOverlay.hidden) {
        closeOverlays();
      } else {
        openCatalog();
      }
    }
  });

  renderCatalog();
})();
