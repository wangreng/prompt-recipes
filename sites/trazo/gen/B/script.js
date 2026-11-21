(() => {
  'use strict';

  /* -----------------------------------------------------------------------
     1. Clipboard helper (works on both https:// and local file://)
     ----------------------------------------------------------------------- */
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // Fall through to execCommand fallback
      }
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
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

  const toastEl = document.getElementById('sketch-toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2000);
  }

  /* -----------------------------------------------------------------------
     2. Tabbed Command Cards (Hero + Step 2)
     ----------------------------------------------------------------------- */
  document.querySelectorAll('[data-tab-group]').forEach((group) => {
    const tabs = group.querySelectorAll('[role="tab"]');
    const codeEl = group.querySelector('code');
    if (!codeEl) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.tab;
        const nextCode = codeEl.getAttribute(`data-code-${key}`);
        if (nextCode == null) return;

        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', String(active));
        });

        codeEl.textContent = nextCode;
      });
    });
  });

  /* -----------------------------------------------------------------------
     3. Copy Buttons with "Copied ✓" state
     ----------------------------------------------------------------------- */
  const CHECK_SVG = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>`;
  const COPY_SVG = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/><path d="M3.5 10.5H3a1.5 1.5 0 0 1-1.5-1.5V3A1.5 1.5 0 0 1 3 1.5h6A1.5 1.5 0 0 1 10.5 3v.5"/></svg>`;

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    let resetTimer = null;

    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      await copyText(target.textContent.trim());

      const labelEl = btn.querySelector('.copy-label');
      const iconEl = btn.querySelector('.copy-icon');

      btn.classList.add('is-copied');
      if (labelEl) labelEl.textContent = 'Copied';
      if (iconEl) iconEl.innerHTML = CHECK_SVG;

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        btn.classList.remove('is-copied');
        if (labelEl) labelEl.textContent = 'Copy';
        if (iconEl) iconEl.innerHTML = COPY_SVG;
      }, 1900);
    });
  });

  /* Clicking orbiting SVG specimens copies their YAML snippet */
  document.querySelectorAll('.specimen[data-copy-snippet]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const snippet = btn.getAttribute('data-copy-snippet');
      if (!snippet) return;
      await copyText(snippet);
      showToast(`Copied: ${snippet}`);
    });
  });

  /* -----------------------------------------------------------------------
     4. Lightbox Modal for Map Artwork Zoom
     ----------------------------------------------------------------------- */
  const MAPS = [
    {
      title: 'Japan — Nippon',
      file: 'assets/japan_cultural_map.png',
      alt: 'Hand-drawn cultural map of Japan rendered by handdrawn-map-kit',
      caption: 'Rendered from japan.yaml · Natural Earth coastline + Okinawa inset, Shinkansen railway, 24 illustrated motifs, zebra border & compass rose.'
    },
    {
      title: 'Korea — Daehan Minguk',
      file: 'assets/korea_cultural_map.png',
      alt: 'Hand-drawn cultural map of Korea rendered by handdrawn-map-kit',
      caption: 'Rendered from korea.yaml · Natural Earth relief, KTX railway, Gyeongbokgung Palace, Jeonju Bibimbap, Turtle Ship, Jeju tangerines & Ulsan whale.'
    }
  ];

  const lightbox = document.getElementById('map-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxFile = document.getElementById('lightbox-file');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxViewport = document.getElementById('lightbox-viewport');
  const zoomBtn = document.getElementById('lightbox-zoom-toggle');
  let activeMapIndex = 0;

  function renderLightbox(index) {
    activeMapIndex = (index + MAPS.length) % MAPS.length;
    const item = MAPS[activeMapIndex];
    lightboxImg.src = item.file;
    lightboxImg.alt = item.alt;
    lightboxTitle.textContent = item.title;
    lightboxFile.textContent = item.file;
    lightboxCaption.textContent = item.caption;
    setZoom(false);
  }

  function setZoom(zoomed) {
    lightboxViewport.classList.toggle('is-zoomed', zoomed);
    zoomBtn.setAttribute('aria-pressed', String(zoomed));
    zoomBtn.textContent = zoomed ? 'Fit view' : 'Zoom 160%';
  }

  function openLightbox(index) {
    renderLightbox(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox-index]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const idx = parseInt(trigger.getAttribute('data-lightbox-index'), 10) || 0;
      openLightbox(idx);
    });
  });

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => renderLightbox(activeMapIndex - 1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => renderLightbox(activeMapIndex + 1));
  zoomBtn?.addEventListener('click', () => setZoom(!lightboxViewport.classList.contains('is-zoomed')));
  lightboxImg?.addEventListener('click', () => setZoom(!lightboxViewport.classList.contains('is-zoomed')));

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* -----------------------------------------------------------------------
     5. Bottom Dock: Live Ink Swatch Tray
     ----------------------------------------------------------------------- */
  const swatchBtns = document.querySelectorAll('.swatch-btn');
  const mobileSwatchBtn = document.getElementById('mobile-swatch-btn');
  const swatchTray = document.getElementById('swatch-tray');
  const swatchCurrentDot = mobileSwatchBtn?.querySelector('.swatch-current');

  const SWATCH_COLORS = {
    multicolor: 'conic-gradient(#d95341, #e5b55b, #6e9a59, #557999, #a46cb0, #d95341)',
    vermilion: '#d94638',
    cobalt: '#346da0',
    pine: '#3f7a57',
    ochre: '#d69635',
    charcoal: '#3a3834'
  };

  swatchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.inkChoice || 'multicolor';
      document.body.setAttribute('data-ink', choice);

      swatchBtns.forEach((b) => {
        const selected = b === btn;
        b.classList.toggle('is-selected', selected);
        b.setAttribute('aria-checked', String(selected));
      });

      if (swatchCurrentDot && SWATCH_COLORS[choice]) {
        swatchCurrentDot.style.background = SWATCH_COLORS[choice];
      }

      if (swatchTray?.classList.contains('is-open')) {
        swatchTray.classList.remove('is-open');
        mobileSwatchBtn?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  mobileSwatchBtn?.addEventListener('click', () => {
    const open = swatchTray.classList.toggle('is-open');
    mobileSwatchBtn.setAttribute('aria-expanded', String(open));
  });

  /* -----------------------------------------------------------------------
     6. Searchable 65-Motif Catalog Overlay (K shortcut)
     ----------------------------------------------------------------------- */
  const MOTIFS = [
    ['Giant Panda', 'giant-panda'], ['Great Wall', 'great-wall'], ['Dumplings', 'dumplings'],
    ['Windmill', 'windmill'], ['Mt. Fuji', 'mt-fuji'], ['Torii Gate', 'torii-gate'],
    ['Sapporo Ramen', 'ramen-bowl'], ['Shinkansen', 'shinkansen'], ['KTX Train', 'ktx-train'],
    ['Sumo Ring', 'sumo-ring'], ['Shiba Inu', 'shiba-inu'], ['Edo Sushi', 'edo-sushi'],
    ['Matcha Tea', 'shizuoka-tea'], ['Nara Deer', 'nara-deer'], ['Koinobori', 'koinobori'],
    ['Onsen Steam', 'onsen-bath'], ['Nishikigoi Carp', 'nishikigoi'], ['Peace Origami', 'origami-crane'],
    ['Kitamaebune Ship', 'kitamaebune'], ['Pacific Whale', 'pacific-whale'], ['Lighthouse', 'coastal-lighthouse'],
    ['Tokyo Tower', 'tokyo-tower'], ['Daruma Doll', 'daruma'], ['Kyoto Pagoda', 'five-story-pagoda'],
    ['Sakura & Dango', 'hanami-dango'], ['Onigiri', 'onigiri'], ['Red-crowned Crane', 'red-crowned-crane'],
    ['Gyeongbokgung', 'gyeongbokgung'], ['Jeonju Bibimbap', 'bibimbap'], ['Kimchi Jars', 'onggi-jars'],
    ['Turtle Ship', 'turtle-ship'], ['Dol Hareubang', 'dol-hareubang'], ['Jeju Tangerines', 'jeju-tangerines'],
    ['Andong Mask', 'andong-mask'], ['Snow Crab', 'snow-crab'], ['Mugunghwa', 'mugunghwa'],
    ['Gimbap Roll', 'gimbap'], ['Korean Tiger', 'korean-tiger'], ['Hanbok Dancer', 'hanbok-figure'],
    ['N Seoul Tower', 'n-seoul-tower'], ['Tea Plantation', 'tea-hills'], ['Pine Forest', 'pine-tree'],
    ['Snowy Peak', 'snowy-peak'], ['Volcano Cone', 'volcano-peak'], ['Terraced Rice', 'rice-terrace'],
    ['Bamboo Grove', 'bamboo-grove'], ['Pagoda Roof', 'pagoda-roof'], ['Temple Bell', 'temple-bell'],
    ['Stone Lantern', 'stone-lantern'], ['Paper Lantern', 'paper-lantern'], ['Wooden Junk', 'wooden-junk'],
    ['Fishing Boat', 'fishing-boat'], ['Sailboat', 'sailboat'], ['Hot Air Balloon', 'hot-air-balloon'],
    ['Steam Locomotive', 'steam-train'], ['Stone Bridge', 'arch-bridge'], ['Castle Keep', 'castle-keep'],
    ['Market Stall', 'market-stall'], ['Teapot & Cup', 'ceramic-teapot'], ['Noodle Chef', 'noodle-chef'],
    ['Pilgrim Hat', 'pilgrim-walker'], ['Sea Wave', 'sea-wave'], ['Compass Rose', 'compass-rose'],
    ['Banner Cartouche', 'banner-cartouche'], ['Zebra Neatline', 'zebra-border']
  ];

  const catalogModal = document.getElementById('catalog-modal');
  const catalogList = document.getElementById('catalog-list');
  const catalogSearch = document.getElementById('catalog-search');
  const catalogCount = document.getElementById('catalog-count');

  function renderCatalog(query = '') {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? MOTIFS.filter(([name, id]) => name.toLowerCase().includes(q) || id.includes(q))
      : MOTIFS;

    catalogCount.textContent = `${filtered.length} / ${MOTIFS.length}`;
    catalogList.innerHTML = '';

    filtered.forEach(([name, id]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'motif-chip';
      btn.setAttribute('role', 'listitem');
      btn.innerHTML = `<span class="motif-chip-name">${name}</span><span class="motif-chip-id">${id}</span>`;
      btn.addEventListener('click', async () => {
        const snippet = `- { id: ${id}, label: "${name}" }`;
        await copyText(snippet);
        showToast(`Copied: ${snippet}`);
      });
      catalogList.appendChild(btn);
    });
  }

  function openCatalog() {
    renderCatalog(catalogSearch?.value || '');
    catalogModal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => catalogSearch?.focus(), 40);
  }

  function closeCatalog() {
    catalogModal.hidden = true;
    document.body.style.overflow = '';
  }

  ['open-catalog-top', 'open-catalog-dock', 'open-catalog-footer'].forEach((id) => {
    document.getElementById(id)?.addEventListener('click', openCatalog);
  });

  document.getElementById('catalog-close')?.addEventListener('click', closeCatalog);
  catalogSearch?.addEventListener('input', (e) => renderCatalog(e.target.value));
  catalogModal?.addEventListener('click', (e) => {
    if (e.target === catalogModal) closeCatalog();
  });

  /* Global keyboard shortcuts: K for motif catalog, Escape to close modals */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!lightbox.hidden) closeLightbox();
      if (!catalogModal.hidden) closeCatalog();
      return;
    }

    if (
      (e.key === 'k' || e.key === 'K') &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey &&
      document.activeElement?.tagName !== 'INPUT' &&
      document.activeElement?.tagName !== 'TEXTAREA'
    ) {
      e.preventDefault();
      if (catalogModal.hidden) {
        if (!lightbox.hidden) closeLightbox();
        openCatalog();
      } else {
        closeCatalog();
      }
    }
  });
})();
