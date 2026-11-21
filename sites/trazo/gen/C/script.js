/* ==========================================================================
   handdrawn-map-kit — Lightweight Plain JS Interactions
   1) Copy-to-clipboard with local file:// fallback & "Copied" confirmation
   2) Click-to-zoom Cartographic Lightbox (Japan & Korea plates + 1.75x zoom)
   3) Header scroll elevation
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Sticky Header Scroll Shadow
     ------------------------------------------------------------------------ */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------------
     2. Copy Code Blocks (with reliable file:// fallback)
     ------------------------------------------------------------------------ */
  const announcer = document.getElementById("copy-announcer");
  const copyTimers = new WeakMap();

  function fallbackCopyText(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {
      ok = false;
    }
    document.body.removeChild(textarea);
    return ok;
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // Fallback for file:// or restricted permissions
      }
    }
    return fallbackCopyText(text);
  }

  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetId = btn.getAttribute("data-copy-target");
      const codeEl = targetId ? document.getElementById(targetId) : null;
      if (!codeEl) return;

      const rawText = codeEl.textContent || "";
      await copyToClipboard(rawText);

      const labelEl = btn.querySelector(".copy-label");
      btn.classList.add("is-copied");
      if (labelEl) labelEl.textContent = "Copied";
      if (announcer) announcer.textContent = "Code copied to clipboard.";

      const prevTimer = copyTimers.get(btn);
      if (prevTimer) window.clearTimeout(prevTimer);

      const timer = window.setTimeout(() => {
        btn.classList.remove("is-copied");
        if (labelEl) labelEl.textContent = "Copy";
      }, 2000);
      copyTimers.set(btn, timer);
    });
  });

  /* ------------------------------------------------------------------------
     3. Artwork Lightbox (Click-to-zoom plate inspector)
     ------------------------------------------------------------------------ */
  const PLATES = [
    {
      id: "PLATE 01",
      title: "Japan Cultural Map · 日本列岛人文地图",
      src: "assets/japan_cultural_map.png",
      alt: "Hand-drawn cultural map of Japan rendered by handdrawn-map-kit",
      caption:
        "Natural Earth coastlines, Ryukyu / Okinawa inset frame, Shinkansen layer, zebra neatline, compass rose, and 22 illustrated motifs (0 overlaps)."
    },
    {
      id: "PLATE 02",
      title: "Korea Cultural Map · 韩国人文地图",
      src: "assets/korea_cultural_map.png",
      alt: "Hand-drawn cultural map of Korea rendered by handdrawn-map-kit",
      caption:
        "Korean Peninsula with KTX railway network, curved offshore leader lines, flag cartouche, and 18 hand-drawn cultural icons (0 overlaps)."
    }
  ];

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbStage = document.getElementById("lightbox-stage");
  const lbPlateId = document.getElementById("lightbox-plate-id");
  const lbTitle = document.getElementById("lightbox-title");
  const lbCaption = document.getElementById("lightbox-caption");
  const lbPrev = document.getElementById("lightbox-prev");
  const lbNext = document.getElementById("lightbox-next");
  const lbZoomToggle = document.getElementById("lightbox-zoom-toggle");
  const lbZoomLabel = document.getElementById("lightbox-zoom-label");

  let activeIndex = 0;
  let lastTrigger = null;

  function setZoom(zoomed) {
    if (!lbStage || !lbZoomToggle || !lbZoomLabel) return;
    lbStage.classList.toggle("is-zoomed", zoomed);
    lbZoomToggle.setAttribute("aria-pressed", String(zoomed));
    lbZoomLabel.textContent = zoomed ? "Fit to Screen" : "1.75× Zoom";
    if (!zoomed) {
      lbStage.scrollTop = 0;
      lbStage.scrollLeft = 0;
    }
  }

  function renderPlate(index) {
    activeIndex = (index + PLATES.length) % PLATES.length;
    const plate = PLATES[activeIndex];
    if (lbPlateId) lbPlateId.textContent = plate.id;
    if (lbTitle) lbTitle.textContent = plate.title;
    if (lbCaption) lbCaption.textContent = plate.caption;
    if (lbImg) {
      lbImg.src = plate.src;
      lbImg.alt = plate.alt;
    }
    setZoom(false);
  }

  function openLightbox(index, triggerEl) {
    if (!lightbox) return;
    lastTrigger = triggerEl || document.activeElement;
    renderPlate(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = lightbox.querySelector(".lb-btn-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    setZoom(false);
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  }

  document.querySelectorAll(".zoom-trigger").forEach((el) => {
    el.addEventListener("click", () => {
      const idx = parseInt(el.getAttribute("data-lightbox-index") || "0", 10);
      openLightbox(Number.isNaN(idx) ? 0 : idx, el);
    });
  });

  if (lightbox) {
    lightbox.querySelectorAll("[data-lightbox-close]").forEach((el) => {
      el.addEventListener("click", closeLightbox);
    });
  }

  if (lbPrev) {
    lbPrev.addEventListener("click", () => renderPlate(activeIndex - 1));
  }

  if (lbNext) {
    lbNext.addEventListener("click", () => renderPlate(activeIndex + 1));
  }

  if (lbZoomToggle) {
    lbZoomToggle.addEventListener("click", () => {
      const nextState = !lbStage.classList.contains("is-zoomed");
      setZoom(nextState);
    });
  }

  if (lbImg) {
    lbImg.addEventListener("click", () => {
      const nextState = !lbStage.classList.contains("is-zoomed");
      setZoom(nextState);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      renderPlate(activeIndex - 1);
    } else if (e.key === "ArrowRight") {
      renderPlate(activeIndex + 1);
    }
  });
})();
