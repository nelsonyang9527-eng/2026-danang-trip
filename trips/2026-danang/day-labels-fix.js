// Day 3／Day 5 顯示整理：移除空閒度與舊建議摘要，第三天改為一日導覽待安排。
(() => {
  const byId = id => itinerary.find(i => i.id === id);

  const d3 = byId('d3-free');
  if (d3) {
    d3.title = '預計安排一日導覽';
    d3.detail = '待安排';
    d3.type = 'planned';
    d3.important = false;
  }

  const d3After = byId('d3-free-after-ticket');
  if (d3After) {
    d3After.title = '預計安排一日導覽';
    d3After.detail = '待安排';
    d3After.type = 'planned';
    d3After.important = false;
    delete d3After.destination;
  }

  function cleanCard(day) {
    const card = document.querySelector(`.trip-day[data-tab-day="${day}"]`);
    if (!card) return;
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

  cleanCard('2026-09-16');
  cleanCard('2026-09-18');

  try { updateLiveMode(); } catch (_) {}
})();