// 9/14 晚餐後預排行程：龍橋東岸散步，再到 BALI Spa • Cafe 做越式養生洗頭。
(() => {
  const freeEvening = itinerary.find(i => i.id === 'd1-free2');
  if (freeEvening) {
    freeEvening.start = '2026-09-14T20:00:00+07:00';
    freeEvening.end = '2026-09-14T21:00:00+07:00';
    freeEvening.startDate = new Date(freeEvening.start);
    freeEvening.endDate = new Date(freeEvening.end);
    freeEvening.title = '龍橋東岸散步';
    freeEvening.detail = '約 45～60 分鐘｜鯉魚化龍像 → 愛情橋 → 韓江河畔 → 龍橋夜景';
    freeEvening.type = 'planned';
    freeEvening.important = false;
    freeEvening.destination = {
      name:'DHC Marina／Cá Chép Hóa Rồng（鯉魚化龍像）',
      mapQuery:'DHC Marina Ca Chep Hoa Rong Da Nang'
    };
  }

  if (!itinerary.find(i => i.id === 'd1-bali-headspa')) {
    itinerary.push({
      id:'d1-bali-headspa',
      day:'2026-09-14',
      start:'2026-09-14T21:15:00+07:00',
      end:'2026-09-14T22:00:00+07:00',
      title:'BALI Spa • Cafe｜越式養生洗頭',
      detail:'Wellness Hair Wash & Head Spa｜吃飯時再訂位｜營業至 22:00',
      type:'planned',
      important:false,
      destination:{
        name:'BALI Spa • Cafe',
        mapQuery:'BALI Spa Cafe 485 Tran Hung Dao An Hai Da Nang Vietnam'
      },
      zone:DANANG_TZ,
      startDate:new Date('2026-09-14T21:15:00+07:00'),
      endDate:new Date('2026-09-14T22:00:00+07:00')
    });
  }

  try { updateLiveMode(); } catch (_) {}
})();