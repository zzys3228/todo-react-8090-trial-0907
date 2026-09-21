<!--lint disable no-undefined-references strong-marker-->

# Implementation Plan: WO-2

**Work Order:** WO-2 — 配置并验证任务标题长度自动化测试
**Created At (UTC):** 2026-09-21T01:33:04Z

## Summary

After WO-1 implementation, configure a repeatable Vitest/React Testing Library test command and verify both title entry points, accessible relationships, limit announcement transitions, empty-title compatibility, responsive layout, and Vite production build. Preserve actual command outputs rather than treating scripts as proof of execution.

## Code Reuse And Package Structure

- Reuse existing Vite/React configuration and WO-1 components. Add only compatible test dependencies, a `test` script, test setup, and public-behavior component tests.
- Do not change title feature behavior except for a small justified testability correction; record any such change in review.

## Components And Flow

RTL renders `Form`, `Todo`, and `App`; tests use visible labels, input attributes, `aria-describedby` targets, and live status regions rather than private component state. Vitest runs through root `npm test`. `npm run build` remains the production bundle gate.

## Steps

1. Read WO-2 linked requirement/blueprints, WO-1 implementation and dependency state. Fill the context index and checklist.
2. Add test configuration and runnable script; complete red-green tests for AC-TODO-008.1..13 where automation is appropriate.
3. Run complete tests, lint, build, `git diff --check`, and browser narrow/wide exploration. Record commands, exit status, counts, and failures honestly.
4. Review code and evidence, update work order status through official browser UI when warranted, and preserve execution artifacts.

## Testing

- Separate create/edit tests for `n/100`, UTF-16 surrogate-pair count, `maxLength`, defensive truncation, `aria-describedby`, independent `role=status` and `aria-live=polite`, first hit/no-repeat/reset/re-hit, and empty-title submission.
- Browser observation at narrow and wide widths for horizontal overflow; test-environment layout assertions cannot substitute for real layout evidence.
- `npm test`, `npm run lint`, `npm run build`, and `git diff --check`, with actual logs and exit codes.
