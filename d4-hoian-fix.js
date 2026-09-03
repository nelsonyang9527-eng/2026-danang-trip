// 9/17 會安規劃：目前仍在討論中，預排會安印象秀並提供 Klook 連結。
(() => {
  const item = itinerary.find(i => i.id === 'd4-free');
  if (item) {
    item.title = '會安（討論中）';
    item.detail = '預排行程：會安印象秀｜時間與交通方式待確認';
    item.type = 'planned';
    item.important = false;
  }

  const card = document.querySelector('.trip-day[data-tab-day="2026-09-17"]');
  if (card) {
    const tag = card.querySelector('.tag');
    if (tag) tag.textContent = '會安討論中';
    const badge = card.querySelector('.badge');
    if (badge) badge.textContent = '預排：會安印象秀';
  }

  const style = document.createElement('style');
  style.textContent = `
    .tl-hoian-klook-btn{flex:0 0 auto;margin-left:auto;align-self:center;min-height:40px;padding:8px 11px;border-radius:11px;background:#fff;color:#7a4d00;border:1px solid #e3c68f;text-decoration:none;font-size:13px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
    @media(max-width:520px){.tl-hoian-klook-btn{min-width:48px;padding:8px;font-size:0}.tl-hoian-klook-btn::before{content:'Klook';font-size:12px}}
  `;
  document.head.append(style);

  function decorateHoianItem() {
    document.querySelectorAll('.day-timeline li').forEach(li => {
      const title = li.querySelector('.tl-title')?.textContent?.trim();
      if (title !== '會安（討論中）') return;

      const detail = li.querySelector('.tl-detail');
      const text = '預排行程：會安印象秀｜時間與交通方式待確認';
      if (detail && detail.textContent !== text) detail.textContent = text;

      if (li.querySelector('.tl-hoian-klook-btn')) return;
      const row = li.querySelector('.tl-row');
      if (!row) return;

      const link = document.createElement('a');
      link.className = 'tl-hoian-klook-btn';
      link.href = 'https://s.klook.com/c/l3PK044V3V';
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Klook 印象秀';
      link.setAttribute('aria-label', '開啟 Klook 會安印象秀');
      row.append(link);
    });
  }

  try { updateLiveMode(); } catch (_) {}
  decorateHoianItem();

  const observer = new MutationObserver(decorateHoianItem);
  document.querySelectorAll('.day-timeline').forEach(el => observer.observe(el, {childList:true, subtree:true}));
})();