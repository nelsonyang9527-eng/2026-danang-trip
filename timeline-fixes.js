// Timeline 閱讀性與行程資料修正：統一「地名｜補充說明」並強化固定行程／重要任務辨識。
(() => {
  const byId = id => itinerary.find(i => i.id === id);

  // 所有行程統一：title 放地名／主要位置，detail 放補充說明。
  const displayCopy = {
    'd1-transfer': ['溫暖家大廳', '送機接送出發'],
    'd1-tpe': ['桃園機場第二航廈', '長榮航空 18 號櫃檯集合'],
    'd1-flight': ['桃園機場第二航廈', 'BR383 09:45 起飛，前往峴港'],
    'd1-arrive': ['Peninsula Hotel Danang', '抵達峴港後搭遊覽車 B 車前往飯店'],
    'd1-free1': ['Peninsula Hotel Danang 周邊', '建議：美溪沙灘／咖啡／按摩 SPA／隨意逛'],
    'd1-dinner': ['Mộc quán Seafood Đà Nẵng', 'PPA 聚餐'],
    'd1-free2': ['Peninsula Hotel Danang 周邊', '建議：飯店附近散步、按摩、宵夜或自由休息'],
    'd2-free': ['Peninsula Hotel Danang', '整日自由，建議：巴拿山、會安、五行山＋會安'],
    'd3-free': ['Peninsula Hotel Danang', '自由安排；建議市區、山茶半島、五行山、咖啡或按摩'],
    'd3-dinner': ['BRILLIANT SEAFOOD', 'PPA 全公司聚餐｜6桌｜建議 17:30～17:35 從飯店出發，18:00 前抵達'],
    'd3-free2': ['Peninsula Hotel Danang 周邊', '建議：飯店附近散步、按摩或自由休息'],
    'd4-free': ['Peninsula Hotel Danang', '整日自由，建議：大型一日遊、會安夜遊、順化，或補前幾天沒去到的景點'],
    'd5-free': ['Peninsula Hotel Danang', '早餐、整理行李，準備前往機場'],
    'd5-airport': ['峴港機場 T2', '10:30 集合，自行前往'],
    'd5-flight': ['峴港機場 T2', 'BR384 12:55 起飛，返回桃園'],
    'd5-arrive': ['桃園機場第二航廈', '16:45 抵達／接機接送']
  };
  Object.entries(displayCopy).forEach(([id, copy]) => {
    const item = byId(id);
    if (!item) return;
    item.title = copy[0];
    item.detail = copy[1];
  });

  // 抵達峴港／前往飯店也是固定行程。
  const arriveDanang = byId('d1-arrive');
  if (arriveDanang) arriveDanang.important = true;

  // 9/16 11:00 YOASOBI 搶票：重要任務，切開自由行程。
  const d3Free = byId('d3-free');
  if (d3Free) {
    d3Free.end = '2026-09-16T11:00:00+07:00';
    d3Free.endDate = new Date(d3Free.end);
  }
  if (!byId('d3-yoasobi-ticket')) {
    itinerary.push({
      id:'d3-yoasobi-ticket',
      day:'2026-09-16',
      start:'2026-09-16T11:00:00+07:00',
      end:'2026-09-16T11:30:00+07:00',
      title:'Ticket Plus 遠大售票系統',
      detail:'YOASOBI 超惑星演唱會搶票',
      type:'ticket',
      important:true,
      veryImportant:true,
      zone:DANANG_TZ,
      startDate:new Date('2026-09-16T11:00:00+07:00'),
      endDate:new Date('2026-09-16T11:30:00+07:00')
    });
  }
  if (!byId('d3-free-after-ticket')) {
    itinerary.push({
      id:'d3-free-after-ticket',
      day:'2026-09-16',
      start:'2026-09-16T11:30:00+07:00',
      end:'2026-09-16T16:30:00+07:00',
      title:'Peninsula Hotel Danang',
      detail:'自由安排；建議市區、山茶半島、五行山、咖啡或按摩，下午回飯店整理',
      type:'free',
      destination:destinations.hotel,
      zone:DANANG_TZ,
      startDate:new Date('2026-09-16T11:30:00+07:00'),
      endDate:new Date('2026-09-16T16:30:00+07:00')
    });
  }

  // 9/16 將 17:50 集合與 18:00 聚餐合併。
  const meetIndex = itinerary.findIndex(i => i.id === 'd3-meet');
  if (meetIndex >= 0) itinerary.splice(meetIndex, 1);

  // 回台後補上回家節點。
  if (!byId('d5-home')) {
    itinerary.push({
      id:'d5-home',
      day:'2026-09-18',
      start:'2026-09-18T18:00:00+08:00',
      end:'2026-09-18T18:30:00+08:00',
      title:'溫暖的家',
      detail:'預計 18:00 抵達',
      type:'arrival',
      important:true,
      zone:TAIPEI_TZ,
      startDate:new Date('2026-09-18T18:00:00+08:00'),
      endDate:new Date('2026-09-18T18:30:00+08:00')
    });
  }

  // 最後一天不重複顯示「可塞時段／適合安排」。
  const lastDayCard = document.querySelector('.trip-day[data-tab-day="2026-09-18"]');
  if (lastDayCard) {
    [...lastDayCard.querySelectorAll('h3')].forEach(h => {
      const text = h.textContent.trim();
      if (text === '可塞時段' || text === '適合安排') {
        const p = h.nextElementSibling;
        if (p?.tagName === 'P') p.remove();
        h.remove();
      }
    });
  }

  // 行前重點精簡並強調 eSIM。
  const preTripCard = [...document.querySelectorAll('.card.all-only')].find(card => card.querySelector('h2')?.textContent.trim() === '行前重點');
  if (preTripCard) {
    [...preTripCard.querySelectorAll('h3')].forEach(h => {
      const text = h.textContent.trim();
      if (text === '時間與時差' || text === '不要帶') {
        const list = h.nextElementSibling;
        if (list?.tagName === 'UL') list.remove();
        h.remove();
      }
    });
    if (!preTripCard.querySelector('.esim-reminder')) {
      const esim = document.createElement('div');
      esim.className = 'esim-reminder';
      esim.innerHTML = '<strong>📶 出發前記得買 eSIM</strong><span>建議先在台灣完成購買與安裝，到峴港後可直接開啟使用。</span>';
      preTripCard.querySelector('.toprow')?.insertAdjacentElement('afterend', esim);
    }
  }

  const style = document.createElement('style');
  style.textContent = `
    /* ===== Travel-app style timeline ===== */
    .day-timeline{
      position:relative!important;
      display:flex!important;
      flex-direction:column!important;
      gap:12px!important;
      margin:18px 0 4px!important;
      padding:0 0 0 28px!important;
      border:0!important;
      list-style:none!important;
    }
    .day-timeline::before{
      content:'';
      position:absolute;
      left:9px;
      top:16px;
      bottom:16px;
      width:2px;
      border-radius:2px;
      background:#d9e5f2;
    }
    .day-timeline li{
      position:relative!important;
      margin:0!important;
      padding:0!important;
      border:0!important;
      background:transparent!important;
      opacity:1!important;
    }
    .day-timeline li::before{
      content:'';
      position:absolute;
      left:-25px;
      top:31px;
      width:11px;
      height:11px;
      border-radius:50%;
      background:#fff;
      border:3px solid #6ba2d0;
      box-shadow:0 0 0 4px #edf5fb;
      z-index:2;
    }
    .day-timeline li.done::before{border-color:#b6c2cd;box-shadow:0 0 0 4px #f2f4f6}
    .day-timeline li.now::before{border-color:#24a36a;box-shadow:0 0 0 5px #e7f6ee}
    .day-timeline li.very-important-item::before{border-color:#e36a48;box-shadow:0 0 0 5px #fff0e9}

    .tl-row{
      display:grid!important;
      grid-template-columns:78px 1px minmax(0,1fr) auto!important;
      align-items:center!important;
      min-height:92px!important;
      padding:14px 14px!important;
      border:1px solid #e5e9ee!important;
      border-radius:18px!important;
      background:#fff!important;
      box-shadow:0 5px 16px rgba(30,50,70,.055)!important;
      overflow:hidden!important;
    }
    .tl-row::before{
      content:'';
      grid-column:2;
      grid-row:1;
      align-self:stretch;
      width:1px;
      background:#e0e5ea;
    }

    /* 固定行程：白底＋藍色左線＋固定標籤。 */
    .important-item .tl-row{
      border-color:#dce8f3!important;
      box-shadow:inset 4px 0 0 #4f91c7,0 5px 16px rgba(30,70,110,.06)!important;
    }

    /* 重要任務：淡暖底＋橘紅左線，比固定行程更醒目但不刺眼。 */
    .very-important-item .tl-row{
      background:#fff9f5!important;
      border-color:#f1c7b7!important;
      box-shadow:inset 5px 0 0 #e36a48,0 6px 18px rgba(140,66,38,.09)!important;
    }

    /* 進行中：狀態用綠色，不改變行程類型顏色。 */
    .now:not(.very-important-item) .tl-row{
      border-color:#bfe4d2!important;
      box-shadow:inset 4px 0 0 #24a36a,0 6px 18px rgba(36,163,106,.08)!important;
    }

    .tl-time-block{
      grid-column:1;
      grid-row:1;
      display:flex;
      flex-direction:column;
      align-items:flex-start;
      justify-content:center;
      gap:6px;
      padding-right:12px;
    }
    .tl-time{
      display:block!important;
      font-size:25px!important;
      line-height:1!important;
      font-weight:900!important;
      letter-spacing:-.5px!important;
      color:#1f6fb7!important;
      font-variant-numeric:tabular-nums;
      white-space:nowrap;
    }
    .done .tl-time{color:#8f9ba6!important}
    .very-important-item .tl-time{color:#c94f31!important}
    .now:not(.very-important-item) .tl-time{color:#16865a!important}

    .tl-copy{
      grid-column:3;
      grid-row:1;
      min-width:0!important;
      padding:0 12px 0 16px!important;
      display:flex!important;
      flex-direction:column!important;
      gap:7px!important;
    }
    .tl-badges{display:flex;align-items:center;flex-wrap:wrap;gap:5px;min-height:20px}
    .tl-badge{
      display:inline-flex;
      align-items:center;
      width:max-content;
      min-height:20px;
      padding:2px 8px;
      border-radius:999px;
      font-size:11px;
      line-height:1.2;
      font-weight:800;
      letter-spacing:.1px;
      white-space:nowrap;
    }
    .tl-badge.fixed{background:#eaf3fb;color:#286c9f}
    .tl-badge.task{background:#ffeadf;color:#b84c2e}
    .tl-badge.now{background:#e3f5eb;color:#16794f}
    .tl-badge.next{background:#fff1d8;color:#9b6712}

    .tl-primary{display:flex!important;flex-direction:column!important;gap:4px!important;min-width:0!important}
    .tl-title{
      display:block!important;
      min-width:0!important;
      font-size:17px!important;
      line-height:1.3!important;
      font-weight:900!important;
      color:#1e252b!important;
      overflow-wrap:anywhere;
    }
    .tl-inline-detail{
      display:block!important;
      color:#6d7781!important;
      font-size:13px!important;
      line-height:1.45!important;
      font-weight:600!important;
      overflow-wrap:anywhere;
    }
    .very-important-item .tl-title{color:#8e321f!important}
    .very-important-item .tl-inline-detail{color:#a24d38!important}
    .done .tl-title,.done .tl-inline-detail{color:#98a1aa!important}
    .tl-sep{display:none!important}
    .tl-dest{display:none!important}

    .tl-map-btn{
      grid-column:4;
      grid-row:1;
      width:40px!important;
      height:40px!important;
      min-width:40px!important;
      border-radius:50%!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      padding:0!important;
      background:#edf5fc!important;
      color:#2474b8!important;
      border:0!important;
      text-decoration:none!important;
      font-size:0!important;
      box-shadow:none!important;
    }
    .tl-map-btn::before{content:'⌖';font-size:22px;font-weight:800;line-height:1}

    .esim-reminder{margin:14px 0 18px;padding:14px 15px;border-radius:14px;background:#eef6fd;border:1px solid #d4e7f7;border-left:5px solid #397eaf;display:flex;flex-direction:column;gap:4px}
    .esim-reminder strong{font-size:16px;color:#174f78}
    .esim-reminder span{font-size:13px;line-height:1.55;color:#546372}

    @media(max-width:520px){
      .day-timeline{padding-left:24px!important;gap:10px!important}
      .day-timeline::before{left:7px}
      .day-timeline li::before{left:-21px;top:29px;width:9px;height:9px}
      .tl-row{grid-template-columns:64px 1px minmax(0,1fr) auto!important;min-height:86px!important;padding:12px 10px!important;border-radius:16px!important}
      .tl-time-block{padding-right:8px}
      .tl-time{font-size:22px!important}
      .tl-copy{padding:0 8px 0 12px!important;gap:5px!important}
      .tl-title{font-size:16px!important}
      .tl-inline-detail{font-size:12.5px!important}
      .tl-map-btn{width:36px!important;height:36px!important;min-width:36px!important}
      .tl-map-btn::before{font-size:20px}
      .tl-badge{font-size:10.5px;padding:2px 7px}
    }

    @media(max-width:380px){
      .tl-row{grid-template-columns:58px 1px minmax(0,1fr) auto!important}
      .tl-time{font-size:20px!important}
      .tl-copy{padding-left:10px!important}
      .tl-map-btn{width:34px!important;height:34px!important;min-width:34px!important}
    }
  `;
  document.head.append(style);

  function compactLocation(s='') {
    return s.toLowerCase()
      .replace(/國際|international/g, '')
      .replace(/集合|前往|抵達|寄放行李|自由活動|待安排行程|公司|全公司|ppa/g, '')
      .replace(/[\s\-_/｜|:：,，.。()（）]/g, '');
  }

  function shouldShowDestination(item) {
    if (!item.destination) return false;
    const title = compactLocation(item.title);
    const dest = compactLocation(item.destination.name);
    if (!title || !dest) return true;
    return !(title.includes(dest) || dest.includes(title));
  }

  function makeBadge(text, kind) {
    const badge = document.createElement('span');
    badge.className = `tl-badge ${kind}`;
    badge.textContent = text;
    return badge;
  }

  function renderReadableTimelines(now) {
    document.querySelectorAll('.trip-day').forEach(card => {
      const items = getDayItems(card.dataset.tabDay);
      const list = card.querySelector('[data-timeline]');
      if (!list) return;
      list.innerHTML = '';

      const nextItem = items.find(i => i.startDate > now) || null;

      items.forEach(item => {
        const li = document.createElement('li');
        const isNow = now >= item.startDate && now < item.endDate;
        const isDone = now >= item.endDate;
        if (isDone) li.className = 'done';
        else if (isNow) li.className = 'now';
        else li.className = 'upcoming';
        if (item.important) li.classList.add('important-item');
        if (item.veryImportant) li.classList.add('very-important-item');
        if (nextItem && item.id === nextItem.id) li.classList.add('next-item');

        const row = document.createElement('div');
        row.className = 'tl-row';

        const timeBlock = document.createElement('div');
        timeBlock.className = 'tl-time-block';
        const t = document.createElement('span');
        t.className = 'tl-time';
        t.textContent = formatHM(item.startDate, item.zone || DANANG_TZ);
        timeBlock.append(t);

        const copy = document.createElement('div');
        copy.className = 'tl-copy';

        const badges = document.createElement('div');
        badges.className = 'tl-badges';
        if (isNow) badges.append(makeBadge('進行中', 'now'));
        else if (nextItem && item.id === nextItem.id) badges.append(makeBadge('下一個', 'next'));
        if (item.veryImportant) badges.append(makeBadge('重要', 'task'));
        else if (item.important) badges.append(makeBadge('固定', 'fixed'));
        if (badges.childElementCount) copy.append(badges);

        const primary = document.createElement('div');
        primary.className = 'tl-primary';
        const title = document.createElement('span');
        title.className = 'tl-title';
        title.textContent = item.title;
        primary.append(title);

        if (item.detail) {
          const detail = document.createElement('span');
          detail.className = 'tl-inline-detail';
          detail.textContent = item.detail;
          primary.append(detail);
        }
        copy.append(primary);

        // 保留判斷函式供未來需要，但目前卡片避免重複顯示地名。
        if (shouldShowDestination(item)) {
          const dest = document.createElement('span');
          dest.className = 'tl-dest';
          dest.textContent = item.destination.name;
          copy.append(dest);
        }

        row.append(timeBlock, copy);

        if (item.destination) {
          const map = document.createElement('a');
          map.className = 'tl-map-btn';
          map.href = googleDirectionsUrl(item.destination);
          map.target = '_blank';
          map.rel = 'noopener';
          map.setAttribute('aria-label', `用 Google Maps 導航到 ${item.destination.name}`);
          map.title = 'Google Maps';
          row.append(map);
        }

        li.append(row);
        list.append(li);
      });
    });
  }

  try { renderDayTimelines = renderReadableTimelines; } catch (_) {}
  try { updateLiveMode(); } catch (_) { try { renderReadableTimelines(getNow()); } catch (_) {} }
})();