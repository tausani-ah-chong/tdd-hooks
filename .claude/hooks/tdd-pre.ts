#!/usr/bin/env tsx
/**
 * TDD PreToolUse Hook
 *
 * Fires BEFORE Claude writes any file.
 * Enforces: no implementation file can be written unless a test file exists.
 *
 * Exit codes:
 *   0     = allow
 *   2     = deny (message shown to Claude, it must respond)
 */

import { existsSync } from "fs";
import { readFileSync } from "fs";
import * as path from "path";

// Claude Code sends hook input as JSON via stdin
const raw = readFileSync("/dev/stdin", "utf8");
const input = JSON.parse(raw);

const filePath: string = input.tool_input?.file_path ?? input.tool_input?.path ?? "";
const filename = path.basename(filePath);

// Only care about TypeScript/JavaScript source files
const isSourceFile = /\.(ts|tsx|js|jsx)$/.test(filename);
if (!isSourceFile) process.exit(0);

const isTestFile = /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(filename);
const isImplFile = isSourceFile && !isTestFile;

if (isImplFile) {
  // Derive expected test filename — e.g. add.ts → add.test.ts
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const dir = path.dirname(filePath);

  const possibleTestFiles = [
    path.join(dir, `${base}.test${ext}`),
    path.join(dir, `${base}.spec${ext}`),
    path.join(dir, "__tests__", `${base}.test${ext}`),
  ];

  const testFileExists = possibleTestFiles.some(existsSync);

  if (!testFileExists) {
    // Block — deny with structured JSON
    const response = {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: [
          `TDD VIOLATION: You are trying to write implementation file '${filename}'`,
          `but no test file exists yet.`,
          ``,
          `You must write a failing test FIRST. Expected test file at one of:`,
          ...possibleTestFiles.map(f => `  - ${f}`),
          ``,
          `Write the test file first, then come back to the implementation.`,
        ].join("\n"),
      },
    };

    process.stdout.write(JSON.stringify(response));
    process.exit(0); // exit 0 with JSON — let Claude handle the denial
  }
}

// Allow everything else
process.exit(0);
