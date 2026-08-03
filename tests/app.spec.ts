import { test, expect } from "@playwright/test";
import { pathToFileURL } from "node:url";

// 静的アプリなのでサーバ不要。kojo の visualGate と同じ file:// 方式で開く
const APP_URL = pathToFileURL("public/index.html").href;

test.beforeEach(async ({ page }) => {
  await page.goto(APP_URL);
});

test("ページがロードできページエラーが出ない", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto(APP_URL);
  await expect(page.locator("body")).toBeVisible();
  expect(errors).toEqual([]);
});

// このスモークは削除しないこと。機能テストは PLAN.md の受け入れ条件ごとに追記する

test("カテゴリタブを切り替えると対応する単位一覧がセレクトに反映される", async ({
  page,
}) => {
  const unitA = page.locator("#unitA");
  const unitB = page.locator("#unitB");

  await expect(page.locator('.tab[data-category="length"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(unitA).toHaveValue("m");
  await expect(unitB).toHaveValue("cm");
  await expect(unitA.locator("option")).toHaveCount(6);
  await expect(unitA.locator("option")).toHaveText([
    "ミリメートル (mm)",
    "センチメートル (cm)",
    "メートル (m)",
    "キロメートル (km)",
    "インチ (in)",
    "フィート (ft)",
  ]);

  await page.locator('.tab[data-category="weight"]').click();
  await expect(page.locator('.tab[data-category="weight"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(unitA).toHaveValue("kg");
  await expect(unitB).toHaveValue("g");
  await expect(unitA.locator("option")).toHaveCount(6);
  await expect(unitA.locator("option")).toHaveText([
    "ミリグラム (mg)",
    "グラム (g)",
    "キログラム (kg)",
    "トン (t)",
    "ポンド (lb)",
    "オンス (oz)",
  ]);

  await page.locator('.tab[data-category="temperature"]').click();
  await expect(
    page.locator('.tab[data-category="temperature"]'),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(unitA).toHaveValue("c");
  await expect(unitB).toHaveValue("f");
  await expect(unitA.locator("option")).toHaveCount(3);
  await expect(unitA.locator("option")).toHaveText([
    "摂氏 (℃)",
    "華氏 (℉)",
    "ケルビン (K)",
  ]);
});

test("長さカテゴリで左入力から右へ即時変換される", async ({ page }) => {
  await page.locator("#inputA").fill("1");
  await expect(page.locator("#inputB")).toHaveValue("100");
});

test("重さカテゴリで左入力から右へ即時変換される", async ({ page }) => {
  await page.locator('.tab[data-category="weight"]').click();
  await page.locator("#inputA").fill("1");
  await expect(page.locator("#inputB")).toHaveValue("1000");
});

test("温度カテゴリでオフセット変換が正しく行われる", async ({ page }) => {
  await page.locator('.tab[data-category="temperature"]').click();

  await page.locator("#inputA").fill("0");
  await expect(page.locator("#inputB")).toHaveValue("32");

  await page.locator("#inputA").fill("100");
  await expect(page.locator("#inputB")).toHaveValue("212");

  await page.locator("#unitB").selectOption("k");
  await page.locator("#inputA").fill("0");
  await expect(page.locator("#inputB")).toHaveValue("273.15");
});

test("右入力欄から左へ逆方向の変換が即時反映される", async ({ page }) => {
  await page.locator("#inputB").fill("100");
  await expect(page.locator("#inputA")).toHaveValue("1");
});

test("数値以外や空欄の入力では対向欄が空になる", async ({ page }) => {
  const inputA = page.locator("#inputA");
  const inputB = page.locator("#inputB");

  await inputA.fill("abc");
  await expect(inputB).toHaveValue("");

  await inputA.fill("");
  await expect(inputB).toHaveValue("");

  await inputB.fill("not-a-number");
  await expect(inputA).toHaveValue("");
});

test("カテゴリ切り替えで入力欄がクリアされる", async ({ page }) => {
  await page.locator("#inputA").fill("1");
  await expect(page.locator("#inputB")).toHaveValue("100");

  await page.locator('.tab[data-category="weight"]').click();
  await expect(page.locator("#inputA")).toHaveValue("");
  await expect(page.locator("#inputB")).toHaveValue("");
});
