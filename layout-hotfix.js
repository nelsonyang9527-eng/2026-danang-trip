// Final mobile layout overrides. Loaded last so older timeline styles cannot reserve side gutters or overlap labels.
(() => {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 520px) {
      html body main { padding-left: 8px !important; padding-right: 8px !important; }
      html body main .trip-day {
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
      html body main .trip-day .toprow {
        padding-left: 2px !important;
        padding-right: 2px !important;
      }
      html body main .trip-day .day-timeline {
        width: 100% !important;
        max-width: none !important;
        margin: 14px 0 4px !important;
        padding: 0 !important;
        gap: 8px !important;
      }
      html body main .trip-day .day-timeline::before,
      html body main .trip-day .day-timeline li::before {
        display: none !important;
        content: none !important;
      }
      html body main .trip-day .day-timeline li {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        min-width: 0 !important;
      }

      /* Mobile card: fixed time column on the left, content on the right. */
      html body main .trip-day .day-timeline .tl-row {
        position: relative !important;
        display: grid !important;
        grid-template-columns: 68px minmax(0, 1fr) auto !important;
        grid-template-rows: auto !important;
        column-gap: 10px !important;
        row-gap: 0 !important;
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 13px 12px !important;
        min-height: 0 !important;
        border-radius: 15px !important;
        align-items: start !important;
      }
      html body main .trip-day .day-timeline .tl-row::before {
        display: none !important;
        content: none !important;
      }
      html body main .trip-day .day-timeline .tl-time-block {
        grid-column: 1 !important;
        grid-row: 1 !important;
        display: block !important;
        min-width: 0 !important;
        padding: 1px 0 0 !important;
        margin: 0 !important;
      }
      html body main .trip-day .day-timeline .tl-time {
        display: block !important;
        min-width: 0 !important;
        width: auto !important;
        margin: 0 !important;
        font-size: 20px !important;
        line-height: 1.2 !important;
        white-space: nowrap !important;
        text-align: left !important;
      }
      html body main .trip-day .day-timeline .tl-copy {
        grid-column: 2 !important;
        grid-row: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        min-width: 0 !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        gap: 4px !important;
        overflow: visible !important;
      }
      html body main .trip-day .day-timeline .tl-badges {
        position: static !important;
        inset: auto !important;
        display: flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 5px !important;
        min-height: 0 !important;
        margin: 0 0 2px !important;
        order: -1 !important;
      }
      html body main .trip-day .day-timeline .tl-primary {
        min-width: 0 !important;
        max-width: 100% !important;
      }
      html body main .trip-day .day-timeline .tl-title {
        margin: 0 !important;
        min-width: 0 !important;
        max-width: 100% !important;
        font-size: 16px !important;
        line-height: 1.35 !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
      }
      html body main .trip-day .day-timeline .tl-inline-detail,
      html body main .trip-day .day-timeline .tl-dest {
        margin-left: 0 !important;
        max-width: 100% !important;
        font-size: 12.5px !important;
        line-height: 1.45 !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
      }
      html body main .trip-day .day-timeline .tl-map-btn,
      html body main .trip-day .day-timeline .tl-ticket-btn,
      html body main .trip-day .day-timeline .tl-exchange-btn {
        grid-column: 3 !important;
        grid-row: 1 !important;
        align-self: center !important;
        justify-self: end !important;
        margin: 0 !important;
        flex: 0 0 auto !important;
      }
    }

    @media (max-width: 390px) {
      html body main { padding-left: 6px !important; padding-right: 6px !important; }
      html body main .trip-day { padding-left: 8px !important; padding-right: 8px !important; }
      html body main .trip-day .day-timeline .tl-row {
        grid-template-columns: 62px minmax(0, 1fr) auto !important;
        padding: 11px 9px !important;
        column-gap: 8px !important;
      }
      html body main .trip-day .day-timeline .tl-time { font-size: 18px !important; }
      html body main .trip-day .day-timeline .tl-title { font-size: 15.5px !important; }
      html body main .trip-day .day-timeline .tl-inline-detail,
      html body main .trip-day .day-timeline .tl-dest { font-size: 12px !important; }
    }

    @media (max-width: 350px) {
      html body main .trip-day .day-timeline .tl-row {
        grid-template-columns: 56px minmax(0, 1fr) auto !important;
        column-gap: 7px !important;
      }
      html body main .trip-day .day-timeline .tl-time { font-size: 17px !important; }
    }

    .customs-reminder {
      margin: 18px 0 4px;
      padding: 16px;
      border: 1px solid #f3c34c;
      border-radius: 16px;
      background: linear-gradient(180deg, #fff9df 0%, #fff4c2 100%);
      color: #4b3a08;
      box-shadow: 0 8px 20px rgba(120, 84, 0, .08);
    }
    .customs-reminder-title {
      margin: 0 0 8px;
      font-size: 17px;
      line-height: 1.35;
      font-weight: 800;
    }
    .customs-reminder p {
      margin: 0 0 10px;
      line-height: 1.6;
      overflow-wrap: anywhere;
    }
    .customs-reminder-note {
      font-size: 12.5px;
      opacity: .78;
    }
    .customs-reminder-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      padding: 10px 14px;
      border-radius: 12px;
      background: #8b6500;
      color: #fff !important;
      text-decoration: none;
      font-weight: 700;
      max-width: 100%;
      box-sizing: border-box;
      text-align: center;
    }
    @media (max-width: 390px) {
      .customs-reminder { padding: 14px 12px; }
      .customs-reminder-link { width: 100%; }
    }
  `;
  document.head.append(style);

  const returnDay = document.querySelector('.trip-day[data-tab-day="2026-09-18"]');
  if (returnDay && !returnDay.querySelector('.customs-reminder')) {
    const reminder = document.createElement('aside');
    reminder.className = 'customs-reminder';
    reminder.setAttribute('aria-label', '回台灣前入境物品提醒');
    reminder.innerHTML = `
      <div class="customs-reminder-title">⚠️ 回台灣前檢查</div>
      <p>有買零食、泡麵、肉製品，或其他不確定能不能帶入境的東西，可先用「台灣入境 AI 放大鏡」檢查。</p>
      <a class="customs-reminder-link" href="https://ai-customs.tw/" target="_blank" rel="noopener">🔎 開啟台灣入境 AI 放大鏡</a>
      <p class="customs-reminder-note">此網站非政府網站，AI 結果僅供參考；有疑義時仍以財政部關務署、防檢署及現場判定為準。</p>
    `;
    const timeline = returnDay.querySelector('.day-timeline');
    if (timeline) timeline.insertAdjacentElement('afterend', reminder);
    else returnDay.prepend(reminder);
  }
})();