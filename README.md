# travel

每次旅行各有一份行程，活動以事件卡片呈現。旅程結束後會自動出現在歷史軌跡；保留的是規劃紀錄，不能據此宣稱活動已實際完成。

## 架構

```text
index.html                 旅行總覽（待出發與進行中）
history.html               歷史軌跡（已結束，依結束日倒序）
data/trips.json            旅程索引，首頁與歷史頁共用
assets/css/site.css        新版共用樣式
assets/js/travel.js        共用日期、狀態與安全 DOM 工具
assets/js/catalog.js       旅程卡片與歷史列表
assets/js/trip.js          日期分頁與事件卡片
assets/css/legacy.css      峴港既有樣式
trips/2026-busan/          新版旅程：index.html + trip.json
trips/2026-danang/         歷史頁與原有專屬腳本
scripts/validate.py        索引、事件資料與本地連結檢查
AGENTS.md                  AI 工作與公開資料規範
```

不需要套件安裝、建置或後端。從倉庫根目錄執行：

```sh
python3 -m http.server 8000 --bind 0.0.0.0
python3 scripts/validate.py
```

GitHub Pages 使用倉庫根目錄部署。所有站內路徑使用相對路徑，支援 `/travel/` 專案網址。原 `danang.html` 保留轉址並保留測試時間參數及錨點。

## AI 新增與修改旅程

1. 先讀 `AGENTS.md`，確認資料可公開。
2. 建立 `trips/YYYY-destination/`；同年同地多次旅行使用 `YYYY-MM-destination` 或更明確日期，ID 建立後保持穩定。
3. 複製釜山的 `index.html` 作為新版模板，更新 HTML 標題、預設標題與 `og:url`。它只載入同目錄 `trip.json`，不需複製共用 JS。
4. 新增 `trip.json`，更新 `data/trips.json` 的索引。兩處的 ID、標題、起迄日期與時區必須一致。
5. 驗證資料、瀏覽器載入與分頁、手機版顯示及敏感資料；確認歷史旅程仍可存取。

旅程資料欄位：`id`、`title`、`timezone`（IANA 時區）、`timezoneLabel`、`start`／`end`（YYYY-MM-DD）、`summary`、`notes`、`days`。
每日資料包含 `date`、`title`、`events`、可選 `links`。每項活動／移動／集合盡量各建一個事件：

```json
{
  "id": "2027-04-10-museum",
  "title": "博物館參觀",
  "status": "tentative",
  "notes": "開放時間待確認",
  "location": "公開博物館名稱",
  "links": [{"label": "官方網站", "url": "https://example.com/"}]
}
```

事件 `status` 使用 `planned`、`tentative`、`confirmed` 或 `cancelled`，表示安排的確認程度。已確定的時間才填 `start`／`end`，使用含 UTC offset 的 ISO 8601；不要把「下午」或估計時間編成確定時間。跨國移動各端使用當地 offset，頁面統一按旅程時區顯示。

旅程狀態依目的地時區的當地日期計算：出發日前為規劃中，起迄日之間為進行中，結束日之後為歷史。無需把頁面搬到另一個資料夾。事件狀態不會因日期過去而自動變為完成。

峴港頁保持原有歷史內容與互動，既有補丁集中在其旅程目錄。不要把其專屬腳本載入新旅程；後續新功能修改共用 renderer 或旅程資料，不再累加 `*-fix.js`。

## 公開資料

提交前檢閱完整變更及新增檔案。不能提交秘密、證件、訂位碼、票券、聯絡人資料或個人療程細節。訂票連結僅保留公開商品網址，不保留訂單或追蹤參數。自動搜尋不能取代內容與附件檢查。
