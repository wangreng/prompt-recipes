/* ==========================================================================
   Memoh Interactive Controls, OS Detection & Step-by-Step Vignettes
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Dropdown Menus (Locale Switcher + OS Split-Buttons)
     ------------------------------------------------------------------------ */
  const dropdowns = Array.from(document.querySelectorAll("[data-dropdown]"));

  function closeAllDropdowns(except) {
    dropdowns.forEach((dd) => {
      if (dd !== except) {
        dd.classList.remove("is-open");
        const trig = dd.querySelector("[data-dropdown-trigger]");
        if (trig) trig.setAttribute("aria-expanded", "false");
      }
    });
  }

  dropdowns.forEach((dd) => {
    const trigger = dd.querySelector("[data-dropdown-trigger]");
    if (!trigger) return;
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !dd.classList.contains("is-open");
      closeAllDropdowns(dd);
      dd.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });
  });

  document.addEventListener("click", () => closeAllDropdowns(null));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllDropdowns(null);
  });

  /* Locale selection */
  const localeLabel = document.querySelector("[data-locale-label]");
  const localeOptions = document.querySelectorAll("[data-locale-option]");
  localeOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-locale-option");
      if (localeLabel && code) localeLabel.textContent = code;
      localeOptions.forEach((opt) => {
        const active = opt === btn;
        opt.classList.toggle("is-active", active);
        opt.setAttribute("aria-selected", String(active));
      });
      closeAllDropdowns(null);
    });
  });

  /* OS-aware desktop download split buttons */
  const heroOsLabel = document.querySelector("[data-os-label]");
  const closingOsLabel = document.querySelector("[data-os-cta-label]");

  function detectDefaultOs() {
    const ua = (navigator.userAgent || "").toLowerCase();
    if (ua.includes("mac")) {
      return { hero: "Download for macOS", closing: "Download .dmg (Apple Silicon)" };
    }
    if (ua.includes("win")) {
      return { hero: "Download for Windows", closing: "Download .exe (Windows)" };
    }
    return { hero: "Download for Linux", closing: "Download AppImage (Linux)" };
  }

  const detected = detectDefaultOs();
  if (heroOsLabel) heroOsLabel.textContent = detected.hero;
  if (closingOsLabel) closingOsLabel.textContent = detected.closing;

  document.querySelectorAll("[data-os-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const heroText = btn.getAttribute("data-os-text");
      const ctaText = btn.getAttribute("data-os-cta");
      if (heroOsLabel && heroText) heroOsLabel.textContent = heroText;
      if (closingOsLabel && ctaText) closingOsLabel.textContent = ctaText;
      closeAllDropdowns(null);
    });
  });

  /* ------------------------------------------------------------------------
     2. Hero Interactive Workspace Tabs
     ------------------------------------------------------------------------ */
  const heroTabTriggers = document.querySelectorAll("[data-hero-tab]");
  const heroPanels = document.querySelectorAll("[data-hero-panel]");

  heroTabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const target = trigger.getAttribute("data-hero-tab");
      heroPanels.forEach((panel) => {
        panel.classList.toggle("is-hidden", panel.getAttribute("data-hero-panel") !== target);
      });
      heroTabTriggers.forEach((el) => {
        const match = el.getAttribute("data-hero-tab") === target;
        el.classList.toggle("is-active", match);
        if (el.getAttribute("role") === "tab") {
          el.setAttribute("aria-selected", String(match));
        }
      });
    });
  });

  /* Interactive Schedule Toggles in Proof Bento */
  document.querySelectorAll(".toggle-switch").forEach((sw) => {
    sw.addEventListener("click", () => {
      const isOn = sw.classList.toggle("is-on");
      sw.setAttribute("aria-pressed", String(isOn));
    });
  });

  /* ------------------------------------------------------------------------
     3. Step-by-Step Animated Vignettes with Gliding Simulated Cursor
     ------------------------------------------------------------------------ */
  function createVignetteRunner(card, steps) {
    const cursor = card.querySelector("[data-cursor]");
    const canvas = card.querySelector(".mini-canvas");
    const toggleBtn = card.querySelector("[data-v-toggle]");
    const replayBtn = card.querySelector("[data-v-replay]");
    const iconPause = toggleBtn ? toggleBtn.querySelector(".icon-pause") : null;
    const iconPlay = toggleBtn ? toggleBtn.querySelector(".icon-play") : null;

    let stepIndex = 0;
    let paused = false;
    let timerId = null;

    function moveCursorTo(selector, click) {
      if (!cursor || !canvas) return;
      const target = selector ? card.querySelector(selector) : null;
      if (target) {
        const cRect = canvas.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        const x = Math.max(10, Math.min(cRect.width - 24, tRect.left - cRect.left + tRect.width * 0.55));
        const y = Math.max(10, Math.min(cRect.height - 24, tRect.top - cRect.top + tRect.height * 0.55));
        cursor.style.transform = `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px)`;
      }
      if (click) {
        cursor.classList.remove("is-clicking");
        void cursor.offsetWidth;
        cursor.classList.add("is-clicking");
      }
    }

    function runStep() {
      if (paused) return;
      const step = steps[stepIndex];
      if (!step) return;
      step.run(moveCursorTo);
      stepIndex = (stepIndex + 1) % steps.length;
      timerId = window.setTimeout(runStep, step.delay);
    }

    function restart() {
      window.clearTimeout(timerId);
      stepIndex = 0;
      if (!paused) runStep();
      else steps[0].run(moveCursorTo);
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        paused = !paused;
        if (iconPause) iconPause.classList.toggle("is-hidden", paused);
        if (iconPlay) iconPlay.classList.toggle("is-hidden", !paused);
        toggleBtn.setAttribute("aria-label", paused ? "Play animation" : "Pause animation");
        if (paused) {
          window.clearTimeout(timerId);
        } else {
          runStep();
        }
      });
    }

    if (replayBtn) {
      replayBtn.addEventListener("click", () => {
        paused = false;
        if (iconPause) iconPause.classList.remove("is-hidden");
        if (iconPlay) iconPlay.classList.add("is-hidden");
        restart();
      });
    }

    // Start gently
    window.setTimeout(runStep, 450);
  }

  /* Vignette 1: External Agents & Model Switching */
  const vModels = document.querySelector('[data-vignette="models"]');
  if (vModels) {
    const agentBtn = vModels.querySelector("[data-m-agent-btn]");
    const agentLabel = vModels.querySelector("[data-m-agent-label]");
    const agentMenu = vModels.querySelector("[data-m-agent-menu]");
    const modelBtn = vModels.querySelector("[data-m-model-btn]");
    const modelLabel = vModels.querySelector("[data-m-model-label]");
    const modelMenu = vModels.querySelector("[data-m-model-menu]");
    const runBtn = vModels.querySelector("[data-m-run]");
    const toast = vModels.querySelector("[data-m-toast]");

    createVignetteRunner(vModels, [
      {
        delay: 1100,
        run(move) {
          agentLabel.textContent = "Memoh Native";
          modelLabel.textContent = "DeepSeek R1";
          agentMenu.classList.remove("is-open");
          modelMenu.classList.remove("is-open");
          agentBtn.classList.remove("is-focus");
          modelBtn.classList.remove("is-focus");
          runBtn.classList.remove("is-pressed");
          toast.classList.remove("is-visible");
          move("[data-m-agent-btn]", false);
        },
      },
      {
        delay: 1100,
        run(move) {
          agentBtn.classList.add("is-focus");
          agentMenu.classList.add("is-open");
          move('[data-m-opt="claude-code"]', true);
        },
      },
      {
        delay: 1000,
        run(move) {
          vModels.querySelectorAll("[data-m-opt]").forEach((el) => el.classList.remove("is-selected"));
          const opt = vModels.querySelector('[data-m-opt="claude-code"]');
          if (opt) opt.classList.add("is-selected");
          agentLabel.textContent = "Claude Code";
          agentMenu.classList.remove("is-open");
          agentBtn.classList.remove("is-focus");
          move("[data-m-model-btn]", false);
        },
      },
      {
        delay: 1100,
        run(move) {
          modelBtn.classList.add("is-focus");
          modelMenu.classList.add("is-open");
          move('[data-m-mopt="claude"]', true);
        },
      },
      {
        delay: 1000,
        run(move) {
          vModels.querySelectorAll("[data-m-mopt]").forEach((el) => el.classList.remove("is-selected"));
          const mopt = vModels.querySelector('[data-m-mopt="claude"]');
          if (mopt) mopt.classList.add("is-selected");
          modelLabel.textContent = "Claude 3.7 Sonnet";
          modelMenu.classList.remove("is-open");
          modelBtn.classList.remove("is-focus");
          move("[data-m-run]", false);
        },
      },
      {
        delay: 2400,
        run(move) {
          move("[data-m-run]", true);
          runBtn.classList.add("is-pressed");
          toast.classList.add("is-visible");
        },
      },
    ]);
  }

  /* Vignette 2: Autonomous Desktop Operation with Human Handover */
  const vHandover = document.querySelector('[data-vignette="handover"]');
  if (vHandover) {
    const desktop = vHandover.querySelector("[data-h-desktop]");
    const badge = vHandover.querySelector("[data-h-badge]");
    const takeBtn = vHandover.querySelector("[data-h-take-btn]");
    const ssoBtn = vHandover.querySelector("[data-h-sso-btn]");
    const approved = vHandover.querySelector("[data-h-approved]");
    const doneMsg = vHandover.querySelector("[data-h-done-msg]");

    createVignetteRunner(vHandover, [
      {
        delay: 1200,
        run(move) {
          desktop.classList.remove("is-human");
          badge.textContent = "Agent active";
          takeBtn.textContent = "Take control";
          ssoBtn.classList.remove("is-hidden");
          approved.classList.add("is-hidden");
          doneMsg.classList.add("is-hidden");
          move("[data-h-take-btn]", false);
        },
      },
      {
        delay: 1200,
        run(move) {
          move("[data-h-take-btn]", true);
          desktop.classList.add("is-human");
          badge.textContent = "You have control";
          takeBtn.textContent = "Hand back";
        },
      },
      {
        delay: 1100,
        run(move) {
          move("[data-h-sso-btn]", false);
        },
      },
      {
        delay: 1300,
        run(move) {
          move("[data-h-sso-btn]", true);
          ssoBtn.classList.add("is-hidden");
          approved.classList.remove("is-hidden");
        },
      },
      {
        delay: 2400,
        run(move) {
          move("[data-h-take-btn]", true);
          desktop.classList.remove("is-human");
          badge.textContent = "Agent active";
          takeBtn.textContent = "Take control";
          doneMsg.classList.remove("is-hidden");
        },
      },
    ]);
  }

  /* Vignette 3: Centralized Package Hub (Installing uv) */
  const vPackages = document.querySelector('[data-vignette="packages"]');
  if (vPackages) {
    const uvBtn = vPackages.querySelector("[data-p-uv-btn]");
    const bar = vPackages.querySelector("[data-p-bar]");
    const fill = vPackages.querySelector("[data-p-fill]");

    createVignetteRunner(vPackages, [
      {
        delay: 1100,
        run(move) {
          uvBtn.textContent = "Install";
          uvBtn.classList.remove("is-installing", "is-installed");
          bar.classList.remove("is-active");
          fill.style.width = "0%";
          move("[data-p-uv-btn]", false);
        },
      },
      {
        delay: 1100,
        run(move) {
          move("[data-p-uv-btn]", true);
          uvBtn.textContent = "Installing…";
          uvBtn.classList.add("is-installing");
          bar.classList.add("is-active");
          window.requestAnimationFrame(() => {
            fill.style.width = "100%";
          });
        },
      },
      {
        delay: 2500,
        run() {
          uvBtn.textContent = "Installed ✓";
          uvBtn.classList.remove("is-installing");
          uvBtn.classList.add("is-installed");
          bar.classList.remove("is-active");
        },
      },
    ]);
  }

  /* Vignette 4: In-Cloud Development & Live App Preview */
  const vPreview = document.querySelector('[data-vignette="preview"]');
  if (vPreview) {
    const tabCode = vPreview.querySelector("[data-pv-tab-code]");
    const tabApp = vPreview.querySelector("[data-pv-tab-app]");
    const paneCode = vPreview.querySelector("[data-pv-code-pane]");
    const paneApp = vPreview.querySelector("[data-pv-app-pane]");
    const taskToggle = vPreview.querySelector("[data-pv-task-toggle]");
    const taskBox = vPreview.querySelector("[data-pv-task-box]");

    createVignetteRunner(vPreview, [
      {
        delay: 1300,
        run(move) {
          tabCode.classList.add("is-active");
          tabApp.classList.remove("is-active");
          paneCode.classList.remove("is-hidden");
          paneApp.classList.add("is-hidden");
          taskToggle.classList.remove("is-done");
          taskBox.textContent = "";
          move("[data-pv-open-chip]", false);
        },
      },
      {
        delay: 1200,
        run(move) {
          move("[data-pv-open-chip]", true);
          tabCode.classList.remove("is-active");
          tabApp.classList.add("is-active");
          paneCode.classList.add("is-hidden");
          paneApp.classList.remove("is-hidden");
        },
      },
      {
        delay: 1100,
        run(move) {
          move("[data-pv-task-toggle]", false);
        },
      },
      {
        delay: 2400,
        run(move) {
          move("[data-pv-task-toggle]", true);
          taskToggle.classList.add("is-done");
          taskBox.textContent = "✓";
        },
      },
    ]);
  }

  /* ------------------------------------------------------------------------
     4. Interactive Ambient Epilogue (Hotspots + Subtle Fireflies)
     ------------------------------------------------------------------------ */
  const whisper = document.getElementById("epilogueWhisper");
  const hotspotNotes = {
    cat: "Atlas · watching the horizon · 0 missed cron jobs",
    train: "Night express · cloud-vm-01 uptime 99.98%",
    city: "Synced live across Desktop, Telegram, WeChat & Discord",
  };

  let whisperTimer = null;
  document.querySelectorAll("[data-hotspot]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-hotspot");
      if (!whisper || !hotspotNotes[key]) return;
      whisper.textContent = hotspotNotes[key];
      whisper.classList.add("is-visible");
      window.clearTimeout(whisperTimer);
      whisperTimer = window.setTimeout(() => {
        whisper.classList.remove("is-visible");
      }, 3600);
    });
  });

  const canvas = document.getElementById("epilogueCanvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const particles = Array.from({ length: 18 }, (_, i) => ({
      x: ((i * 73) % 100) / 100,
      y: 0.35 + ((i * 37) % 58) / 100,
      r: 0.9 + (i % 3) * 0.45,
      phase: i * 0.7,
      speed: 0.008 + (i % 4) * 0.003,
    }));

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.phase += p.speed;
        const alpha = 0.14 + 0.34 * (0.5 + 0.5 * Math.sin(p.phase));
        const px = p.x * canvas.width + Math.sin(p.phase * 0.7) * 8;
        const py = p.y * canvas.height + Math.cos(p.phase * 0.5) * 5;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 224, 178, ${alpha.toFixed(3)})`;
        ctx.fill();
      });
      window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
  }
})();
