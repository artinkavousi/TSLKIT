# AGENT_GUIDE.md — Universal Codex Agent Guide

## Project Conventions
- Commands are standardized via **Makefile**:
  - `make setup` (install deps)
  - `make test`  (unit + e2e)
  - `make dev`   (start dev server)
  - `make ui:start && make ui:shots` (headless server + screenshots)

## Ticket Hygiene
- **Atomic tasks only**: one crisp goal with measurable **Acceptance Criteria** (AC).
- Include **visual AC** (e.g., “Provide `home-desktop.png` and `home-mobile.png` proving layout”).

## Testing
- Write/extend **unit tests**, **integration tests**, and **visual smoke tests**.
- Use **pixel diffs** (optional) to guard UI regressions.

## PR Flow
1) Plan review (human quick look). 2) Agent commits. 3) CI runs tests + visuals. 4) PR review (security/perf). 5) Merge.

## Failure Recovery
- Create a failing test reproducing the issue.
- List hypotheses (ranked), patch iteratively, re-run tests, update screenshots.
- If blocked, switch to “Explain mode” and enumerate probes/next steps.

## Multi-Agent Option
- Planner → Implementer → Tester → Reviewer agents. Each uses PDCR and hands artifacts forward.
