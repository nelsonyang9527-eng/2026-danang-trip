// Timeline 閱讀性與行程資料修正：避免地點重複、拉開行程間距、統一固定行程視覺。
(() => {
  // 直接修正 itinerary，讓 Timeline 與「最新動態」使用同一份資料。
  const byId = id => itinerary.find(i => i.id === id);

  const transfer = byId('d1-transfer');
  if (transfer) transfer.detail = '溫暖家大廳';

  // 抵達峴港／前往飯店也是固定行程，套用固定行程淡藍色樣式。
  const arriveDanang = byId('d1-arrive');
  if (arriveDanang) {
    arriveDanang.important = true;
    arriveDanang.detail = '遊覽車 B車';
  }

  const freeSuggestions = {
    'd1-free1': '建議：飯店附近、美溪沙灘、咖啡、按摩',
    'd1-free2': '建議：飯店附近散步、按摩、宵夜或自由休息',
    'd2-free': '整日自由，建議：巴拿山、會安、五行山＋會安',
    'd3-free': '建議：市區、山茶半島、五行山、咖啡或按摩；下午回飯店整理',
    'd3-free2': '建議：飯店附近散步、按摩或自由休息',
    'd4-free': '整日自由，建議：大型一日遊、會安夜遊、順化，或補前幾天沒去到的景點'
  };
  Object.entries(freeSuggestions).forEach(([id, detail]) => {
    const item = byId(id);
    if (!item) return;
    item.title = '待安排行程';
    item.detail = detail;
  });

  // 9/16 11:00 YOASOBI 超惑星演唱會搶票：切開原本整段待安排行程，
  // 讓「最新動態」在接近 11:00 時可以正確把搶票列為下一個重要行程。
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
      title:'YOASOBI 超惑星演唱會搶票',
      detail:'Ticket Plus 遠大售票系統｜非常重要',
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
      title:'待安排行程',
      detail:'建議：市區、山茶半島、五行山、咖啡或按摩；下午回飯店整理',
      type:'free',
      destination:destinations.hotel,
      zone:DANANG_TZ,
      startDate:new Date('2026-09-16T11:30:00+07:00'),
      endDate:new Date('2026-09-16T16:30:00+07:00')
    });
  }

  // 9/16 將 17:50 集合與 18:00 聚餐合併為同一個正式行程。
  const meetIndex = itinerary.findIndex(i => i.id === 'd3-meet');
  if (meetIndex >= 0) itinerary.splice(meetIndex, 1);
  const dinner = byId('d3-dinner');
  if (dinner) {
    dinner.title = 'PPA 全公司聚餐：BRILLIANT SEAFOOD';
    dinner.detail = '6桌｜建議 17:30～17:35 從飯店出發，18:00 前抵達';
    dinner.important = true;
  }

  // 9/18 早餐／整理行李改為 08:00 開始。
  const lastBreakfast = byId('d5-free');
  if (lastBreakfast) {
    lastBreakfast.start = '2026-09-18T08:00:00+07:00';
    lastBreakfast.startDate = new Date(lastBreakfast.start);
    lastBreakfast.detail = '早餐、整理行李，準備前往機場';
  }

  // 16:45 抵達桃園／接機接送後，補上 18:00 溫暖的家。
  if (!byId('d5-home')) {
    itinerary.push({
      id:'d5-home',
      day:'2026-09-18',
      start:'2026-09-18T18:00:00+08:00',
      end:'2026-09-18T18:30:00+08:00',
      title:'溫暖的家',
      type:'arrival',
      important:true,
      zone:TAIPEI_TZ,
      startDate:new Date('2026-09-18T18:00:00+08:00'),
      endDate:new Date('2026-09-18T18:30:00+08:00')
    });
  }

  // 最後一天不再重複顯示「可塞時段／適合安排」，Timeline 已足夠。
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

  // 行前重點精簡：常識型的「時間與時差／不要帶」移除，改強調 eSIM。
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
      const top = preTripCard.querySelector('.toprow');
      top?.insertAdjacentElement('afterend', esim);
    }
  }

  const style = document.createElement('style');
  style.textContent = `
    .day-timeline{border-top:0!important;display:flex!important;flex-direction:column!important;gap:10px!important;margin-top:10px!important}
    .day-timeline li{border:1px solid #e6eaf0!important;border-radius:14px!important;margin:0!important;padding:13px 60px 13px 34px!important;background:#fff}
    .day-timeline li.done{background:#fafbfc!important;color:#9aa1aa}

    /* 固定／重要行程統一淡藍色。 */
    .day-timeline li.important-item,
    .day-timeline li.important-item.done,
    .day-timeline li.important-item.next-important,
    .day-timeline li.important-item.now{
      background:#eef6fd!important;
      border-color:#d5e6f5!important;
      border-left:4px solid #5c94bf!important;
    }
    .day-timeline li.important-item.done{opacity:.68}

    /* YOASOBI 搶票是最高優先事項，覆蓋一般淡藍固定行程。 */
    .day-timeline li.very-important-item,
    .day-timeline li.very-important-item.next-important,
    .day-timeline li.very-important-item.now{
      background:#fff0f0!important;
      border:2px solid #e55757!important;
      border-left:6px solid #d72f2f!important;
      color:#7f1d1d!important;
      box-shadow:0 5px 16px rgba(190,45,45,.10)!important;
    }
    .day-timeline li.very-important-item .tl-title{font-weight:950!important}
    .day-timeline li.very-important-item .tl-detail{color:#a42c2c!important;font-weight:800!important}
    .day-timeline li.very-important-item.done{opacity:.62}

    /* 非固定行程仍用目前狀態區別。 */
    .day-timeline li.now:not(.important-item){background:#f2fbf6!important;border-color:#d7eee1!important;border-left:4px solid var(--green)!important}
    .day-timeline li.next-important:not(.important-item){background:#fff8e8!important;border-color:#f2dfad!important;border-left:4px solid #e5ad38!important}

    .esim-reminder{margin:14px 0 18px;padding:14px 15px;border-radius:14px;background:#eef6fd;border:1px solid #d4e7f7;border-left:5px solid #397eaf;display:flex;flex-direction:column;gap:4px}
    .esim-reminder strong{font-size:16px;color:#174f78}
    .esim-reminder span{font-size:13px;line-height:1.55;color:#546372}

    .tl-map-btn{align-self:center}
    @media(max-width:520px){
      .day-timeline{gap:8px!important}
      .day-timeline li{padding:12px 50px 12px 32px!important}
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

  function renderReadableTimelines(now) {
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
        if (item.veryImportant) li.classList.add('very-important-item');
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

        if (shouldShowDestination(item)) {
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

  try { renderDayTimelines = renderReadableTimelines; } catch (_) {}
  try { updateLiveMode(); } catch (_) { try { renderReadableTimelines(getNow()); } catch (_) {} }
})();