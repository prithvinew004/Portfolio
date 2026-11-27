import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} from "next/constants";
import nextConfig from "../../next.config";

test("a production build cannot replace the development server's output", () => {
  const development = nextConfig(PHASE_DEVELOPMENT_SERVER);
  const build = nextConfig(PHASE_PRODUCTION_BUILD);
  const production = nextConfig(PHASE_PRODUCTION_SERVER);

  assert.notEqual(development.distDir, build.distDir);
  assert.equal(build.distDir, production.distDir);
});
