// 9/15 巴拿山包車規劃：中午 12:00 出發，上午留在飯店休息或附近走走。
(() => {
  const morning = itinerary.find(i => i.id === 'd2-free');
  if (morning) {
    morning.start = '2026-09-15T08:00:00+07:00';
    morning.end = '2026-09-15T12:00:00+07:00';
    morning.startDate = new Date(morning.start);
    morning.endDate = new Date(morning.end);
    morning.title = '飯店休息／附近走走';
    morning.detail = '上午自由安排，可在飯店休息或飯店附近散步';
    morning.type = 'free';
    morning.important = false;
    morning.bookingPending = false;
    morning.destination = destinations.hotel;
  }

  let bana = itinerary.find(i => i.id === 'd2-bana');
  if (!bana) {
    bana = {
      id:'d2-bana',
      day:'2026-09-15',
      start:'2026-09-15T12:00:00+07:00',
      end:'2026-09-15T18:00:00+07:00',
      title:'包車前往巴拿山',
      detail:'',
      type:'daytrip',
      important:true,
      bookingPending:true,
      zone:DANANG_TZ,
      startDate:new Date('2026-09-15T12:00:00+07:00'),
      endDate:new Date('2026-09-15T18:00:00+07:00')
    };
    itinerary.push(bana);
  }
  bana.detail = '推薦必逛：黃金橋／法國村／Fantasy Park｜尚未訂車｜12:00–18:00';

  // 9/15 已有巴拿山規劃，不再顯示舊的「空閒度／可塞時段／適合安排」。
  const d2Card = document.querySelector('.trip-day[data-tab-day="2026-09-15"]');
  if (d2Card) {
    d2Card.querySelector('.badge')?.remove();
    [...d2Card.querySelectorAll('h3')].forEach(h => {
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

      const detail = li.querySelector('.tl-detail');
      const text = '推薦必逛：黃金橋／法國村／Fantasy Park｜尚未訂車｜12:00–18:00';
      if (detail && detail.textContent !== text) detail.textContent = text;

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

  // Timeline 每 30 秒會重繪；僅在內容真的不同或按鈕不存在時才修改 DOM，避免 observer 迴圈。
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

// 載入 9/14 晚餐後的龍橋散步＋BALI 養生洗頭預排行程。
(() => {
  if (document.querySelector('script[data-d1-evening-plan]')) return;
  const script = document.createElement('script');
  script.src = 'd1-evening-fix.js';
  script.dataset.d1EveningPlan = '1';
  document.body.append(script);
})();