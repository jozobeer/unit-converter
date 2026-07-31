# 単位換算ツール

長さ・重さ・温度など日常でよく使う単位をリアルタイムで相互変換する静的単一ページアプリ。カテゴリを選択し、片方の入力欄に数値を入れるともう片方に自動で変換結果が表示される。

## 公開URL

https://unit-converter.jozo.beer

## 開発

[kojo](https://github.com/jozobeer/kojo)（1日1アプリ自動生成基盤）により生成されたリポジトリです。

- `npm run verify` — 検証（実装の完成条件チェック）
- `npm run deploy` — Cloudflare Workers へデプロイ

## 構成

- `public/index.html` — アプリ本体（CSS/JSインラインの単一ファイル）
- `PLAN.md` — 受け入れ条件付きの実装計画
