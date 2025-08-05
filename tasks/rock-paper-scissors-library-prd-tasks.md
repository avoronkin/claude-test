# Rock Paper Scissors Library - Implementation Tasks

Generated from PRD: `/home/alex/projects/pet/new_test/tasks/rock-paper-scissors-library-prd.md`

## Relevant Files

- `/home/alex/projects/pet/new_test/package.json` - Project metadata and scripts, updated for RPS library
- `/home/alex/projects/pet/new_test/src/types.ts` - Type definitions, simplified for stateless RPS design
- `/home/alex/projects/pet/new_test/src/types.test.ts` - Type system tests for simplified RPS types
- `/home/alex/projects/pet/new_test/src/errors.ts` - Custom error classes (RPSError, InvalidMoveError)
- `/home/alex/projects/pet/new_test/src/errors.test.ts` - Error class tests
- `/home/alex/projects/pet/new_test/src/RockPaperScissors.ts` - Main stateless RPS class implementation
- `/home/alex/projects/pet/new_test/src/index.ts` - Library exports with RockPaperScissors class and all types
- `/home/alex/projects/pet/new_test/tests/RockPaperScissors.test.ts` - Comprehensive RPS game logic tests (29 tests)
- `/home/alex/projects/pet/new_test/tests/index.test.ts` - Integration tests for library exports (6 tests)
- `/home/alex/projects/pet/new_test/tests/bundle-size.test.ts` - Bundle size and build verification tests
- `/home/alex/projects/pet/new_test/README.md` - Complete documentation with usage examples and API reference
- `/home/alex/projects/pet/new_test/dist/` - CommonJS build output
- `/home/alex/projects/pet/new_test/dist/esm/` - ES modules build output

### Notes

- **TDD Methodology**: Write failing tests first, then implement code to make them pass
- **Stateless Design**: Unlike TicTacToe, RPS class has no persistent state between method calls
- **Performance Target**: Each game operation must complete in <1ms
- **Coverage Requirement**: 100% test coverage required
- **Size Target**: Final bundle must be <3KB minified
- **Zero Dependencies**: No external dependencies allowed

## Tasks

- [x] **T001: Project Setup and Configuration**
  - [x] 1.1 Update package.json metadata (name, description, keywords) for RPS library
  - [x] 1.2 Remove TicTacToe implementation files (TicTacToe.ts and TicTacToe.test.ts)
  - [x] 1.3 Clean up index.ts exports to prepare for RPS exports
  - [x] 1.4 Verify build configuration supports stateless library pattern

- [x] **T002: Core Type System and Error Handling**
  - [x] 2.1 Simplify RPS types in types.ts (remove stateful RPSGameState, keep essential types)
  - [x] 2.2 Create simple RPSGameResult interface for method return values
  - [x] 2.3 Create custom error classes (InvalidMoveError) in errors.ts
  - [x] 2.4 Update types.test.ts to test simplified RPS types
  - [x] 2.5 Remove unused complex RPS types (RPSGameState, RPSRound, etc.)

- [x] **T003: RPS Game Engine Implementation**
  - [x] 3.1 Create RockPaperScissors class skeleton with method signatures and TSDoc
  - [x] 3.2 Implement move validation and normalization (accept strings, handle case insensitivity)
  - [x] 3.3 Implement core game logic (determine winner, create explanatory messages)
  - [x] 3.4 Implement playVsComputer method with Math.random() for computer moves
  - [x] 3.5 Implement playTwoPlayer method for human vs human games
  - [x] 3.6 Add comprehensive TSDoc documentation to all public methods

- [x] **T004: Testing and Quality Assurance**
  - [x] 4.1 Create RockPaperScissors.test.ts following TDD (write failing tests first)
  - [x] 4.2 Test move validation (valid moves, invalid inputs, case insensitivity)
  - [x] 4.3 Test playVsComputer method (all outcomes, verify randomness distribution)
  - [x] 4.4 Test playTwoPlayer method (all 9 win/lose/tie combinations)
  - [x] 4.5 Test comprehensive error handling (invalid moves, edge cases)
  - [x] 4.6 Test performance requirements (measure <1ms per game operation)
  - [x] 4.7 Verify 100% test coverage with npm run test:coverage
  - [x] 4.8 Update index.test.ts to test main library exports

- [ ] **T005: Documentation and Final Integration**
  - [x] 5.1 Update index.ts to export RockPaperScissors class and required types
  - [x] 5.2 Update README.md with comprehensive usage examples and API documentation
  - [x] 5.3 Verify build output (npm run build) produces both CommonJS and ES modules
  - [x] 5.4 Test and verify bundle size meets <3KB minified requirement
  - [x] 5.5 Run complete CI pipeline (npm run ci) and fix any issues
  - [x] 5.6 Final cleanup and verification of all PRD requirements