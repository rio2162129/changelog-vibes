const CATEGORY_ORDER = [
  "Breaking Changes",
  "Added",
  "Fixed",
  "Changed",
  "Performance",
  "Docs",
  "Tests",
  "Maintenance",
  "Reverts",
  "Other"
];

export function formatChangelog(commits, options = {}) {
  const heading = options.heading || "Unreleased";
  const lines = ["# Changelog", "", `## ${heading}`, ""];

  if (commits.length === 0) {
    lines.push("No matching commits found.", "");
    return lines.join("\n");
  }

  const grouped = groupByCategory(commits);

  for (const category of CATEGORY_ORDER) {
    const items = grouped.get(category) || [];
    if (items.length === 0) continue;

    lines.push(`### ${category}`);
    for (const item of items) {
      lines.push(formatCommitLine(item));
    }
    lines.push("");
  }

  return lines.join("\n");
}

function groupByCategory(commits) {
  const grouped = new Map();
  for (const commit of commits) {
    const category = commit.category || "Other";
    const items = grouped.get(category) || [];
    items.push(commit);
    grouped.set(category, items);
  }
  return grouped;
}

function formatCommitLine(commit) {
  const scope = commit.scope ? `**${commit.scope}:** ` : "";
  const hash = commit.shortHash ? ` (\`${commit.shortHash}\`)` : "";
  return `- ${scope}${commit.subject}${hash}`;
}
