// Final mobile layout overrides. Loaded last so older timeline styles cannot reserve side gutters.
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
      html body main .trip-day .day-timeline .tl-row {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 11px 11px 11px 13px !important;
        min-height: 0 !important;
        border-radius: 15px !important;
      }
    }

    @media (max-width: 390px) {
      html body main { padding-left: 6px !important; padding-right: 6px !important; }
      html body main .trip-day { padding-left: 8px !important; padding-right: 8px !important; }
      html body main .trip-day .day-timeline .tl-row {
        padding: 10px 9px 10px 12px !important;
      }
    }
  `;
  document.head.append(style);
})();