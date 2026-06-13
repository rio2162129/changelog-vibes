import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const projectRoot = new URL("..", import.meta.url).pathname;
const cliPath = join(projectRoot, "bin", "changelog-vibes.js");

function git(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" });
}

test("CLI prints a changelog for a git repository", () => {
  const repo = mkdtempSync(join(tmpdir(), "changelog-vibes-"));

  try {
    git(repo, ["init"]);
    git(repo, ["config", "user.email", "test@example.com"]);
    git(repo, ["config", "user.name", "Test User"]);

    writeFileSync(join(repo, "app.txt"), "one\n");
    git(repo, ["add", "app.txt"]);
    git(repo, ["commit", "-m", "feat(cli): add dry run mode"]);

    writeFileSync(join(repo, "app.txt"), "one\ntwo\n");
    git(repo, ["add", "app.txt"]);
    git(repo, ["commit", "-m", "fix: handle empty output path"]);

    const output = execFileSync("node", [cliPath, "--repo", repo, "--dry-run", "--heading", "Test"], {
      encoding: "utf8"
    });

    assert.match(output, /## Test/);
    assert.match(output, /### Added/);
    assert.match(output, /- \*\*cli:\*\* add dry run mode/);
    assert.match(output, /### Fixed/);
    assert.match(output, /- handle empty output path/);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("CLI prints an empty changelog for a repository with no commits", () => {
  const repo = mkdtempSync(join(tmpdir(), "changelog-vibes-empty-"));

  try {
    git(repo, ["init"]);

    const output = execFileSync("node", [cliPath, "--repo", repo, "--dry-run", "--heading", "Empty"], {
      encoding: "utf8"
    });

    assert.equal(output, ["# Changelog", "", "## Empty", "", "No matching commits found.", ""].join("\n"));
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
