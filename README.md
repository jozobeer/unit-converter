# 単位換算ツール

長さ・重さ・温度の3カテゴリをタブで切り替え、左右の入力欄と単位セレクトで双方向にリアルタイム換算する静的単一ページアプリ。長さは mm/cm/m/km/インチ/フィート、重さは mg/g/kg/トン/ポンド/オンス、温度は ℃/℉/K に対応。片方に数値を入れると対向欄へ即時反映し、空欄や非数値では対向欄を空にする（エラー表示なし）。

## 公開URL

https://unit-converter.jozo.beer

## 開発

[kojo](https://github.com/jozobeer/kojo)（1日1アプリ自動生成基盤）により生成されたリポジトリです。

初回セットアップ: `npm install`（Playwright ブラウザ未取得の環境では `npx playwright install chromium`）

- `npm test` — Playwright によるブラウザテスト
- `npm run verify` — 不変条件チェック（favicon / apps.jozo.beer フッター）
- `npm run deploy` — Cloudflare Workers へデプロイ

## 構成

- `public/index.html` — アプリ本体（CSS/JSインラインの単一ファイル）
- `tests/app.spec.ts` — Playwright による受け入れ条件のテスト
- `PLAN.md` — 初回実装時の計画（歴史的文書。現状の正は README とテスト）
