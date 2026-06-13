import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";

import { helpText, parseArgs } from "./args.js";
import { formatChangelog } from "./formatter.js";
import { readGitCommits } from "./git.js";
import { parseCommit } from "./parser.js";

export async function runCli(argv = process.argv.slice(2), io = process) {
  let options;

  try {
    options = parseArgs(argv);
  } catch (error) {
    io.stderr.write(`${error.message}\n\n${helpText()}\n`);
    return 1;
  }

  if (options.help) {
    io.stdout.write(`${helpText()}\n`);
    return 0;
  }

  try {
    const rawCommits = await readGitCommits(options);
    const commits = rawCommits.map(parseCommit);
    const markdown = formatChangelog(commits, { heading: options.heading });

    if (options.dryRun) {
      io.stdout.write(markdown);
      return 0;
    }

    const outputPath = resolve(options.repo, options.output);
    await writeFile(outputPath, markdown, "utf8");
    io.stdout.write(`Wrote ${outputPath}\n`);
    return 0;
  } catch (error) {
    io.stderr.write(`Failed to generate changelog: ${error.message}\n`);
    return 1;
  }
}
