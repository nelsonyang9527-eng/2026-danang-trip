// 9/17 會安規劃：08:00 包車前往，目前尚未訂車。
(() => {
  const item = itinerary.find(i => i.id === 'd4-free');
  if (item) {
    item.start = '2026-09-17T08:00:00+07:00';
    item.startDate = new Date(item.start);
    item.title = '包車前往會安';
    item.detail = '尚未訂車';
    item.type = 'daytrip';
    item.important = true;
    item.bookingPending = true;
    delete item.destination;
  }

  const card = document.querySelector('.trip-day[data-tab-day="2026-09-17"]');
  if (card) {
    const tag = card.querySelector('.tag');
    if (tag) tag.textContent = '會安日';

    // Timeline 已提供完整資訊，移除舊的空閒度與建議摘要。
    card.querySelector('.badge')?.remove();
    [...card.querySelectorAll('h3')].forEach(h => {
      const text = h.textContent.trim();
      if (text === '可塞時段' || text === '適合安排') {
        const p = h.nextElementSibling;
        if (p?.tagName === 'P') p.remove();
        h.remove();
      }
    });
  }

  function decorateHoianItem() {
    document.querySelectorAll('.day-timeline li').forEach(li => {
      const title = li.querySelector('.tl-title')?.textContent?.trim();
      if (title !== '包車前往會安') return;

      li.classList.add('booking-pending-item');
      const detail = li.querySelector('.tl-detail');
      if (detail && detail.textContent !== '尚未訂車') detail.textContent = '尚未訂車';

      li.querySelector('.tl-hoian-klook-btn')?.remove();
    });
  }

  try { updateLiveMode(); } catch (_) {}
  decorateHoianItem();

  const observer = new MutationObserver(decorateHoianItem);
  document.querySelectorAll('.day-timeline').forEach(el => observer.observe(el, {childList:true, subtree:true}));
})();

// 載入 Day 3／Day 5 顯示整理。
(() => {
  if (document.querySelector('script[data-day-labels-fix]')) return;
  const script = document.createElement('script');
  script.src = 'day-labels-fix.js';
  script.dataset.dayLabelsFix = '1';
  document.body.append(script);
})();