// 最新動態 v2：出發前導向行前重點；旅途中以 GPS／目前行程地點估算可停留時間。
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .live-pretrip-link{border:0;background:transparent;padding:0;color:#1769aa;font:inherit;font-weight:850;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
    .live-remaining-row{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:9px}
    .live-remaining-value{font-size:17px;font-weight:900;color:#166f49;line-height:1.45}
    .live-inline-location{min-height:34px;padding:6px 10px;border-radius:10px;border:1px solid #cfd8e3;background:#fff;color:#31506b;font:inherit;font-size:12px;font-weight:850;cursor:pointer}
    .live-inline-location:disabled{opacity:.6;cursor:default}
    .live-remaining-source{margin-top:3px;font-size:12px;color:#6b7280;line-height:1.45;font-weight:650}
    #liveLocationBtn{display:none!important}
    @media(max-width:520px){.live-remaining-value{font-size:16px}.live-inline-location{min-height:32px}}
  `;
  document.head.append(style);

  let gpsPoint = null;
  let locating = false;
  const geocodeCache = new Map();

  function pointFromDestination(dest) {
    if (!dest || !Number.isFinite(dest.lat) || !Number.isFinite(dest.lng)) return null;
    return {lat:dest.lat,lng:dest.lng};
  }

  async function pointFromAddress(dest) {
    if (!dest) return null;
    const direct = pointFromDestination(dest);
    if (direct) return direct;
    const query = (dest.address || dest.mapQuery || dest.name || '').trim();
    if (!query) return null;
    if (geocodeCache.has(query)) return geocodeCache.get(query);

    const promise = fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`)
      .then(r => r.ok ? r.json() : [])
      .then(rows => {
        const row = rows?.[0];
        const lat = Number(row?.lat), lng = Number(row?.lon);
        return Number.isFinite(lat) && Number.isFinite(lng) ? {lat,lng} : null;
      })
      .catch(() => null);
    geocodeCache.set(query, promise);
    return promise;
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

  function currentPlaceItem(state, now) {
    if (state.active?.destination) return state.active;
    const prior = (state.todayItems || [])
      .filter(i => i.destination && i.endDate <= now)
      .sort((a,b) => b.endDate - a.endDate)[0];
    return prior || null;
  }

  function ensureRemainingUi() {
    const nowTime = document.getElementById('liveNowTime');
    if (!nowTime) return null;

    let row = document.getElementById('liveRemainingRowV2');
    if (!row) {
      row = document.createElement('div');
      row.id = 'liveRemainingRowV2';
      row.className = 'live-remaining-row';

      const value = document.createElement('span');
      value.id = 'liveRemainingValueV2';
      value.className = 'live-remaining-value';

      const btn = document.createElement('button');
      btn.id = 'liveInlineLocationBtn';
      btn.type = 'button';
      btn.className = 'live-inline-location';
      btn.textContent = '取得目前位置';
      btn.addEventListener('click', requestGps);

      row.append(value, btn);
      nowTime.insertAdjacentElement('afterend', row);
    }

    let source = document.getElementById('liveRemainingSourceV2');
    if (!source) {
      source = document.createElement('div');
      source.id = 'liveRemainingSourceV2';
      source.className = 'live-remaining-source';
      row.insertAdjacentElement('afterend', source);
    }
    return {row, value:document.getElementById('liveRemainingValueV2'), btn:document.getElementById('liveInlineLocationBtn'), source};
  }

  function requestGps() {
    const ui = ensureRemainingUi();
    if (!navigator.geolocation) {
      if (ui?.source) ui.source.textContent = '此瀏覽器不支援定位，先使用目前行程地點估算';
      return;
    }
    locating = true;
    if (ui?.btn) {
      ui.btn.disabled = true;
      ui.btn.textContent = '定位中…';
    }
    navigator.geolocation.getCurrentPosition(
      p => {
        gpsPoint = {lat:p.coords.latitude,lng:p.coords.longitude};
        locating = false;
        if (ui?.btn) {
          ui.btn.disabled = false;
          ui.btn.textContent = '更新目前位置';
        }
        renderLiveV2();
      },
      () => {
        locating = false;
        if (ui?.btn) {
          ui.btn.disabled = false;
          ui.btn.textContent = '取得目前位置';
        }
        renderLiveV2();
      },
      {enableHighAccuracy:false,timeout:8000,maximumAge:120000}
    );
  }

  function showPretripGuide() {
    const nowTime = document.getElementById('liveNowTime');
    if (!nowTime) return;
    nowTime.textContent = '';
    const text = document.createTextNode('出發前請先閱讀 ');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'live-pretrip-link';
    btn.textContent = '行前重點';
    btn.addEventListener('click', () => {
      try { selectDayTab('all', true); } catch (_) {}
      requestAnimationFrame(() => {
        const target = [...document.querySelectorAll('.card.all-only')]
          .find(el => el.querySelector('h2')?.textContent.trim() === '行前重點');
        target?.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
    nowTime.append(text, btn);

    document.getElementById('liveRemainingRowV2')?.remove();
    document.getElementById('liveRemainingSourceV2')?.remove();
    const oldRemaining = document.getElementById('liveRemainingTime');
    const oldMeta = document.getElementById('liveRemainingMeta');
    if (oldRemaining) oldRemaining.style.display = 'none';
    if (oldMeta) oldMeta.style.display = 'none';
  }

  async function renderLiveV2() {
    let now, state;
    try {
      now = getNow();
      state = computeTravelState(now);
    } catch (_) { return; }

    if (state.status === 'before-trip') {
      showPretripGuide();
      return;
    }

    const oldRemaining = document.getElementById('liveRemainingTime');
    const oldMeta = document.getElementById('liveRemainingMeta');
    if (oldRemaining) oldRemaining.style.display = 'none';
    if (oldMeta) oldMeta.style.display = 'none';

    const ui = ensureRemainingUi();
    if (!ui) return;
    ui.row.style.display = '';
    ui.source.style.display = '';
    ui.btn.style.display = state.status === 'after-trip' ? 'none' : '';
    if (!locating) ui.btn.textContent = gpsPoint ? '更新目前位置' : '取得目前位置';

    const next = state.next;
    if (!next) {
      ui.value.textContent = '';
      ui.source.textContent = '';
      return;
    }

    const minsUntilNext = Math.max(0, Math.ceil((next.startDate - now) / 60000));
    const currentItem = currentPlaceItem(state, now);
    const sourceDest = currentItem?.destination || null;

    let source = gpsPoint;
    let sourceKind = gpsPoint ? 'GPS' : '';
    if (!source && sourceDest) {
      source = await pointFromAddress(sourceDest);
      if (source) sourceKind = '目前行程地點';
    }
    const target = await pointFromAddress(next.destination);

    let latest;
    try { latest = computeTravelState(getNow()).next; } catch (_) { latest = next; }
    if (latest?.id !== next.id) return;

    if (source && target) {
      const km = haversineKm(source.lat, source.lng, target.lat, target.lng);
      const grabMin = estimateGrabMinutes(km);
      const stayMin = Math.max(0, minsUntilNext - grabMin);
      ui.value.textContent = stayMin > 0 ? `剩餘時間：${formatMinutes(stayMin)}` : '剩餘時間：建議現在出發';
      ui.source.textContent = gpsPoint
        ? `已扣除 Grab 預估約 ${grabMin} 分鐘｜依目前 GPS 位置`
        : `已扣除 Grab 預估約 ${grabMin} 分鐘｜依${sourceKind || '目前行程地點'}估算（取得目前位置更精準）`;
    } else if (!source) {
      ui.value.textContent = '剩餘時間：取得目前位置後計算';
      ui.source.textContent = sourceDest ? '目前行程地點無法取得座標，請使用定位計算' : '目前沒有可用的行程地點，請使用定位計算';
    } else {
      ui.value.textContent = '剩餘時間：待確認下一個行程地點';
      ui.source.textContent = '';
    }
  }

  try {
    const baseUpdate = updateLiveMode;
    updateLiveMode = function() {
      baseUpdate();
      renderLiveV2();
    };
  } catch (_) {}

  renderLiveV2();
  setInterval(renderLiveV2, 30000);
})();

// 手機閱讀性修正＋回到頂端按鈕。
(() => {
  const style = document.createElement('style');
  style.textContent = `
    /* 移除先前加入的旅行 emoji。 */
    .live-kicker{display:block!important}
    .live-kicker::before{content:none!important;display:none!important}

    /* 已完成的固定行程不要淡到看不清楚。 */
    .day-timeline li.important-item.done{
      opacity:1!important;
      color:#637181!important;
      background:#f1f6fa!important;
      border-color:#cbddea!important;
    }
    .day-timeline li.important-item.done .tl-title{color:#596979!important}
    .day-timeline li.important-item.done .tl-detail,
    .day-timeline li.important-item.done .tl-dest{color:#788694!important}

    /* 右下角 TOP。 */
    .back-to-top{
      position:fixed;right:16px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:2400;
      width:48px;height:48px;border:1px solid #d8dee7;border-radius:50%;
      background:rgba(255,255,255,.94);color:#344250;font:inherit;font-size:12px;font-weight:900;
      box-shadow:0 7px 22px rgba(15,23,32,.15);cursor:pointer;
      opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .18s ease,transform .18s ease;
      backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)
    }
    .back-to-top.show{opacity:1;transform:translateY(0);pointer-events:auto}
    .back-to-top:active{transform:scale(.96)}

    @media(max-width:520px){
      /* 手機上 action button 改到文字下方靠右，不再擠壓標題與地點。 */
      .day-timeline .tl-row{display:block!important}
      .day-timeline .tl-copy{width:100%!important;min-width:0!important}
      .day-timeline .tl-map-btn,
      .day-timeline .tl-exchange-btn,
      .day-timeline .tl-ticket-btn,
      .day-timeline .tl-klook-btn,
      .day-timeline .tl-hoian-klook-btn{
        display:flex!important;
        width:max-content!important;
        max-width:100%!important;
        margin:9px 0 0 auto!important;
        min-width:48px!important;
        min-height:38px!important;
      }
      .day-timeline li{padding-right:12px!important}
      .day-timeline .tl-detail,.day-timeline .tl-dest{padding-left:54px!important;padding-right:0!important}
      .back-to-top{right:14px;bottom:calc(14px + env(safe-area-inset-bottom));width:46px;height:46px}
    }
  `;
  document.head.append(style);

  let btn = document.getElementById('backToTopBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.textContent = 'TOP';
    btn.setAttribute('aria-label', '回到頁面最上方');
    btn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
    document.body.append(btn);
  }

  let ticking = false;
  function updateTopButton() {
    ticking = false;
    btn.classList.toggle('show', window.scrollY > 480);
  }
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateTopButton);
  }, {passive:true});
  updateTopButton();
})();