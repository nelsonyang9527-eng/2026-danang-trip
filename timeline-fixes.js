// Timeline 閱讀性與行程資料修正：避免地點重複、拉開行程間距、統一固定行程視覺。
(() => {
  // 直接修正 itinerary，讓 Timeline 與「最新動態」使用同一份資料。
  const byId = id => itinerary.find(i => i.id === id);

  const transfer = byId('d1-transfer');
  if (transfer) transfer.detail = '溫暖家大廳';

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

  // 9/16 將 17:50 集合與 18:00 聚餐合併為同一個正式行程。
  const meetIndex = itinerary.findIndex(i => i.id === 'd3-meet');
  if (meetIndex >= 0) itinerary.splice(meetIndex, 1);
  const dinner = byId('d3-dinner');
  if (dinner) {
    dinner.title = 'PPA 全公司聚餐：BRILLIANT SEAFOOD';
    dinner.detail = '建議 17:30～17:35 從飯店出發，18:00 前抵達';
    dinner.important = true;
  }

  const style = document.createElement('style');
  style.textContent = `
    .day-timeline{border-top:0!important;display:flex!important;flex-direction:column!important;gap:10px!important;margin-top:10px!important}
    .day-timeline li{border:1px solid #e6eaf0!important;border-radius:14px!important;margin:0!important;padding:13px 60px 13px 34px!important;background:#fff}
    .day-timeline li.done{background:#fafbfc!important;color:#9aa1aa}

    /* 固定／重要行程統一淡藍色，不再因下一個重要行程變成黃色底。 */
    .day-timeline li.important-item,
    .day-timeline li.important-item.done,
    .day-timeline li.important-item.next-important,
    .day-timeline li.important-item.now{
      background:#eef6fd!important;
      border-color:#d5e6f5!important;
      border-left:4px solid #5c94bf!important;
    }
    .day-timeline li.important-item.done{opacity:.68}

    /* 非固定行程仍用目前狀態區別。 */
    .day-timeline li.now:not(.important-item){background:#f2fbf6!important;border-color:#d7eee1!important;border-left:4px solid var(--green)!important}
    .day-timeline li.next-important:not(.important-item){background:#fff8e8!important;border-color:#f2dfad!important;border-left:4px solid #e5ad38!important}

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