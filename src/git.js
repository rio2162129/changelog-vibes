import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const FIELD_SEPARATOR = "\u001f";
const RECORD_SEPARATOR = "\u001e";

export async function readGitCommits(options) {
  const args = buildGitLogArgs(options);
  let stdout;

  try {
    const result = await execFileAsync("git", args, {
      cwd: options.repo,
      maxBuffer: 1024 * 1024 * 10
    });
    stdout = result.stdout;
  } catch (error) {
    if (isEmptyRepositoryHeadError(error, options)) {
      return [];
    }
    throw error;
  }

  return parseGitLog(stdout);
}

export function buildGitLogArgs(options) {
  const range = options.from ? `${options.from}..${options.to}` : options.to;
  return [
    "log",
    range,
    `--pretty=format:%H${FIELD_SEPARATOR}%s${FIELD_SEPARATOR}%b${RECORD_SEPARATOR}`
  ];
}

export function parseGitLog(stdout) {
  return stdout
    .split(RECORD_SEPARATOR)
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [hash = "", subject = "", body = ""] = record.split(FIELD_SEPARATOR);
      return { hash, subject, body };
    });
}

function isEmptyRepositoryHeadError(error, options) {
  if (options.from || options.to !== "HEAD") return false;
  const stderr = error.stderr || "";
  return stderr.includes("ambiguous argument 'HEAD'") || stderr.includes("unknown revision");
}
