// Timeline 閱讀性修正：避免地點名稱重複，並拉開每個行程項目的視覺間距。
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .day-timeline{border-top:0!important;display:flex!important;flex-direction:column!important;gap:10px!important;margin-top:10px!important}
    .day-timeline li{border:1px solid #e6eaf0!important;border-radius:14px!important;margin:0!important;padding:13px 60px 13px 34px!important;background:#fff}
    .day-timeline li.done{background:#fafbfc!important;color:#9aa1aa}
    .day-timeline li.now{background:#f2fbf6!important;border-color:#d7eee1!important;border-left:4px solid var(--green)!important}
    .day-timeline li.next-important{background:#fff8e8!important;border-color:#f2dfad!important;border-left:4px solid #e5ad38!important}
    .day-timeline li.important-item:not(.next-important):not(.now){background:#f8f9fb!important;border-left:4px solid #d4dae2!important}
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
      .replace(/集合|前往|抵達|寄放行李|自由活動|公司|全公司/g, '')
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
  try { renderReadableTimelines(getNow()); } catch (_) {}
})();