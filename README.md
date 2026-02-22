# tdd-hooks

An experiment in enforcing strict Test-Driven Development on an AI coding agent using Claude Code hooks.

## The Experiment

Can hooks stop an AI from skipping the red-green cycle?

Claude Code supports hooks — shell scripts that run before and after tool use. This project wires up two hooks that enforce the TDD rules from `CLAUDE.md`:

- **Pre-hook** (`tdd-pre.ts`): blocks any write to an implementation file if no corresponding test file exists yet
- **Post-hook** (`tdd-post.ts`): runs the test suite after each file write and blocks the agent from continuing if tests are not passing

The agent cannot cheat. It must write a failing test first, confirm red, write the minimum code to pass, confirm green, then move on.

## What Was Built

Two TypeScript modules, written test-first with [Vitest](https://vitest.dev/), 20 tests total:

**Shopping cart** (`src/shoppingCart.ts`)
- Add and remove items
- Calculate total across quantities
- Apply percentage or fixed discount codes

**User registration service** split across four files:
- `src/validator.ts` — email validation
- `src/hasher.ts` — password hashing (SHA-256 via Node's built-in `crypto`)
- `src/userStore.ts` — in-memory user store
- `src/registrationService.ts` — orchestrates validation, hashing, and storage; throws on invalid email or duplicate registration

## Running the Tests

```bash
npm install
npm test
```
