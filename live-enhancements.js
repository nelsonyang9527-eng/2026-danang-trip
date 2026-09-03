// 「最新動態」補強：剩餘可停留時間與步行／開車粗估。
// 不使用 Google Maps Directions API，因此不是即時路況；僅以直線距離乘道路係數後，用一般市區速度估算。
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .live-stay-badge{display:inline-block;margin-left:7px;color:#16784a;font-weight:900;font-size:12px}
    .live-travel-estimate{margin-top:10px;padding-top:9px;border-top:1px dashed #d9dee5;font-size:14px;font-weight:800;color:#35404b;line-height:1.55}
    .live-leave-by{margin-top:4px;font-size:13px;color:#66717d;line-height:1.5}
    .live-leave-by.urgent{color:#c43d3d;font-weight:850}
    .day-tab[data-tab="all"]{font-size:14px}
    .day-tab[data-tab="all"]::after{content:none}
    .live-head.live-toggle{cursor:pointer;user-select:none;-webkit-user-select:none;align-items:center;margin-bottom:14px}
    .live-toggle-right{display:flex;align-items:center;gap:9px}
    .live-toggle-chevron{font-size:17px;color:#7b8490;line-height:1;transition:transform .2s ease}
    .live-head[aria-expanded="true"] .live-toggle-chevron{transform:rotate(180deg)}
    .live-mode.live-collapsed{padding-bottom:18px}
    .live-mode.live-collapsed .live-head{margin-bottom:0}
    .live-grid[hidden]{display:none!important}
    @media(max-width:520px){.live-stay-badge{display:block;margin:4px 0 0}.live-travel-estimate{font-size:13px}}
  `;
  document.head.append(style);

  const liveMode = document.getElementById('liveMode');
  const liveHead = liveMode?.querySelector('.live-head');
  const liveGrid = liveMode?.querySelector('.live-grid');
  const liveClock = document.getElementById('liveClock');

  // 最新動態可收合：旅程開始前預設收起；開始後預設展開。
  // 使用者一旦手動切換，本次瀏覽期間會記住，不受 30 秒更新影響。
  if (liveMode && liveHead && liveGrid) {
    liveHead.classList.add('live-toggle');
    liveHead.setAttribute('role', 'button');
    liveHead.setAttribute('tabindex', '0');
    liveHead.setAttribute('aria-controls', 'liveGrid');
    liveGrid.id = 'liveGrid';

    const right = document.createElement('div');
    right.className = 'live-toggle-right';
    if (liveClock) right.append(liveClock);
    const chevron = document.createElement('span');
    chevron.className = 'live-toggle-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '⌄';
    right.append(chevron);
    liveHead.append(right);

    const storageKey = 'danang-live-mode-expanded';
    let manualExpanded = null;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved === 'true' || saved === 'false') manualExpanded = saved === 'true';
    } catch (_) {}

    function setLiveExpanded(expanded, remember = false) {
      liveGrid.hidden = !expanded;
      liveHead.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      liveMode.classList.toggle('live-collapsed', !expanded);
      if (remember) {
        manualExpanded = expanded;
        try { sessionStorage.setItem(storageKey, String(expanded)); } catch (_) {}
      }
    }

    let defaultExpanded = true;
    try { defaultExpanded = getNow() >= tripStart; } catch (_) {}
    setLiveExpanded(manualExpanded ?? defaultExpanded);

    function toggleLive() {
      setLiveExpanded(liveGrid.hidden, true);
    }
    liveHead.addEventListener('click', toggleLive);
    liveHead.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleLive();
      }
    });
  }

  let gpsPoint = null;
  const nowPanel = document.querySelector('.live-panel.now');
  if (!nowPanel) return;

  const label = nowPanel.querySelector('.live-label');
  const stayBadge = document.createElement('span');
  stayBadge.id = 'liveStayBadge';
  stayBadge.className = 'live-stay-badge';
  label?.append(stayBadge);

  const travel = document.createElement('div');
  travel.id = 'liveTravelEstimate';
  travel.className = 'live-travel-estimate';
  nowPanel.append(travel);

  const leave = document.createElement('div');
  leave.id = 'liveLeaveBy';
  leave.className = 'live-leave-by';
  nowPanel.append(leave);

  function formatMinutes(mins) {
    mins = Math.max(0, Math.floor(mins));
    const h = Math.floor(mins / 60), m = mins % 60;
    if (h && m) return `${h} 小時 ${m} 分`;
    if (h) return `${h} 小時`;
    return `${m} 分`;
  }

  function estimateTravel(km) {
    // 峴港市區「粗估」：步行道路距離約為直線 1.25 倍；開車約 1.2 倍。
    // 步行 4.5 km/h；開車市區平均 25 km/h，另加 4 分鐘找車／等車／上下車緩衝。
    const walkKm = km * 1.25;
    const driveKm = km * 1.20;
    const walkMin = Math.max(2, Math.ceil((walkKm / 4.5) * 60));
    const driveMin = Math.max(5, Math.ceil((driveKm / 25) * 60 + 4));
    return { walkMin, driveMin };
  }

  function pointFromDestination(dest) {
    if (!dest || !Number.isFinite(dest.lat) || !Number.isFinite(dest.lng)) return null;
    return { lat: dest.lat, lng: dest.lng };
  }

  function formatLeaveTime(date, zone) {
    try { return formatHM(date, zone || DANANG_TZ); }
    catch (_) { return ''; }
  }

  function refresh() {
    let now, state;
    try {
      now = getNow();
      state = computeTravelState(now);
    } catch (_) { return; }

    const next = state.next;
    const source = gpsPoint || pointFromDestination(state.active?.destination);
    const target = pointFromDestination(next?.destination);

    stayBadge.textContent = '';
    travel.textContent = '';
    leave.textContent = '';
    leave.classList.remove('urgent');

    if (!next) return;

    const minsUntilNext = Math.max(0, Math.ceil((next.startDate - now) / 60000));

    if (!source || !target) {
      stayBadge.textContent = `｜距下一行程 ${formatMinutes(minsUntilNext)}`;
      travel.textContent = '交通時間：點「取得目前位置」後可估算步行／開車時間';
      return;
    }

    const km = haversineKm(source.lat, source.lng, target.lat, target.lng);
    const { walkMin, driveMin } = estimateTravel(km);
    const driveStay = Math.max(0, minsUntilNext - driveMin);
    const walkStay = Math.max(0, minsUntilNext - walkMin);
    const driveLeaveAt = new Date(next.startDate.getTime() - driveMin * 60000);

    // 最醒目的數字採「搭車還可停留多久」，因峴港旅途中最常用 Grab／汽車移動。
    stayBadge.textContent = driveStay > 0 ? `｜還可停留約 ${formatMinutes(driveStay)}` : '｜建議現在出發';

    const sourceText = gpsPoint ? 'GPS' : '目前行程地點';
    travel.textContent = `🚶 步行約 ${walkMin} 分　🚕 開車約 ${driveMin} 分（${sourceText}粗估）`;

    if (driveStay <= 0) {
      leave.textContent = '已接近下一個行程時間，建議準備出發';
      leave.classList.add('urgent');
    } else {
      leave.textContent = `搭車最晚約 ${formatLeaveTime(driveLeaveAt, next.zone)} 離開｜若走路還可停留約 ${formatMinutes(walkStay)}`;
    }
  }

  // 沿用原本「取得目前位置」按鈕；使用者主動點擊後，補記 GPS 供交通粗估使用。
  const locationBtn = document.getElementById('liveLocationBtn');
  locationBtn?.addEventListener('click', () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      p => {
        gpsPoint = { lat: p.coords.latitude, lng: p.coords.longitude };
        refresh();
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 }
    );
  });

  refresh();
  setInterval(refresh, 30000);
})();