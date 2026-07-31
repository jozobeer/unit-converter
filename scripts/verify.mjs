import { readFileSync, statSync } from "node:fs";

const errors = [];
try {
  const html = readFileSync("public/index.html", "utf-8");
  if (html.trim().length < 100) errors.push("public/index.html が小さすぎます");
  if (html.includes("{{")) errors.push("未置換のプレースホルダが残っています");
  if (html.includes("builder がこのファイルを実装で置き換えます")) {
    errors.push("public/index.html がテンプレートのまま実装されていません");
  }
  if (!/<link[^>]+rel=["']?[^"'>]*icon/i.test(html)) {
    errors.push('faviconがありません（<link rel="icon" href="data:..."> をインラインで入れる）');
  }
} catch {
  errors.push("public/index.html がありません");
}
try {
  statSync("PLAN.md");
} catch {
  errors.push("PLAN.md がありません（plannerが未実行）");
}
try {
  statSync("README.md");
} catch {
  errors.push("README.md がありません（テンプレートから削除しないこと）");
}
try {
  statSync("wrangler.jsonc");
} catch {
  errors.push("wrangler.jsonc がありません");
}
if (errors.length > 0) {
  console.error("verify失敗:\n" + errors.map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log("verify OK");
