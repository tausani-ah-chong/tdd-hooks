#!/usr/bin/env tsx
/**
 * TDD PostToolUse Hook
 *
 * Fires AFTER Claude writes any file.
 * Runs the test suite and feeds results back as context.
 *
 * Exit codes:
 *   0  = continue (tests passed or no tests yet)
 *   2  = block (tests failed — Claude must fix before moving on)
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
import * as path from "path";

const raw = readFileSync("/dev/stdin", "utf8");
const input = JSON.parse(raw);

const filePath: string = input.tool_input?.file_path ?? input.tool_input?.path ?? "";
const filename = path.basename(filePath);

// Only run tests after TS/JS file writes
const isSourceFile = /\.(ts|tsx|js|jsx)$/.test(filename);
if (!isSourceFile) process.exit(0);

const isTestFile = /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(filename);
const isImplFile = isSourceFile && !isTestFile;

// Run tests
let testOutput = "";
let testsPassed = false;

try {
  testOutput = execSync("npm test 2>&1", {
    encoding: "utf8",
    cwd: process.cwd(),
  });
  testsPassed = true;
} catch (err: any) {
  testOutput = err.stdout || err.message;
  testsPassed = false;
}

// Parse a summary from the output
const lines = testOutput.split("\n");
const summaryLine = lines.find(l => /Tests\s+\d+/.test(l)) ?? "";
const passMatch = summaryLine.match(/(\d+) passed/);
const failMatch = summaryLine.match(/(\d+) failed/);

const passed = passMatch ? parseInt(passMatch[1]) : 0;
const failed = failMatch ? parseInt(failMatch[1]) : 0;

if (testsPassed) {
  // Tests green — give Claude a success signal and prompt next step
  const message = [
    `✅ TDD: Tests passing (${passed} passed)`,
    ``,
    isTestFile
      ? `Good — you wrote a failing test. Now write the minimum implementation to make it pass.`
      : `Green phase complete. You may now write the next failing test for the next simplest case.`,
  ].join("\n");

  // PostToolUse uses top-level decision field (not hookSpecificOutput)
  const response = {
    decision: "block", // "block" here means: add this as context to Claude
    reason: message,
  };

  // Actually for PostToolUse we just write to stdout for context
  process.stderr.write(message + "\n");
  process.exit(0);
}

// Tests failed
if (isTestFile) {
  // Just wrote a test and it fails — that's correct red phase
  // Let Claude know to proceed to implementation
  const message = [
    `🔴 TDD: Test is failing as expected (red phase).`,
    ``,
    `Failed: ${failed} | Passed: ${passed}`,
    ``,
    `Test output:`,
    ...lines
      .filter(l => l.trim() && !l.includes("node_modules") && !l.trim().startsWith("at "))
      .slice(0, 15)
      .map(l => `  ${l}`),
    ``,
    `Now write the MINIMUM implementation to make this test pass.`,
  ].join("\n");

  process.stderr.write(message + "\n");
  process.exit(0); // allow — this is the expected red state
}

if (isImplFile) {
  // Wrote implementation but tests still failing — block and force a fix
  const errorLines = lines
    .filter(l => {
      const t = l.trim();
      return (
        t.match(/^(Error|TypeError|AssertionError|ReferenceError):/) ||
        t.startsWith("- Expected") ||
        t.startsWith("+ Received") ||
        t.startsWith("expected ")
      );
    })
    .slice(0, 8)
    .map(l => `  ${l.trim()}`);

  const message = [
    `❌ TDD: Tests still failing after implementation write.`,
    ``,
    `Failed: ${failed} | Passed: ${passed}`,
    ``,
    ...(errorLines.length > 0 ? ["Key errors:", ...errorLines, ""] : []),
    `Fix the implementation — write only the minimum code needed to pass the failing test.`,
    `Do not add extra logic or handle cases not yet tested.`,
  ].join("\n");

  process.stderr.write(message + "\n");
  process.exit(2); // block — Claude must fix before continuing
}

process.exit(0);
