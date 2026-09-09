// 主要地點地圖穩定性修正：避免手機／LINE 內建瀏覽器展開後 Leaflet 尺寸沒有正確重算。
(() => {
  const oldToggle = document.getElementById('mapToggle');
  const collapse = document.getElementById('mapCollapse');
  const mapEl = document.getElementById('map');
  if (!oldToggle || !collapse || !mapEl) return;

  // 複製按鈕，移除 app.js 舊的 click handler，改由這裡統一控制，避免重複切換。
  const toggle = oldToggle.cloneNode(true);
  oldToggle.replaceWith(toggle);

  function refreshMap() {
    try {
      if (typeof L === 'undefined') throw new Error('Leaflet not loaded');
      initMap();
      renderMapForTab(currentTab || 'all');
      if (map) {
        map.invalidateSize({ pan: false });
        requestAnimationFrame(() => {
          map.invalidateSize({ pan: false });
          renderMapForTab(currentTab || 'all');
        });
      }
    } catch (err) {
      console.error('Map refresh failed', err);
      mapEl.innerHTML = '<div style="padding:22px;font-size:14px;line-height:1.6;color:#5f6975">地圖暫時無法載入，請重新整理頁面後再試。</div>';
    }
  }

  toggle.addEventListener('click', () => {
    const open = collapse.hidden;
    collapse.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) return;

    // hidden → visible 後分幾個 frame 重算，對 LINE WebView / iOS Safari 比較穩定。
    requestAnimationFrame(refreshMap);
    setTimeout(refreshMap, 100);
    setTimeout(refreshMap, 350);
  });

  window.addEventListener('orientationchange', () => {
    if (!collapse.hidden) setTimeout(refreshMap, 180);
  });
})();

// 9/16 改為博物館自由參觀日，不再顯示「預計安排一日導覽」等舊導覽占位內容。
(() => {
  if (typeof itinerary === 'undefined') return;

  const chamMuseum = {
    name:'Museum of Cham Sculpture 占婆雕刻博物館',
    mapQuery:'Museum of Cham Sculpture Da Nang'
  };
  const danangMuseum = {
    name:'Da Nang Museum 峴港博物館',
    mapQuery:'Da Nang Museum'
  };
  const conMarket = {
    name:'Chợ Cồn 共市場',
    mapQuery:'Cho Con Da Nang'
  };

  // 移除 9/16 舊自由日、導覽占位、搶票切段與集合拆卡，避免同一天出現重複資訊。
  for (let i = itinerary.length - 1; i >= 0; i -= 1) {
    if (itinerary[i].day === '2026-09-16') itinerary.splice(i, 1);
  }

  const makeItem = item => ({
    ...item,
    zone:DANANG_TZ,
    startDate:new Date(item.start),
    endDate:new Date(item.end)
  });

  itinerary.push(
    makeItem({
      id:'d3-cham-museum', day:'2026-09-16',
      start:'2026-09-16T09:30:00+07:00', end:'2026-09-16T10:45:00+07:00',
      title:'占婆雕刻博物館', detail:'自由參觀，不排導覽',
      type:'museum', destination:chamMuseum
    }),
    makeItem({
      id:'d3-danang-museum', day:'2026-09-16',
      start:'2026-09-16T11:15:00+07:00', end:'2026-09-16T12:15:00+07:00',
      title:'峴港博物館', detail:'自由參觀，不排導覽',
      type:'museum', destination:danangMuseum
    }),
    makeItem({
      id:'d3-con-market', day:'2026-09-16',
      start:'2026-09-16T14:15:00+07:00', end:'2026-09-16T16:30:00+07:00',
      title:'Chợ Cồn 共市場', detail:'逛市場、吃小吃，依現場狀況彈性安排',
      type:'market', destination:conMarket
    }),
    makeItem({
      id:'d3-dinner', day:'2026-09-16',
      start:'2026-09-16T18:00:00+07:00', end:'2026-09-16T21:00:00+07:00',
      title:'BRILLIANT SEAFOOD',
      detail:'PPA 全公司聚餐｜6桌｜建議 17:30～17:35 從飯店出發，18:00 前抵達',
      type:'meal', important:true, destination:destinations.brilliant
    })
  );

  itinerary.sort((a,b) => a.startDate - b.startDate);

  const section = document.querySelector('.trip-day[data-tab-day="2026-09-16"]');
  if (section) {
    const tag = section.querySelector('.toprow .tag');
    if (tag) tag.textContent = '博物館 + 共市場 + 聚餐';
    const badge = section.querySelector('.badge');
    if (badge) badge.textContent = '占婆雕刻博物館・峴港博物館・共市場・公司聚餐';
  }

  try {
    if (typeof renderDayTimelines === 'function') renderDayTimelines(getNow());
    if (typeof updateLiveMode === 'function') updateLiveMode();
  } catch (err) {
    console.error('9/16 museum itinerary refresh failed', err);
  }
})();
