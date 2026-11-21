/* ==========================================================================
   工位 (Gongwei) — Interactive Demo Script, Split Menus, Waitlist & Epilogue
   Pure vanilla JS, zero dependencies, runs directly from file://
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Mobile Navigation Toggle
     ------------------------------------------------------------------------ */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = !mobileNav.hidden;
      mobileNav.hidden = isOpen;
      mobileMenuBtn.setAttribute("aria-expanded", String(!isOpen));
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.hidden = true;
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Split-Pill Dropdown Menus (Hero & Closing CTA)
     ------------------------------------------------------------------------ */
  const splitMenus = document.querySelectorAll("[data-split-menu]");

  function closeAllSplitMenus() {
    splitMenus.forEach((menu) => {
      menu.classList.remove("is-open");
      const toggle = menu.querySelector(".split-pill-toggle");
      const dropdown = menu.querySelector(".split-dropdown");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      if (dropdown) dropdown.hidden = true;
    });
  }

  splitMenus.forEach((menu) => {
    const toggle = menu.querySelector(".split-pill-toggle");
    const dropdown = menu.querySelector(".split-dropdown");
    if (!toggle || !dropdown) return;

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = dropdown.hidden;
      closeAllSplitMenus();
      if (willOpen) {
        menu.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        dropdown.hidden = false;
      }
    });
  });

  document.addEventListener("click", closeAllSplitMenus);

  /* ------------------------------------------------------------------------
     3. Interactive Multi-Bot Demo Engine
        States: idle (未开始) | running (进行中) | done (完成)
     ------------------------------------------------------------------------ */
  const SCENARIOS = {
    release: {
      channel: "#版本发布协同群",
      preview:
        "预设指令：「@全员 准备 v2.4 上线：梳理竞品动态、跑通回归测试、确认预发指标并起草更新公告，外发前停下来让我审批。」",
      steps: [
        {
          delay: 350,
          stage: 1,
          type: "user",
          author: "你",
          time: "14:10",
          body: '<span class="mention">@全员</span> 准备 v2.4 上线：梳理竞品动态、跑通回归测试、确认预发指标并起草更新公告，外发前停下来让我审批。',
          bots: {
            research: { status: "working", label: "工作中", note: "接单：比对竞品更新" },
            code: { status: "working", label: "工作中", note: "接单：执行回归测试" },
            monitor: { status: "working", label: "工作中", note: "接单：核查预发指标" },
            writer: { status: "idle", label: "空闲", note: "等待上游交接材料" },
            schedule: { status: "working", label: "工作中", note: "接单：预留发布复盘" }
          }
        },
        {
          delay: 1400,
          stage: 2,
          type: "bot",
          botKey: "research",
          avatarClass: "av-research",
          avatarChar: "研",
          author: "调研 Bot",
          chip: "已交接给 写作 Bot",
          chipClass: "",
          time: "14:11",
          body: '已比对 5 份竞品近两周变更，提炼出 3 条核心卖点差异并生成 <code>v2.4-highlights.md</code>，已自动交接给 <span class="mention">@写作 Bot</span>。',
          bots: {
            research: { status: "done", label: "已完成", note: "差异摘要已交接" },
            writer: { status: "working", label: "工作中", note: "收到调研摘要，起草中" }
          }
        },
        {
          delay: 1450,
          stage: 2,
          type: "bot",
          botKey: "code",
          avatarClass: "av-code",
          avatarChar: "码",
          author: "代码 Bot",
          chip: "回归 48/48 通过",
          chipClass: "chip-working",
          time: "14:12",
          body: '<code>release/2.4</code> 全量回归已通过（48/48），无破坏性接口变更。已将版本号与 4 条用户可见更新交给 <span class="mention">@写作 Bot</span>。',
          bots: {
            code: { status: "done", label: "已完成", note: "48/48 回归全部通过" }
          }
        },
        {
          delay: 1150,
          stage: 2,
          type: "bot",
          botKey: "monitor",
          avatarClass: "av-monitor",
          avatarChar: "盯",
          author: "盯盘 Bot",
          chip: "指标正常",
          chipClass: "chip-working",
          time: "14:12",
          body: '预发集群过去 2 小时错误率 <code>0.00%</code>，接口 P95 延迟 <code>82ms</code>，满足灰度放量条件。',
          bots: {
            monitor: { status: "done", label: "已完成", note: "预发基线正常" },
            schedule: { status: "done", label: "已完成", note: "已锁定 16:00 发布复盘" }
          }
        },
        {
          delay: 1450,
          stage: 3,
          type: "approval",
          botKey: "writer",
          avatarClass: "av-writer",
          avatarChar: "写",
          author: "写作 Bot",
          chip: "等你审批",
          chipClass: "chip-approval",
          time: "14:13",
          body: '已综合调研要点与代码变更起草《工位 v2.4 更新公告》（380 字），日程 Bot 也已留好 16:00 复盘会。<strong>推送至 328 位内测订阅者前等待你审批：</strong>',
          approvalLabel: "批准发布公告",
          bots: {
            writer: { status: "approval", label: "等你审批", note: "外发公告已拦截，待确认" }
          }
        },
        {
          delay: 1100,
          stage: 4,
          type: "summary",
          botKey: "writer",
          avatarClass: "av-archive",
          avatarChar: "汇",
          author: "工位交付汇总",
          chip: "已归档 #AP-412",
          chipClass: "chip-working",
          time: "14:14",
          body: '审批已通过。v2.4 更新公告已发送至文档库与订阅列表，回归报告、竞品差异表与 16:00 复盘日程已打包归档。',
          bots: {
            writer: { status: "done", label: "已完成", note: "公告已发布并归档" }
          }
        }
      ]
    },
    incident: {
      channel: "#晚间告警处置群",
      preview:
        "预设指令：「@全员 支付回调延迟突然升高，先查明根因和影响范围、起草修复补丁和用户说明，合并补丁前给我审批。」",
      steps: [
        {
          delay: 350,
          stage: 1,
          type: "user",
          author: "你",
          time: "21:18",
          body: '<span class="mention">@全员</span> 支付回调延迟突然升高，先查明根因和影响范围、起草修复补丁和用户说明，合并补丁前给我审批。',
          bots: {
            monitor: { status: "working", label: "工作中", note: "接单：拉取延迟与日志" },
            code: { status: "working", label: "工作中", note: "接单：定位最近提交" },
            research: { status: "working", label: "工作中", note: "接单：核查上游状态页" },
            writer: { status: "idle", label: "空闲", note: "等待根因定论" },
            schedule: { status: "working", label: "工作中", note: "接单：预排明早复盘" }
          }
        },
        {
          delay: 1350,
          stage: 2,
          type: "bot",
          botKey: "monitor",
          avatarClass: "av-monitor",
          avatarChar: "盯",
          author: "盯盘 Bot",
          chip: "已交接给 代码 Bot",
          chipClass: "",
          time: "21:19",
          body: '定位到 <code>webhook-worker</code> 连接池在 21:12 达到上限，受影响请求占比 <code>1.8%</code>，无资金丢失。堆栈快照已交给 <span class="mention">@代码 Bot</span>。',
          bots: {
            monitor: { status: "done", label: "已完成", note: "已锁定连接池瓶颈" },
            research: { status: "done", label: "已完成", note: "确认外部网关无故障" }
          }
        },
        {
          delay: 1500,
          stage: 2,
          type: "bot",
          botKey: "code",
          avatarClass: "av-code",
          avatarChar: "码",
          author: "代码 Bot",
          chip: "补丁已通过沙盒测试",
          chipClass: "chip-working",
          time: "21:20",
          body: '已起草热修补丁 <code>fix/webhook-pool-timeout</code>（释放空闲连接 + 限流回退），沙盒压测 P95 从 1.9s 降至 <code>94ms</code>。同时通知 <span class="mention">@写作 Bot</span> 备好说明。',
          bots: {
            code: { status: "approval", label: "等你审批", note: "热修补丁等待合并审批" },
            writer: { status: "working", label: "工作中", note: "起草状态页简短说明" }
          }
        },
        {
          delay: 1350,
          stage: 3,
          type: "approval",
          botKey: "code",
          avatarClass: "av-code",
          avatarChar: "码",
          author: "代码 Bot",
          chip: "等你审批",
          chipClass: "chip-approval",
          time: "21:21",
          body: '热修补丁与状态页通告已备齐，日程 Bot 已排好明早 10:00 根因复盘。<strong>涉及合并至生产分支并发布公告，请确认放行：</strong>',
          approvalLabel: "批准合并热修",
          bots: {
            writer: { status: "done", label: "已完成", note: "状态说明已就绪" },
            schedule: { status: "done", label: "已完成", note: "已约明早 10:00 复盘" }
          }
        },
        {
          delay: 1100,
          stage: 4,
          type: "summary",
          botKey: "code",
          avatarClass: "av-archive",
          avatarChar: "汇",
          author: "工位交付汇总",
          chip: "已归档 #AP-413",
          chipClass: "chip-working",
          time: "21:22",
          body: '热修补丁已合入并自动滚动发布，盯盘 Bot 确认回调 P95 恢复至 88ms。完整故障时间线与明早复盘议程已归档。',
          bots: {
            code: { status: "done", label: "已完成", note: "补丁已合入并验证" }
          }
        }
      ]
    }
  };

  let activeScenarioKey = "release";
  let demoState = "idle"; // idle | running | done
  let isPaused = false;
  let stepCursor = 0;
  let stepTimer = null;
  let autoApproveTimer = null;
  let clockInterval = null;
  let elapsedSec = 0;
  let waitingForApproval = false;

  const demoFeed = document.getElementById("demoFeed");
  const demoEmpty = document.getElementById("demoEmpty");
  const demoEmptyPreview = document.getElementById("demoEmptyPreview");
  const demoChannelTitle = document.getElementById("demoChannelTitle");
  const demoFeedHint = document.getElementById("demoFeedHint");
  const demoStateBadge = document.getElementById("demoStateBadge");
  const demoStateText = document.getElementById("demoStateText");
  const demoElapsed = document.getElementById("demoElapsed");
  const dispatchTaskBtn = document.getElementById("dispatchTaskBtn");
  const dispatchBtnLabel = document.getElementById("dispatchBtnLabel");
  const demoInlineStartBtn = document.getElementById("demoInlineStartBtn");
  const demoPauseBtn = document.getElementById("demoPauseBtn");
  const demoResetBtn = document.getElementById("demoResetBtn");
  const scenarioTabs = document.querySelectorAll(".scenario-tab");
  const stepperItems = document.querySelectorAll(".stepper-item");

  function clearTimers() {
    if (stepTimer) {
      clearTimeout(stepTimer);
      stepTimer = null;
    }
    if (autoApproveTimer) {
      clearTimeout(autoApproveTimer);
      autoApproveTimer = null;
    }
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  }

  function formatClock(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function setDemoState(nextState) {
    demoState = nextState;
    demoStateBadge.dataset.state = nextState;
    if (nextState === "idle") {
      demoStateText.textContent = "未开始";
      dispatchBtnLabel.textContent = "派一个任务";
      dispatchTaskBtn.disabled = false;
      demoPauseBtn.hidden = true;
      demoResetBtn.hidden = true;
      demoFeedHint.textContent = "准备就绪 · 点击「派一个任务」开始";
    } else if (nextState === "running") {
      demoStateText.textContent = "进行中";
      dispatchBtnLabel.textContent = "任务执行中…";
      dispatchTaskBtn.disabled = true;
      demoPauseBtn.hidden = false;
      demoResetBtn.hidden = false;
      demoFeedHint.textContent = "多个 Bot 正在并行协作与交接…";
    } else if (nextState === "done") {
      demoStateText.textContent = "完成";
      dispatchBtnLabel.textContent = "再派一个任务";
      dispatchTaskBtn.disabled = false;
      demoPauseBtn.hidden = true;
      demoResetBtn.hidden = false;
      demoFeedHint.textContent = "全部交付已归档 · 可切换场景或重新演示";
    }
  }

  function updateStepper(activeStage) {
    stepperItems.forEach((el) => {
      const n = Number(el.dataset.step);
      el.classList.remove("is-active", "is-done");
      if (activeStage === 0) return;
      if (n < activeStage || (activeStage === 4 && demoState === "done")) {
        el.classList.add("is-done");
      } else if (n === activeStage) {
        el.classList.add("is-active");
      }
    });
  }

  function resetBotStatuses() {
    document.querySelectorAll(".demo-bot-row").forEach((row) => {
      row.classList.remove("state-working", "state-approval", "state-done");
      const note = row.querySelector(".demo-bot-note");
      const pill = row.querySelector(".status-pill");
      if (note) note.textContent = "待命中";
      if (pill) {
        pill.className = "status-pill st-idle";
        pill.textContent = "空闲";
      }
    });
  }

  function applyBotUpdates(updates) {
    if (!updates) return;
    Object.keys(updates).forEach((key) => {
      const row = document.querySelector(`.demo-bot-row[data-bot="${key}"]`);
      if (!row) return;
      const cfg = updates[key];
      row.classList.remove("state-working", "state-approval", "state-done");
      if (cfg.status !== "idle") {
        row.classList.add(`state-${cfg.status}`);
      }
      const note = row.querySelector(".demo-bot-note");
      const pill = row.querySelector(".status-pill");
      if (note) note.textContent = cfg.note;
      if (pill) {
        pill.className = `status-pill st-${cfg.status}`;
        pill.textContent = cfg.label;
      }
    });
  }

  function renderMessage(step) {
    const el = document.createElement("div");
    el.className = "demo-msg";
    if (step.type === "user") el.classList.add("is-user");
    if (step.type === "approval") el.classList.add("is-approval");
    if (step.type === "summary") el.classList.add("is-summary");

    const avatarHtml =
      step.type === "user"
        ? ""
        : `<span class="bot-avatar-xs ${step.avatarClass}" aria-hidden="true">${step.avatarChar}</span>`;

    const chipHtml = step.chip
      ? `<span class="ws-chip ${step.chipClass || ""}">${step.chip}</span>`
      : "";

    el.innerHTML = `
      <div class="ws-msg-head">
        ${avatarHtml}
        <span class="ws-author">${step.author}</span>
        ${chipHtml}
        <span class="ws-time tabular">${step.time}</span>
      </div>
      <p class="ws-msg-body">${step.body}</p>
    `;

    if (step.type === "approval") {
      const actions = document.createElement("div");
      actions.className = "demo-approval-actions";

      const hint = document.createElement("span");
      hint.className = "demo-auto-hint tabular";
      hint.textContent = "点击立即审批，或 3 秒后自动演示批准";

      const approveBtn = document.createElement("button");
      approveBtn.type = "button";
      approveBtn.className = "demo-approve-btn";
      approveBtn.textContent = step.approvalLabel || "审批通过";

      const completeApproval = (byUser) => {
        if (!waitingForApproval) return;
        waitingForApproval = false;
        if (autoApproveTimer) {
          clearTimeout(autoApproveTimer);
          autoApproveTimer = null;
        }
        approveBtn.disabled = true;
        approveBtn.textContent = byUser ? "已批准执行 ✓" : "已自动演示批准 ✓";
        hint.textContent = "审批记录已写入留痕日志";
        demoFeedHint.textContent = "审批已放行 · 正在生成最终交付汇总…";
        scheduleNextStep();
      };

      approveBtn.addEventListener("click", () => completeApproval(true));

      actions.appendChild(hint);
      actions.appendChild(approveBtn);
      el.appendChild(actions);

      waitingForApproval = true;
      demoFeedHint.textContent = "关键一步已拦截 · 等待你点击审批";
      autoApproveTimer = setTimeout(() => {
        if (!isPaused) completeApproval(false);
      }, 3200);
    }

    demoFeed.appendChild(el);
    demoFeed.scrollTop = demoFeed.scrollHeight;
  }

  function scheduleNextStep() {
    const scenario = SCENARIOS[activeScenarioKey];
    if (stepCursor >= scenario.steps.length) {
      clearTimers();
      setDemoState("done");
      updateStepper(4);
      return;
    }

    const step = scenario.steps[stepCursor];
    stepTimer = setTimeout(() => {
      if (isPaused) return;
      stepCursor += 1;
      updateStepper(step.stage);
      applyBotUpdates(step.bots);
      renderMessage(step);

      if (step.type !== "approval") {
        if (stepCursor >= scenario.steps.length) {
          clearTimers();
          setDemoState("done");
          updateStepper(4);
        } else {
          scheduleNextStep();
        }
      }
    }, step.delay);
  }

  function resetDemo() {
    clearTimers();
    isPaused = false;
    waitingForApproval = false;
    stepCursor = 0;
    elapsedSec = 0;
    demoElapsed.textContent = "00:00";
    demoPauseBtn.textContent = "暂停";
    resetBotStatuses();
    updateStepper(0);
    setDemoState("idle");

    const scenario = SCENARIOS[activeScenarioKey];
    demoChannelTitle.textContent = scenario.channel;
    demoEmptyPreview.textContent = scenario.preview;

    demoFeed.innerHTML = "";
    demoFeed.appendChild(demoEmpty);
    demoEmpty.hidden = false;
  }

  function startDemo() {
    resetDemo();
    demoEmpty.hidden = true;
    demoFeed.innerHTML = "";
    setDemoState("running");

    clockInterval = setInterval(() => {
      if (!isPaused) {
        elapsedSec += 1;
        demoElapsed.textContent = formatClock(elapsedSec);
      }
    }, 1000);

    scheduleNextStep();
  }

  dispatchTaskBtn.addEventListener("click", startDemo);
  if (demoInlineStartBtn) {
    demoInlineStartBtn.addEventListener("click", startDemo);
  }

  demoPauseBtn.addEventListener("click", () => {
    if (demoState !== "running") return;
    isPaused = !isPaused;
    if (isPaused) {
      if (stepTimer) clearTimeout(stepTimer);
      if (autoApproveTimer) clearTimeout(autoApproveTimer);
      demoPauseBtn.textContent = "继续";
      demoFeedHint.textContent = "演示已暂停";
    } else {
      demoPauseBtn.textContent = "暂停";
      if (waitingForApproval) {
        demoFeedHint.textContent = "关键一步等待审批（点击消息中按钮或等待自动继续）";
        const activeBtn = demoFeed.querySelector(".demo-approve-btn:not(:disabled)");
        autoApproveTimer = setTimeout(() => {
          if (activeBtn && !isPaused) activeBtn.click();
        }, 2000);
      } else {
        demoFeedHint.textContent = "多个 Bot 正在并行协作与交接…";
        scheduleNextStep();
      }
    }
  });

  demoResetBtn.addEventListener("click", resetDemo);

  scenarioTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.scenario;
      if (!SCENARIOS[key]) return;
      activeScenarioKey = key;
      scenarioTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      resetDemo();
    });
  });

  // Jump-to-demo buttons from Hero & Closing Split-Pills
  document.querySelectorAll("[data-jump-demo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const scenarioKey = btn.dataset.jumpDemo;
      closeAllSplitMenus();
      if (SCENARIOS[scenarioKey]) {
        activeScenarioKey = scenarioKey;
        scenarioTabs.forEach((t) => {
          const active = t.dataset.scenario === scenarioKey;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
        });
      }
      const demoSec = document.getElementById("demo");
      if (demoSec) {
        demoSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setTimeout(startDemo, 320);
    });
  });

  /* ------------------------------------------------------------------------
     4. Waitlist Modal (申请内测)
     ------------------------------------------------------------------------ */
  const waitlistModal = document.getElementById("waitlistModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalDoneBtn = document.getElementById("modalDoneBtn");
  const waitlistForm = document.getElementById("waitlistForm");
  const waitlistSuccess = document.getElementById("waitlistSuccess");
  const waitlistEmail = document.getElementById("waitlistEmail");
  const waitlistPlan = document.getElementById("waitlistPlan");
  const assignedEmail = document.getElementById("assignedEmail");
  const assignedQueueNum = document.getElementById("assignedQueueNum");
  const headerQueueCount = document.getElementById("headerQueueCount");
  let queueCount = 1428;

  function openWaitlistModal(preselectPlan) {
    if (!waitlistModal) return;
    if (preselectPlan && waitlistPlan) {
      waitlistPlan.value = preselectPlan;
    }
    waitlistForm.hidden = false;
    waitlistSuccess.hidden = true;
    waitlistModal.hidden = false;
    setTimeout(() => waitlistEmail && waitlistEmail.focus(), 40);
  }

  function closeWaitlistModal() {
    if (waitlistModal) waitlistModal.hidden = true;
  }

  document.querySelectorAll("[data-open-waitlist]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openWaitlistModal(trigger.dataset.openWaitlist || "");
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeWaitlistModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener("click", closeWaitlistModal);

  if (waitlistModal) {
    waitlistModal.addEventListener("click", (e) => {
      if (e.target === waitlistModal) closeWaitlistModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeWaitlistModal();
      closeAllSplitMenus();
    }
  });

  if (waitlistForm) {
    waitlistForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = waitlistEmail.value.trim();
      if (!email) return;
      queueCount += 1;
      assignedQueueNum.textContent = `#${queueCount}`;
      assignedEmail.textContent = email;
      if (headerQueueCount) {
        headerQueueCount.textContent = queueCount.toLocaleString("en-US");
      }
      waitlistForm.hidden = true;
      waitlistSuccess.hidden = false;
    });
  }

  /* ------------------------------------------------------------------------
     5. Ambient Footer Epilogue Interaction
     ------------------------------------------------------------------------ */
  const epilogueSeats = document.querySelectorAll(".seat-chip");
  const epilogueReadout = document.getElementById("epilogueReadout");

  epilogueSeats.forEach((chip) => {
    const showMsg = () => {
      epilogueSeats.forEach((c) => c.classList.remove("is-selected"));
      chip.classList.add("is-selected");
      if (epilogueReadout) {
        epilogueReadout.textContent = chip.dataset.seatMsg || "";
      }
    };
    chip.addEventListener("mouseenter", showMsg);
    chip.addEventListener("focus", showMsg);
    chip.addEventListener("click", showMsg);
  });
})();
