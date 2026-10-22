import "server-only";

import { github } from "@/content/resume";
import fallback from "@/content/github-fallback.json";

/** One day. Both feeds are revalidated on this cadence via fetch's `next.revalidate`. */
const DAY = 86_400;

export type Contributions = {
  /** 365 entries, oldest first — the shape Kibo's ContributionGraph takes as `data`. */
  days: { date: string; count: number; level: number }[];
  total: number;
  /** True when the live fetch failed and the committed snapshot is being shown instead. */
  stale: boolean;
};

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  pushedAt: string;
};

/**
 * Server-side only, and deliberately so: no token ever reaches the browser, and the daily
 * revalidate means GitHub sees one request per feed per day rather than one per visitor.
 * A token is optional — it only raises the unauthenticated 60/hr limit, which a daily
 * revalidate is nowhere near.
 */
function auth(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Every fetch here is wrapped: a portfolio must render even when a third-party API is down,
 * so a failure degrades to the committed snapshot rather than throwing the page away. Returns
 * null on any failure — HTTP error, network error, or a body that isn't the shape we expect.
 */
async function safeJson<T>(url: string, init: RequestInit & { next: { revalidate: number } }) {
  try {
    const res = await fetch(url, { ...init, headers: auth() });
    if (!res.ok) {
      console.warn(`[github] ${url} -> ${res.status}; using fallback`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[github] ${url} failed; using fallback`, err);
    return null;
  }
}

type ApiContributions = {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
};

export async function getContributions(): Promise<Contributions> {
  const data = await safeJson<ApiContributions>(
    `https://github-contributions-api.jogruber.de/v4/${github.username}?y=last`,
    { next: { revalidate: DAY } }
  );

  // A 200 with an empty or malformed body is still a failure — check the payload, not the status.
  const days = data?.contributions;
  if (!Array.isArray(days) || days.length === 0) {
    return { ...(fallback.contributions as Omit<Contributions, "stale">), stale: true };
  }

  return {
    days,
    total: days.reduce((sum, d) => sum + d.count, 0),
    stale: false,
  };
}

type ApiRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  pushed_at: string;
};

/**
 * Hydrates the repos named in `github.repos` with live data. One list request rather than one
 * per repo: three round trips would spend three times the rate limit to learn the same thing.
 *
 * The *selection* is curated in content/resume.ts; everything displayed — description, language,
 * star count — is live from the API.
 */
export async function getRepos(): Promise<{ repos: Repo[]; stale: boolean }> {
  const data = await safeJson<ApiRepo[]>(
    `https://api.github.com/users/${github.username}/repos?per_page=100&sort=pushed`,
    { next: { revalidate: DAY } }
  );

  if (!Array.isArray(data)) return { repos: fallback.repos as Repo[], stale: true };

  const byName = new Map(data.map((r) => [r.name.toLowerCase(), r]));
  const repos = github.repos
    .map((name) => byName.get(name.toLowerCase()))
    .filter((r): r is ApiRepo => Boolean(r))
    .map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      url: r.html_url,
      pushedAt: r.pushed_at,
    }));

  // A renamed or deleted repo would silently drop a card; the snapshot still has it.
  if (repos.length === 0) return { repos: fallback.repos as Repo[], stale: true };
  return { repos, stale: false };
}

/** Linguist colours for the languages this profile actually uses; grey covers anything new. */
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Dart: "#00b4ab",
  Go: "#00add8",
  Rust: "#dea584",
  Java: "#b07219",
};

export const langColor = (lang: string | null) =>
  (lang && LANG_COLORS[lang]) || "var(--dim)";
