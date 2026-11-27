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

test("the footer animates on its own, pauses, and draws all four anti-aliasing modes", async ({ page }) => {
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
  const picker = footer.getByRole("combobox", { name: "Anti-aliasing" });
  const frameCount = async () => Number(await page.locator("html").getAttribute("data-footer-gpu-frames"));
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toBeInViewport();
  await expect(canvas).toBeHidden();
  await expect(page.locator("html")).not.toHaveAttribute("data-footer-gpu-configured");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(canvas).toHaveAttribute("data-aa-mode", "fxaa");
  await expect(stage).toHaveCSS("opacity", "1");
  const backingScale = await canvas.evaluate((element: HTMLCanvasElement) => element.width / element.clientWidth);
  expect(backingScale).toBeCloseTo(2, 1);
  const initial = await frameCount();
  await expect.poll(frameCount).toBeGreaterThan(initial);
  await footer.getByRole("button", { name: "Pause footer animation" }).click();
  await page.waitForTimeout(120);
  const pausedAt = await frameCount();
  await page.waitForTimeout(160);
  expect(await frameCount()).toBe(pausedAt);

  await picker.selectOption("off");
  await expect(canvas).toHaveAttribute("data-aa-mode", "off");
  const unfiltered = await canvas.screenshot();
  await picker.selectOption("msaa");
  await expect(canvas).toHaveAttribute("data-aa-mode", "msaa");
  await picker.selectOption("ssaa");
  await expect(canvas).toHaveAttribute("data-aa-mode", "ssaa");
  expect((await canvas.screenshot()).equals(unfiltered)).toBe(false);
  await picker.selectOption("fxaa");
  await expect(canvas).toHaveAttribute("data-aa-mode", "fxaa");

  const beforeResume = await frameCount();
  await footer.getByRole("button", { name: "Play footer animation" }).click();
  await expect.poll(frameCount).toBeGreaterThan(beforeResume);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(stage).not.toBeInViewport();
  await page.waitForTimeout(120);
  const offscreenAt = await frameCount();
  await page.waitForTimeout(160);
  expect(await frameCount()).toBe(offscreenAt);

  await page.evaluate(() => window.dispatchEvent(new Event("portfolio-test-aa-loss")));
  await expect(canvas).toBeHidden();
  await expect(stage).toHaveAttribute("data-aa-ready", "false");
  await expect(footer.getByRole("link", { name: /prithvi\.new004@gmail\.com/i })).toBeVisible();
});
