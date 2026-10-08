// Use the same date-switch scroll position on preserved historical pages.
document.querySelector('.day-tabs')?.addEventListener('click', event => {
  const button = event.target.closest('.day-tab');
  if (!button) return;
  requestAnimationFrame(() => {
    const bar = document.querySelector('.day-tabs-wrap');
    const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
    button.scrollIntoView({block:'nearest', inline:'nearest', behavior:'instant'});
    window.scrollTo({top:Math.max(0, bar.getBoundingClientRect().top + window.scrollY - navHeight), behavior:'instant'});
  });
});

// Completed trips use the compact shared trip header; historical time previews
// still retain the original live itinerary controls.
const historicalTitle = document.querySelector('#liveNowTitle');
function syncHistoricalHeader() {
  const ended = historicalTitle?.textContent.includes('旅程已結束') || false;
  document.querySelector('main').classList.toggle('is-history', ended);
  document.querySelector('#historyStatus').hidden = !ended;
}
if (historicalTitle) {
  syncHistoricalHeader();
  new MutationObserver(syncHistoricalHeader).observe(historicalTitle, {childList:true, subtree:true, characterData:true});
}
