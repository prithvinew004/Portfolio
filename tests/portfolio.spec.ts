import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "small-mobile", width: 360, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "small-desktop", width: 1024, height: 900 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "compact", width: 320, height: 568 },
] as const;

function observeRuntimeFailures(page: Page) {
  const failures: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => failures.push(`page: ${error.message}`));
  page.on("requestfailed", (request) => {
    if (request.url().startsWith("http://127.0.0.1:3100")) {
      failures.push(`request: ${request.method()} ${request.url()} ${request.failure()?.errorText ?? ""}`);
    }
  });
  return failures;
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => {
    const clientWidth = document.documentElement.clientWidth;
    const offenders = [...document.querySelectorAll<HTMLElement>("body *")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          className: typeof element.className === "string" ? element.className : "",
          left: rect.left,
          right: rect.right,
        };
      })
      .filter(({ left, right }) => left < -1 || right > clientWidth + 1)
      .slice(0, 8);
    return { clientWidth, scrollWidth: document.documentElement.scrollWidth, offenders };
  });
  expect(dimensions.scrollWidth, JSON.stringify(dimensions)).toBeLessThanOrEqual(
    dimensions.clientWidth + 1
  );
}

test("baseline has no runtime, overflow, or serious accessibility failures", async ({ page }) => {
  const failures = observeRuntimeFailures(page);
  await page.goto("/", { waitUntil: "networkidle" });
  await expectNoHorizontalOverflow(page);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const blocking = results.violations.filter(({ impact }) =>
    impact === "serious" || impact === "critical"
  );

  expect(failures).toEqual([]);
  expect(blocking).toEqual([]);
});

test("the production homepage emits no unused preload or blocked unload warnings", async ({ page, context }) => {
  const warnings = new Set<string>();
  function collect(text: string) {
    if (/preloaded using link preload but not used|unload is not allowed in this document/i.test(text)) {
      warnings.add(text);
    }
  }

  const devTools = await context.newCDPSession(page);
  await devTools.send("Log.enable");
  devTools.on("Log.entryAdded", ({ entry }) => collect(entry.text));
  page.on("console", (message) => collect(message.text()));

  await page.route("http://127.0.0.1:3100/", async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), "permissions-policy": "unload=()" } });
  });
  const response = await page.goto("/", { waitUntil: "load" });
  expect(response?.status()).toBe(200);
  // Chromium reports unused preload hints asynchronously after the load event.
  await page.waitForTimeout(5_000);
  expect([...warnings]).toEqual([]);
});

test("first viewport explains the offer and exposes both primary actions", async ({ page }) => {
  for (const viewport of [viewports[0], viewports[5], viewports[6]]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /product-focused full-stack developer/i })
    ).toBeVisible();
    await expect(page.getByText(/turn product ideas into clear, usable web experiences/i)).toBeVisible();

    const contact = page.locator("#hero").getByRole("link", { name: "Contact me" });
    const work = page.getByRole("link", { name: /see selected work/i });
    await expect(contact).toHaveAttribute("href", "#contact");
    await expect(work).toHaveAttribute("href", "#projects");
    await expect(contact).toBeInViewport();
    await expect(work).toBeInViewport();
    const evidence = page.getByRole("navigation", { name: "Jump to a featured project" }).getByRole("link");
    await expect(evidence).toHaveCount(4);
    for (const [index, href] of [
      "#project-curoh-dr-raja",
      "#project-digifrills",
      "#project-navachis",
      "#project-lomaa",
    ].entries()) {
      await expect(evidence.nth(index)).toHaveAttribute("href", href);
    }
    await expect(page.getByText(/^Loading$/i)).toHaveCount(0);

    await page.keyboard.press("Tab");
    await expect(page.locator(":focus-visible")).toBeVisible();

    await contact.click();
    await expect(page.locator("#contact")).toBeInViewport();
  }
});

test("small-screen text stays inside the viewport without clipping", async ({ page }) => {
  await page.setViewportSize(viewports[6]);
  await page.goto("/", { waitUntil: "networkidle" });

  const clipped = await page.locator("h1, h2, h3, h4, p, a, button, dt, dd").evaluateAll(
    (elements) =>
      elements
        .filter((element) => !element.classList.contains("sr-only") && !element.closest(".sr-only"))
        .map((element) => {
          const node = element as HTMLElement;
          const bounds = node.getBoundingClientRect();
          return {
            text: (node.innerText || node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
            left: Math.round(bounds.left),
            right: Math.round(bounds.right),
            clientWidth: node.clientWidth,
            scrollWidth: node.scrollWidth,
            clippedContent: node.scrollWidth > node.clientWidth + 1,
          };
        })
        .filter(
          ({ text, left, right, clippedContent }) =>
            text && (left < -1 || right > document.documentElement.clientWidth + 1 || clippedContent)
        )
  );

  expect(clipped).toEqual([]);
  await expectNoHorizontalOverflow(page);
});

test("selected work is evidence-backed and never uses contact as a fake case study", async ({
  page,
}) => {
  await page.goto("/");
  const work = page.locator("#projects");
  const caseStudies = work.getByRole("article");
  const mediaLinks = work.locator('[data-project-media="featured"]');

  await expect(caseStudies).toHaveCount(4);
  await expect(mediaLinks).toHaveCount(4);
  const destinations = [
    "https://dev.curoh.com/login/dr-raja-neuro-care",
    "https://digifrills.in/",
    "https://navachis.com/",
    "https://lomaait.com/",
  ];
  for (const title of [
    "Curoh · Dr Raja Neuro Care",
    "DigiFrills",
    "Navachis IT Solutions",
    "LOMAA IT Solutions",
  ]) {
    const article = caseStudies.filter({ has: page.getByRole("heading", { name: title }) });
    await expect(article).toHaveCount(1);
    await expect(article.getByText(/published healthcare product work|published organization website/i)).toBeVisible();
    await expect(article.getByRole("link", { name: /view live product/i })).toHaveAttribute(
      "href",
      /^https:\/\//
    );
    const media = article.locator("[data-project-media]");
    await expect(media).toHaveAttribute("href", destinations.shift()!);
    await expect(media).toHaveAccessibleName(new RegExp(`open ${title}`, "i"));
    await expect(media.getByText("Live", { exact: true })).toBeVisible();
  }

  await expect(page.getByText("8 public projects")).toBeVisible();
  await expect(work.getByRole("heading", { name: "GolfGives" })).toBeVisible();
  await expect(work.getByRole("heading", { name: "PDFToolkit" })).toBeVisible();
  await expect(work.getByRole("heading", { name: "DevToolkit" })).toBeVisible();
  await expect(work.locator('[data-project-media="compact"]')).toHaveCount(3);
  await expect(work.getByRole("link", { name: /source for imagetoolkit/i })).toHaveAttribute(
    "href",
    "https://github.com/prithvinew004/ImageToolkit"
  );

  await expect(work.locator('a[href="#contact"]')).toHaveCount(0);
  await expect(work.getByText(/product screenshot|api docs|mobile screens/i)).toHaveCount(0);
});

test("desktop navigation exposes exactly one active section while scrolling", async ({ page }) => {
  await page.setViewportSize(viewports[5]);
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  for (const section of ["projects", "skills", "experience", "about", "activity", "contact", "hero"]) {
    await nav.locator(`a[href="#${section}"]`).click();
    await expect(nav.locator(`a[href="#${section}"]`)).toHaveAttribute(
      "aria-current",
      "location"
    );
    await expect(nav.locator('a[aria-current="location"]')).toHaveCount(1);
  }
});

test("capabilities cite work and unresolved employment claims stay unpublished", async ({ page }) => {
  await page.goto("/");

  const capabilities = page.locator("#skills");
  await expect(
    capabilities.getByRole("heading", { level: 2, name: /capabilities tied to real work/i })
  ).toBeVisible();
  await expect(capabilities.getByRole("article")).toHaveCount(3);
  await expect(capabilities.getByRole("link", { name: /curoh/i }).first()).toHaveAttribute(
    "href",
    "#project-curoh-dr-raja"
  );

  const approach = page.locator("#experience");
  await expect(approach.getByRole("heading", { level: 2, name: /how i work/i })).toBeVisible();
  await expect(approach.getByRole("article")).toHaveCount(3);
  await expect(approach.getByText(/DigiFrills|LOMAA IT Solutions|Navachis IT Solutions/i)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /testimonials|kind words/i })).toHaveCount(0);
});

test("the complete page stays usable across target viewports and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectNoHorizontalOverflow(page);
    await expect(page.locator("main")).toBeVisible();
  }

  expect(await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true
  );
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    "auto"
  );

  await page.setViewportSize({ width: 780, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.documentElement.style.fontSize = "200%");
  await expectNoHorizontalOverflow(page);
});

test("mobile navigation returns focus and contact survives clipboard denial", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new DOMException("Denied", "NotAllowedError")) },
    });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Navigate" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  const email = page.getByRole("link", { name: /prithvi\.new004@gmail\.com/i });
  await email.scrollIntoViewIfNeeded();
  await expect(email).toHaveAttribute("href", "mailto:prithvi.new004@gmail.com");
  await expect(page.getByRole("link", { name: /^Discord/i })).toHaveAttribute(
    "href",
    "https://discord.com/users/1068023960689717288"
  );
  await page.getByRole("button", { name: /copy email/i }).click();
  await expect(page.getByRole("status").filter({ hasText: /copy unavailable/i })).toBeVisible();
  await expect(email).toBeVisible();
});

test("desktop and mobile navigation open the Cal.com booking in a separate tab", async ({ page, context }) => {
  const bookingUrl = "https://cal.com/prithviraj-panda-qtbcvw/30min";
  await context.route(bookingUrl, (route) => route.fulfill({ body: "Booking page" }));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const desktop = page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: /let.s talk/i });
  const [desktopBooking] = await Promise.all([page.waitForEvent("popup"), desktop.click()]);
  await expect(desktopBooking).toHaveURL(bookingUrl);
  await desktopBooking.close();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  const drawer = page.getByRole("dialog", { name: "Navigate" });
  const [mobileBooking] = await Promise.all([
    page.waitForEvent("popup"),
    drawer.getByRole("link", { name: /start a conversation/i }).click(),
  ]);
  await expect(mobileBooking).toHaveURL(bookingUrl);
  await expect(drawer).toBeHidden();
  await expect(page.locator("#contact").getByRole("link", { name: /prithvi\.new004@gmail\.com/i })).toHaveAttribute("href", "mailto:prithvi.new004@gmail.com");
});

test("the mobile contribution chart is scrollable from the keyboard", async ({ page }) => {
  await page.setViewportSize(viewports[0]);
  await page.goto("/");
  const chart = page.getByRole("region", { name: "GitHub contributions calendar" });
  await chart.focus();
  await expect(chart).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => chart.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  const results = await new AxeBuilder({ page }).withRules(["scrollable-region-focusable"]).analyze();
  expect(results.violations).toEqual([]);
});

test("public activity discloses its source and covered-through date", async ({ page }) => {
  const clientGitHubRequests: string[] = [];
  page.on("request", (request) => {
    if (/api\.github\.com|github-contributions-api/.test(request.url())) {
      clientGitHubRequests.push(request.url());
    }
  });

  await page.goto("/");

  const activity = page.locator("#activity");
  await expect(activity.getByText(/live GitHub data|saved public snapshot/i)).toBeVisible();
  await expect(activity.locator("time[datetime]")).toHaveAttribute(
    "datetime",
    /^\d{4}-\d{2}-\d{2}$/
  );
  await expect(activity.getByRole("link", { name: /GitHub profile/i })).toHaveAttribute(
    "href",
    "https://github.com/prithvinew004"
  );
  await expect(page.getByRole("heading", { name: /real work, shown with context/i })).toBeVisible();
  await expect(page.locator("#hero").getByRole("link", { name: "Contact me" })).toHaveAttribute(
    "href",
    "#contact"
  );
  expect(clientGitHubRequests).toEqual([]);
});

export { expectNoHorizontalOverflow, observeRuntimeFailures, viewports };
