# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript games library development project providing multiple game implementations. Currently includes Rock Paper Scissors, Tic Tac Toe, and 2048 games. Each game provides a reusable, class-based API with immutable state management, zero dependencies, and comprehensive error handling. Target output is a lightweight library (<5KB minified) supporting both CommonJS and ES modules.

## Development Environment

- **Environment**: Devbox-managed with Node.js latest
- **Language**: TypeScript with strict type checking enabled
- **Target**: ES2017+ for modern JavaScript features
- **Dependencies**: Zero external dependencies by design

## Key Requirements

- **API Pattern**: Class-based architecture with `new GameClass()` instantiation for each game
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

## Project Structure

```
src/
  games/
    rock-paper-scissors/
      RockPaperScissors.ts        # Game logic
      RockPaperScissors.test.ts   # Tests
      demo/                       # Browser demo
    tic-tac-toe/
      TicTacToe.ts               # Game logic  
      TicTacToe.test.ts          # Tests
      demo/                      # Browser demo
    2048/
      Game2048.ts                # Game logic
      Game2048.test.ts           # Tests
      demo/                      # Browser demo
  index.ts                       # Main library exports
dist/                           # Build output
docs/                           # GitHub Pages
  index.html                    # Main navigation page
  rock-paper-scissors/          # Compiled demos
  tic-tac-toe/
  2048/
```

## Code Standards

- **Documentation**: JSDoc comments required for all public methods/properties
- **Error Messages**: Descriptive, actionable error messages
- **Method Naming**: TypeScript camelCase conventions
- **File Organization**: Games organized in `src/games/[game-name]/` structure

## Project Status

Complete TypeScript games library with three fully implemented games: Rock Paper Scissors, Tic Tac Toe, and 2048. All games feature comprehensive test coverage, browser demos, and are deployed to GitHub Pages. Library provides immutable state management, custom error handling, and zero external dependencies.

## Development Scripts

- **Library build**: `npm run build` - Builds complete library
- **Demo development**: 
  - `npm run demo:dev:rps` - Rock Paper Scissors development server
  - `npm run demo:dev:ttt` - Tic Tac Toe development server
  - `npm run demo:dev:2048` - 2048 development server
  - `npm run demo:dev` - Default demo server
- **Demo build & deploy**:
  - `npm run demo:build:rps` - Build Rock Paper Scissors demo
  - `npm run demo:build:ttt` - Build Tic Tac Toe demo
  - `npm run demo:build:2048` - Build 2048 demo
  - `npm run demo:build:all` - Build all game demos  
  - `npm run demo:deploy` - Build and deploy to docs/ for GitHub Pages
- **Quality checks**: `npm run lint:fix`, `npm run typecheck`, `npm test`

## Adding New Games

1. Create `src/games/[game-name]/` directory
2. Implement game logic in `[GameName].ts` with tests
3. Create demo in `demo/` subdirectory
4. Add Vite config: `vite.[game-name].config.ts`
5. Update npm scripts in package.json
6. Add to main exports in `src/index.ts`
7. Update docs navigation page

## Development Practices

- **Test-Driven Development (TDD)**:
  - First create tests before writing code
  - On first run, tests must fail
  - Then write code to make tests pass
  - Run tests, fix code if tests fail

## Code Maintenance Practices

- После изменения кода запускай npm run lint:fix и npm run typecheck, исправляй ошибки