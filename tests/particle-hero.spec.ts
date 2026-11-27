import { expect, test } from "@playwright/test";

test.use({
  channel: "chromium",
  launchOptions: { args: ["--enable-unsafe-webgpu"] },
});

test("unsupported WebGPU leaves the hero and its links usable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "gpu", { value: undefined });
  });
  await page.goto("/");

  await expect(page.locator(".hero-art")).toHaveAttribute("data-renderer", "static");
  await expect(page.locator(".hero-static")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "See selected work" }).click();
  await expect(page.locator("#projects")).toBeInViewport();
});

test("reduced motion skips GPU initialization, and an unavailable adapter falls back", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "gpu", {
      value: {
        requestAdapter: () => {
          document.documentElement.dataset.gpuRequested = "true";
          return Promise.resolve(null);
        },
      },
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("html")).not.toHaveAttribute("data-gpu-requested");
  await expect(page.locator(".hero-art")).toHaveAttribute("data-renderer", "static");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveAttribute("data-gpu-requested", "true");
  await expect(page.locator(".hero-art")).toHaveAttribute("data-renderer", "static");
  await expect(page.getByRole("link", { name: "Contact me" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("the hero animates without playback controls and suspends rendering when hidden", async ({ page }) => {
  await page.addInitScript(() => {
    if (!globalThis.GPUAdapter || !globalThis.GPUQueue) return;
    const requestDevice = GPUAdapter.prototype.requestDevice;
    GPUAdapter.prototype.requestDevice = async function (descriptor) {
      const device = await requestDevice.call(this, descriptor);
      window.addEventListener("portfolio-test-device-loss", () => device.destroy(), { once: true });
      return device;
    };
    const submit = GPUQueue.prototype.submit;
    GPUQueue.prototype.submit = function (commands) {
      const count = Number(document.documentElement.dataset.gpuFrames ?? "0");
      document.documentElement.dataset.gpuFrames = String(count + 1);
      return submit.call(this, commands);
    };
  });
  await page.goto("/");
  const hasAdapter = await page.evaluate(async () => {
    try {
      return Boolean(await navigator.gpu?.requestAdapter({ powerPreference: "low-power" }));
    } catch {
      return false;
    }
  });
  test.skip(!hasAdapter, "This browser did not provide a WebGPU adapter");

  const art = page.locator(".hero-art");
  const frames = () => page.locator("html").getAttribute("data-gpu-frames");
  await expect(art).toHaveAttribute("data-renderer", "active", { timeout: 15000 });
  await expect(page.getByRole("button", { name: /^(pause|play) hero animation$/i })).toHaveCount(0);
  const initial = await frames();
  await expect.poll(frames).not.toBe(initial);

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(art).toHaveAttribute("data-renderer", "paused");
  const hiddenAt = await frames();
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
  expect(await frames()).toEqual(hiddenAt);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(art).toHaveAttribute("data-renderer", "active");
  await expect.poll(frames).not.toBe(hiddenAt);
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await expect(art).toHaveAttribute("data-renderer", "paused");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(art).toHaveAttribute("data-renderer", "active");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(art).toHaveAttribute("data-renderer", "static");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(art).toHaveAttribute("data-renderer", "active");

  await page.evaluate(() => window.dispatchEvent(new Event("portfolio-test-device-loss")));
  await expect(art).toHaveAttribute("data-renderer", "static");
  await expect(page.getByRole("link", { name: "See selected work" })).toBeVisible();
});
