import {loadJSON, tripStatus, statusLabels, element, publicLink} from './travel.js';
const labels={planned:'已規劃',tentative:'待確認',confirmed:'已確認',cancelled:'已取消'};
const root=document.querySelector('#days');
loadJSON('trip.json').then(trip=>{
  document.title=`${trip.title}｜travel`;
  document.querySelector('#title').textContent=trip.title;
  document.querySelector('#summary').textContent=trip.summary;
  document.querySelector('#dates').textContent=`${trip.start} — ${trip.end}`;
  function update(){
    document.querySelector('#status').textContent=statusLabels[tripStatus(trip)];
    document.querySelector('#clock').textContent=`台灣 ${new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())} · ${trip.timezoneLabel} ${new Intl.DateTimeFormat('zh-TW',{timeZone:trip.timezone,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())}`;
  }
  update();setInterval(update,30000);
  const tabs=document.querySelector('#tabs');
  function select(date){for(const card of root.children)card.hidden=date!=='all'&&card.dataset.date!==date;for(const button of tabs.children)button.setAttribute('aria-pressed',String(button.dataset.date===date))}
  for(const [date,label] of [['all','總覽'],...trip.days.map(day=>[day.date,day.date.slice(5)])]){
    const button=element('button',label,'tab');button.type='button';button.dataset.date=date;button.addEventListener('click',()=>select(date));tabs.append(button);
  }
  for(const day of trip.days){
    const card=element('section',undefined,'day-card');card.dataset.date=day.date;card.append(element('h2',`${day.date} · ${day.title}`));
    for(const event of day.events){
      const item=element('article',undefined,'event-card');item.id=event.id;
      item.append(element('span',labels[event.status],'event-status'),element('h3',event.title));
      if(event.start){const time=element('time',new Intl.DateTimeFormat('zh-TW',{timeZone:trip.timezone,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(event.start)));time.dateTime=event.start;item.append(time)}
      if(event.notes)item.append(element('p',event.notes));
      if(event.location)item.append(element('p',`地點：${event.location}`));
      for(const link of event.links||[])item.append(publicLink(link.label,link.url));
      card.append(item);
    }
    const links=element('div',undefined,'links');for(const link of day.links||[])links.append(publicLink(link.label,link.url));card.append(links);root.append(card);
  }
  const notes=document.querySelector('#notes');for(const note of trip.notes||[])notes.append(element('li',note));
  select('all');
}).catch(()=>{root.replaceChildren(element('p','行程資料暫時無法載入，請重新整理後再試。','empty'))});
