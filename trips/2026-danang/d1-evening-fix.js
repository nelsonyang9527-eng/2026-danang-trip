// 9/14 晚餐後維持自由安排；夜市、龍橋與越式洗頭改由推薦折疊卡呈現，不參與「現在／下一個」判斷。
(() => {
  const evening = itinerary.find(i => i.id === 'd1-free2');
  if (evening) {
    evening.start = '2026-09-14T20:00:00+07:00';
    evening.end = '2026-09-14T23:59:59+07:00';
    evening.startDate = new Date(evening.start);
    evening.endDate = new Date(evening.end);
    evening.title = '晚餐後自由安排';
    evening.detail = '可選：山茶夜市／龍橋河畔散步／越式養生洗頭';
    evening.type = 'free';
    evening.important = false;
    delete evening.destination;
  }

  // 舊版曾把 BALI 洗頭排成固定時間節點；改回純推薦，避免影響即時行程。
  const oldBaliIndex = itinerary.findIndex(i => i.id === 'd1-bali-headspa');
  if (oldBaliIndex >= 0) itinerary.splice(oldBaliIndex, 1);

  document.querySelector('.summary.all-only')?.remove();
  try { updateLiveMode(); } catch (_) {}
})();