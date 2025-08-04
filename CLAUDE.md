# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript library development project for implementing tic-tac-toe game logic. The library provides a reusable, class-based API with immutable state management, zero dependencies, and comprehensive error handling. Target output is a lightweight library (<5KB minified) supporting both CommonJS and ES modules.

## Development Environment

- **Environment**: Devbox-managed with Node.js latest
- **Language**: TypeScript with strict type checking enabled
- **Target**: ES2017+ for modern JavaScript features
- **Dependencies**: Zero external dependencies by design

## Key Requirements

- **API Pattern**: Class-based architecture with `new TicTacToe()` instantiation
- **State Management**: Immutable state - each move returns new game instance
- **Error Handling**: Fail-fast with custom error classes for different scenarios
- **Type Safety**: 100% TypeScript coverage, no `any` types in public API
- **Testing**: 100% test coverage required
- **Performance**: Game operations must complete in <1ms

## Task Management Protocol

Follow the workflow defined in `docs/process-task-list.md`:

1. Work on one sub-task at a time from `tasks/tic-tac-toe-tasks.md`
2. Mark sub-tasks as `[x]` when completed
3. When all sub-tasks under a parent task are complete:
   - Run full test suite
   - Stage changes with `git add .` (only if tests pass)
   - Clean up temporary files/code
   - Commit with conventional format and task reference
   - Mark parent task as `[x]`

## Code Standards

- **Documentation**: JSDoc comments required for all public methods/properties
- **Error Messages**: Descriptive, actionable error messages
- **Method Naming**: TypeScript camelCase conventions
- **File Organization**: `src/` for source, `dist/` for build output, `tests/` for tests

## Project Status

Currently in planning phase with PRD (`tasks/prd-tic-tac-toe-library.md`) and task breakdown (`tasks/tic-tac-toe-tasks.md`) completed. Ready to begin T001: Project Setup and Configuration. No git repository initialized yet.

## Development Practices

- **Test-Driven Development (TDD)**:
  - First create tests before writing code
  - On first run, tests must fail
  - Then write code to make tests pass
  - Run tests, fix code if tests fail

## Code Maintenance Practices

- После изменения кода запускай npm run lint:fix и npm run typecheck, исправляй ошибки