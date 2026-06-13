import assert from "node:assert/strict";
import test from "node:test";

import { parseArgs } from "../src/args.js";

test("parses supported CLI flags", () => {
  const options = parseArgs([
    "--from",
    "v0.1.0",
    "--to",
    "HEAD",
    "--output",
    "CHANGELOG.md",
    "--heading",
    "v0.2.0",
    "--repo",
    "/tmp/project",
    "--dry-run"
  ]);

  assert.deepEqual(options, {
    from: "v0.1.0",
    to: "HEAD",
    output: "CHANGELOG.md",
    heading: "v0.2.0",
    repo: "/tmp/project",
    dryRun: true,
    help: false
  });
});

test("rejects unknown flags", () => {
  assert.throws(() => parseArgs(["--wat"]), /Unknown option: --wat/);
});

test("rejects missing flag values", () => {
  assert.throws(() => parseArgs(["--from"]), /Missing value for --from/);
});
