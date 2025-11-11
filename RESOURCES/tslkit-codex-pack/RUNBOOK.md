# RUNBOOK.md — Universal Ops

## Setup
- Node v20+, `npm ci`, `npx playwright install --with-deps`

## Common Commands
- `make setup` — install deps
- `make test` — run unit/e2e
- `make ui:start && make ui:shots` — generate screenshots
- `make ui:diff` — pixel diffs against baselines

## CI/CD
- Every PR: build, test, screenshots, artifact upload, (optional) pixel diffs.
- Required reviewers for sensitive paths; block on failing gates.

## Incidents
- Reproduce with failing test; link logs and screenshots in the issue; rollback via last good tag if needed.
