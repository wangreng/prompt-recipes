/* Kid Pickup — Lightweight Plain JS Interactions */

(function () {
  'use strict';

  /* 1. Sticky Nav Brand Reveal & Mobile Drawer */
  const nav = document.getElementById('site-nav');
  const hero = document.getElementById('hero');
  const toggleBtn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (nav && hero && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          nav.classList.toggle('is-scrolled', !entry.isIntersecting);
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(hero);
  }

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const open = drawer.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', String(open));
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* 2. Corner Consent Notice */
  const consentCard = document.getElementById('consent-card');
  const consentAccept = document.getElementById('consent-accept');
  const consentDecline = document.getElementById('consent-decline');
  const reopenConsent = document.getElementById('cookie-prefs-trigger');
  const STORAGE_KEY = 'kidpickup_cookie_choice';

  function hideConsent(choice) {
    if (!consentCard) return;
    consentCard.classList.add('is-hidden');
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch (_) {
      /* ignore storage restrictions on local file */
    }
  }

  try {
    if (window.localStorage.getItem(STORAGE_KEY) && consentCard) {
      consentCard.classList.add('is-hidden');
    }
  } catch (_) {
    /* ignore */
  }

  if (consentAccept) consentAccept.addEventListener('click', () => hideConsent('accepted'));
  if (consentDecline) consentDecline.addEventListener('click', () => hideConsent('declined'));
  if (reopenConsent && consentCard) {
    reopenConsent.addEventListener('click', () => {
      consentCard.classList.remove('is-hidden');
      consentAccept && consentAccept.focus();
    });
  }

  /* 3. Interactive Framed Walkthrough Video Player (Offline-ready) */
  const playOverlay = document.getElementById('video-play-overlay');
  const playBtn = document.getElementById('video-ctrl-play');
  const ccBtn = document.getElementById('video-ctrl-cc');
  const captionsEl = document.getElementById('video-captions');
  const progressBar = document.getElementById('video-progress');
  const progressFill = document.getElementById('video-progress-fill');
  const timeEl = document.getElementById('video-time');
  const titleEl = document.getElementById('video-scene-title');
  const subEl = document.getElementById('video-scene-sub');
  const kickerEl = document.getElementById('video-scene-kicker');

  const TOTAL_SECS = 108; // 1:48
  const scenes = [
    {
      at: 0,
      kicker: '0:00 · The Morning Feed',
      title: 'Today’s pickups, right at the top.',
      sub: 'Open Kid Pickup to see who has morning drop-off, afternoon soccer, and piano — without scrolling past forty texts.',
      caption: '“Good morning! Every pickup for today sits calmly at the top of your private family feed.”'
    },
    {
      at: 26,
      kicker: '0:26 · One-Tap Claiming',
      title: 'Grandma taps Claim — everyone knows.',
      sub: 'No vague thumbs-up emoji. One tap attaches a real name and sends an instant confirmation to both parents.',
      caption: '“When Grandma Mae taps Claim for Thursday’s 3:15 pickup, her name locks in and parents get notified.”'
    },
    {
      at: 54,
      kicker: '0:54 · Automatic Escalation',
      title: 'Unclaimed slots never slip through.',
      sub: 'If nobody has claimed a ride yet, parents receive calm automatic nudges at 24 hours, 3 hours, and 2 hours before.',
      caption: '“Still uncovered? Parents automatically hear about it 24 hours, 3 hours, and 2 hours ahead.”'
    },
    {
      at: 82,
      kicker: '1:22 · Arrival Check-Ins',
      title: '“In the car and heading home.”',
      sub: 'One tap lets working parents breathe easy in the middle of a meeting — with zero GPS location tracking.',
      caption: '“One tap marks the pickup complete — total peace of mind, and zero GPS tracking ever.”'
    }
  ];

  let isPlaying = false;
  let elapsed = 0;
  let ccEnabled = true;
  let timerId = null;

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function renderVideoState() {
    const pct = Math.min(100, (elapsed / TOTAL_SECS) * 100);
    if (progressFill) progressFill.style.width = pct + '%';
    if (timeEl) timeEl.textContent = formatTime(elapsed) + ' / 1:48';

    let current = scenes[0];
    for (let i = 0; i < scenes.length; i++) {
      if (elapsed >= scenes[i].at) current = scenes[i];
    }
    if (kickerEl) kickerEl.textContent = current.kicker;
    if (titleEl) titleEl.textContent = current.title;
    if (subEl) subEl.textContent = current.sub;
    if (captionsEl) {
      captionsEl.textContent = current.caption;
      captionsEl.classList.toggle('is-hidden', !ccEnabled || (!isPlaying && elapsed === 0));
    }
    if (playBtn) playBtn.textContent = isPlaying ? 'Pause' : (elapsed >= TOTAL_SECS ? 'Replay' : 'Play');
  }

  function togglePlay() {
    if (elapsed >= TOTAL_SECS) elapsed = 0;
    isPlaying = !isPlaying;
    if (playOverlay) playOverlay.classList.toggle('is-hidden', isPlaying);
    if (isPlaying) {
      timerId = window.setInterval(() => {
        elapsed += 1;
        if (elapsed >= TOTAL_SECS) {
          elapsed = TOTAL_SECS;
          isPlaying = false;
          window.clearInterval(timerId);
          if (playOverlay) playOverlay.classList.remove('is-hidden');
        }
        renderVideoState();
      }, 1000);
    } else if (timerId) {
      window.clearInterval(timerId);
    }
    renderVideoState();
  }

  if (playOverlay) playOverlay.addEventListener('click', togglePlay);
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (ccBtn) {
    ccBtn.addEventListener('click', () => {
      ccEnabled = !ccEnabled;
      ccBtn.classList.toggle('is-active', ccEnabled);
      ccBtn.setAttribute('aria-pressed', String(ccEnabled));
      renderVideoState();
    });
  }
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      elapsed = Math.round(ratio * TOTAL_SECS);
      renderVideoState();
    });
  }
  renderVideoState();

  /* 4. Pricing Billing View Toggle (Annual / Monthly) */
  const billingBtns = document.querySelectorAll('[data-billing]');
  const familyPrice = document.getElementById('price-family');
  const familyUnit = document.getElementById('unit-family');
  const familyAlt = document.getElementById('alt-family');
  const premPrice = document.getElementById('price-premium');
  const premUnit = document.getElementById('unit-premium');
  const premAlt = document.getElementById('alt-premium');

  billingBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-billing');
      billingBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      if (mode === 'monthly') {
        if (familyPrice) familyPrice.textContent = '$5.99';
        if (familyUnit) familyUnit.textContent = '/ month USD';
        if (familyAlt) familyAlt.textContent = 'Or $59.99 / year (save 17% annually)';
        if (premPrice) premPrice.textContent = '$11.99';
        if (premUnit) premUnit.textContent = '/ month USD';
        if (premAlt) premAlt.textContent = 'Or $109.99 / year (save 24% annually)';
      } else {
        if (familyPrice) familyPrice.textContent = '$59.99';
        if (familyUnit) familyUnit.textContent = '/ year USD';
        if (familyAlt) familyAlt.textContent = 'Save 17% annually · or $5.99 / month';
        if (premPrice) premPrice.textContent = '$109.99';
        if (premUnit) premUnit.textContent = '/ year USD';
        if (premAlt) premAlt.textContent = 'Save 24% annually · or $11.99 / month';
      }
    });
  });

  /* 5. Language Switcher Active State */
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      langBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
    });
  });
})();
