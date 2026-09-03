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
