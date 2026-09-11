// 將推薦行程整合進每日時間線：主卡簡潔，展開後每個地點都有名稱、地址與 Google Maps。
(() => {
  const ticketIndex = itinerary.findIndex(i => i.id === 'd3-yoasobi-ticket');
  if (ticketIndex >= 0) itinerary.splice(ticketIndex, 1);

  // 9/15 已有明確的巴拿山與晚間 Klook 行程，取代原本「完整自由日」，讓現在／下一個行程與倒數能正確判斷。
  const d2Items = [
    {id:'d2-breakfast',day:'2026-09-15',start:'2026-09-15T00:00:00+07:00',end:'2026-09-15T10:00:00+07:00',title:'早餐／飯店準備',type:'free',destination:destinations.hotel,zone:DANANG_TZ},
    {id:'d2-bana',day:'2026-09-15',start:'2026-09-15T10:00:00+07:00',end:'2026-09-15T18:00:00+07:00',title:'巴拿山 Sun World Ba Na Hills',detail:'10:00 從飯店出發；預計 18:00 回到飯店',type:'activity',important:true,zone:DANANG_TZ},
    {id:'d2-hotel-return',day:'2026-09-15',start:'2026-09-15T18:00:00+07:00',end:'2026-09-15T19:00:00+07:00',title:'回飯店／準備 Klook Tour',detail:'巴拿山預計 18:00 回到 Peninsula Hotel Danang',type:'transfer',important:true,destination:destinations.hotel,zone:DANANG_TZ},
    {id:'d2-klook-food-tour',day:'2026-09-15',start:'2026-09-15T19:00:00+07:00',end:'2026-09-15T22:00:00+07:00',title:'米其林街頭美食與精釀啤酒私人機車之旅',detail:'Klook｜19:00 集合',type:'activity',important:true,zone:DANANG_TZ},
    {id:'d2-free-night',day:'2026-09-15',start:'2026-09-15T22:00:00+07:00',end:'2026-09-15T23:59:59+07:00',title:'Tour 後自由活動',type:'free',zone:DANANG_TZ}
  ].map(i=>({...i,startDate:new Date(i.start),endDate:new Date(i.end)}));
  for(let i=itinerary.length-1;i>=0;i--){if(itinerary[i].day==='2026-09-15')itinerary.splice(i,1)}
  itinerary.push(...d2Items);

  const groups = {
    '2026-09-14': [
      {
        time:'午餐', title:'午餐輕食', detail:'飯店附近簡單吃，不要太撐；18:00 還有海鮮聚餐。', before:'18:00',
        places:[
          {name:'Bánh mì / Phở / Bún bò（飯店周邊搜尋）', address:'Peninsula Hotel Danang 周邊', note:'三選一即可，依當下位置找最近的。', map:'https://www.google.com/maps/search/Banh+mi+Pho+Bun+bo+near+Peninsula+Hotel+Danang'}
        ]
      },
      {
        time:'下午', title:'咖啡＋伴手禮', detail:'建議挑 1～2 站即可，不需要全部跑。', before:'18:00',
        places:[
          {name:'WONDERLUST - Coffee & Souvenir', address:'96 Trần Phú, Hải Châu, Đà Nẵng', note:'主選：咖啡＋伴手禮一次處理。', map:'https://www.google.com/maps/search/WONDERLUST+Coffee+Souvenir+96+Tran+Phu+Da+Nang'},
          {name:'Trình cà phê - Chợ Hàn', address:'Bạch Đằng, Hải Châu, Đà Nẵng', note:'想喝越南咖啡可選。', map:'https://www.google.com/maps/search/Trinh+ca+phe+Cho+Han+Da+Nang'},
          {name:'LỤC LAM', address:'104 Trần Phú, Hải Châu, Đà Nẵng', note:'茶、巧克力、咖啡與伴手禮。', map:'https://www.google.com/maps/search/LUC+LAM+104+Tran+Phu+Da+Nang'},
          {name:'Star Kitchen Souvenir Gift Shop - Danang', address:'75 Trần Quốc Toản, Hải Châu, Đà Nẵng', note:'伴手禮備選。', map:'https://www.google.com/maps/search/Star+Kitchen+75+Tran+Quoc+Toan+Da+Nang'},
          {name:'Dragon Market', address:'49 Trần Bạch Đằng, An Hải, Đà Nẵng', note:'靠近美溪沙灘，適合順路補小物。', map:'https://www.google.com/maps/search/Dragon+Market+49+Tran+Bach+Dang+Da+Nang'}
        ]
      },
      {
        time:'16:00', title:'美溪沙灘', detail:'散步、看海，之後準備前往晚餐。', before:'18:00',
        places:[
          {name:'My Khe Beach', address:'Võ Nguyên Giáp, Đà Nẵng', note:'抓約 45～60 分鐘即可。', map:'https://www.google.com/maps/search/My+Khe+Beach+Da+Nang'}
        ]
      },
      {
        time:'20:00後', title:'夜市・龍橋・越式洗頭', detail:'晚餐後依體力選擇，不必全部完成。', after:'晚餐後自由安排',
        places:[
          {name:'Sơn Trà Night Market', address:'Mai Hắc Đế, Sơn Trà, Đà Nẵng', note:'逛夜市、小吃、伴手禮。', map:'https://www.google.com/maps/search/Son+Tra+Night+Market+Da+Nang'},
          {name:'Dragon Bridge', address:'Cầu Rồng, Đà Nẵng', note:'可搭配愛情橋、韓江河畔散步。', map:'https://www.google.com/maps/search/Dragon+Bridge+Da+Nang'},
          {name:'BALI Spa • Cafe', address:'485 Trần Hưng Đạo, An Hải, Đà Nẵng', note:'越式養生洗頭／Head Spa；晚餐時再決定是否訂位。', map:'https://www.google.com/maps/search/BALI+Spa+Cafe+485+Tran+Hung+Dao+Da+Nang'}
        ]
      }
    ],
    '2026-09-15': [
      {
        time:'巴拿山', title:'白天安排', detail:'10:00 飯店出發；午餐山上解決。預計 18:00 回到飯店，接著準備 19:00 Klook Tour。', before:'18:00',
        places:[
          {name:'Sun World Ba Na Hills', address:'Hòa Ninh, Hòa Vang, Đà Nẵng', note:'白天主要行程。', map:'https://www.google.com/maps/search/Sun+World+Ba+Na+Hills'},
          {name:'Peninsula Hotel Danang', address:'Sơn Trà, Đà Nẵng', note:'巴拿山預計 18:00 回到飯店。', map:'https://www.google.com/maps/search/Peninsula+Hotel+Danang'}
        ]
      },
      {
        time:'19:00', title:'米其林街頭美食與精釀啤酒私人機車之旅', detail:'Klook 已購買行程；18:00 回飯店後整理，19:00 前往指定集合地點。', after:'19:00',
        places:[
          {name:'Klook Tour 集合地點', address:'依 Klook 指定 Google Maps 地點', note:'19:00 集合，出發前直接用此連結導航。', map:'https://maps.app.goo.gl/HuasPNrby1p1vp4Z7'},
          {name:'Klook 行程頁', address:'米其林街頭美食與精釀啤酒私人機車之旅', note:'已購買行程，可快速開啟訂購頁確認內容。', map:'https://www.klook.com/zh-TW/activity/224232-da-nang-michelin-street-foods-craft-beer-tasting-private-motorbike-tour/?spm=BookingDetail.ActivityCard&clickId=afd505550c'},
          {name:'Cầu Tình Yêu - Love Pier', address:'Trần Hưng Đạo, An Hải, Đà Nẵng', note:'Tour 可能停靠；實際以當天安排為準。', map:'https://www.google.com/maps/search/Cau+Tinh+Yeu+Da+Nang'},
          {name:'Dragon Bridge', address:'Cầu Rồng, Đà Nẵng', note:'Tour 可能停靠；實際以當天安排為準。', map:'https://www.google.com/maps/search/Dragon+Bridge+Da+Nang'},
          {name:'APEC Park', address:'Bình Hiên, Hải Châu, Đà Nẵng', note:'Tour 可能停靠；實際以當天安排為準。', map:'https://www.google.com/maps/search/APEC+Park+Da+Nang'},
          {name:'Chè Liên', address:'Đà Nẵng', note:'Tour 可能停靠；實際以當天安排為準。', map:'https://www.google.com/maps/search/Che+Lien+Da+Nang'},
          {name:'Hương Bia - Danang Craft Beer', address:'18 Tạ Mỹ Duật, An Hải, Đà Nẵng', note:'Tour 可能停靠；實際以當天安排為準。', map:'https://www.google.com/maps/search/Huong+Bia+18+Ta+My+Duat+Da+Nang'}
        ]
      }
    ],
    '2026-09-16': [
      {
        time:'備案', title:'餐廳備案', detail:'只有臨時需要替代餐廳時再開。',
        places:[
          {name:'Pizza 4P’s Indochina Đà Nẵng', address:'Indochina Riverside Towers 2F, 74 Bạch Đằng, Hải Châu, Đà Nẵng', note:'不放進主行程，只保留快速導航。', map:'https://www.google.com/maps/search/Pizza+4Ps+Indochina+74+Bach+Dang+Da+Nang'}
        ]
      }
    ],
    '2026-09-17': [
      {
        time:'白天', title:'會安古城順遊', detail:'以古城散步為主，不把每個景點拆成固定時段。',
        places:[
          {name:'Hoi An Ancient Town', address:'Phường Minh An, Hội An', note:'整天主區域。', map:'https://www.google.com/maps/search/Hoi+An+Ancient+Town'},
          {name:'Japanese Covered Bridge', address:'Phường Minh An, Hội An', note:'古城內順遊。', map:'https://www.google.com/maps/search/Japanese+Covered+Bridge+Hoi+An'},
          {name:'Fujian Assembly Hall', address:'46 Trần Phú, Hội An', note:'古城內順遊。', map:'https://www.google.com/maps/search/Fujian+Assembly+Hall+46+Tran+Phu+Hoi+An'}
        ]
      },
      {
        time:'午餐', title:'會安特色料理', detail:'Cao lầu 或 White Rose 擇一主餐方向。',
        places:[
          {name:'White Rose Restaurant', address:'533 Hai Bà Trưng, Hội An', note:'白玫瑰餃／會安特色料理。', map:'https://www.google.com/maps/search/White+Rose+Restaurant+533+Hai+Ba+Trung+Hoi+An'},
          {name:'Cao lầu（古城周邊搜尋）', address:'Hoi An Ancient Town 周邊', note:'依當下位置找順路店家。', map:'https://www.google.com/maps/search/Cao+lau+Hoi+An+Ancient+Town'}
        ]
      },
      {
        time:'下午', title:'按摩備選', detail:'走累再安排，按摩後繼續留在古城等夜色。',
        places:[
          {name:'Five Senses Spa Hoi An', address:'14 Phan Bội Châu, Hội An', note:'古城附近按摩備選。', map:'https://www.google.com/maps/search/Five+Senses+Spa+14+Phan+Boi+Chau+Hoi+An'},
          {name:'Metta Spa & Massage Hoi An', address:'54 Phan Bội Châu, Hội An', note:'按摩備選。', map:'https://www.google.com/maps/search/Metta+Spa+54+Phan+Boi+Chau+Hoi+An'}
        ]
      }
    ],
    '2026-09-18': [
      {
        time:'早餐', title:'飯店附近就好', detail:'整理行李優先，不另外跑遠景點。', before:'10:30',
        places:[
          {name:'Peninsula Hotel Danang 周邊咖啡', address:'Sơn Trà, Đà Nẵng', note:'有時間才喝，避免影響 10:30 機場集合。', map:'https://www.google.com/maps/search/Coffee+near+Peninsula+Hotel+Danang'}
        ]
      }
    ]
  };

  const style = document.createElement('style');
  style.textContent = `
    .trip-day.itinerary-merged > h3,
    .trip-day.itinerary-merged > ul:not(.day-timeline),
    .trip-day.itinerary-merged > p,
    .trip-day.itinerary-merged > .links{display:none!important}
    .day-timeline .tl-extra .tl-row{border:1px solid #eadfca!important;background:#fffaf1!important;box-shadow:0 4px 14px rgba(90,65,20,.05)!important}
    .rec-details{width:100%;min-width:0}
    .rec-details summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12.5px;font-weight:800;color:#956518;margin-top:5px;min-height:28px}
    .rec-details summary::-webkit-details-marker{display:none}
    .rec-details summary::after{content:'⌄';font-size:18px;line-height:1;transition:transform .18s ease}
    .rec-details[open] summary::after{transform:rotate(180deg)}
    .rec-list{display:flex;flex-direction:column;gap:8px;margin-top:9px;padding-top:9px;border-top:1px solid #eadfca}
    .rec-place{display:grid;grid-template-columns:minmax(0,1fr) 38px;gap:9px;align-items:center;padding:9px 0}
    .rec-place + .rec-place{border-top:1px solid #eee5d6}
    .rec-name{font-size:14px;font-weight:900;line-height:1.35;color:#252a2e;overflow-wrap:anywhere}
    .rec-address{font-size:11.5px;line-height:1.45;color:#78818a;margin-top:2px;overflow-wrap:anywhere}
    .rec-note{font-size:12px;line-height:1.45;color:#5f6870;margin-top:3px;overflow-wrap:anywhere}
    .rec-map-btn{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#edf5fc;color:#2474b8;text-decoration:none;flex:0 0 auto}
    .rec-map-btn::before{content:'⌖';font-size:20px;font-weight:800;line-height:1}
    .ticket-reminder{margin:10px 0 12px;padding:11px 12px;border-radius:13px;background:#fff7ef;border:1px solid #f0d4b8;display:flex;align-items:center;justify-content:space-between;gap:10px}
    .ticket-reminder-copy{min-width:0}.ticket-reminder strong{display:block;font-size:13px;color:#9c4c23}.ticket-reminder span{display:block;margin-top:2px;font-size:11.5px;line-height:1.4;color:#6e6259}
    .ticket-reminder a{flex:0 0 auto;min-height:34px;padding:7px 9px;border-radius:10px;border:1px solid #e3b890;background:#fff;color:#9c4c23;text-decoration:none;font-size:11px;font-weight:900}
    @media(max-width:390px){.rec-place{grid-template-columns:minmax(0,1fr) 34px}.rec-map-btn{width:34px;height:34px}.ticket-reminder{align-items:flex-start;flex-direction:column}.ticket-reminder a{align-self:flex-end}}
  `;
  document.head.append(style);

  function makeGroup(group){
    const li=document.createElement('li');
    li.className='tl-extra recommend';
    const row=document.createElement('div'); row.className='tl-row';
    const timeBlock=document.createElement('div'); timeBlock.className='tl-time-block';
    const time=document.createElement('span'); time.className='tl-time'; time.textContent=group.time; timeBlock.append(time);
    const copy=document.createElement('div'); copy.className='tl-copy';
    const primary=document.createElement('div'); primary.className='tl-primary';
    const title=document.createElement('div'); title.className='tl-title'; title.textContent=group.title; primary.append(title);
    if(group.detail){const detail=document.createElement('div'); detail.className='tl-inline-detail'; detail.textContent=group.detail; primary.append(detail)}
    const details=document.createElement('details'); details.className='rec-details';
    const summary=document.createElement('summary'); summary.textContent=`查看推薦 ${group.places.length} 個地點`; details.append(summary);
    const list=document.createElement('div'); list.className='rec-list';
    group.places.forEach(place=>{
      const item=document.createElement('div'); item.className='rec-place';
      const text=document.createElement('div');
      const name=document.createElement('div'); name.className='rec-name'; name.textContent=place.name;
      const address=document.createElement('div'); address.className='rec-address'; address.textContent=place.address;
      text.append(name,address);
      if(place.note){const note=document.createElement('div'); note.className='rec-note'; note.textContent=place.note; text.append(note)}
      const map=document.createElement('a'); map.className='rec-map-btn'; map.href=place.map; map.target='_blank'; map.rel='noopener'; map.title=place.map.includes('klook.com')?'Klook':'Google Maps'; map.setAttribute('aria-label',`${map.title}：${place.name}`);
      item.append(text,map); list.append(item);
    });
    details.append(list); primary.append(details); copy.append(primary); row.append(timeBlock,copy); li.append(row);
    return li;
  }

  function findTarget(timeline,needle){return [...timeline.children].find(el=>!el.classList.contains('tl-extra')&&el.textContent.includes(needle))||null}
  function mergeGroups(){
    Object.entries(groups).forEach(([day,items])=>{
      const section=document.querySelector(`.trip-day[data-tab-day="${day}"]`); const timeline=section?.querySelector('.day-timeline');
      if(!section||!timeline)return;
      timeline.querySelectorAll('.tl-extra').forEach(el=>el.remove());
      items.forEach(group=>{
        const card=makeGroup(group);
        if(group.before){const target=findTarget(timeline,group.before); target?timeline.insertBefore(card,target):timeline.append(card)}
        else if(group.after){const target=findTarget(timeline,group.after); target?target.insertAdjacentElement('afterend',card):timeline.append(card)}
        else timeline.append(card);
      });
      section.classList.add('itinerary-merged');
    });
    addTicketReminder();
  }

  function addTicketReminder(){
    const section=document.querySelector('.trip-day[data-tab-day="2026-09-16"]'); if(!section)return;
    section.querySelector('.ticket-reminder')?.remove();
    const reminder=document.createElement('aside'); reminder.className='ticket-reminder';
    reminder.innerHTML='<div class="ticket-reminder-copy"><strong>⏰ 11:00｜YOASOBI Ticket Plus 搶票提醒</strong><span>手機操作提醒，不算行程，不影響「現在／下一個」判斷。</span></div><a href="https://ticketplus.com.tw/" target="_blank" rel="noopener">Ticket Plus</a>';
    const timeline=section.querySelector('.day-timeline'); timeline?.insertAdjacentElement('afterend',reminder);
  }

  try{if(typeof window.renderDayTimelines==='function')window.renderDayTimelines(getNow())}catch(_){ }
  try{if(typeof updateLiveMode==='function')updateLiveMode()}catch(_){ }
  mergeGroups();
  if(typeof window.renderDayTimelines==='function'&&!window.renderDayTimelines.__recommendationWrapped){
    const original=window.renderDayTimelines;
    const wrapped=function(...args){const result=original.apply(this,args); mergeGroups(); return result};
    wrapped.__recommendationWrapped=true; window.renderDayTimelines=wrapped;
  }
  setTimeout(mergeGroups,0);
})();