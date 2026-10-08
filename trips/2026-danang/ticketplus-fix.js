// Timeline 補充：YOASOBI 官網、第一天換匯、行前提醒。
(() => {
  const ticketItem = itinerary.find(i => i.id === 'd3-yoasobi-ticket');
  if (ticketItem) {
    ticketItem.title = 'YOASOBI 超惑星演唱會搶票';
    ticketItem.detail = 'Ticket Plus 遠大售票系統';
    ticketItem.important = true;
    ticketItem.veryImportant = true;
  }

  // 第一天下飛機後先回飯店；13:30 自由行程開始時再先去換匯。
  const arriveItem = itinerary.find(i => i.id === 'd1-arrive');
  if (arriveItem) {
    arriveItem.title = '抵達峴港／前往飯店';
    arriveItem.detail = '遊覽車 B車';
  }

  const d1Free = itinerary.find(i => i.id === 'd1-free1');
  if (d1Free) {
    d1Free.title = '自由行程';
    d1Free.detail = '先換匯，再自由選擇：美溪沙灘／咖啡／按摩 SPA／隨意逛';
    delete d1Free.destination;
  }

  // 第一天下方已由 Timeline 完整呈現，不再顯示空閒度／可塞時段／適合安排。
  const d1Card = document.querySelector('.trip-day[data-tab-day="2026-09-14"]');
  if (d1Card) {
    d1Card.querySelector('.badge')?.remove();
    [...d1Card.querySelectorAll('h3')].forEach(h => {
      const text = h.textContent.trim();
      if (text === '可塞時段' || text === '適合安排') {
        const p = h.nextElementSibling;
        if (p?.tagName === 'P') p.remove();
        h.remove();
      }
    });
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
    .shower-filter-reminder span{font-size:13px;line-height:1.65;color:#5f6972}
    .travel-safety-reminder{margin:-6px 0 18px;padding:14px 15px;border-radius:14px;background:#fff3f1;border:1px solid #f1cbc5;border-left:5px solid #cc5948;display:flex;flex-direction:column;gap:5px}
    .travel-safety-reminder strong{font-size:16px;color:#8f3025}
    .travel-safety-reminder span{font-size:13px;line-height:1.7;color:#65504c}
    @media(max-width:520px){
      .tl-ticket-btn,.tl-exchange-btn{min-width:46px;padding:8px;font-size:0}
      .tl-ticket-btn::before{content:'官網';font-size:12px}
      .tl-exchange-btn::before{content:'換匯';font-size:12px}
    }
  `;
  document.head.append(style);

  function addTicketLink() {
    document.querySelectorAll('.day-timeline li').forEach(li => {
      const titleEl = li.querySelector('.tl-title');
      const title = titleEl?.textContent?.trim();
      if (title !== 'YOASOBI 超惑星演唱會搶票' && title !== 'Ticket Plus 遠大售票系統') return;

      // 新舊 Timeline 樣式都能修正回正確顯示：主標題是任務，補充說明才是售票系統。
      if (titleEl && titleEl.textContent !== 'YOASOBI 超惑星演唱會搶票') {
        titleEl.textContent = 'YOASOBI 超惑星演唱會搶票';
      }
      const detail = li.querySelector('.tl-inline-detail, .tl-detail');
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
      if (title !== '自由行程') return;

      const time = li.querySelector('.tl-time')?.textContent?.trim();
      if (time !== '13:30') return;

      const detail = li.querySelector('.tl-inline-detail, .tl-detail');
      const text = '先換匯，再自由選擇：美溪沙灘／咖啡／按摩 SPA／隨意逛';
      if (detail && detail.textContent !== text) detail.textContent = text;

      // 這段不固定綁 Peninsula Hotel，避免自由行程下方多顯示飯店地點。
      li.querySelector('.tl-dest')?.remove();
      li.querySelector('.tl-map-btn')?.remove();

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

    let insurance = card.querySelector('.insurance-reminder');
    if (!insurance) {
      insurance = document.createElement('div');
      insurance.className = 'insurance-reminder';
      insurance.innerHTML = '<strong>🛡️ 出發前確認保險</strong><span>記得投保旅遊平安險＋旅遊不便險，確認保障期間涵蓋完整旅程。</span>';
      esim.insertAdjacentElement('afterend', insurance);
    }

    let prep = card.querySelector('.shower-filter-reminder');
    const prepHtml = '<strong>🧳 行前準備</strong><span>記得帶蓮蓬頭過濾器、萬國插座轉接頭；濕紙巾與面紙可多準備一些，外出時比較方便。</span>';
    if (prep) {
      if (prep.innerHTML !== prepHtml) prep.innerHTML = prepHtml;
    } else {
      prep = document.createElement('div');
      prep.className = 'shower-filter-reminder';
      prep.innerHTML = prepHtml;
      insurance.insertAdjacentElement('afterend', prep);
    }

    let safety = card.querySelector('.travel-safety-reminder');
    const safetyHtml = '<strong>⚠️ 當地注意事項</strong><span>飲食：路邊攤飲料的冰塊來源較難確認，建議直接說「No ice」；能避免就避免，喝水優先買便利商店／超市的瓶裝水。<br>廁所：部分廁所不提供衛生紙，建議隨身帶面紙；衛生紙是否能沖馬桶依現場標示，部分場所需丟垃圾桶。公廁有些會收費，約數千越南盾（約台幣幾元）。<br>財物：手機、錢包、相機與包包不要離身；騎車經過的搶奪案件確實存在，在路邊使用手機或背單肩包時要特別留意。</span>';
    if (safety) {
      if (safety.innerHTML !== safetyHtml) safety.innerHTML = safetyHtml;
    } else {
      safety = document.createElement('div');
      safety.className = 'travel-safety-reminder';
      safety.innerHTML = safetyHtml;
      prep.insertAdjacentElement('afterend', safety);
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

// 補強主要地點地圖在 LINE / iOS 等行動瀏覽器的展開與尺寸重算。
(() => {
  if (document.querySelector('script[data-map-fix]')) return;
  const script = document.createElement('script');
  script.src = 'map-fix.js';
  script.dataset.mapFix = '1';
  document.body.append(script);
})();