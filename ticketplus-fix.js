// Timeline 補充：YOASOBI 官網、第一天換匯、行前提醒。
(() => {
  const ticketItem = itinerary.find(i => i.id === 'd3-yoasobi-ticket');
  if (ticketItem) ticketItem.detail = 'Ticket Plus 遠大售票系統';

  // 第一天下飛機後先去 Khải Hoàn III 換匯，再前往飯店；不硬猜中途時間。
  const arriveItem = itinerary.find(i => i.id === 'd1-arrive');
  if (arriveItem) {
    arriveItem.title = '抵達峴港／第一站換匯／前往飯店';
    arriveItem.detail = '遊覽車 B車｜Tiệm vàng Khải Hoàn III - Exchange Money Here';
  }

  const style = document.createElement('style');
  style.textContent = `
    .tl-ticket-btn,.tl-exchange-btn{flex:0 0 auto;align-self:center;min-height:40px;padding:8px 11px;border-radius:11px;text-decoration:none;font-size:13px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
    .tl-ticket-btn{background:#fff;color:#b42323;border:1px solid #efb0b0}
    .tl-exchange-btn{background:#eef8f2;color:#187548;border:1px solid #b9dfc8}
    .tl-ticket-btn:active,.tl-exchange-btn:active{transform:scale(.98)}
    .insurance-reminder{margin:-6px 0 18px;padding:14px 15px;border-radius:14px;background:#fff7e8;border:1px solid #f0d9a8;border-left:5px solid #d59125;display:flex;flex-direction:column;gap:4px}
    .insurance-reminder strong{font-size:16px;color:#8a5810}
    .insurance-reminder span{font-size:13px;line-height:1.55;color:#62594b}
    .shower-filter-reminder{margin:-6px 0 18px;padding:14px 15px;border-radius:14px;background:#f4f7fa;border:1px solid #dce3ea;border-left:5px solid #6f8799;display:flex;flex-direction:column;gap:4px}
    .shower-filter-reminder strong{font-size:16px;color:#405565}
    .shower-filter-reminder span{font-size:13px;line-height:1.55;color:#5f6972}
    @media(max-width:520px){
      .tl-ticket-btn,.tl-exchange-btn{min-width:46px;padding:8px;font-size:0}
      .tl-ticket-btn::before{content:'官網';font-size:12px}
      .tl-exchange-btn::before{content:'換匯';font-size:12px}
    }
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

  function addExchangeLink() {
    document.querySelectorAll('.day-timeline li').forEach(li => {
      const titleEl = li.querySelector('.tl-title');
      const title = titleEl?.textContent?.trim();
      if (title !== '抵達峴港／前往飯店' && title !== '抵達峴港／第一站換匯／前往飯店') return;

      if (titleEl && titleEl.textContent !== '抵達峴港／第一站換匯／前往飯店') {
        titleEl.textContent = '抵達峴港／第一站換匯／前往飯店';
      }
      const detail = li.querySelector('.tl-detail');
      const text = '遊覽車 B車｜Tiệm vàng Khải Hoàn III - Exchange Money Here';
      if (detail && detail.textContent !== text) detail.textContent = text;

      if (li.querySelector('.tl-exchange-btn')) return;
      const row = li.querySelector('.tl-row');
      if (!row) return;

      const link = document.createElement('a');
      link.className = 'tl-exchange-btn';
      link.href = 'https://maps.app.goo.gl/otkgnTG5Z6pu3Zz16';
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = '📍 換匯';
      link.setAttribute('aria-label', '開啟 Tiệm vàng Khải Hoàn III 換匯地圖');
      const existingMap = row.querySelector('.tl-map-btn');
      if (existingMap) row.insertBefore(link, existingMap);
      else row.append(link);
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

    let insurance = card.querySelector('.insurance-reminder');
    if (!insurance) {
      insurance = document.createElement('div');
      insurance.className = 'insurance-reminder';
      insurance.innerHTML = '<strong>🛡️ 出發前確認保險</strong><span>記得投保旅遊平安險＋旅遊不便險，確認保障期間涵蓋完整旅程。</span>';
      esim.insertAdjacentElement('afterend', insurance);
    }

    if (!card.querySelector('.shower-filter-reminder')) {
      const shower = document.createElement('div');
      shower.className = 'shower-filter-reminder';
      shower.innerHTML = '<strong>🚿 行前準備</strong><span>記得帶蓮蓬頭過濾器。</span>';
      insurance.insertAdjacentElement('afterend', shower);
    }
  }

  function applyTimelineExtras() {
    addTicketLink();
    addExchangeLink();
  }

  applyTimelineExtras();
  updatePreTripReminders();

  // Timeline 會定期重新 render；只在按鈕缺少或文字真的不同時才修改 DOM，避免 observer 自我觸發。
  const observer = new MutationObserver(applyTimelineExtras);
  document.querySelectorAll('.day-timeline').forEach(el => {
    observer.observe(el, {childList:true, subtree:true});
  });
})();

// 載入 9/15 巴拿山包車規劃；獨立檔案便於之後訂車後直接更新狀態。
(() => {
  if (document.querySelector('script[data-bana-plan]')) return;
  const script = document.createElement('script');
  script.src = 'd2-bana-fix.js';
  script.dataset.banaPlan = '1';
  document.body.append(script);
})();