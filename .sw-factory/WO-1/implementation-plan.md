<!--lint disable no-undefined-references strong-marker-->

# Implementation Plan: WO-1

**Work Order:** WO-1 — 实现任务标题计数、上限与无障碍提示
**Created At (UTC):** 2026-09-21T01:32:55Z

## Summary

Add the same 100 UTF-16 code-unit title rule to the existing new-task and edit-task inputs. Preserve empty-title submission and focus behavior while adding a persistent `n/100` description and independent polite limit notification per input. The worktree starts from a GitHub API snapshot of source SHA `fb6d245439e0367d2c514227f4e5c20cb3df456e` (local synthetic commit `9758fc7553ea2321f88a6fd4615425baaeb41aa9`).

## Code Reuse And Package Structure

- Reuse `src/components/Form.jsx` for creation and `src/components/Todo.jsx` for editing. Keep `src/App.jsx` as the task state boundary; add no persistence or API.
- Add one shared title-length rule to avoid divergent counting/truncation, and one small presentation component for count/status if it reduces duplication without moving form state ownership.
- Update `src/index.css` only for count/status placement and narrow/wide overflow prevention. Preserve filters, completion, deletion, and focus effects.
- Keep comprehensive RTL tooling and coverage in dependent WO-2. WO-1 starts with a focused failing behavior test and documents the lack of a baseline `test` script.

## Components And Flow

`Form` and each editing `Todo` independently pass candidate input through `TitleLengthPolicy` (`slice(0, 100)` and `.length` in JavaScript UTF-16 code units). Each input declares `maxLength=100` and uses a unique `aria-describedby` target for its visible count. A separate `role=status` / `aria-live=polite` region announces once on transition below 100 → 100, stays quiet at 100, and re-arms at 99 or less. Accepted title values continue through existing `App.addTask` and `App.editTask`; empty strings remain valid.

## Steps

1. Confirm snapshot metadata, read linked requirement and both blueprints, and record exact context and AC mapping.
2. Add a focused test that fails on missing creation/editing count and limit behavior. Capture the failure before implementation.
3. Implement shared UTF-16 policy and independent count/status presentation in Form and Todo; preserve submit and focus paths.
4. Add minimal CSS for responsive placement, then rerun focused tests and lint. Hand off to WO-2 for full suite and build verification.

## Testing

- Focused regression: initial `0/100`, typing and pasting to 100, maxLength, defensive truncation, 100→99→100 announcement, empty-title behavior, unique `aria-describedby`.
- WO-2 owns comprehensive Vitest/RTL tests, narrow/wide browser observation, and production build execution. WO-1 must not claim those outcomes until actually run.
