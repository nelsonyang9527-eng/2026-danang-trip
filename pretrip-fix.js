// 行前重點補充：保險與旅行社提供的網卡資訊。
(() => {
  const card = [...document.querySelectorAll('.card.all-only')]
    .find(el => el.querySelector('h2')?.textContent.trim() === '行前重點');
  if (!card) return;

  // 更新既有 eSIM 提醒，避免顯示成一定要另外購買。
  let esim = card.querySelector('.esim-reminder');
  if (esim) {
    esim.innerHTML = '<strong>📶 網路／eSIM</strong><span>旅行社會提供每人一張【5 日網卡｜每日 1GB｜流量用完降速】。若擔心流量不足，可再自行加買 eSIM 當備援。</span>';
  } else {
    esim = document.createElement('div');
    esim.className = 'esim-reminder';
    esim.innerHTML = '<strong>📶 網路／eSIM</strong><span>旅行社會提供每人一張【5 日網卡｜每日 1GB｜流量用完降速】。若擔心流量不足，可再自行加買 eSIM 當備援。</span>';
    const top = card.querySelector('.toprow');
    top?.insertAdjacentElement('afterend', esim);
  }

  if (!card.querySelector('.insurance-reminder')) {
    const insurance = document.createElement('div');
    insurance.className = 'insurance-reminder';
    insurance.innerHTML = '<strong>🛡️ 出發前確認保險</strong><span>記得投保旅遊平安險＋旅遊不便險，確認保障期間涵蓋完整旅程。</span>';
    esim.insertAdjacentElement('afterend', insurance);
  }

  const style = document.createElement('style');
  style.textContent = `
    .insurance-reminder{margin:-6px 0 18px;padding:14px 15px;border-radius:14px;background:#fff7e8;border:1px solid #f0d9a8;border-left:5px solid #d59125;display:flex;flex-direction:column;gap:4px}
    .insurance-reminder strong{font-size:16px;color:#8a5810}
    .insurance-reminder span{font-size:13px;line-height:1.55;color:#62594b}
  `;
  document.head.append(style);
})();