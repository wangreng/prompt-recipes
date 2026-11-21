/* ==========================================================================
   handdrawn-map-kit — Lightweight Vanilla JS Interactions
   Works directly over file:// without any build step or server.
   ========================================================================== */

(() => {
  'use strict';

  const MAPS = {
    japan: {
      title: 'Japan · 日本人文地图',
      sub: '1500×1000 px · japan.yaml · Natural Earth + 24 sprites',
      src: 'assets/japan_cultural_map.png',
      alt: 'Hand-drawn cultural map of Japan with Mt. Fuji, Shinkansen routes, Ryukyu inset, zebra border, and illustrated landmarks',
      nextKey: 'korea',
      nextLabel: 'View Korea →',
    },
    korea: {
      title: 'Korea · 韩国人文地图',
      sub: '1500×1000 px · korea.yaml · Natural Earth + KTX routes',
      src: 'assets/korea_cultural_map.png',
      alt: 'Hand-drawn cultural map of Korea with Seoul, Gyeongbokgung Palace, KTX lines, Yeosu turtle ship, and Jeju Island',
      nextKey: 'japan',
      nextLabel: 'View Japan →',
    },
  };

  const CATALOG_SPRITES = [
    { group: 'Landmarks & monuments', name: 'Mt. Fuji', id: 'mt-fuji', coords: [138.73, 35.36] },
    { group: 'Landmarks & monuments', name: 'Great Wall', id: 'great-wall', coords: [116.57, 40.43] },
    { group: 'Landmarks & monuments', name: 'Gyeongbokgung Palace', id: 'gyeongbokgung', coords: [126.98, 37.58] },
    { group: 'Landmarks & monuments', name: 'Miyajima Torii', id: 'torii-gate', coords: [132.32, 34.30] },
    { group: 'Landmarks & monuments', name: 'Dutch Windmill', id: 'windmill', coords: [4.82, 52.47] },
    { group: 'Landmarks & monuments', name: 'Dol Hareubang', id: 'dol-hareubang', coords: [126.53, 33.49] },
    { group: 'Food & culture', name: 'Steamed Dumplings', id: 'dumplings', coords: [116.40, 39.90] },
    { group: 'Food & culture', name: 'Sapporo Ramen', id: 'ramen-bowl', coords: [141.35, 43.06] },
    { group: 'Food & culture', name: 'Jeonju Bibimbap', id: 'bibimbap', coords: [127.15, 35.82] },
    { group: 'Food & culture', name: 'Kimchi Jars (Onggi)', id: 'kimchi-jars', coords: [126.90, 35.15] },
    { group: 'Food & culture', name: 'Edo Sushi', id: 'edo-sushi', coords: [139.77, 35.67] },
    { group: 'Food & culture', name: 'Shizuoka Tea', id: 'green-tea', coords: [138.38, 34.98] },
    { group: 'Nature & animals', name: 'Giant Panda', id: 'panda', coords: [104.07, 30.67] },
    { group: 'Nature & animals', name: 'Shiba Inu', id: 'shiba-inu', coords: [139.69, 35.68] },
    { group: 'Nature & animals', name: 'Red-crowned Crane', id: 'crane', coords: [144.38, 42.98] },
    { group: 'Nature & animals', name: 'Pacific Whale', id: 'whale', coords: [145.20, 39.80] },
    { group: 'Ships & rails', name: 'Yeosu Turtle Ship', id: 'turtle-ship', coords: [127.66, 34.76] },
    { group: 'Ships & rails', name: 'Shinkansen / KTX', id: 'bullet-train', coords: [137.50, 34.95] },
  ];

  // Safe clipboard helper that works on file:// as well as https://
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // fall through to textarea fallback
      }
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.left = '-9999px';
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

  function flashCopied(btn) {
    const label = btn.querySelector('.copy-btn__label');
    btn.classList.add('is-copied');
    if (label) label.textContent = 'Copied';
    clearTimeout(btn._copyTimer);
    btn._copyTimer = setTimeout(() => {
      btn.classList.remove('is-copied');
      if (label) label.textContent = 'Copy';
    }, 1800);
  }

  // 1. Tabbed Command Cards + Copy Buttons
  document.querySelectorAll('[data-command-card]').forEach((card) => {
    const tabs = card.querySelectorAll('[role="tab"]');
    const codeEl = card.querySelector('.command-text');
    const copyBtn = card.querySelector('[data-copy-target]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        if (codeEl && tab.dataset.cmd) {
          codeEl.textContent = tab.dataset.cmd;
        }
      });
    });

    if (copyBtn && codeEl) {
      copyBtn.addEventListener('click', async () => {
        await copyText(codeEl.textContent.trim());
        flashCopied(copyBtn);
      });
    }
  });

  // Standalone Code Block Copy Buttons (YAML spec)
  document.querySelectorAll('[data-copy-block]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = document.getElementById(btn.dataset.copyBlock);
      if (!target) return;
      await copyText(target.textContent.trim());
      flashCopied(btn);
    });
  });

  // 2. Step 3 Output Preview Switcher (japan.png / korea.png)
  const previewBtns = document.querySelectorAll('[data-preview-map]');
  const stepPreviewImg = document.getElementById('step-preview-img');
  const stepPreviewBtn = document.getElementById('step-preview-btn');

  previewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.previewMap;
      const map = MAPS[key];
      if (!map) return;

      previewBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      if (stepPreviewImg) {
        stepPreviewImg.src = map.src;
        stepPreviewImg.alt = map.alt;
      }
      if (stepPreviewBtn) {
        stepPreviewBtn.dataset.openLightbox = key;
      }
    });
  });

  // 3. Map Lightbox with Zoom & Switch
  const lightbox = document.getElementById('map-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxSub = document.getElementById('lightbox-sub');
  const lightboxStage = document.getElementById('lightbox-stage');
  const lightboxZoomBtn = document.getElementById('lightbox-zoom-toggle');
  const lightboxZoomLabel = document.getElementById('lightbox-zoom-label');
  const lightboxSwitchBtn = document.getElementById('lightbox-switch');
  const lightboxSwitchLabel = document.getElementById('lightbox-switch-label');
  const lightboxCloseBtn = document.getElementById('lightbox-close');

  let currentMapKey = 'japan';

  function setZoom(zoomed) {
    if (!lightboxStage || !lightboxZoomBtn || !lightboxZoomLabel) return;
    lightboxStage.classList.toggle('is-zoomed', zoomed);
    lightboxZoomBtn.setAttribute('aria-pressed', String(zoomed));
    lightboxZoomLabel.textContent = zoomed ? 'Fit to view' : 'Zoom 1.8×';
  }

  function renderLightbox(key) {
    const map = MAPS[key] || MAPS.japan;
    currentMapKey = key in MAPS ? key : 'japan';
    if (lightboxImg) {
      lightboxImg.src = map.src;
      lightboxImg.alt = map.alt;
    }
    if (lightboxTitle) lightboxTitle.textContent = map.title;
    if (lightboxSub) lightboxSub.textContent = map.sub;
    if (lightboxSwitchLabel) lightboxSwitchLabel.textContent = map.nextLabel;
    setZoom(false);
  }

  function openLightbox(key) {
    if (!lightbox) return;
    renderLightbox(key);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    setZoom(false);
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openLightbox(trigger.dataset.openLightbox);
    });
  });

  if (lightboxZoomBtn) {
    lightboxZoomBtn.addEventListener('click', () => {
      setZoom(!lightboxStage.classList.contains('is-zoomed'));
    });
  }

  if (lightboxImg) {
    lightboxImg.addEventListener('click', () => {
      setZoom(!lightboxStage.classList.contains('is-zoomed'));
    });
  }

  if (lightboxSwitchBtn) {
    lightboxSwitchBtn.addEventListener('click', () => {
      renderLightbox(MAPS[currentMapKey].nextKey);
    });
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // 4. Bottom Dock Swatch Tray (instantaneous ink wash updates + mobile popover)
  const swatchBtns = document.querySelectorAll('[data-ink-choice]');
  const swatchTray = document.getElementById('swatch-tray');
  const swatchMobileBtn = document.getElementById('swatch-mobile-btn');
  const mobileActiveSwatch = document.getElementById('mobile-active-swatch');

  swatchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.inkChoice;
      document.documentElement.setAttribute('data-ink', choice);

      swatchBtns.forEach((b) => {
        const selected = b === btn;
        b.classList.toggle('is-selected', selected);
        b.setAttribute('aria-checked', String(selected));
      });

      if (mobileActiveSwatch) {
        mobileActiveSwatch.className = `swatch-dot swatch-dot--${choice}`;
      }
      if (swatchTray && swatchMobileBtn) {
        swatchTray.classList.remove('is-open');
        swatchMobileBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  if (swatchMobileBtn && swatchTray) {
    swatchMobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = swatchTray.classList.toggle('is-open');
      swatchMobileBtn.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (e) => {
      if (!swatchTray.contains(e.target) && e.target !== swatchMobileBtn) {
        swatchTray.classList.remove('is-open');
        swatchMobileBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 5. Searchable Atlas & Sprite Catalog Overlay
  const catalogModal = document.getElementById('catalog-modal');
  const catalogSearch = document.getElementById('catalog-search');
  const catalogList = document.getElementById('catalog-list');
  const catalogCount = document.getElementById('catalog-count');
  const catalogClose = document.getElementById('catalog-close');
  const openCatalogBtns = [
    document.getElementById('open-catalog-dock'),
    document.getElementById('open-catalog-top'),
  ].filter(Boolean);

  function renderCatalog(query = '') {
    if (!catalogList) return;
    const q = query.trim().toLowerCase();

    const matchedMaps = Object.entries(MAPS).filter(([key, m]) => {
      if (!q) return true;
      return key.includes(q) || m.title.toLowerCase().includes(q) || m.sub.toLowerCase().includes(q);
    });

    const matchedSprites = CATALOG_SPRITES.filter((s) => {
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.group.toLowerCase().includes(q)
      );
    });

    const total = matchedMaps.length + matchedSprites.length;
    if (catalogCount) {
      catalogCount.textContent = `${total} shown`;
    }

    catalogList.innerHTML = '';

    if (total === 0) {
      catalogList.innerHTML = `<div class="catalog-empty">No matching maps or sprites on this sheet.</div>`;
      return;
    }

    // Rendered maps group
    if (matchedMaps.length > 0) {
      const sec = document.createElement('div');
      sec.innerHTML = `<h3 class="catalog-group-title">Specimen maps</h3><div class="catalog-items"></div>`;
      const grid = sec.querySelector('.catalog-items');
      matchedMaps.forEach(([key, map]) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'catalog-item';
        item.innerHTML = `
          <span>
            <span class="catalog-item__name">${map.title}</span>
            <span class="catalog-item__id mono">${key}.yaml · 1500×1000</span>
          </span>
          <span class="catalog-item__badge">Inspect</span>
        `;
        item.addEventListener('click', () => {
          closeCatalog();
          openLightbox(key);
        });
        grid.appendChild(item);
      });
      catalogList.appendChild(sec);
    }

    // Sprites grouped by category
    const groups = new Map();
    matchedSprites.forEach((s) => {
      if (!groups.has(s.group)) groups.set(s.group, []);
      groups.get(s.group).push(s);
    });

    groups.forEach((items, groupName) => {
      const sec = document.createElement('div');
      sec.innerHTML = `<h3 class="catalog-group-title">${groupName}</h3><div class="catalog-items"></div>`;
      const grid = sec.querySelector('.catalog-items');

      items.forEach((sprite) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'catalog-item';
        btn.innerHTML = `
          <span>
            <span class="catalog-item__name">${sprite.name}</span>
            <span class="catalog-item__id mono">${sprite.id}</span>
          </span>
          <span class="catalog-item__badge mono">Copy YAML</span>
        `;
        btn.addEventListener('click', async () => {
          const snippet = `- { sprite: ${sprite.id}, at: [${sprite.coords[0]}, ${sprite.coords[1]}] }`;
          await copyText(snippet);
          const badge = btn.querySelector('.catalog-item__badge');
          btn.classList.add('is-copied');
          if (badge) badge.textContent = 'Copied';
          clearTimeout(btn._t);
          btn._t = setTimeout(() => {
            btn.classList.remove('is-copied');
            if (badge) badge.textContent = 'Copy YAML';
          }, 1500);
        });
        grid.appendChild(btn);
      });

      catalogList.appendChild(sec);
    });
  }

  function openCatalog() {
    if (!catalogModal) return;
    renderCatalog(catalogSearch ? catalogSearch.value : '');
    catalogModal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (catalogSearch) {
      setTimeout(() => catalogSearch.focus(), 40);
    }
  }

  function closeCatalog() {
    if (!catalogModal || catalogModal.hidden) return;
    catalogModal.hidden = true;
    document.body.style.overflow = '';
  }

  openCatalogBtns.forEach((btn) => btn.addEventListener('click', openCatalog));
  if (catalogClose) catalogClose.addEventListener('click', closeCatalog);
  if (catalogModal) {
    catalogModal.addEventListener('click', (e) => {
      if (e.target === catalogModal) closeCatalog();
    });
  }
  if (catalogSearch) {
    catalogSearch.addEventListener('input', () => renderCatalog(catalogSearch.value));
  }

  // 6. Keyboard Shortcuts (Esc, M for Atlas index, G for GitHub, Arrow keys in Lightbox)
  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;

    if (e.key === 'Escape') {
      closeLightbox();
      closeCatalog();
      return;
    }

    if (!lightbox.hidden) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        renderLightbox(MAPS[currentMapKey].nextKey);
      }
      return;
    }

    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key.toLowerCase() === 'm') {
      e.preventDefault();
      if (catalogModal.hidden) openCatalog();
      else closeCatalog();
    } else if (e.key.toLowerCase() === 'g') {
      const gh = document.getElementById('github-cta');
      if (gh) gh.focus();
    }
  });
})();
