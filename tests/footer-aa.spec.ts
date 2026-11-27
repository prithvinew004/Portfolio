import { expect, test } from "@playwright/test";

test.use({
  channel: "chromium",
  deviceScaleFactor: 2,
  launchOptions: { args: ["--enable-unsafe-webgpu"] },
});

test("the footer keeps its artwork and contact actions without WebGPU", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "gpu", { value: undefined }));
  await page.goto("/");
  const footer = page.locator("#contact");
  const stage = footer.locator(".footer-aa-stage");
  await expect(stage).toHaveCSS(
    "background-image",
    /footer-aa-spokes\.svg/,
  );
  await expect(stage).toHaveCSS("position", "absolute");
  await expect(stage).toHaveCSS("pointer-events", "none");
  await expect(footer.locator(".footer-aa-canvas")).toBeHidden();
  await expect(footer.getByRole("link", { name: /prithvi\.new004@gmail\.com/i })).toHaveAttribute(
    "href",
    "mailto:prithvi.new004@gmail.com",
  );
  await expect(footer.getByRole("button", { name: "Copy email address" })).toBeVisible();
});

test("the footer animates without controls and suspends or falls back when needed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    if (!globalThis.GPUCanvasContext || !globalThis.GPUQueue) return;
    const queues = new WeakSet<GPUQueue>();
    const configure = GPUCanvasContext.prototype.configure;
    GPUCanvasContext.prototype.configure = function (options) {
      if (this.canvas instanceof HTMLCanvasElement && this.canvas.matches(".footer-aa-canvas")) {
        queues.add(options.device.queue);
        window.addEventListener("portfolio-test-aa-loss", () => options.device.destroy(), { once: true });
        document.documentElement.dataset.footerGpuConfigured = "true";
      }
      return configure.call(this, options);
    };
    const submit = GPUQueue.prototype.submit;
    GPUQueue.prototype.submit = function (commands) {
      if (queues.has(this)) {
        const data = document.documentElement.dataset;
        data.footerGpuFrames = String(Number(data.footerGpuFrames ?? 0) + 1);
      }
      return submit.call(this, commands);
    };
  });
  await page.goto("/");
  const hasAdapter = await page.evaluate(async () => Boolean(await navigator.gpu?.requestAdapter()));
  test.skip(!hasAdapter, "This browser did not provide a WebGPU adapter");

  const footer = page.locator("#contact");
  const stage = footer.locator(".footer-aa-stage");
  const canvas = stage.locator("canvas");
  const frameCount = async () => Number(await page.locator("html").getAttribute("data-footer-gpu-frames"));
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toBeInViewport();
  await expect(canvas).toBeHidden();
  await expect(page.locator("html")).not.toHaveAttribute("data-footer-gpu-configured");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(canvas).toBeVisible();
  await expect(footer.getByRole("combobox")).toHaveCount(0);
  await expect(footer.getByRole("button", { name: /^(pause|play) footer animation$/i })).toHaveCount(0);
  await expect(stage).toHaveCSS("opacity", "1");
  const backingScale = await canvas.evaluate((element: HTMLCanvasElement) => element.width / element.clientWidth);
  expect(backingScale).toBeCloseTo(2, 1);
  const initial = await frameCount();
  await expect.poll(frameCount).toBeGreaterThan(initial);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(canvas).toBeHidden();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(canvas).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(stage).not.toBeInViewport();
  await page.waitForTimeout(120);
  const offscreenAt = await frameCount();
  await page.waitForTimeout(160);
  expect(await frameCount()).toBe(offscreenAt);
  await stage.scrollIntoViewIfNeeded();
  await expect.poll(frameCount).toBeGreaterThan(offscreenAt);

  await page.evaluate(() => window.dispatchEvent(new Event("portfolio-test-aa-loss")));
  await expect(canvas).toBeHidden();
  await expect(stage).toHaveAttribute("data-aa-ready", "false");
  await expect(footer.getByRole("link", { name: /prithvi\.new004@gmail\.com/i })).toBeVisible();
});
