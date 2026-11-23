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

test("first viewport explains the offer and exposes both primary actions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [viewports[1], viewports[4]]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /clear products.*useful workflows.*built end to end/i })
    ).toBeVisible();
    await expect(page.getByText(/turn product ideas into clear, usable web experiences/i)).toBeVisible();

    const hero = page.locator("#hero");
    const contact = hero.getByRole("link", { name: /start a conversation/i });
    const work = hero.getByRole("link", { name: /see selected work/i });
    await expect(contact).toHaveAttribute("href", "#contact");
    await expect(work).toHaveAttribute("href", "#projects");
    await expect(contact).toBeInViewport();
    await expect(work).toBeInViewport();
    const stack = page.getByRole("region", { name: "Featured project websites" });
    await expect(stack).toBeVisible();
    await expect(stack.locator("[data-swap-index]")).toHaveCount(4);
    await expect(page.locator("[data-hero-stack]").getByRole("link", { name: /visit live site/i })).toHaveAttribute(
      "href",
      "https://dev.curoh.com/login/dr-raja-neuro-care"
    );
    await expect(page.getByText(/^Loading$/i)).toHaveCount(0);

    await page.keyboard.press("Tab");
    await expect(page.locator(":focus-visible")).toBeVisible();

    await contact.click();
    await expect(page.locator("#contact")).toBeInViewport();
  }
});

test("small-screen text stays inside the viewport without clipping", async ({ page }) => {
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
  const mediaLinks = work.locator("[data-project-media]");

  await expect(caseStudies).toHaveCount(4);
  await expect(mediaLinks).toHaveCount(4);
  await expect(work.getByText("Primary case study", { exact: true })).toBeVisible();
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
    await expect(media.getByText("Live site", { exact: true })).toBeVisible();
  }

  await expect(page.getByText("8 public projects")).toBeVisible();
  await expect(work.getByRole("heading", { name: "GolfGives" })).toBeVisible();
  await expect(work.getByRole("heading", { name: "PDFToolkit" })).toBeVisible();
  await expect(work.getByRole("heading", { name: "DevToolkit" })).toBeVisible();

  await expect(work.locator('a[href="#contact"]')).toHaveCount(0);
  await expect(work.getByText(/product screenshot|api docs|mobile screens/i)).toHaveCount(0);
});

test("editorial typography uses the approved premium scale", async ({ page }) => {
  await page.setViewportSize(viewports[4]);
  await page.goto("/");

  const sizes = await page.evaluate(() => {
    const px = (selector: string) =>
      Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>(selector)!).fontSize);
    return {
      hero: px("#hero h1"),
      sections: ["#projects h2", "#skills h2", "#experience h2", "#activity h2"].map(px),
      primaryProject: px("#project-curoh-dr-raja h3"),
      supportingProjects: ["#project-digifrills h3", "#project-navachis h3", "#project-lomaa h3"].map(px),
      body: Number.parseFloat(getComputedStyle(document.body).fontSize),
    };
  });

  expect(sizes.hero).toBeLessThanOrEqual(88);
  expect(sizes.hero).toBeGreaterThanOrEqual(72);
  expect(Math.max(...sizes.sections)).toBeLessThanOrEqual(64);
  expect(Math.max(...sizes.sections)).toBeGreaterThanOrEqual(48);
  expect(sizes.primaryProject).toBeLessThanOrEqual(64);
  expect(Math.max(...sizes.supportingProjects)).toBeLessThanOrEqual(52);
  expect(sizes.body).toBe(16);
});

test("desktop navigation exposes exactly one active section while scrolling", async ({ page }) => {
  await page.setViewportSize(viewports[3]);
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  for (const section of ["projects", "skills", "experience", "activity", "contact"]) {
    await page.locator(`#${section}`).scrollIntoViewIfNeeded();
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
    capabilities.getByRole("heading", { level: 2, name: /a stack is useful when the workflow holds together/i })
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

  const activeProject = page.locator('[data-hero-stack] [aria-live="polite"]');
  await expect(activeProject).toHaveText("Curoh · Dr Raja Neuro Care");
  await expect(activeProject).toBeVisible();
  await page.waitForTimeout(5800);
  await expect(activeProject).toHaveText("Curoh · Dr Raja Neuro Care");

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
  await expect(page.getByRole("status")).toHaveText(/copy unavailable/i);
  await expect(email).toBeVisible();
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
  await expect(page.getByRole("heading", { name: /real products, given room to speak/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /start a conversation/i }).last()).toHaveAttribute(
    "href",
    "#contact"
  );
  expect(clientGitHubRequests).toEqual([]);
});

export { expectNoHorizontalOverflow, observeRuntimeFailures, viewports };
