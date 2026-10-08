export function dateInZone(now, timezone) {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone: timezone, year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(now);
  const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
export function tripStatus(trip, now = new Date()) {
  const today = dateInZone(now, trip.timezone);
  return today < trip.start ? 'planning' : today > trip.end ? 'completed' : 'ongoing';
}
export const statusLabels = {planning:'行前規劃', ongoing:'旅程進行中', completed:'已結束'};
export function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
export function publicLink(label, url) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw new Error('外部連結必須使用 HTTPS');
  const link = element('a', label, 'button secondary');
  link.href = parsed.href; link.target = '_blank'; link.rel = 'noopener noreferrer';
  return link;
}
export async function loadJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`資料載入失敗 (${response.status})`);
  return response.json();
}
