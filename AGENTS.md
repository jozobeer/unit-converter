# 単位換算ツール

長さ・重さ・温度の3カテゴリをタブで切り替え、左右の入力欄で双方向にリアルタイム換算する静的単一ページアプリ。

## アプリ概要と構成

- エントリ: `public/index.html`（CSS/JS インライン、フレームワークなし）
- カテゴリ: `.tab[data-category]`（`length` / `weight` / `temperature`）。`aria-pressed` で選択状態を表現。切替時は両入力をクリアし、デフォルト単位をセットする
- デフォルト単位: 長さ `m`↔`cm`、重さ `kg`↔`g`、温度 `c`↔`f`
- 単位一覧:
  - 長さ: mm / cm / m / km / in / ft（基準: m）
  - 重さ: mg / g / kg / t / lb / oz（基準: kg）
  - 温度: ℃ / ℉ / K（基準: ℃。オフセット付き変換）
- UI: `#inputA` / `#unitA` と `#inputB` / `#unitB`。`input` / `change` で即時換算
- 変換: `convert(value, fromUnit, toUnit)` — `toBase` → `fromBase` の2段。`formatResult` は `toPrecision(12)` で浮動小数誤差を吸収
- 入力検証: `parseInput` — 空・非数値は `null`。対向欄を空にし、エラー表示や NaN は出さない
- テスト: `tests/app.spec.ts`（Playwright、`file://` で `public/index.html` を開く）
- 配信: Cloudflare Workers assets（`wrangler.jsonc`）

現状の仕様の正は README.md と `tests/app.spec.ts` である。`PLAN.md` は初回実装時の計画（歴史的文書）であり、受け入れ条件の最新ソースとしては扱わない。

## 技術スタック（不変）

- バニラJS・単一 `public/index.html`（CSS/JSインライン）・ビルドなし
- 配信: Cloudflare Workers assets（`wrangler.jsonc`）
- テスト: Playwright（`tests/app.spec.ts`、`npm test`）
- 保守時もこのスタックを維持すること。フレームワーク・ビルドツール・宣言外ライブラリの導入は禁止

## 品質不変条件

次を壊してはならない。変更後は必ず `npm run verify` が通る状態を維持すること。

- **favicon**: `<link rel="icon" href="data:image/svg+xml,...">` のインライン data URI（外部ファイル・外部 URL 不可）
- **フッター**: hub（apps.jozo.beer）への導線。リンク先 `https://apps.jozo.beer` とリンクテキスト `apps.jozo.beer` は変えない

```html
<footer style="margin-top:3rem;text-align:center;font-size:.8rem;opacity:.6">
  <a href="https://apps.jozo.beer" style="color:inherit">apps.jozo.beer</a>
</footer>
```

スタイル（リンク色を含む）はテーマに合わせて調整してよい。リンク色を変える場合は背景とのコントラストを確保すること。body が flex/grid のセンタリングレイアウトのときは、`flex-direction: column` にするかメインコンテナ末尾に置き、フッターが横並びの flex アイテムにならないようにする。

その他:

- 静的アプリ（`public/` 配下のみ）。サーバコード・外部 API・ビルドツールは使わない
- `public/index.html` を単一ファイルで完結させる（CSS/JS インライン可）
- 雛形のスモークテスト（ページロード・ページエラーなし）は削除しない
- README.md は削除しない

## 保守の進め方

1. 変更したい振る舞いを受け入れ条件として `tests/app.spec.ts` に先に書く（または既存テストを更新する）
2. `public/index.html` を実装・修正する
3. `npm test` と `npm run verify` を通す
4. `npm run deploy` で Cloudflare Workers へデプロイする
