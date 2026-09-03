// YOASOBI 搶票：精簡售票文字，並在 Timeline 右側加入 Ticket Plus 官網按鈕。
(() => {
  const item = itinerary.find(i => i.id === 'd3-yoasobi-ticket');
  if (item) item.detail = 'Ticket Plus 遠大售票系統';

  const style = document.createElement('style');
  style.textContent = `
    .tl-ticket-btn{flex:0 0 auto;align-self:center;min-height:40px;padding:8px 11px;border-radius:11px;background:#fff;color:#b42323;border:1px solid #efb0b0;text-decoration:none;font-size:13px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
    .tl-ticket-btn:active{transform:scale(.98)}
    @media(max-width:520px){.tl-ticket-btn{min-width:46px;padding:8px;font-size:0}.tl-ticket-btn::before{content:'官網';font-size:12px}}
  `;
  document.head.append(style);

  function addTicketLink() {
    document.querySelectorAll('.day-timeline li').forEach(li => {
      const title = li.querySelector('.tl-title')?.textContent?.trim();
      if (title !== 'YOASOBI 超惑星演唱會搶票') return;

      const detail = li.querySelector('.tl-detail');
      if (detail) detail.textContent = 'Ticket Plus 遠大售票系統';
      if (li.querySelector('.tl-ticket-btn')) return;

      const row = li.querySelector('.tl-row');
      if (!row) return;
      const link = document.createElement('a');
      link.className = 'tl-ticket-btn';
      link.href = 'https://ticketplus.com.tw/';
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = '官網';
      link.setAttribute('aria-label', '開啟 Ticket Plus 遠大售票系統官網');
      row.append(link);
    });
  }

  addTicketLink();
  try { updateLiveMode(); } catch (_) {}
  const observer = new MutationObserver(addTicketLink);
  document.querySelectorAll('.day-timeline').forEach(el => observer.observe(el, {childList:true, subtree:true}));
})();