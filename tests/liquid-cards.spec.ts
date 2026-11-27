import { expect, test } from "@playwright/test";

test.use({
  channel: "chromium",
  launchOptions: { args: ["--enable-unsafe-webgpu"] },
});

test("liquid cards keep their content and link targets without WebGPU", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "gpu", { value: undefined }));
  await page.goto("/");
  const products = page.locator("#projects [data-liquid-grid]");
  const skills = page.locator("#skills [data-liquid-grid]");
  const activity = page.locator("#activity [data-liquid-grid]");
  await expect(products.locator("li[data-liquid-card]")).toHaveCount(3);
  await expect(products.getByRole("link", { name: /^live.*golfgives/i })).toHaveAttribute("href", "https://golf-gives-three.vercel.app/");
  await expect(products.getByRole("link", { name: /^source.*golfgives/i })).toHaveAttribute("href", "https://github.com/prithvinew004/GolfGives");
  await expect(skills.locator("[data-liquid-card]")).toHaveCount(3);
  await expect(skills.getByRole("link", { name: /curoh/i }).first()).toHaveAttribute("href", "#project-curoh-dr-raja");
  await expect(activity.getByRole("region", { name: "GitHub contributions calendar" })).toBeVisible();
  await expect(activity.locator("a[data-liquid-card]").first()).toHaveAttribute("href", /^https:\/\/github\.com\//);
  await expect(products.locator("canvas")).toBeHidden();
});

test("all card groups share a lazy device and restore their CSS cards after device loss", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    if (!globalThis.GPUCanvasContext || !globalThis.GPUQueue) return;
    const devices = new WeakSet<GPUDevice>();
    const queues = new WeakSet<GPUQueue>();
    const configure = GPUCanvasContext.prototype.configure;
    GPUCanvasContext.prototype.configure = function (options) {
      if (this.canvas instanceof HTMLCanvasElement && this.canvas.matches(".liquid-card-canvas") &&
          !devices.has(options.device)) {
        const root = document.documentElement;
        const { device } = options;
        root.dataset.liquidDevices = String(Number(root.dataset.liquidDevices ?? 0) + 1);
        devices.add(device);
        queues.add(device.queue);
        window.addEventListener("portfolio-test-liquid-loss", () => device.destroy(), { once: true });
      }
      return configure.call(this, options);
    };
    const submit = GPUQueue.prototype.submit;
    GPUQueue.prototype.submit = function (commands) {
      if (queues.has(this)) {
        const root = document.documentElement;
        root.dataset.liquidFrames = String(Number(root.dataset.liquidFrames ?? 0) + 1);
      }
      return submit.call(this, commands);
    };
  });
  await page.goto("/");
  const hasAdapter = await page.evaluate(async () => Boolean(await navigator.gpu?.requestAdapter()));
  test.skip(!hasAdapter, "This browser did not provide a WebGPU adapter");

  const products = page.locator("#projects [data-liquid-grid]");
  const skills = page.locator("#skills [data-liquid-grid]");
  const activity = page.locator("#activity [data-liquid-grid]");
  const root = page.locator("html");
  await skills.scrollIntoViewIfNeeded();
  await expect(skills).toBeInViewport();
  await expect(page.locator("#hero")).not.toBeInViewport();
  await expect(skills.locator("canvas")).toBeHidden();
  await expect(root).not.toHaveAttribute("data-liquid-devices");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(skills).toHaveAttribute("data-liquid-status", "active");
  await expect(root).toHaveAttribute("data-liquid-devices", "1");
  const beforeHover = await root.getAttribute("data-liquid-frames");
  await skills.locator("article").first().hover();
  await expect.poll(() => root.getAttribute("data-liquid-frames")).not.toBe(beforeHover);

  await products.scrollIntoViewIfNeeded();
  await expect(products).toHaveAttribute("data-liquid-status", "active");
  await expect(products.locator("canvas")).toBeVisible();

  await activity.scrollIntoViewIfNeeded();
  await expect(activity).toHaveAttribute("data-liquid-status", "active");
  await expect(root).toHaveAttribute("data-liquid-devices", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(activity.locator("canvas")).toBeHidden();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(activity.locator("canvas")).toBeVisible();

  await page.evaluate(() => window.dispatchEvent(new Event("portfolio-test-liquid-loss")));
  await expect(products.locator("canvas")).toBeHidden();
  await expect(activity.locator("canvas")).toBeHidden();
  await expect(skills.locator("canvas")).toBeHidden();
  await expect(activity.getByRole("region", { name: "GitHub contributions calendar" })).toBeVisible();
});
