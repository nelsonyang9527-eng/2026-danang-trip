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

// 每日卡片：固定行程完整併入 Timeline，並把地圖入口放到每個有目的地的項目右側。
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .day-timeline{margin-top:8px}
    .day-timeline li{padding:12px 8px 12px 32px;min-height:54px}
    .day-timeline li.important-item{background:#f8fafc;border-left:3px solid #d7dde5;border-radius:12px;font-weight:780}
    .day-timeline li.important-item.done{background:#fafbfc;border-left-color:#e4e7eb}
    .day-timeline li.now{border-left:3px solid var(--green);background:#f2fbf6}
    .day-timeline li.next-important{border-left:3px solid #e5ad38;background:#fff8e8}
    .tl-row{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;min-width:0}
    .tl-copy{min-width:0;flex:1}
    .tl-primary{line-height:1.45}
    .tl-title{font-weight:inherit}
    .important-item .tl-title{font-weight:850}
    .tl-detail{display:block;margin:4px 0 0 54px;font-size:13px;color:#5f6975;line-height:1.5;font-weight:500}
    .tl-dest{display:block;margin:3px 0 0 54px;font-size:12px;color:var(--muted);line-height:1.45;font-weight:650}
    .tl-map-btn{flex:0 0 auto;min-width:46px;min-height:40px;padding:8px 10px;border-radius:11px;background:#eef5fb;color:#155f9b;text-decoration:none;font-size:13px;font-weight:850;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
    .tl-map-btn:active{transform:scale(.98)}
    @media(max-width:520px){
      .day-timeline li{padding-right:4px}
      .tl-row{gap:8px}
      .tl-detail,.tl-dest{margin-left:0;padding-left:54px}
      .tl-map-btn{min-width:44px;padding:8px;font-size:0}
      .tl-map-btn::before{content:'📍';font-size:17px}
    }
  `;
  document.head.append(style);

  // 把舊版「固定行程」與底部重複地圖連結拿掉；資料來源仍保留在 itinerary。
  document.querySelectorAll('.trip-day').forEach(card => {
    [...card.querySelectorAll('h3')].forEach(h => {
      if (h.textContent.trim() === '固定行程') {
        const next = h.nextElementSibling;
        if (next?.tagName === 'UL') next.remove();
        h.remove();
      }
    });
    card.querySelector('.links')?.remove();
  });

  // 補回原本固定區塊中的重要說明，避免整合後遺失資訊。
  const extraDetails = {
    'd1-tpe': '長榮航空 18 號櫃檯｜抵達後請尋找福委 EJ／慧柔，領取護照及登機證。',
    'd3-meet': '建議 17:30～17:35 從飯店出發',
    'd5-arrive': '接機接送依實際航班抵達時間安排'
  };
  itinerary.forEach(item => {
    if (extraDetails[item.id]) item.detail = extraDetails[item.id];
  });

  function renderIntegratedTimelines(now) {
    document.querySelectorAll('.trip-day').forEach(card => {
      const items = getDayItems(card.dataset.tabDay);
      const list = card.querySelector('[data-timeline]');
      if (!list) return;
      list.innerHTML = '';
      const nextImportant = items.find(i => i.startDate > now && i.important);

      items.forEach(item => {
        const li = document.createElement('li');
        if (now >= item.endDate) li.className = 'done';
        else if (now >= item.startDate && now < item.endDate) li.className = 'now';
        else li.className = 'upcoming';
        if (item.important) li.classList.add('important-item');
        if (nextImportant && item.id === nextImportant.id) li.classList.add('next-important');

        const row = document.createElement('div');
        row.className = 'tl-row';
        const copy = document.createElement('div');
        copy.className = 'tl-copy';
        const primary = document.createElement('div');
        primary.className = 'tl-primary';

        const t = document.createElement('span');
        t.className = 'tl-time';
        t.textContent = formatHM(item.startDate, item.zone || DANANG_TZ);
        const title = document.createElement('span');
        title.className = 'tl-title';
        title.textContent = item.title;
        primary.append(t, title);
        copy.append(primary);

        if (item.detail) {
          const detail = document.createElement('span');
          detail.className = 'tl-detail';
          detail.textContent = item.detail;
          copy.append(detail);
        }
        if (item.destination) {
          const dest = document.createElement('span');
          dest.className = 'tl-dest';
          dest.textContent = item.destination.name;
          copy.append(dest);
        }
        row.append(copy);

        if (item.destination) {
          const map = document.createElement('a');
          map.className = 'tl-map-btn';
          map.href = googleDirectionsUrl(item.destination);
          map.target = '_blank';
          map.rel = 'noopener';
          map.setAttribute('aria-label', `用 Google Maps 導航到 ${item.destination.name}`);
          map.textContent = '📍 地圖';
          row.append(map);
        }

        li.append(row);
        list.append(li);
      });
    });
  }

  // 覆蓋原本 Timeline renderer，之後每 30 秒更新仍會維持整合版。
  try { renderDayTimelines = renderIntegratedTimelines; } catch (_) {}
  renderIntegratedTimelines(getNow());
})();

// 最新動態新版：現在顯示「扣掉 Grab 車程後的剩餘時間」；下一行程強調時間＋標題。
(() => {
  const style = document.createElement('style');
  style.textContent = `
    #liveStayBadge,#liveTravelEstimate,#liveLeaveBy{display:none!important}
    .live-remaining-time{margin-top:9px;font-size:17px;font-weight:900;color:#166f49;line-height:1.45}
    .live-remaining-meta{margin-top:3px;font-size:12px;color:#6b7280;line-height:1.45;font-weight:650}
    .live-next-big-time{display:inline-block;margin-right:8px;font-size:26px;line-height:1.1;font-weight:950;font-variant-numeric:tabular-nums;color:#173f62;vertical-align:-1px}
    .live-panel.next .live-title{font-size:18px;line-height:1.45}
    .live-panel.next .live-time{margin-top:6px;font-size:13px;line-height:1.5;color:#5e6874}
    #liveCountdown{display:none!important}
    @media(max-width:520px){.live-next-big-time{font-size:24px}.live-remaining-time{font-size:16px}}
  `;
  document.head.append(style);

  const nowPanel = document.querySelector('.live-panel.now');
  const nowTime = document.getElementById('liveNowTime');
  const remaining = document.createElement('div');
  remaining.id = 'liveRemainingTime';
  remaining.className = 'live-remaining-time';
  const remainingMeta = document.createElement('div');
  remainingMeta.id = 'liveRemainingMeta';
  remainingMeta.className = 'live-remaining-meta';
  if (nowTime) {
    nowTime.insertAdjacentElement('afterend', remainingMeta);
    nowTime.insertAdjacentElement('afterend', remaining);
  } else if (nowPanel) {
    nowPanel.append(remaining, remainingMeta);
  }

  let gpsPoint = null;

  function pointFromDestination(dest) {
    if (!dest || !Number.isFinite(dest.lat) || !Number.isFinite(dest.lng)) return null;
    return {lat:dest.lat,lng:dest.lng};
  }

  function formatMinutes(mins) {
    mins = Math.max(0, Math.floor(mins));
    const h = Math.floor(mins / 60), m = mins % 60;
    if (h && m) return `${h} 小時 ${m} 分`;
    if (h) return `${h} 小時`;
    return `${m} 分`;
  }

  function estimateGrabMinutes(km) {
    const roadKm = km * 1.20;
    return Math.max(5, Math.ceil((roadKm / 25) * 60 + 4));
  }

  function renderCompactLive() {
    let now, state;
    try {
      now = getNow();
      state = computeTravelState(now);
    } catch (_) { return; }

    const next = state.next;
    const nextLabel = document.getElementById('liveNextLabel');
    const nextTitle = document.getElementById('liveNextTitle');
    const nextTime = document.getElementById('liveNextTime');
    const countdown = document.getElementById('liveCountdown');
    if (countdown) countdown.textContent = '';

    if (!next) {
      remaining.textContent = '';
      remainingMeta.textContent = '';
      return;
    }

    // 下一個行程：大時間＋標題，子標題只留行程細節，不再顯示重複倒數。
    if (nextLabel) nextLabel.textContent = '下一個行程';
    if (nextTitle) {
      nextTitle.textContent = '';
      const time = document.createElement('span');
      time.className = 'live-next-big-time';
      time.textContent = formatHM(next.startDate, next.zone || DANANG_TZ);
      nextTitle.append(time, document.createTextNode(next.title));
    }
    if (nextTime) nextTime.textContent = next.detail || '';

    const minsUntilNext = Math.max(0, Math.ceil((next.startDate - now) / 60000));
    const source = gpsPoint || pointFromDestination(state.active?.destination);
    const target = pointFromDestination(next.destination);

    if (source && target) {
      const km = haversineKm(source.lat, source.lng, target.lat, target.lng);
      const grabMin = estimateGrabMinutes(km);
      const stayMin = Math.max(0, minsUntilNext - grabMin);
      remaining.textContent = stayMin > 0 ? `剩餘時間：${formatMinutes(stayMin)}` : '剩餘時間：建議現在出發';
      remainingMeta.textContent = `已扣除 Grab 預估約 ${grabMin} 分鐘｜${gpsPoint ? '依目前 GPS 位置' : '依目前行程地點'}`;
    } else if (!source && target) {
      remaining.textContent = '剩餘時間：取得目前位置後計算';
      remainingMeta.textContent = '會從下一個行程時間扣除 Grab 預估車程';
    } else if (!target) {
      remaining.textContent = '剩餘時間：待確認下一個行程地點';
      remainingMeta.textContent = '';
    }
  }

  // 使用者點原本定位按鈕後，剩餘時間優先改用實際 GPS 位置估算。
  document.getElementById('liveLocationBtn')?.addEventListener('click', () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      p => {
        gpsPoint = {lat:p.coords.latitude,lng:p.coords.longitude};
        renderCompactLive();
      },
      () => {},
      {enableHighAccuracy:false,timeout:8000,maximumAge:120000}
    );
  });

  // app.js 每 30 秒會重畫一次最新動態；包住原函式，確保新版排版立即跟著重畫。
  try {
    const baseUpdateLiveMode = updateLiveMode;
    updateLiveMode = function() {
      baseUpdateLiveMode();
      renderCompactLive();
    };
  } catch (_) {}

  renderCompactLive();
  setInterval(renderCompactLive, 30000);
})();