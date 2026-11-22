(() => {
  'use strict';

  // Interactive style preset plate switcher (works offline via file://)
  const img = document.getElementById('preset-img');
  const cmd = document.getElementById('preset-cmd');
  const buttons = document.querySelectorAll('.preset-btn[data-preset]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.preset;
      const src = btn.dataset.img;
      const alt = btn.dataset.alt;

      buttons.forEach((other) => {
        const active = other === btn;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      if (img && src) {
        img.src = src;
        if (alt) img.alt = alt;
      }
      if (cmd && preset) {
        cmd.textContent = `npx handdrawn-map render examples/specs/italy.yaml --style ${preset} --fast --auto-layout`;
      }
    });
  });

  // One-click copy for hero build command
  document.querySelectorAll('.copy-btn[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy || '';
      const original = btn.textContent;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = text;
      }
      setTimeout(() => {
        btn.textContent = original;
      }, 1600);
    });
  });
})();
