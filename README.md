# changelog-vibes

A tiny zero-dependency CLI that turns git commits into a clean Markdown changelog.

## Usage

```bash
npx changelog-vibes --from v0.1.0 --to HEAD --output CHANGELOG.md
```

For a quick preview without writing a file:

```bash
npx changelog-vibes --from v0.1.0 --dry-run
```

## Commit Style

The best output comes from conventional commits:

```text
feat(cli): add output flag
fix: handle empty git log
docs(readme): add usage examples
feat(api)!: rename config option
```

Non-conventional commits are kept under `Other`.

## Local Development

```bash
npm test
node ./bin/changelog-vibes.js --dry-run
```
