/**
 * Regenerates content/github-fallback.json — the snapshot the site falls back to when the
 * GitHub feeds are unreachable at build time.
 *
 * Run it whenever the snapshot drifts far enough to be embarrassing: `npm run github:refresh`.
 * It is not wired into the build on purpose. A build step that hits two third-party APIs is a
 * build step that can fail, which is the exact failure this file exists to absorb.
 */
import { writeFile } from "node:fs/promises";

const USERNAME = "prithvinew004";
const REPOS = ["GolfGives", "pdftoolkit", "devtoolkit"];

const get = async (url) => {
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
};

const contrib = await get(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`);
const allRepos = await get(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`);

const byName = new Map(allRepos.map((r) => [r.name.toLowerCase(), r]));
const repos = REPOS.map((n) => byName.get(n.toLowerCase()))
  .filter(Boolean)
  .map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    url: r.html_url,
    pushedAt: r.pushed_at,
  }));

const missing = REPOS.filter((n) => !byName.has(n.toLowerCase()));
if (missing.length) throw new Error(`repos not found on GitHub: ${missing.join(", ")}`);

const out = {
  capturedAt: new Date().toISOString().slice(0, 10),
  contributions: {
    days: contrib.contributions,
    total: contrib.contributions.reduce((s, d) => s + d.count, 0),
  },
  repos,
};

// Unindented: 365 days pretty-printed is 1800 lines of generated noise in diffs, and this file
// is never hand-edited — rerun the script instead.
await writeFile(
  new URL("../content/github-fallback.json", import.meta.url),
  `${JSON.stringify(out)}\n`
);

console.log(
  `wrote content/github-fallback.json — ${out.contributions.days.length} days, ` +
    `${out.contributions.total} contributions, ${repos.length} repos`
);
