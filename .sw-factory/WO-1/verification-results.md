# WO-1 verification evidence (2026-09-21)

Source tree: initially materialized from a GitHub API snapshot of `zzys3228/todo-react-8090-trial-0907@fb6d245439e0367d2c514227f4e5c20cb3df456e`. After diagnosing the local Git proxy, the actual upstream commit was fetched and the `codex/8090-title-count-0914` implementation branch was rebased directly onto that exact commit. The upstream `main` ref was verified to match it before delivery.

## Red-green and code checks

1. Before implementation, `vitest run src/components/title-length.wo1.test.jsx --environment jsdom --reporter verbose` failed both focused tests for the correct reason: neither creation nor editing rendered `0/100`.
2. After implementation and test cleanup, the same focused suite passed: 1 file, 4 tests passed. It covers new/edit count and native length attribute, per-input descriptions, direct over-limit input event truncation, 100→99→100 status reset, and baseline empty-title submission.
3. `npm run lint` exited 0. `git diff --check` exited 0; Git reported only CRLF normalization warnings. `npm run build` exited 0 with 38 modules transformed.

## Real browser pass

Backend: Codex In-app Browser, agent-created hidden tab, target `http://127.0.0.1:3002/todo-react/`. Server was checked by HTTP 200 before opening. All UI actions below used the browser page and did not create 8090 product records.

- Initial TodoMatic page showed the new-task title input followed by `0/100` and the existing Eat/Sleep/Repeat task list.
- Browser paste of 101 ASCII characters into the new-task input yielded exactly 100 characters, `100/100` and “已达到 100 字符上限”. Backspace yielded `99/100` and removed the status text; typing one character restored `100/100` and the status text.
- Opening Edit Eat showed an independent edit input and `0/100` while the new-task field remained at `100/100`. Pasting 101 characters into the edit input yielded exactly 100, `100/100` and its own upper-limit message.
- Read-only DOM inspection at a 2560 px viewport returned `scrollWidth=2560`, `window.innerWidth=2560`, both input `maxLength=100`, descriptions `new-todo-input-counter` and `todo-0-counter`, and two independent `role=status`/`aria-live=polite` elements.
- A separate real Chromium pass (Playwright) at 375 px and 1280 px filled both inputs with 101 characters. At both widths, `scrollWidth` equaled viewport width, both retained exactly 100 characters and displayed `100/100`, and the input/count rectangles stayed inside the viewport. Results: `{width:375,scrollWidth:375,createLength:100,editLength:100,createCount:"100/100",editCount:"100/100",createInView:true,editInView:true}` and the same values at width 1280. This is browser-generated layout evidence, not an API-created Software Factory record.

## Known limits

- Browser paste here demonstrates native maxLength behavior. The direct over-limit input-event path is covered by the focused test, not by the browser paste action.
- No real assistive-technology speech output was measured. DOM semantics and message transitions were verified; actual NVDA announcements require a separate manual or instrumented AT pass.
- 8090 Work Order WO-1 was moved from In Progress to In Review through the browser after the independent review verdict, and the list row, detail field, and Activity entry reflected In Review.
- The reviewed code and WO-1/WO-2 execution files were delivered to draft [PR #1](https://github.com/zzys3228/todo-react-8090-trial-0907/pull/1) from the exact upstream base. WO-1's Development panel displayed this PR after branch creation. The PR is not merged; no 8090 execution MCP run is claimed.
