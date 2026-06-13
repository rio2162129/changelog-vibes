import assert from "node:assert/strict";
import test from "node:test";

import { formatChangelog } from "../src/formatter.js";

test("formats commits into ordered Markdown sections", () => {
  const markdown = formatChangelog(
    [
      {
        hash: "a111111",
        shortHash: "a111111",
        scope: "cli",
        subject: "add output flag",
        category: "Added"
      },
      {
        hash: "b222222",
        shortHash: "b222222",
        scope: "",
        subject: "handle empty git log",
        category: "Fixed"
      },
      {
        hash: "c333333",
        shortHash: "c333333",
        scope: "api",
        subject: "rename config option",
        category: "Breaking Changes"
      }
    ],
    { heading: "v0.2.0" }
  );

  assert.equal(
    markdown,
    [
      "# Changelog",
      "",
      "## v0.2.0",
      "",
      "### Breaking Changes",
      "- **api:** rename config option (`c333333`)",
      "",
      "### Added",
      "- **cli:** add output flag (`a111111`)",
      "",
      "### Fixed",
      "- handle empty git log (`b222222`)",
      ""
    ].join("\n")
  );
});

test("returns a helpful empty-state changelog", () => {
  const markdown = formatChangelog([], { heading: "Unreleased" });

  assert.equal(
    markdown,
    ["# Changelog", "", "## Unreleased", "", "No matching commits found.", ""].join("\n")
  );
});
