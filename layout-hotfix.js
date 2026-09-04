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
      }

      /* Mobile card: time on top, badges below it, content underneath. */
      html body main .trip-day .day-timeline .tl-row {
        position: relative !important;
        display: grid !important;
        grid-template-columns: minmax(0,1fr) auto !important;
        grid-template-rows: auto auto !important;
        column-gap: 10px !important;
        row-gap: 7px !important;
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 12px 12px 12px 14px !important;
        min-height: 0 !important;
        border-radius: 15px !important;
        align-items: start !important;
      }
      html body main .trip-day .day-timeline .tl-row::before {
        display:none !important;
        content:none !important;
      }
      html body main .trip-day .day-timeline .tl-time-block {
        grid-column: 1 !important;
        grid-row: 1 !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      html body main .trip-day .day-timeline .tl-time {
        display: block !important;
        min-width: 0 !important;
        font-size: 23px !important;
        line-height: 1 !important;
      }
      html body main .trip-day .day-timeline .tl-copy {
        grid-column: 1 !important;
        grid-row: 2 !important;
        display: flex !important;
        flex-direction: column !important;
        min-width: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        gap: 5px !important;
      }
      html body main .trip-day .day-timeline .tl-badges {
        position: static !important;
        inset: auto !important;
        display: flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 5px !important;
        min-height: 0 !important;
        margin: 0 !important;
        order: -1 !important;
      }
      html body main .trip-day .day-timeline .tl-primary {
        min-width: 0 !important;
      }
      html body main .trip-day .day-timeline .tl-title {
        font-size: 16px !important;
        line-height: 1.35 !important;
      }
      html body main .trip-day .day-timeline .tl-inline-detail {
        font-size: 12.5px !important;
        line-height: 1.45 !important;
      }
      html body main .trip-day .day-timeline .tl-map-btn,
      html body main .trip-day .day-timeline .tl-ticket-btn,
      html body main .trip-day .day-timeline .tl-exchange-btn {
        grid-column: 2 !important;
        grid-row: 1 / span 2 !important;
        align-self: center !important;
        justify-self: end !important;
        margin: 0 !important;
      }
    }

    @media (max-width: 390px) {
      html body main { padding-left: 6px !important; padding-right: 6px !important; }
      html body main .trip-day { padding-left: 8px !important; padding-right: 8px !important; }
      html body main .trip-day .day-timeline .tl-row {
        padding: 10px 9px 10px 12px !important;
        column-gap: 8px !important;
      }
      html body main .trip-day .day-timeline .tl-time { font-size: 21px !important; }
      html body main .trip-day .day-timeline .tl-title { font-size: 15.5px !important; }
      html body main .trip-day .day-timeline .tl-inline-detail { font-size: 12px !important; }
    }
  `;
  document.head.append(style);
})();