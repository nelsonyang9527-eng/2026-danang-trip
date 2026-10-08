import {loadJSON, tripStatus, statusLabels, element} from './travel.js';
const root = document.querySelector('#trips');
const history = document.body.dataset.view === 'history';
function render(trips) {
  root.replaceChildren();
  const selected = history ? trips.filter(t => tripStatus(t) === 'completed').sort((a,b)=>b.end.localeCompare(a.end)) : trips.filter(t=>tripStatus(t)!=='completed').sort((a,b)=>a.start.localeCompare(b.start));
  document.querySelector('#tripCount').textContent = history ? `${selected.length} 段旅程紀錄` : `${selected.length} 段即將出發或進行中的旅程`;
  if (!selected.length) root.append(element('p', history?'還沒有已結束的旅程。':'目前沒有待出發的旅程，可到歷史軌跡回顧。','empty'));
  for (const trip of selected) {
    const card = element('article', undefined, 'trip-card');
    card.dataset.status = tripStatus(trip);
    const cover = element('div', undefined, 'trip-cover');
    const destinations = {'2026-busan':['busan.svg','BUSAN · SOUTH KOREA'], '2026-danang':['danang.svg','DA NANG · VIETNAM']};
    const destination = destinations[trip.id];
    if (destination) {
      const illustration = element('img');
      illustration.src = `assets/images/${destination[0]}`;
      illustration.alt = ''; illustration.width = 800; illustration.height = 300;
      cover.append(illustration);
    }
    cover.append(element('span', destination ? destination[1] : 'A NEW JOURNEY', 'cover-label'));
    const body = element('div', undefined, 'trip-body');
    const meta = element('div', undefined, 'trip-meta');
    meta.append(element('span',statusLabels[tripStatus(trip)],'badge'));
    const time = element('p',`${trip.start} — ${trip.end}`,'dates');
    meta.append(time);
    body.append(meta,element('h2',trip.title),element('p',trip.summary));
    const link = element('a', undefined, 'button');
    link.append(element('span',history?'回顧這段旅程':'打開旅行計畫'),element('span','↗'));
    // Manifest links are relative, remain under the GitHub Pages project path.
    if (!/^trips\/[a-z0-9-]+\/$/.test(trip.url)) throw new Error('旅程路徑無效');
    link.href=trip.url;body.append(link);card.append(cover,body);root.append(card);
  }
}
loadJSON('data/trips.json').then(trips=>{render(trips);setInterval(()=>render(trips),60000)}).catch(()=>{root.replaceChildren(element('p','旅程資料暫時無法載入，請重新整理後再試。','empty'))});
