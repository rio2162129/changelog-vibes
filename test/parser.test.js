import assert from "node:assert/strict";
import test from "node:test";

import { parseCommit } from "../src/parser.js";

test("parses a conventional commit with type and scope", () => {
  const commit = parseCommit({
    hash: "1234567890abcdef",
    subject: "feat(cli): add output flag",
    body: ""
  });

  assert.deepEqual(commit, {
    hash: "1234567890abcdef",
    shortHash: "1234567",
    type: "feat",
    scope: "cli",
    subject: "add output flag",
    breaking: false,
    category: "Added"
  });
});

test("marks bang commits as breaking changes", () => {
  const commit = parseCommit({
    hash: "abcdef1234567890",
    subject: "feat(api)!: rename config option",
    body: ""
  });

  assert.equal(commit.breaking, true);
  assert.equal(commit.category, "Breaking Changes");
  assert.equal(commit.subject, "rename config option");
});

test("detects breaking changes from commit body", () => {
  const commit = parseCommit({
    hash: "fedcba9876543210",
    subject: "fix: load config before startup",
    body: "BREAKING CHANGE: config is now read from changelog-vibes.json"
  });

  assert.equal(commit.breaking, true);
  assert.equal(commit.category, "Breaking Changes");
});

test("keeps non-conventional commits in Other", () => {
  const commit = parseCommit({
    hash: "1111111111111111",
    subject: "Initial import",
    body: ""
  });

  assert.equal(commit.type, "other");
  assert.equal(commit.scope, "");
  assert.equal(commit.subject, "Initial import");
  assert.equal(commit.category, "Other");
});
