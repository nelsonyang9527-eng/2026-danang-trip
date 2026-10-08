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
    card.append(element('span',statusLabels[tripStatus(trip)],'badge'),element('h2',trip.title));
    const time = element('p',`${trip.start} — ${trip.end}`,'dates');
    card.append(time,element('p',trip.summary));
    const link = element('a',history?'回顧旅程 →':'查看行程 →','button');
    // Manifest links are relative, remain under the GitHub Pages project path.
    if (!/^trips\/[a-z0-9-]+\/$/.test(trip.url)) throw new Error('旅程路徑無效');
    link.href=trip.url;card.append(link);root.append(card);
  }
}
loadJSON('data/trips.json').then(trips=>{render(trips);setInterval(()=>render(trips),60000)}).catch(()=>{root.replaceChildren(element('p','旅程資料暫時無法載入，請重新整理後再試。','empty'))});
