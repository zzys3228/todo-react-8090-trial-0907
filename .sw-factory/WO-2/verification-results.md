# WO-2 verification evidence (2026-09-21)

## Configuration and command outcomes

- `package.json` declares a root `test` script using Vitest in jsdom and compatible exact versions of Vitest 2.1.9, React Testing Library 16.3.3, user-event 14.6.7, jsdom 25.0.1, and the required peer dependency `@testing-library/dom` 10.4.2. The authentic upstream repository includes `yarn.lock`; it is updated with these dependencies.
- The first clean Yarn install exposed the missing `@testing-library/dom` peer dependency: `corepack yarn test` failed with `Cannot find module '@testing-library/dom'`. After declaring it, a separate clean worktree at the actual upstream-based commit completed `corepack yarn install --ignore-scripts --non-interactive` and a subsequent `--frozen-lockfile` check, then `corepack yarn test` passed 9/9. The clean worktree has an ordinary dependency directory, and independent review confirmed its manifest and lockfile hashes match this branch. This is a real red/green verification of reproducible dependency setup, not only the earlier ignored `node_modules` junction run.
- `npm test` exited 0: 2 test files, 9 tests passed, including 5 WO-2 cases for UTF-16 counting, both over-limit input paths, independent edit fields and status, edit 100→99→100 reset, and empty create/edit submission.
- In the clean worktree, `corepack yarn lint` exited 0, `corepack yarn build` exited 0 with 38 transformed modules, and `git diff --check` exited 0 with only line-ending normalization warnings.

## Real browser evidence

- WO-1's browser pass in `.sw-factory/WO-1/verification-results.md` covers actual new and edit 101-character paste, independent counts/status, and Chromium 375 px and 1280 px no-overflow checks. WO-2 changed only test/tooling files, so the product UI code used in those checks is unchanged.
- Additional live browser interaction on `http://127.0.0.1:3002/todo-react/`: the edit field at `100/100` displayed its polite limit message; Backspace changed it to `99/100` and removed the message; typing one character changed it back to `100/100` and showed the message again. The separate create field stayed at `100/100` throughout.

## Evidence limits

- No actual NVDA speech was measured; DOM roles, relationships, state text and transitions were observed.
- No real screen-reader speech test or 8090 execution MCP run is claimed. Delivery links/status are recorded separately once created.
