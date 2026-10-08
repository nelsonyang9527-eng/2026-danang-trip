"""Validate public travel data and local HTML references without dependencies."""
import json
import re
from datetime import date, datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def valid_date(value):
    require(bool(re.fullmatch(r'\d{4}-\d{2}-\d{2}', value)), '日期必須為 YYYY-MM-DD')
    return date.fromisoformat(value)


def links_valid(links):
    for link in links:
        parsed = urlsplit(link['url'])
        require(parsed.scheme == 'https' and parsed.hostname and not parsed.username and not parsed.password, '外部連結必須是無憑證的 HTTPS URL')
        require(bool(link['label'].strip()), '連結需有標籤')
        require(not re.search(r'(?:^|&)(?:clickId|spm|token|booking_id|order_id)=', parsed.query, re.I), '不得保留訂單或追蹤參數')


class References(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key not in ('src', 'href') or not value:
                continue
            parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc or value.startswith('#'):
                continue
            require(not parsed.path.startswith('/'), f'使用相對站內路徑：{self.path}')
            target = (self.path.parent / unquote(parsed.path)).resolve()
            require(target.is_relative_to(ROOT) and target.exists(), f'失效站內連結：{self.path.relative_to(ROOT)} → {value}')


def main():
    manifest = json.loads((ROOT / 'data/trips.json').read_text())
    ids = set()
    events_count = 0
    for entry in manifest:
        ident = entry['id']
        require(bool(re.fullmatch(r'[a-z0-9-]+', ident)) and ident not in ids, '旅程 ID 無效或重複')
        ids.add(ident)
        require(valid_date(entry['start']) <= valid_date(entry['end']), '旅程起迄日期顛倒')
        ZoneInfo(entry['timezone'])
        require(entry['url'] == f'trips/{ident}/', '旅程路徑必須符合 ID')
        require((ROOT / entry['url'] / 'index.html').is_file(), '旅程頁不存在')
        path = ROOT / entry['url'] / 'trip.json'
        if not path.exists():
            require(ident == '2026-danang', '新旅程必須有 trip.json')
            continue
        trip = json.loads(path.read_text())
        for field in ('id', 'title', 'start', 'end', 'timezone', 'summary'):
            require(trip[field] == entry[field], f'{ident} 索引與資料 {field} 不一致')
        event_ids, day_dates = set(), []
        for day in trip['days']:
            day_date = valid_date(day['date'])
            require(valid_date(trip['start']) <= day_date <= valid_date(trip['end']), '日程超出旅程日期')
            day_dates.append(day_date)
            links_valid(day.get('links', []))
            for event in day['events']:
                require(event['id'] not in event_ids and bool(re.fullmatch(r'[a-z0-9-]+', event['id'])), '事件 ID 無效或重複')
                event_ids.add(event['id'])
                require(event['title'].strip() and event['status'] in ('planned', 'tentative', 'confirmed', 'cancelled'), '事件標題或狀態無效')
                times = {}
                for key in ('start', 'end'):
                    if key in event:
                        stamp = datetime.fromisoformat(event[key])
                        require(stamp.tzinfo is not None, '事件時間需要時區 offset')
                        times[key] = stamp
                require('end' not in times or ('start' in times and times['start'] <= times['end']), '事件時間範圍無效')
                if 'start' in times:
                    require(times['start'].astimezone(ZoneInfo(trip['timezone'])).date() == day_date, '事件開始日與日程不一致')
                links_valid(event.get('links', []))
        require(day_dates == sorted(set(day_dates)), '日程必須排序且不能重複')
        events_count += len(event_ids)
    pages = list(ROOT.rglob('*.html'))
    for path in pages:
        parser = References()
        parser.path = path
        parser.feed(path.read_text())
    print(f'PASS: {len(ids)} trips, {events_count} structured events, {len(pages)} HTML pages and local references')


if __name__ == '__main__':
    main()
