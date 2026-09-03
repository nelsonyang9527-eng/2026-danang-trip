// 9/17 會安規劃：目前仍在討論中，先標示為待確認行程。
(() => {
  const item = itinerary.find(i => i.id === 'd4-free');
  if (item) {
    item.title = '會安（討論中）';
    item.detail = '時間與交通方式待確認';
    item.type = 'planned';
    item.important = false;
  }

  const card = document.querySelector('.trip-day[data-tab-day="2026-09-17"]');
  if (card) {
    const tag = card.querySelector('.tag');
    if (tag) tag.textContent = '會安討論中';
    const badge = card.querySelector('.badge');
    if (badge) badge.textContent = '行程討論中';
  }

  try { updateLiveMode(); } catch (_) {}
})();