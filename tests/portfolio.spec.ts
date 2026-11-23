import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { name: "small-mobile", width: 360, height: 800 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 900 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "minimum", width: 320, height: 568 },
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

test("hero communicates the offer and restores the stacked project theatre", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of [viewports[1], viewports[4]]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /i build the product, not just the page/i })
    ).toBeVisible();
    const hero = page.locator("#hero");
    const work = hero.getByRole("link", { name: /explore selected work/i });
    const contact = hero.getByRole("link", { name: /start a conversation/i });
    await expect(work).toHaveAttribute("href", "#projects");
    await expect(contact).toHaveAttribute("href", "#contact");
    await expect(hero.getByRole("list", { name: "Areas of focus" }).getByRole("listitem")).toHaveCount(3);

    const stack = page.getByRole("region", { name: "Featured project websites" });
    await expect(stack).toBeVisible();
    await expect(stack.locator("[data-swap-index]")).toHaveCount(4);
    await expect(hero.locator("[data-hero-stack]").getByRole("link", { name: /live site/i })).toHaveAttribute(
      "href",
      "https://dev.curoh.com/login/dr-raja-neuro-care"
    );
  }
});

test("React Bits Flowing Menu exposes four real project destinations", async ({ page }) => {
  await page.setViewportSize(viewports[4]);
  await page.goto("/");

  const menu = page.getByRole("navigation", { name: "Selected project websites" });
  await menu.scrollIntoViewIfNeeded();
  const links = menu.getByRole("link");
  await expect(links).toHaveCount(4);

  const expected = [
    ["Curoh", "https://dev.curoh.com/login/dr-raja-neuro-care"],
    ["DigiFrills", "https://digifrills.in/"],
    ["Navachis IT Solutions", "https://navachis.com/"],
    ["LOMAA IT Solutions", "https://lomaait.com/"],
  ] as const;

  for (const [name, destination] of expected) {
    await expect(menu.getByRole("link", { name: new RegExp(name, "i") })).toHaveAttribute(
      "href",
      destination
    );
  }

  await links.first().focus();
  await expect(links.first()).toBeFocused();
});

test("primary evidence and Watermelon collections reveal complete project data", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const primary = page.locator("#project-curoh-dr-raja");
  await expect(
    primary.getByRole("heading", { name: /a clinical entry point designed for trust/i })
  ).toBeVisible();
  await expect(primary.getByRole("img", { name: /curoh/i })).toBeVisible();
  await expect(primary.getByRole("link", { name: /open the live product/i })).toHaveAttribute(
    "href",
    "https://dev.curoh.com/login/dr-raja-neuro-care"
  );

  const independent = page.locator("#independent-work");
  const productSystem = independent.getByRole("button", { name: /full-stack product system/i });
  const toolSuite = independent.getByRole("button", { name: /browser tool suite/i });
  await expect(productSystem).toHaveAttribute("aria-expanded", "false");
  await expect(toolSuite).toHaveAttribute("aria-expanded", "false");

  await productSystem.click();
  await expect(independent.getByRole("heading", { name: "GolfGives" })).toBeVisible();
  await expect(independent.getByRole("link", { name: /open GolfGives/i })).toHaveAttribute(
    "href",
    /^https:\/\//
  );
  await independent.getByRole("button", { name: /collapse full-stack product system/i }).click();

  await toolSuite.click();
  for (const project of ["PDFToolkit", "DevToolkit", "ImageToolkit"]) {
    await expect(independent.getByRole("heading", { name: project })).toBeVisible();
  }
});

test("capabilities link to evidence and the working approach stays truthful", async ({ page }) => {
  await page.goto("/");

  const capabilities = page.locator("#skills");
  await expect(
    capabilities.getByRole("heading", { level: 2, name: /interface, system, and delivery/i })
  ).toBeVisible();
  await expect(capabilities.getByRole("article")).toHaveCount(3);
  await expect(capabilities.getByRole("link", { name: /curoh/i }).first()).toHaveAttribute(
    "href",
    "#project-curoh-dr-raja"
  );

  const approach = page.locator("#experience");
  await expect(
    approach.getByRole("heading", { level: 2, name: /find the path. build the whole thing/i })
  ).toBeVisible();
  await expect(approach.getByRole("listitem")).toHaveCount(3);
  await expect(approach.getByText(/DigiFrills|LOMAA IT Solutions|Navachis IT Solutions/i)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /testimonials|kind words/i })).toHaveCount(0);
});

test("desktop navigation exposes exactly one active section while scrolling", async ({ page }) => {
  await page.setViewportSize(viewports[4]);
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  for (const section of ["projects", "skills", "experience", "activity", "contact"]) {
    await page.locator(`#${section}`).scrollIntoViewIfNeeded();
    await expect(nav.locator(`a[href="#${section}"]`)).toHaveAttribute("aria-current", "location");
    await expect(nav.locator('a[aria-current="location"]')).toHaveCount(1);
  }
});

test("the complete page stays usable across target viewports and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectNoHorizontalOverflow(page);
    await expect(page.locator("main")).toBeVisible();
  }

  expect(await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");

  const activeProject = page.locator('[data-hero-stack] [aria-live="polite"]');
  await expect(activeProject).toContainText("Curoh · Dr Raja Neuro Care");
  await page.waitForTimeout(5800);
  await expect(activeProject).toContainText("Curoh · Dr Raja Neuro Care");

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
  await page.setViewportSize(viewports[1]);
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Navigate" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  const email = page.getByRole("link", { name: /prithvi\.new004@gmail\.com/i });
  await email.scrollIntoViewIfNeeded();
  await expect(email).toHaveAttribute("href", "mailto:prithvi.new004@gmail.com");
  await page.getByRole("button", { name: /copy email/i }).click();
  await expect(page.getByRole("status")).toHaveText(/copy unavailable/i);
});

test("public activity and closing contact disclose trustworthy sources", async ({ page }) => {
  const clientGitHubRequests: string[] = [];
  page.on("request", (request) => {
    if (/api\.github\.com|github-contributions-api/.test(request.url())) {
      clientGitHubRequests.push(request.url());
    }
  });

  await page.goto("/");
  const activity = page.locator("#activity");
  await expect(activity.getByText(/live GitHub data|saved public snapshot/i)).toBeVisible();
  await expect(activity.locator("time[datetime]")).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);
  await expect(activity.getByRole("link", { name: /complete GitHub profile/i })).toHaveAttribute(
    "href",
    "https://github.com/prithvinew004"
  );
  await expect(page.getByRole("heading", { name: /have a product worth building/i })).toBeVisible();
  expect(clientGitHubRequests).toEqual([]);
});

test("minimum-width text remains inside the viewport without clipping", async ({ page }) => {
  await page.setViewportSize(viewports[5]);
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
            clippedContent: node.scrollWidth > node.clientWidth + 1,
          };
        })
        .filter(({ text, left, right }) =>
          text && (left < -1 || right > document.documentElement.clientWidth + 1)
        )
  );

  expect(clipped).toEqual([]);
  await expectNoHorizontalOverflow(page);
});

export { expectNoHorizontalOverflow, observeRuntimeFailures, viewports };
