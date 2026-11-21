(() => {
  "use strict";

  /* =========================================================
     1. 首屏手机界面互动（清单 / 番茄钟切换 + 打勾同步演示）
     ========================================================= */
  const mockTabs = document.querySelectorAll("[data-mock-tab]");
  const mockListView = document.getElementById("mock-view-list");
  const mockTimerView = document.getElementById("mock-view-timer");

  mockTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-mock-tab");
      mockTabs.forEach((btn) => {
        const active = btn === tab;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", String(active));
      });
      if (mockListView && mockTimerView) {
        mockListView.classList.toggle("is-hidden", target !== "list");
        mockTimerView.classList.toggle("is-hidden", target !== "timer");
      }
    });
  });

  const heroTasks = document.querySelectorAll("#hero-task-list .mock-task");
  const heroDoneCount = document.getElementById("hero-done-count");
  const heroRemainMin = document.getElementById("hero-remain-min");
  const heroProgressBar = document.getElementById("hero-progress-bar");
  const heroParentFeed = document.getElementById("hero-parent-feed");

  function updateHeroProgress(lastTitle, isNowDone) {
    let done = 0;
    let remainMin = 0;
    heroTasks.forEach((item) => {
      const min = Number(item.getAttribute("data-min") || 0);
      if (item.classList.contains("is-done")) {
        done += 1;
      } else {
        remainMin += min;
      }
    });
    if (heroDoneCount) heroDoneCount.textContent = String(done);
    if (heroRemainMin) heroRemainMin.textContent = String(remainMin);
    if (heroProgressBar) {
      const pct = Math.round((done / heroTasks.length) * 100);
      heroProgressBar.style.width = `${pct}%`;
    }
    if (heroParentFeed && lastTitle) {
      heroParentFeed.textContent = isNowDone
        ? `刚打勾「${lastTitle}」· 还剩 ${heroTasks.length - done} 项`
        : `已恢复「${lastTitle}」为待完成`;
    }
  }

  heroTasks.forEach((item) => {
    const checkBtn = item.querySelector(".mock-check");
    const pill = item.querySelector(".mock-pill");
    const titleEl = item.querySelector(".mock-task-title");
    if (!checkBtn) return;

    checkBtn.addEventListener("click", () => {
      const nowDone = !item.classList.contains("is-done");
      item.classList.toggle("is-done", nowDone);
      if (nowDone) {
        item.classList.remove("is-focus");
        if (pill) {
          pill.className = "mock-pill mock-pill-done";
          pill.textContent = "已完成";
        }
      } else if (pill) {
        pill.className = "mock-pill";
        pill.textContent = "番茄钟";
      }
      updateHeroProgress(titleEl ? titleEl.textContent : "", nowDone);
    });
  });

  /* =========================================================
     2. 番茄钟互动演示（开始 / 暂停 / 重置 / 1x 与 60x 加速）
     ========================================================= */
  const FOCUS_SECONDS = 25 * 60; // 25 分钟
  const BREAK_SECONDS = 5 * 60;  // 5 分钟
  const RING_CIRCUMFERENCE = 2 * Math.PI * 110; // r = 110 => ~691.15

  const demoTasks = [
    { subject: "数学", title: "口算题卡第 38–39 页" },
    { subject: "语文", title: "背诵古诗《绝句》并默写" },
    { subject: "英语", title: "跟读 Unit 4 课文 3 遍" },
  ];

  const state = {
    phase: "focus",          // "focus" | "break"
    running: false,
    remaining: FOCUS_SECONDS,
    speed: 1,                // 1x 或 60x
    selectedTaskIdx: 0,
    completedCount: 0,
    timerId: null,
  };

  const stageEl = document.getElementById("pomo-stage");
  const displayEl = document.getElementById("timer-display");
  const badgeEl = document.getElementById("timer-badge");
  const subEl = document.getElementById("timer-sub");
  const ringEl = document.getElementById("timer-progress-ring");
  const toggleBtn = document.getElementById("pomo-toggle-btn");
  const btnLabel = document.getElementById("pomo-btn-label");
  const btnIcon = document.getElementById("pomo-btn-icon");
  const resetBtn = document.getElementById("pomo-reset-btn");
  const completedCountEl = document.getElementById("pomo-completed-count");
  const activeTaskEl = document.getElementById("demo-active-task");
  const syncDot = document.getElementById("sync-dot");
  const syncStatusText = document.getElementById("sync-status-text");
  const speedHint = document.getElementById("speed-hint");

  const phaseBtns = document.querySelectorAll("[data-phase-btn]");
  const speedBtns = document.querySelectorAll("[data-speed]");
  const taskBtns = document.querySelectorAll("[data-demo-task]");

  const PLAY_PATH = '<path d="M6.5 4.8L15.2 10L6.5 15.2V4.8Z" fill="currentColor"/>';
  const PAUSE_PATH = '<rect x="5.5" y="4.5" width="3.4" height="11" rx="1.2" fill="currentColor"/><rect x="11.1" y="4.5" width="3.4" height="11" rx="1.2" fill="currentColor"/>';

  function formatTime(totalSeconds) {
    const clamped = Math.max(0, Math.ceil(totalSeconds));
    const mins = Math.floor(clamped / 60);
    const secs = clamped % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function getTotalForPhase(phase) {
    return phase === "focus" ? FOCUS_SECONDS : BREAK_SECONDS;
  }

  function renderTimer() {
    const total = getTotalForPhase(state.phase);
    const progress = 1 - state.remaining / total;
    const offset = Math.min(RING_CIRCUMFERENCE, Math.max(0, progress * RING_CIRCUMFERENCE));

    if (ringEl) {
      ringEl.style.strokeDasharray = String(RING_CIRCUMFERENCE.toFixed(2));
      ringEl.style.strokeDashoffset = String(offset.toFixed(2));
    }

    if (displayEl) {
      displayEl.textContent = formatTime(state.remaining);
    }

    const task = demoTasks[state.selectedTaskIdx];
    if (activeTaskEl) {
      activeTaskEl.textContent =
        state.phase === "focus"
          ? `当前任务：${task.subject} · ${task.title}`
          : "护眼休息时间：起来喝口水、眺望窗外";
    }

    if (stageEl) {
      stageEl.setAttribute("data-phase", state.phase);
      const runState = state.running
        ? "running"
        : state.remaining < total
        ? "paused"
        : "idle";
      stageEl.setAttribute("data-state", runState);
    }

    if (badgeEl && subEl) {
      if (state.running) {
        badgeEl.textContent = state.phase === "focus" ? "专注倒数中" : "休息倒数中";
        subEl.textContent =
          state.speed > 1
            ? `已开启 ${state.speed}× 加速演示 · 随时可暂停`
            : state.phase === "focus"
            ? "专心写作业，到点自动提醒休息"
            : "放松眼睛和肩膀，准备下一项";
      } else if (state.remaining < total) {
        badgeEl.textContent = "已暂停";
        subEl.textContent = "点「继续」从当前时间接着倒数";
      } else {
        badgeEl.textContent = state.phase === "focus" ? "准备专注" : "准备休息";
        subEl.textContent = "点下方「开始」立即倒数";
      }
    }

    if (toggleBtn && btnLabel && btnIcon) {
      toggleBtn.classList.toggle("is-running", state.running);
      if (state.running) {
        btnLabel.textContent = "暂停";
        btnIcon.innerHTML = PAUSE_PATH;
      } else {
        btnLabel.textContent = state.remaining < total ? "继续" : "开始";
        btnIcon.innerHTML = PLAY_PATH;
      }
    }

    phaseBtns.forEach((btn) => {
      const isCurrent = btn.getAttribute("data-phase-btn") === state.phase;
      btn.classList.toggle("is-active", isCurrent);
      btn.setAttribute("aria-selected", String(isCurrent));
    });

    if (completedCountEl) {
      completedCountEl.textContent = String(state.completedCount);
    }

    if (syncDot && syncStatusText) {
      syncDot.classList.toggle("is-live", state.running);
      if (state.running && state.phase === "focus") {
        syncStatusText.textContent = `专注进行中：孩子正在写「${task.subject} · ${task.title}」，剩余 ${formatTime(state.remaining)}，无需打扰。`;
      } else if (state.running && state.phase === "break") {
        syncStatusText.textContent = `护眼休息中：刚完成一轮专注，孩子正在休息 5 分钟（剩 ${formatTime(state.remaining)}）。`;
      } else if (state.remaining < total) {
        syncStatusText.textContent = `计时已暂停：当前停在 ${formatTime(state.remaining)}，孩子回来点击「继续」即可。`;
      } else if (state.completedCount > 0 && state.phase === "break") {
        syncStatusText.textContent = `太棒了！「${task.subject} · ${task.title}」已自动打勾，可开始 5 分钟休息提醒。`;
      } else {
        syncStatusText.textContent = `等待开始：孩子已选中「${task.subject} · ${task.title}」，准备好就可以启动番茄钟。`;
      }
    }
  }

  function stopInterval() {
    if (state.timerId !== null) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function handlePhaseFinished() {
    stopInterval();
    state.running = false;

    if (state.phase === "focus") {
      state.completedCount += 1;
      const doneTaskBtn = taskBtns[state.selectedTaskIdx];
      if (doneTaskBtn) {
        doneTaskBtn.classList.add("is-completed");
      }
      state.phase = "break";
      state.remaining = BREAK_SECONDS;
      renderTimer();
      // 自动进入 5 分钟休息倒计时，让加速演示体验顺畅连贯
      startTimer();
    } else {
      state.phase = "focus";
      state.remaining = FOCUS_SECONDS;
      renderTimer();
    }
  }

  function startTimer() {
    if (state.running) return;
    state.running = true;
    const tickMs = state.speed > 1 ? 200 : 1000;
    const stepSeconds = state.speed > 1 ? state.speed * (tickMs / 1000) : 1;

    renderTimer();
    state.timerId = setInterval(() => {
      state.remaining = Math.max(0, state.remaining - stepSeconds);
      if (state.remaining <= 0) {
        handlePhaseFinished();
      } else {
        renderTimer();
      }
    }, tickMs);
  }

  function pauseTimer() {
    stopInterval();
    state.running = false;
    renderTimer();
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (state.running) {
        pauseTimer();
      } else {
        startTimer();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      stopInterval();
      state.running = false;
      state.remaining = getTotalForPhase(state.phase);
      renderTimer();
    });
  }

  phaseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextPhase = btn.getAttribute("data-phase-btn");
      if (!nextPhase || nextPhase === state.phase) return;
      stopInterval();
      state.running = false;
      state.phase = nextPhase;
      state.remaining = getTotalForPhase(nextPhase);
      renderTimer();
    });
  });

  speedBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextSpeed = Number(btn.getAttribute("data-speed") || 1);
      if (nextSpeed === state.speed) return;
      state.speed = nextSpeed;
      speedBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      if (speedHint) {
        speedHint.textContent =
          nextSpeed > 1
            ? "已切至 60× 加速演示：每 1 秒相当于 1 分钟，约 25 秒即可看完整轮专注并自动切到休息。"
            : "真实 1 秒倒数 1 秒；切到「60× 加速演示」约 25 秒即可看完整轮专注与休息提醒。";
      }
      if (state.running) {
        stopInterval();
        state.running = false;
        startTimer();
      } else {
        renderTimer();
      }
    });
  });

  taskBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-demo-task") || 0);
      state.selectedTaskIdx = idx;
      taskBtns.forEach((b, i) => {
        const selected = i === idx;
        b.classList.toggle("is-selected", selected);
        b.setAttribute("aria-pressed", String(selected));
      });
      if (state.phase !== "focus") {
        stopInterval();
        state.running = false;
        state.phase = "focus";
        state.remaining = FOCUS_SECONDS;
      }
      renderTimer();
    });
  });

  renderTimer();

  /* =========================================================
     3. FAQ 手风琴展开 / 收起
     ========================================================= */
  const faqTriggers = document.querySelectorAll(".faq-trigger");
  faqTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".faq-item");
      if (!item) return;
      const isOpen = item.classList.contains("is-open");
      item.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* =========================================================
     4. 下载 App 弹窗
     ========================================================= */
  const modal = document.getElementById("download-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const platIos = document.getElementById("plat-ios");
  const platAndroid = document.getElementById("plat-android");
  const downloadTriggers = document.querySelectorAll("[data-open-download]");

  function openModal(platform) {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    if (platIos) platIos.classList.toggle("is-highlighted", platform === "ios");
    if (platAndroid) platAndroid.classList.toggle("is-highlighted", platform === "android");
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  downloadTriggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal(btn.getAttribute("data-open-download") || "");
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) {
      closeModal();
    }
  });
})();
