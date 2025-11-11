setup:
\tnpm ci
test:
\tnpm test -- --coverage
dev:
\tnpm run dev
ui:start:
\tnpm run dev & sleep 5
ui:shots:
\tnpx playwright test --project=chromium --reporter=dot
ui:diff:
\tnode scripts/visual/diff.mjs
fmt:
\tnpm run format && npm run lint -- --fix
