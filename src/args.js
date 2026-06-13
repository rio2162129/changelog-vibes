const VALUE_FLAGS = new Set(["--from", "--to", "--output", "--heading", "--repo"]);

export function parseArgs(argv) {
  const options = {
    from: "",
    to: "HEAD",
    output: "CHANGELOG.md",
    heading: "Unreleased",
    repo: process.cwd(),
    dryRun: false,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (!VALUE_FLAGS.has(arg)) {
      throw new Error(`Unknown option: ${arg}`);
    }

    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`);
    }

    index += 1;
    if (arg === "--from") options.from = value;
    if (arg === "--to") options.to = value;
    if (arg === "--output") options.output = value;
    if (arg === "--heading") options.heading = value;
    if (arg === "--repo") options.repo = value;
  }

  return options;
}

export function helpText() {
  return [
    "changelog-vibes",
    "",
    "Usage:",
    "  changelog-vibes [--from <ref>] [--to <ref>] [--output <file>] [--heading <text>] [--repo <path>] [--dry-run]",
    "",
    "Options:",
    "  --from <ref>       Start ref for git log. If omitted, all commits up to --to are used.",
    "  --to <ref>         End ref for git log. Defaults to HEAD.",
    "  --output <file>    File to write. Defaults to CHANGELOG.md.",
    "  --heading <text>   Changelog section heading. Defaults to Unreleased.",
    "  --repo <path>      Repository path. Defaults to the current directory.",
    "  --dry-run          Print Markdown instead of writing a file.",
    "  --help, -h         Show this help."
  ].join("\n");
}
