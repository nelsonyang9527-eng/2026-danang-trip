// 9/15 巴拿山包車規劃：尚未訂車，並提供 Klook 接送連結。
(() => {
  const item = itinerary.find(i => i.id === 'd2-free');
  if (item) {
    item.start = '2026-09-15T07:00:00+07:00';
    item.end = '2026-09-15T18:00:00+07:00';
    item.startDate = new Date(item.start);
    item.endDate = new Date(item.end);
    item.title = '包車前往巴拿山';
    item.detail = '尚未訂車｜07:00–18:00';
    item.type = 'daytrip';
    item.important = true;
    item.bookingPending = true;
    delete item.destination;
  }

  const style = document.createElement('style');
  style.textContent = `
    .day-timeline li.booking-pending-item,
    .day-timeline li.booking-pending-item.next-important,
    .day-timeline li.booking-pending-item.now{
      background:#fff8e8!important;
      border-color:#efd797!important;
      border-left:5px solid #d79a22!important;
    }
    .day-timeline li.booking-pending-item .tl-detail{color:#9a6510!important;font-weight:800!important}
    .tl-klook-btn{flex:0 0 auto;margin-left:auto;align-self:center;min-height:40px;padding:8px 11px;border-radius:11px;background:#fff;color:#d66a00;border:1px solid #efc18e;text-decoration:none;font-size:13px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
    @media(max-width:520px){.tl-klook-btn{min-width:48px;padding:8px;font-size:0}.tl-klook-btn::before{content:'Klook';font-size:12px}}
  `;
  document.head.append(style);

  function decorateBanaItem() {
    document.querySelectorAll('.day-timeline li').forEach(li => {
      const title = li.querySelector('.tl-title')?.textContent?.trim();
      if (title !== '包車前往巴拿山') return;
      li.classList.add('booking-pending-item');
      if (li.querySelector('.tl-klook-btn')) return;
      const row = li.querySelector('.tl-row');
      if (!row) return;
      const link = document.createElement('a');
      link.className = 'tl-klook-btn';
      link.href = 'https://s.klook.com/c/Ny6dxWm6wq';
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Klook 接送';
      link.setAttribute('aria-label', '開啟 Klook 巴拿山接送');
      row.append(link);
    });
  }

  try { updateLiveMode(); } catch (_) {}
  decorateBanaItem();

  // Timeline 每 30 秒會重繪；僅在按鈕不存在時補上，不重寫既有文字，避免 observer 迴圈。
  const observer = new MutationObserver(decorateBanaItem);
  document.querySelectorAll('.day-timeline').forEach(el => observer.observe(el, {childList:true, subtree:true}));
})();

// 載入 9/17 會安討論中行程。
(() => {
  if (document.querySelector('script[data-hoian-plan]')) return;
  const script = document.createElement('script');
  script.src = 'd4-hoian-fix.js';
  script.dataset.hoianPlan = '1';
  document.body.append(script);
})();