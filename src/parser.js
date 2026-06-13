const CATEGORY_BY_TYPE = new Map([
  ["feat", "Added"],
  ["fix", "Fixed"],
  ["docs", "Docs"],
  ["refactor", "Changed"],
  ["perf", "Performance"],
  ["test", "Tests"],
  ["build", "Maintenance"],
  ["ci", "Maintenance"],
  ["chore", "Maintenance"],
  ["style", "Maintenance"],
  ["revert", "Reverts"]
]);

export function parseCommit(rawCommit) {
  const hash = rawCommit.hash || "";
  const subject = rawCommit.subject.trim();
  const body = rawCommit.body || "";
  const match = subject.match(/^([a-z]+)(?:\(([^)]+)\))?(!)?:\s+(.+)$/i);

  if (!match) {
    return {
      hash,
      shortHash: hash.slice(0, 7),
      type: "other",
      scope: "",
      subject,
      breaking: hasBreakingChange(body),
      category: hasBreakingChange(body) ? "Breaking Changes" : "Other"
    };
  }

  const [, rawType, scope = "", bang = "", parsedSubject] = match;
  const type = rawType.toLowerCase();
  const breaking = bang === "!" || hasBreakingChange(body);

  return {
    hash,
    shortHash: hash.slice(0, 7),
    type,
    scope,
    subject: parsedSubject,
    breaking,
    category: breaking ? "Breaking Changes" : CATEGORY_BY_TYPE.get(type) || "Other"
  };
}

function hasBreakingChange(body) {
  return /(^|\n)BREAKING CHANGE:/i.test(body);
}
