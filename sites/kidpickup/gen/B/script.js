/* ==========================================================================
   作业到手 — Interactive Behaviors
   1. Sticky nav brand reveal + mobile menu toggle
   2. Interactive Pomodoro Timer (Start/Pause, 1x / 60x speed, task switching,
      focus <-> 5-minute break transition, finish checkoff, live parent sync)
   3. Accessible FAQ accordion (expand/collapse)
   4. Gentle inline download feedback (no intrusive pop-ups)
   ========================================================================== */

(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Navigation: reveal brand mark after hero scrolls out & mobile menu
     ------------------------------------------------------------------------ */
  const siteNav = document.getElementById('siteNav');
  const heroSection = document.getElementById('hero');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const updateNavState = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (siteNav) {
      siteNav.classList.toggle('is-scrolled', scrollY > 12);
      const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight * 0.45 : 320;
      siteNav.classList.toggle('show-brand', scrollY > heroBottom);
    }
  };

  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState();

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.hidden = isOpen;
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Interactive Pomodoro Demo
     ------------------------------------------------------------------------ */
  const RING_CIRCUMFERENCE = 2 * Math.PI * 94; // 590.62

  const state = {
    subject: '数学',
    subjectColor: 'sky',
    taskTitle: '口算题卡第 18 页',
    focusMinutes: 25,
    breakMinutes: 5,
    phase: 'focus', // 'focus' | 'break'
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    isRunning: false,
    speed: 1, // 1 = real time (1 sec/sec), 60 = accelerated demo (60x)
    timerId: null,
    completed: false
  };

  const timerDisplay = document.getElementById('timerDisplay');
  const timerHint = document.getElementById('timerHint');
  const ringProgress = document.getElementById('ringProgress');
  const phasePill = document.getElementById('phasePill');
  const phaseSwitchBtn = document.getElementById('phaseSwitchBtn');
  const startPauseBtn = document.getElementById('timerStartPause');
  const startPauseLabel = document.getElementById('startPauseLabel');
  const startPauseIcon = document.getElementById('startPauseIcon');
  const resetBtn = document.getElementById('timerReset');
  const completeBtn = document.getElementById('timerComplete');
  const demoSubjectTag = document.getElementById('demoSubjectTag');
  const demoTaskName = document.getElementById('demoTaskName');
  const demoBuddy = document.getElementById('demoBuddy');
  const parentSyncText = document.getElementById('parentSyncText');
  const syncDot = document.getElementById('syncDot');

  const formatTime = (sec) => {
    const safe = Math.max(0, Math.floor(sec));
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const renderTimer = () => {
    if (!timerDisplay || !ringProgress) return;

    timerDisplay.textContent = formatTime(state.remainingSeconds);

    const progress = state.totalSeconds > 0
      ? (state.totalSeconds - state.remainingSeconds) / state.totalSeconds
      : 0;
    const offset = RING_CIRCUMFERENCE * progress;
    ringProgress.style.strokeDasharray = `${RING_CIRCUMFERENCE.toFixed(2)}`;
    ringProgress.style.strokeDashoffset = `${offset.toFixed(2)}`;
    ringProgress.classList.toggle('is-break', state.phase === 'break');

    // Subject & task title
    if (demoSubjectTag) {
      demoSubjectTag.textContent = state.subject;
      demoSubjectTag.className = `subject-tag tag-${state.subjectColor}`;
    }
    if (demoTaskName) {
      demoTaskName.textContent = state.taskTitle;
    }

    // Buddy animation
    if (demoBuddy) {
      demoBuddy.classList.toggle('is-running', state.isRunning);
    }

    // Start / Pause button visuals
    if (startPauseLabel && startPauseIcon) {
      if (state.isRunning) {
        startPauseLabel.textContent = '暂停';
        startPauseIcon.innerHTML = '<rect x="6" y="4" width="4.5" height="16" rx="1.2"/><rect x="13.5" y="4" width="4.5" height="16" rx="1.2"/>';
      } else {
        startPauseLabel.textContent = state.remainingSeconds < state.totalSeconds && state.remainingSeconds > 0
          ? '继续专注'
          : (state.phase === 'break' ? '开始休息' : '开始专注');
        startPauseIcon.innerHTML = '<polygon points="6 4 20 12 6 20 6 4"/>';
      }
    }

    // Phase pill, switch link, hints & parent sync
    if (phasePill && phaseSwitchBtn && timerHint && parentSyncText && syncDot) {
      syncDot.classList.remove('is-focus', 'is-break');

      if (state.completed) {
        phasePill.textContent = '本项已完成 ✓';
        phasePill.className = 'phase-pill phase-break';
        phaseSwitchBtn.textContent = '再开一个番茄钟';
        timerHint.textContent = '太棒了！打勾进度已同步给家长';
        syncDot.classList.add('is-break');
        parentSyncText.textContent = `已完成 ✓ · 乐乐搞定了「${state.taskTitle}」`;
      } else if (state.phase === 'break') {
        phasePill.textContent = state.isRunning ? '休息中 · 5 分钟' : '休息时间 · 5 分钟';
        phasePill.className = 'phase-pill phase-break';
        phaseSwitchBtn.textContent = '回到专注阶段';
        timerHint.textContent = state.isRunning
          ? '站起来喝口水，看看窗外放松眼睛吧'
          : '专注结束啦，歇 5 分钟再接着写';
        syncDot.classList.add('is-break');
        parentSyncText.textContent = state.isRunning
          ? `休息 5 分钟中 · 刚完成一段「${state.subject}」专注`
          : '已进入 5 分钟休息提醒';
      } else {
        const isPausedMidway = !state.isRunning && state.remainingSeconds < state.totalSeconds;
        phasePill.textContent = state.isRunning
          ? `专注中 · ${state.focusMinutes} 分钟`
          : (isPausedMidway ? '已暂停' : `专注阶段 · ${state.focusMinutes} 分钟`);
        phasePill.className = `phase-pill ${isPausedMidway ? 'phase-paused' : 'phase-focus'}`;
        phaseSwitchBtn.textContent = '切到休息 5 分钟';

        if (state.isRunning) {
          timerHint.textContent = state.speed > 1
            ? '加速演示中：马上看到休息提醒切换'
            : '慢慢来，这一项写完就能歇会儿啦';
          syncDot.classList.add('is-focus');
          parentSyncText.textContent = `专注中（请勿打扰）· 正在写「${state.taskTitle}」`;
        } else if (isPausedMidway) {
          timerHint.textContent = '已暂停，准备好随时点继续';
          parentSyncText.textContent = `已暂停 · 「${state.taskTitle}」还剩 ${formatTime(state.remainingSeconds)}`;
        } else {
          timerHint.textContent = '准备好就可以点开始啦';
          parentSyncText.textContent = `待开始 · 乐乐准备写「${state.taskTitle}」`;
        }
      }
    }
  };

  const stopTimerInterval = () => {
    if (state.timerId !== null) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  };

  const startTimerInterval = () => {
    stopTimerInterval();
    const tickMs = state.speed > 1 ? 100 : 1000;
    const stepSeconds = state.speed > 1 ? 6 : 1; // 60x: 6 seconds every 100ms = 60 sec/real sec

    state.timerId = setInterval(() => {
      state.remainingSeconds -= stepSeconds;

      if (state.remainingSeconds <= 0) {
        if (state.phase === 'focus') {
          // Automatically transition to 5-minute break!
          state.phase = 'break';
          state.totalSeconds = state.breakMinutes * 60;
          state.remainingSeconds = state.breakMinutes * 60;
        } else {
          // Break finished; stop cleanly back to focus ready state
          stopTimerInterval();
          state.isRunning = false;
          state.phase = 'focus';
          state.totalSeconds = state.focusMinutes * 60;
          state.remainingSeconds = state.focusMinutes * 60;
        }
      }
      renderTimer();
    }, tickMs);
  };

  if (startPauseBtn) {
    startPauseBtn.addEventListener('click', () => {
      if (state.completed) {
        state.completed = false;
        state.phase = 'focus';
        state.totalSeconds = state.focusMinutes * 60;
        state.remainingSeconds = state.focusMinutes * 60;
      }

      if (state.isRunning) {
        state.isRunning = false;
        stopTimerInterval();
      } else {
        state.isRunning = true;
        // Immediate visual tick feel on first second when accelerated, or crisp start
        startTimerInterval();
      }
      renderTimer();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      stopTimerInterval();
      state.isRunning = false;
      state.completed = false;
      state.totalSeconds = (state.phase === 'break' ? state.breakMinutes : state.focusMinutes) * 60;
      state.remainingSeconds = state.totalSeconds;
      renderTimer();
    });
  }

  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      stopTimerInterval();
      state.isRunning = false;
      state.completed = true;
      state.remainingSeconds = 0;
      renderTimer();
    });
  }

  if (phaseSwitchBtn) {
    phaseSwitchBtn.addEventListener('click', () => {
      stopTimerInterval();
      state.isRunning = false;
      state.completed = false;
      if (state.phase === 'focus') {
        state.phase = 'break';
        state.totalSeconds = state.breakMinutes * 60;
      } else {
        state.phase = 'focus';
        state.totalSeconds = state.focusMinutes * 60;
      }
      state.remainingSeconds = state.totalSeconds;
      renderTimer();
    });
  }

  // Task picker buttons
  const taskPicker = document.getElementById('demoTaskPicker');
  if (taskPicker) {
    const pickerCards = taskPicker.querySelectorAll('.picker-card');
    pickerCards.forEach((card) => {
      card.addEventListener('click', () => {
        pickerCards.forEach((c) => {
          c.classList.remove('is-selected');
          c.setAttribute('aria-checked', 'false');
        });
        card.classList.add('is-selected');
        card.setAttribute('aria-checked', 'true');

        stopTimerInterval();
        state.isRunning = false;
        state.completed = false;
        state.phase = 'focus';
        state.subject = card.dataset.subject || '数学';
        state.subjectColor = card.dataset.color || 'sky';
        state.taskTitle = card.dataset.title || '口算题卡第 18 页';
        state.focusMinutes = parseInt(card.dataset.minutes || '25', 10);
        state.totalSeconds = state.focusMinutes * 60;
        state.remainingSeconds = state.totalSeconds;
        renderTimer();
      });
    });
  }

  // Speed toggle buttons
  const speedToggle = document.getElementById('speedToggle');
  if (speedToggle) {
    const speedBtns = speedToggle.querySelectorAll('.speed-pill');
    speedBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        speedBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.speed = parseInt(btn.dataset.speed || '1', 10);
        if (state.isRunning) {
          startTimerInterval();
        }
        renderTimer();
      });
    });
  }

  renderTimer();

  /* ------------------------------------------------------------------------
     3. FAQ Accordion (Accessible Expand / Collapse)
     ------------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  });

  /* ------------------------------------------------------------------------
     4. Gentle Inline Download Feedback
     ------------------------------------------------------------------------ */
  const downloadFeedback = document.getElementById('downloadFeedback');
  document.querySelectorAll('.download-trigger').forEach((el) => {
    el.addEventListener('click', (e) => {
      const platform = el.dataset.platform || '客户端';
      if (el.tagName === 'BUTTON') {
        e.preventDefault();
      }
      if (downloadFeedback) {
        downloadFeedback.textContent = `已选择「${platform}」— 当前为官网演示版，正式版上架后点击即可直达安装。`;
      }
    });
  });
})();
