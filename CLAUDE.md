# TDD Rules — Read this first

This project enforces strict Test-Driven Development via hooks.

## You must follow this order, every time:

1. Write a failing test first (one `it()` — the simplest possible case)
2. Run the tests — confirm they fail (red)
3. Write the minimum implementation to pass the test
4. Run the tests — confirm they pass (green)
5. Only then move to the next test case

## Rules you cannot break:

- Never write an implementation file before its test file exists
- Never write more code than the minimum to pass the current failing test
- Never refactor until tests are green
- One `it()` at a time — no writing the full test suite upfront

## The hooks will enforce this:

- If you try to write an implementation before a test exists → **blocked**
- If your implementation doesn't pass the tests → **blocked until fixed**

These are not suggestions. The hooks will stop you if you drift.
