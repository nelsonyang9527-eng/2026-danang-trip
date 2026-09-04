// UI 小修：移除最新動態旅行圖示；頁面往下滑時顯示右下角 TOP 按鈕。
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .live-kicker::before{content:none!important;display:none!important}
    .live-kicker{gap:0!important}
    .back-to-top{
      position:fixed;right:16px;bottom:18px;z-index:2500;
      min-width:48px;height:48px;padding:0 12px;border:1px solid #d8dee7;border-radius:999px;
      background:rgba(255,255,255,.94);color:#31506b;
      font:inherit;font-size:12px;font-weight:900;letter-spacing:.4px;
      box-shadow:0 6px 20px rgba(15,23,32,.14);
      cursor:pointer;opacity:0;visibility:hidden;transform:translateY(8px);
      transition:opacity .18s ease,transform .18s ease,visibility .18s ease;
      backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)
    }
    .back-to-top.show{opacity:1;visibility:visible;transform:translateY(0)}
    .back-to-top:active{transform:scale(.96)}
    @media(max-width:520px){.back-to-top{right:12px;bottom:14px;min-width:46px;height:46px}}
  `;
  document.head.append(style);

  if (document.getElementById('backToTop')) return;
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.className = 'back-to-top';
  btn.type = 'button';
  btn.textContent = 'TOP';
  btn.setAttribute('aria-label', '回到頁面最上方');
  document.body.append(btn);

  function refresh() {
    btn.classList.toggle('show', window.scrollY > 420);
  }
  btn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll', refresh, {passive:true});
  refresh();
})();