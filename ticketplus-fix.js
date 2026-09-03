// YOASOBI 搶票：精簡售票文字，並在 Timeline 右側加入 Ticket Plus 官網按鈕。
(() => {
  const item = itinerary.find(i => i.id === 'd3-yoasobi-ticket');
  if (item) item.detail = 'Ticket Plus 遠大售票系統';

  const style = document.createElement('style');
  style.textContent = `
    .tl-ticket-btn{flex:0 0 auto;align-self:center;min-height:40px;padding:8px 11px;border-radius:11px;background:#fff;color:#b42323;border:1px solid #efb0b0;text-decoration:none;font-size:13px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
    .tl-ticket-btn:active{transform:scale(.98)}
    .insurance-reminder{margin:-6px 0 18px;padding:14px 15px;border-radius:14px;background:#fff7e8;border:1px solid #f0d9a8;border-left:5px solid #d59125;display:flex;flex-direction:column;gap:4px}
    .insurance-reminder strong{font-size:16px;color:#8a5810}
    .insurance-reminder span{font-size:13px;line-height:1.55;color:#62594b}
    @media(max-width:520px){.tl-ticket-btn{min-width:46px;padding:8px;font-size:0}.tl-ticket-btn::before{content:'官網';font-size:12px}}
  `;
  document.head.append(style);

  function addTicketLink() {
    document.querySelectorAll('.day-timeline li').forEach(li => {
      const title = li.querySelector('.tl-title')?.textContent?.trim();
      if (title !== 'YOASOBI 超惑星演唱會搶票') return;

      const detail = li.querySelector('.tl-detail');
      if (detail && detail.textContent !== 'Ticket Plus 遠大售票系統') {
        detail.textContent = 'Ticket Plus 遠大售票系統';
      }

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

  function updatePreTripReminders() {
    const card = [...document.querySelectorAll('.card.all-only')]
      .find(el => el.querySelector('h2')?.textContent.trim() === '行前重點');
    if (!card) return;

    let esim = card.querySelector('.esim-reminder');
    const esimHtml = '<strong>📶 網路／eSIM</strong><span>旅行社會提供每人一張【5 日網卡｜每日 1GB｜流量用完降速】。若擔心流量不足，可再自行加買 eSIM 當備援。</span>';
    if (esim) {
      if (esim.innerHTML !== esimHtml) esim.innerHTML = esimHtml;
    } else {
      esim = document.createElement('div');
      esim.className = 'esim-reminder';
      esim.innerHTML = esimHtml;
      card.querySelector('.toprow')?.insertAdjacentElement('afterend', esim);
    }

    if (!card.querySelector('.insurance-reminder')) {
      const insurance = document.createElement('div');
      insurance.className = 'insurance-reminder';
      insurance.innerHTML = '<strong>🛡️ 出發前確認保險</strong><span>記得投保旅遊平安險＋旅遊不便險，確認保障期間涵蓋完整旅程。</span>';
      esim.insertAdjacentElement('afterend', insurance);
    }
  }

  addTicketLink();
  updatePreTripReminders();

  // Timeline 每 30 秒可能被重新 render，因此保留 observer；
  // callback 只處理搶票按鈕，不碰行前提醒，避免不必要的 DOM 觸發。
  const observer = new MutationObserver(addTicketLink);
  document.querySelectorAll('.day-timeline').forEach(el => {
    observer.observe(el, {childList:true, subtree:true});
  });
})();