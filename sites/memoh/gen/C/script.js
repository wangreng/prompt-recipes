(function () {
  'use strict';

  // Bot 基础元数据（与页面内联 SVG 保持一致，纯本地无外部图）
  const BOTS = {
    research: {
      name: '调研 Bot',
      avatarClass: 'av-research',
      svg: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none"><circle cx="11" cy="11" r="5.5" stroke="currentColor" stroke-width="2"/><path d="m15.5 15.5 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    monitor: {
      name: '盯盘 Bot',
      avatarClass: 'av-monitor',
      svg: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M3 13h4l2.5-6 4 10 2.5-4H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    code: {
      name: '代码 Bot',
      avatarClass: 'av-code',
      svg: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="m9 8-4 4 4 4m6-8 4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    writing: {
      name: '写作 Bot',
      avatarClass: 'av-writing',
      svg: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M5 19h4l9.5-9.5-4-4L5 15v4Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>'
    },
    schedule: {
      name: '日程 Bot',
      avatarClass: 'av-schedule',
      svg: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none"><rect x="4" y="5" width="16" height="15" rx="3" stroke="currentColor" stroke-width="1.9"/><path d="M8 3v4m8-4v4M4 10h16" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>'
    },
    ops: {
      name: '复盘 Bot',
      avatarClass: 'av-ops',
      svg: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none"><rect x="5" y="4" width="14" height="16" rx="2.5" stroke="currentColor" stroke-width="1.9"/><path d="m8.5 10.5 1.6 1.6 3-3.1M8.5 15.5h7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    }
  };

  // 两套可交互脚本任务
  const SCENARIOS = {
    launch: {
      previewPrompt: '“帮我追踪竞品 A 本周新版本，整理核心差异写成周报草稿，并约产品与研发明天下午开半小时评审会。”',
      routeLabel: ['调研 Bot', '日程 Bot', '写作 Bot（审批）', '复盘 Bot 交付'],
      userMessage: '帮我追踪竞品 A 本周新版本，整理核心差异写成周报草稿，并约产品与研发明天下午开半小时评审会。',
      steps: [
        {
          delay: 750,
          typing: '调研 Bot 正在抓取竞品 A 更新日志与价格页…',
          botUpdates: [
            { id: 'research', status: 'working', statusText: '工作中', note: '检索竞品更新日志' },
            { id: 'schedule', status: 'working', statusText: '工作中', note: '比对成员明日空闲时段' }
          ],
          message: {
            bot: 'research',
            time: '14:02',
            tag: '已完成 · 交接给 写作 Bot',
            tagType: 'default',
            body: '已提取竞品 A v3.4 变更：新增团队审批流、Pro 档涨价 18%，社区热评集中在迁移成本。已附 4 条原始链接。<span class="mention-pill">@写作 Bot 接棒起草周报</span>'
          }
        },
        {
          delay: 1150,
          typing: '日程 Bot 正在核对参会人日历空闲…',
          botUpdates: [
            { id: 'research', status: 'idle', statusText: '空闲', note: '素材已交付' },
            { id: 'writing', status: 'working', statusText: '工作中', note: '撰写对比周报中' }
          ],
          message: {
            bot: 'schedule',
            time: '14:03',
            tag: '待确认时段',
            tagType: 'working',
            body: '核对 5 位成员日历完成：<strong>明天 15:00–15:30</strong> 全员空闲，已预留 3 号会议室并挂好竞品对比文档链接。'
          }
        },
        {
          delay: 1200,
          typing: '写作 Bot 正在生成团队周报草稿…',
          botUpdates: [
            { id: 'schedule', status: 'idle', statusText: '空闲', note: '等待发邀审批' },
            { id: 'writing', status: 'approval', statusText: '等你审批', note: '周报与邀约待你拍板' }
          ],
          message: {
            bot: 'writing',
            time: '14:04',
            tag: '等你审批',
            tagType: 'approval',
            approval: {
              title: '关键步审批：发送团队周报并寄出会议邀请',
              desc: '将同时执行：① 发送《竞品 A v3.4 拆解》到产品研发群 ② 发出明日 15:00 评审会邀请（5人）'
            }
          }
        },
        {
          delay: 1400,
          typing: '已获批，写作 Bot 与日程 Bot 正在执行外发…',
          botUpdates: [
            { id: 'writing', status: 'idle', statusText: '空闲', note: '周报已发送' },
            { id: 'schedule', status: 'idle', statusText: '空闲', note: '会议邀请已发出' },
            { id: 'ops', status: 'working', statusText: '工作中', note: '归档交付与留痕' }
          ],
          message: {
            bot: 'ops',
            time: '14:05',
            tag: '汇总交付',
            tagType: 'working',
            summary: {
              title: '本次派活已全部交付（留痕编号 #TSK-408）',
              items: [
                '调研表：竞品 A v3.4 差异清单（含 4 条信源）已归档',
                '团队周报：已发至产品研发群，阅读回执跟踪中',
                '评审会议：明日 15:00–15:30 邀请已送达 5 位成员'
              ]
            }
          }
        }
      ]
    },
    hotfix: {
      previewPrompt: '“盯盘刚报结账接口超时飙升，帮我定位原因、在分支修复并跑单测，准备好状态页公告等我确认发。”',
      routeLabel: ['盯盘 Bot', '代码 Bot', '写作 Bot（审批）', '复盘 Bot 交付'],
      userMessage: '盯盘刚报结账接口超时飙升，帮我定位原因、在分支修复并跑单测，准备好状态页公告等我确认发。',
      steps: [
        {
          delay: 750,
          typing: '盯盘 Bot 正在拉取近 15 分钟慢请求追踪日志…',
          botUpdates: [
            { id: 'monitor', status: 'working', statusText: '工作中', note: '分析 P99 超时样本' },
            { id: 'code', status: 'working', statusText: '工作中', note: '准备诊断环境' }
          ],
          message: {
            bot: 'monitor',
            time: '16:11',
            tag: '已定位 · 交接给 代码 Bot',
            tagType: 'default',
            body: '定位到 16:04 发版后 <code>/api/checkout</code> P99 从 180ms 升至 2.9s，集中发生在优惠券校验重复查询。<span class="mention-pill">@代码 Bot 接棒排查修复</span>'
          }
        },
        {
          delay: 1200,
          typing: '代码 Bot 正在编写补丁并跑回归测试…',
          botUpdates: [
            { id: 'monitor', status: 'working', statusText: '工作中', note: '持续盯守错误率' },
            { id: 'code', status: 'working', statusText: '工作中', note: '执行 42 项结账单测' },
            { id: 'writing', status: 'working', statusText: '工作中', note: '起草状态页恢复说明' }
          ],
          message: {
            bot: 'code',
            time: '16:13',
            tag: '补丁就绪',
            tagType: 'working',
            body: '已在隔离分支 <code>hotfix/coupon-cache</code> 合并重复查询并补齐缓存，42 项单测与压测全绿，P99 回落至 165ms。'
          }
        },
        {
          delay: 1200,
          typing: '代码 Bot 与写作 Bot 正在打包变更等待审批…',
          botUpdates: [
            { id: 'code', status: 'approval', statusText: '等你审批', note: 'PR #319 待你批准合并' },
            { id: 'writing', status: 'approval', statusText: '等你审批', note: '状态页公告待确认' }
          ],
          message: {
            bot: 'code',
            time: '16:14',
            tag: '等你审批',
            tagType: 'approval',
            approval: {
              title: '关键步审批：合并热修复 PR #319 并发布状态页说明',
              desc: '改动 2 个文件（+28 / -11），测试全部通过；合并后将由写作 Bot 同步发布简短状态更新。'
            }
          }
        },
        {
          delay: 1350,
          typing: '审批已通过，正在合并部署并由复盘 Bot 归档事故记录…',
          botUpdates: [
            { id: 'code', status: 'idle', statusText: '空闲', note: 'PR #319 已合并' },
            { id: 'writing', status: 'idle', statusText: '空闲', note: '公告已发布' },
            { id: 'monitor', status: 'idle', statusText: '空闲', note: '延迟恢复正常' },
            { id: 'ops', status: 'working', statusText: '工作中', note: '生成事故复盘卡片' }
          ],
          message: {
            bot: 'ops',
            time: '16:16',
            tag: '汇总交付',
            tagType: 'working',
            summary: {
              title: '线上修复闭环完成（留痕编号 #INC-118）',
              items: [
                '代码合并：PR #319 已部署，结账接口 P99 稳定在 162ms',
                '对外同步：状态页已更新为「已恢复正常」',
                '复盘草稿：根因、时间线与防护建议已写入复盘库'
              ]
            }
          }
        }
      ]
    }
  };

  // DOM 元素
  const statePill = document.getElementById('demo-state-pill');
  const stateText = document.getElementById('demo-state-text');
  const dispatchBtn = document.getElementById('dispatch-btn');
  const dispatchLabel = document.getElementById('dispatch-btn-label');
  const resetBtn = document.getElementById('reset-demo-btn');
  const progressBar = document.getElementById('demo-progress-bar');
  const stepCounter = document.getElementById('demo-step-counter');
  const demoStream = document.getElementById('demo-stream');
  const demoTyping = document.getElementById('demo-typing');
  const demoTypingText = document.getElementById('demo-typing-text');
  const scenarioTabs = document.querySelectorAll('.scenario-tab');
  const legendPills = document.querySelectorAll('.legend-pill');

  let currentScenarioKey = 'launch';
  let demoStatus = 'idle'; // 'idle' | 'running' | 'done'
  let timers = [];
  let pendingApproveResolve = null;

  function clearAllTimers() {
    timers.forEach((t) => clearTimeout(t));
    timers = [];
    pendingApproveResolve = null;
  }

  function schedule(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function setDemoState(nextState) {
    demoStatus = nextState;
    statePill.classList.remove('state-idle', 'state-running', 'state-done');

    legendPills.forEach((pill) => {
      pill.classList.toggle('is-current', pill.dataset.legend === nextState);
    });

    if (nextState === 'idle') {
      statePill.classList.add('state-idle');
      stateText.textContent = '未开始';
      dispatchBtn.disabled = false;
      dispatchLabel.textContent = '派一个任务';
      resetBtn.disabled = true;
      progressBar.style.width = '0%';
      progressBar.classList.remove('is-done');
      demoTyping.hidden = true;
    } else if (nextState === 'running') {
      statePill.classList.add('state-running');
      stateText.textContent = '进行中';
      dispatchBtn.disabled = true;
      dispatchLabel.textContent = 'Bot 协作进行中…';
      resetBtn.disabled = false;
      progressBar.classList.remove('is-done');
    } else if (nextState === 'done') {
      statePill.classList.add('state-done');
      stateText.textContent = '完成';
      dispatchBtn.disabled = false;
      dispatchLabel.textContent = '再派一次任务';
      resetBtn.disabled = false;
      progressBar.style.width = '100%';
      progressBar.classList.add('is-done');
      demoTyping.hidden = true;
    }
  }

  function resetBotStatuses() {
    document.querySelectorAll('#demo-bot-list .demo-bot-item').forEach((item) => {
      item.classList.remove('is-active', 'is-approval');
      const noteEl = item.querySelector('[data-note]');
      const statusEl = item.querySelector('[data-status]');
      if (noteEl) noteEl.textContent = '等待派活';
      if (statusEl) {
        statusEl.textContent = '空闲';
        statusEl.className = 'mini-status status-idle';
      }
    });
  }

  function applyBotUpdates(updates) {
    if (!updates) return;
    updates.forEach((u) => {
      const item = document.querySelector(`#demo-bot-list .demo-bot-item[data-bot="${u.id}"]`);
      if (!item) return;
      item.classList.remove('is-active', 'is-approval');
      const noteEl = item.querySelector('[data-note]');
      const statusEl = item.querySelector('[data-status]');
      if (noteEl) noteEl.textContent = u.note;
      if (statusEl) {
        statusEl.textContent = u.statusText;
        statusEl.className = 'mini-status';
        if (u.status === 'working') {
          statusEl.classList.add('status-working');
          item.classList.add('is-active');
        } else if (u.status === 'approval') {
          statusEl.classList.add('status-approval');
          item.classList.add('is-approval');
        } else {
          statusEl.classList.add('status-idle');
        }
      }
    });
  }

  function renderEmptyState() {
    const scenario = SCENARIOS[currentScenarioKey];
    stepCounter.textContent = `0 / ${scenario.steps.length + 1} 步`;
    const routeHtml = scenario.routeLabel
      .map((label) => `<strong>${label}</strong>`)
      .join('<span class="empty-route-arrow" aria-hidden="true">→</span>');
    demoStream.innerHTML = `
      <div class="demo-empty" id="demo-empty">
        <div class="empty-badge">任务待派发 · 未开始</div>
        <p class="empty-prompt" id="demo-preview-prompt">${scenario.previewPrompt}</p>
        <div class="empty-route" aria-label="预计接力路径">
          <span>预计接力：</span>${routeHtml}
        </div>
        <p class="empty-hint">点击右上角 <strong>「派一个任务」</strong>，观察多 Bot 自动分工、互相交接并请求你审批关键一步。</p>
      </div>
    `;
  }

  function appendUserMessage(text) {
    const node = document.createElement('div');
    node.className = 'msg-item msg-user demo-msg';
    node.innerHTML = `
      <div class="msg-meta">
        <span class="msg-author">你（派活）</span>
        <span class="msg-time">刚刚</span>
      </div>
      <div class="msg-bubble user-bubble">${text}</div>
    `;
    demoStream.appendChild(node);
    demoStream.scrollTop = demoStream.scrollHeight;
  }

  function appendBotMessage(msg) {
    const bot = BOTS[msg.bot];
    const node = document.createElement('div');
    node.className = 'msg-item demo-msg';

    let tagClass = 'role-tag';
    if (msg.tagType === 'working') tagClass += ' working-tag';
    if (msg.tagType === 'approval') tagClass += ' approval-tag';

    let innerBody = '';
    if (msg.approval) {
      innerBody = `
        <div class="approval-card" data-demo-approval>
          <div class="approval-head">
            <span class="approval-icon" aria-hidden="true">!</span>
            <div>
              <div class="approval-title">${msg.approval.title}</div>
              <div class="approval-desc">${msg.approval.desc}</div>
            </div>
          </div>
          <div class="approval-actions">
            <span class="msg-time" data-auto-tip>可点击立即通过，或 2 秒后自动模拟通过</span>
            <button type="button" class="mini-btn mini-btn-approve" data-demo-approve-btn>批准并继续</button>
          </div>
        </div>
      `;
    } else if (msg.summary) {
      const itemsHtml = msg.summary.items.map((it) => `<li>${it}</li>`).join('');
      innerBody = `
        <div class="demo-summary-card">
          <div class="summary-title">✓ ${msg.summary.title}</div>
          <ul class="summary-list">${itemsHtml}</ul>
        </div>
      `;
    } else {
      innerBody = `<div class="msg-bubble">${msg.body}</div>`;
    }

    node.innerHTML = `
      <span class="mini-avatar ${bot.avatarClass}" aria-hidden="true">${bot.svg}</span>
      <div class="msg-content">
        <div class="msg-meta">
          <span class="msg-author">${bot.name}</span>
          <span class="${tagClass}">${msg.tag}</span>
          <span class="msg-time">${msg.time}</span>
        </div>
        ${innerBody}
      </div>
    `;

    demoStream.appendChild(node);
    demoStream.scrollTop = demoStream.scrollHeight;
    return node;
  }

  function runDemo() {
    clearAllTimers();
    const scenario = SCENARIOS[currentScenarioKey];
    const totalSteps = scenario.steps.length + 1;

    resetBotStatuses();
    demoStream.innerHTML = '';
    setDemoState('running');

    // 第 1 步：用户派活
    appendUserMessage(scenario.userMessage);
    stepCounter.textContent = `1 / ${totalSteps} 步`;
    progressBar.style.width = `${Math.round((1 / totalSteps) * 100)}%`;

    function runStep(index) {
      if (index >= scenario.steps.length) {
        // 全部结束，归位状态
        document.querySelectorAll('#demo-bot-list .demo-bot-item').forEach((item) => {
          item.classList.remove('is-active', 'is-approval');
          const statusEl = item.querySelector('[data-status]');
          if (statusEl && statusEl.textContent === '工作中') {
            statusEl.textContent = '已完成';
            statusEl.className = 'mini-status status-working';
          }
        });
        setDemoState('done');
        return;
      }

      const step = scenario.steps[index];
      demoTypingText.textContent = step.typing;
      demoTyping.hidden = false;

      schedule(() => {
        applyBotUpdates(step.botUpdates);
        const msgEl = appendBotMessage(step.message);
        const doneCount = index + 2;
        stepCounter.textContent = `${doneCount} / ${totalSteps} 步`;
        progressBar.style.width = `${Math.round((doneCount / totalSteps) * 100)}%`;

        // 如果是审批步骤，支持立即点击通过，也提供 2 秒自动模拟通过以便完整演示
        if (step.message.approval) {
          demoTypingText.textContent = '流程已暂停在关键步骤，等你点「批准并继续」…';
          const card = msgEl.querySelector('[data-demo-approval]');
          const approveBtn = msgEl.querySelector('[data-demo-approve-btn]');
          const tip = msgEl.querySelector('[data-auto-tip]');

          let settled = false;
          const finishApproval = (manual) => {
            if (settled) return;
            settled = true;
            if (card) card.classList.add('is-approved');
            const icon = card && card.querySelector('.approval-icon');
            if (icon) icon.textContent = '✓';
            if (tip) tip.textContent = manual ? '你已批准，Bot 继续执行' : '已模拟批准通过，Bot 继续执行';
            if (approveBtn) {
              approveBtn.textContent = '已批准';
              approveBtn.disabled = true;
            }
            runStep(index + 1);
          };

          if (approveBtn) {
            approveBtn.addEventListener('click', () => finishApproval(true), { once: true });
          }
          schedule(() => finishApproval(false), 2100);
        } else {
          runStep(index + 1);
        }
      }, step.delay);
    }

    runStep(0);
  }

  function resetDemo() {
    clearAllTimers();
    resetBotStatuses();
    renderEmptyState();
    setDemoState('idle');
  }

  // 事件绑定
  dispatchBtn.addEventListener('click', runDemo);
  resetBtn.addEventListener('click', resetDemo);

  scenarioTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.scenario;
      if (!key || key === currentScenarioKey) return;
      currentScenarioKey = key;
      scenarioTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      resetDemo();
    });
  });

  // 首屏预览卡片中的审批按钮也可以交互体验
  const heroApprovalCard = document.getElementById('hero-approval-card');
  if (heroApprovalCard) {
    heroApprovalCard.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-hero-action]');
      if (!btn) return;
      const action = btn.dataset.heroAction;
      const desc = heroApprovalCard.querySelector('.approval-desc');
      const title = heroApprovalCard.querySelector('.approval-title');
      const icon = heroApprovalCard.querySelector('.approval-icon');
      const actions = heroApprovalCard.querySelector('.approval-actions');

      if (action === 'approve') {
        heroApprovalCard.classList.add('is-approved');
        if (icon) icon.textContent = '✓';
        if (title) title.textContent = '已批准：团队周报已发出';
        if (desc) desc.textContent = '写作 Bot 已推送至产品研发群（12人），留痕 #AUD-9412';
        if (actions) actions.innerHTML = '<span class="msg-time">审批通过 · 刚刚</span>';
      } else if (action === 'edit') {
        if (title) title.textContent = '已退回修改：等待你补充意见';
        if (desc) desc.textContent = '写作 Bot 已挂起外发，保留草稿等你批注。';
      }
    });
  }

  // 套餐按钮快捷联动内测表单
  const betaEmail = document.getElementById('beta-email');
  const betaRole = document.getElementById('beta-role');
  const selectPersonalBtn = document.getElementById('select-personal-btn');
  const selectTeamBtn = document.getElementById('select-team-btn');

  if (selectPersonalBtn && betaEmail) {
    selectPersonalBtn.addEventListener('click', () => {
      setTimeout(() => betaEmail.focus(), 250);
    });
  }

  if (selectTeamBtn && betaRole && betaEmail) {
    selectTeamBtn.addEventListener('click', () => {
      betaRole.value = '小团队负责人';
      setTimeout(() => betaEmail.focus(), 250);
    });
  }

  // 内测表单提交反馈
  const betaForm = document.getElementById('beta-form');
  const formFeedback = document.getElementById('form-feedback');

  if (betaForm && betaEmail && formFeedback) {
    betaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = betaEmail.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!valid) {
        formFeedback.textContent = '请输入有效的邮箱地址，方便我们发送内测邀请码。';
        formFeedback.classList.add('is-error');
        betaEmail.focus();
        return;
      }

      const role = betaRole ? betaRole.value : '用户';
      formFeedback.classList.remove('is-error');
      formFeedback.textContent = `已收到申请（${role} · ${email}）！我们会按批次发送「工位」内测邀请码。`;
      betaEmail.value = '';
    });
  }

  // 初始化演示状态
  setDemoState('idle');
  renderEmptyState();
})();
