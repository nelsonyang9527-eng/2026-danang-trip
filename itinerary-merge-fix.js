// Keep merged suggestion cards attached after every timeline re-render.
(() => {
  const plans = {
    '2026-09-14': [
      { time: '午餐', title: 'Bánh mì / Phở / Bún bò', detail: '飯店附近輕食即可，不要吃太撐。', link: 'https://www.google.com/maps/search/Banh+mi+Pho+Bun+bo+near+Peninsula+Hotel+Danang', kind: 'recommend', before: '18:00' },
      { time: '下午', title: 'Wonderlust - Coffee & Souvenir', detail: '咖啡＋伴手禮，可一次解決。', link: 'https://www.google.com/maps/search/Wonderlust+Coffee+%26+Souvenir+Da+Nang', kind: 'recommend', before: '18:00' },
      { time: '備選', title: 'Trình cà phê / LỤC LAM / Star Kitchen / Dragon Market', detail: '依當下位置與時間挑一站即可，不必全部跑。', kind: 'optional', before: '18:00' },
      { time: '16:00', title: '美溪沙灘 My Khe Beach', detail: '散步、看海，之後準備前往晚餐。', link: 'https://www.google.com/maps/search/My+Khe+Beach+Da+Nang', kind: 'recommend', before: '18:00' }
    ],
    '2026-09-15': [
      { time: '午餐', title: '巴拿山上解決', detail: '依現場行程彈性安排。', kind: 'optional', before: '19:00' },
      { time: '回程', title: '接送時間待定', detail: '依現場狀況決定，回飯店後銜接晚間 Tour。', kind: 'optional', before: '19:00' },
      { time: 'Tour', title: '可能包含景點', detail: 'Love Pier、龍橋、APEC Park、Chè Liên、Hương Bia。', kind: 'optional' }
    ],
    '2026-09-16': [
      { time: '備案', title: 'Pizza 4P’s Indochina Đà Nẵng', detail: '臨時需要替代餐廳時再考慮。', link: 'https://www.google.com/maps/search/Pizza+4P%27s+Indochina+Da+Nang', kind: 'optional' }
    ],
    '2026-09-17': [
      { time: '白天', title: 'Hoi An Ancient Town 會安古城', detail: '慢慢逛古城，依序穿插日本橋、福建會館。', link: 'https://www.google.com/maps/search/Hoi+An+Ancient+Town', kind: 'recommend' },
      { time: '順遊', title: '日本橋＋福建會館', detail: '古城內步行安排，不必切成獨立大區塊。', kind: 'optional' },
      { time: '午餐', title: 'Cao lầu / White Rose', detail: '吃會安特色料理。', link: 'https://www.google.com/maps/search/White+Rose+Restaurant+Hoi+An', kind: 'recommend' },
      { time: '下午', title: '按摩備選', detail: 'Five Senses Spa / Metta Spa；走累再安排。', kind: 'optional' },
      { time: '傍晚', title: '留在古城看夜色', detail: '按摩後再回古城散步，感受點燈後氣氛。', kind: 'recommend' }
    ],
    '2026-09-18': [
      { time: '早餐', title: '附近咖啡＋整理行李', detail: '出發前以飯店周邊為主，不再跑遠景點。', kind: 'recommend', before: '10:30' },
      { time: '回台後', title: '接機接送', detail: '依實際航班抵達時間安排。', kind: 'optional' }
    ]
  };

  const makeCard = ({ time = '建議', title, detail = '', link = '', kind = 'optional' }) => {
    const li = document.createElement('li');
    li.className = `tl-extra ${kind}`;
    li.innerHTML = `<div class="tl-row"><div class="tl-time-block"><span class="tl-time">${time}</span></div><div class="tl-copy"><div class="tl-primary"><div class="tl-title">${title}</div>${detail ? `<div class="tl-inline-detail">${detail}</div>` : ''}${link ? `<div class="links"><a class="mapbtn" href="${link}" target="_blank" rel="noopener">📍 導航</a></div>` : ''}</div></div></div>`;
    return li;
  };

  function mergeExtras() {
    Object.entries(plans).forEach(([day, items]) => {
      const section = document.querySelector(`.trip-day[data-tab-day="${day}"]`);
      const timeline = section?.querySelector('.day-timeline');
      if (!section || !timeline) return;

      timeline.querySelectorAll('.tl-extra').forEach(el => el.remove());
      items.forEach(item => {
        const card = makeCard(item);
        if (item.before) {
          const target = [...timeline.children].find(el => !el.classList.contains('tl-extra') && el.textContent.includes(item.before));
          if (target) timeline.insertBefore(card, target);
          else timeline.append(card);
        } else {
          timeline.append(card);
        }
      });
      section.classList.add('itinerary-merged');
    });
  }

  // layout-hotfix may have merged once before the readable timeline renderer ran.
  // Re-merge now, then wrap future timeline renders so suggestions never disappear.
  mergeExtras();
  if (typeof window.renderDayTimelines === 'function' && !window.renderDayTimelines.__mergedExtrasWrapped) {
    const original = window.renderDayTimelines;
    const wrapped = function(...args) {
      const result = original.apply(this, args);
      mergeExtras();
      return result;
    };
    wrapped.__mergedExtrasWrapped = true;
    window.renderDayTimelines = wrapped;
  }

  // One more pass after current synchronous initialization settles.
  setTimeout(mergeExtras, 0);
})();