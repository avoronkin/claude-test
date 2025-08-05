# Rock Paper Scissors Library

[![Pipeline Status](https://gitlab.com/your-username/rock-paper-scissors-lib/badges/main/pipeline.svg)](https://gitlab.com/your-username/rock-paper-scissors-lib/-/pipelines)
[![Coverage Report](https://gitlab.com/your-username/rock-paper-scissors-lib/badges/main/coverage.svg)](https://gitlab.com/your-username/rock-paper-scissors-lib/-/jobs)

A lightweight, stateless TypeScript library for Rock Paper Scissors games with comprehensive error handling, strict typing, and zero dependencies.

## Features

- 🎲 **Stateless Design**: No persistent state between method calls
- 🛡️ **Type Safety**: 100% TypeScript with strict mode enabled
- 🚨 **Error Handling**: Comprehensive validation with custom error classes
- ✅ **Zero Dependencies**: Lightweight with no external dependencies
- 🧪 **Fully Tested**: 100% test coverage with performance testing
- 📦 **Multiple Formats**: Supports both CommonJS and ES modules
- ⚡ **High Performance**: Each operation completes in <1ms
- 🎯 **Flexible Input**: Case-insensitive move validation with whitespace handling

## Installation

```bash
npm install rock-paper-scissors-lib
```

## Quick Start

```typescript
import { RockPaperScissors } from 'rock-paper-scissors-lib';

const rps = new RockPaperScissors();

// Play against computer
const result = rps.playVsComputer('rock');
console.log(result.explanation); // "Paper covers rock" (if computer chose paper)
console.log(result.winner);      // "computer" | "player" | null

// Play two-player game
const twoPlayerResult = rps.playTwoPlayer('Rock', 'scissors');
console.log(twoPlayerResult.winner);      // "player1"
console.log(twoPlayerResult.explanation); // "Rock crushes scissors"
```

## API Reference

### `RockPaperScissors` Class

#### Constructor

```typescript
new RockPaperScissors()
```

Creates a new RockPaperScissors instance. The constructor takes no parameters as this is a stateless implementation.

#### Methods

##### `playTwoPlayer(player1Move: string, player2Move: string): RPSGameResult`

Plays a Rock Paper Scissors game between two human players.

**Parameters:**
- `player1Move` - The first player's move (case-insensitive: "rock", "paper", or "scissors")
- `player2Move` - The second player's move (case-insensitive: "rock", "paper", or "scissors")

**Returns:** `RPSGameResult` object containing:
- `player1Move` - Normalized first player's move
- `player2Move` - Normalized second player's move  
- `result` - Result from player1's perspective (`'win'` | `'lose'` | `'draw'`)
- `winner` - The winning player (`'player1'` | `'player2'` | `null`)
- `explanation` - Human-readable explanation of the result

**Throws:** `InvalidMoveError` when either move is invalid

##### `playVsComputer(playerMove: string): RPSGameResult`

Plays a Rock Paper Scissors game between a human player and the computer.

**Parameters:**
- `playerMove` - The human player's move (case-insensitive: "rock", "paper", or "scissors")

**Returns:** `RPSGameResult` object containing:
- `playerMove` - Normalized player's move
- `computerMove` - Computer's randomly generated move
- `result` - Result from player's perspective (`'win'` | `'lose'` | `'draw'`)
- `winner` - The winner (`'player'` | `'computer'` | `null`)
- `explanation` - Human-readable explanation of the result

**Throws:** `InvalidMoveError` when the player's move is invalid

##### `validateMove(move: string): RPSMove`

Validates and normalizes a move string.

**Parameters:**
- `move` - The move string to validate

**Returns:** The normalized move as `RPSMove` (`'rock'` | `'paper'` | `'scissors'`)

**Throws:** `InvalidMoveError` when the move is not valid

### Types

```typescript
type RPSMove = 'rock' | 'paper' | 'scissors';
type RPSResult = 'win' | 'lose' | 'draw';
type RPSWinner = 'player1' | 'player2' | 'computer' | 'player' | null;

interface RPSGameResult {
  readonly player1Move?: RPSMove;      // For two-player games
  readonly player2Move?: RPSMove;      // For two-player games
  readonly playerMove?: RPSMove;       // For vs computer games
  readonly computerMove?: RPSMove;     // For vs computer games
  readonly result: RPSResult;
  readonly winner: RPSWinner;
  readonly explanation: string;
}
```

### Error Classes

- `RPSError` - Base error class for all Rock Paper Scissors related errors
- `InvalidMoveError` - Thrown for invalid moves (invalid strings, unsupported moves, or invalid input types)

## Usage Examples

### Playing Against Computer

```typescript
import { RockPaperScissors } from 'rock-paper-scissors-lib';

const rps = new RockPaperScissors();

// Single game
const result = rps.playVsComputer('rock');
console.log(`You: ${result.playerMove}`);
console.log(`Computer: ${result.computerMove}`);
console.log(`Result: ${result.result}`);
console.log(`Winner: ${result.winner}`);
console.log(`Explanation: ${result.explanation}`);

// Multiple games with different inputs
const games = ['Rock', 'PAPER', '  scissors  '];
games.forEach(move => {
  const result = rps.playVsComputer(move);
  console.log(`${move} vs ${result.computerMove}: ${result.explanation}`);
});
```

### Two-Player Games

```typescript
import { RockPaperScissors } from 'rock-paper-scissors-lib';

const rps = new RockPaperScissors();

// All possible winning combinations for Player 1
const winningCombos = [
  ['rock', 'scissors'],
  ['paper', 'rock'],
  ['scissors', 'paper']
];

winningCombos.forEach(([p1, p2]) => {
  const result = rps.playTwoPlayer(p1, p2);
  console.log(`${p1} vs ${p2}: ${result.explanation} (Winner: ${result.winner})`);
});

// Draw scenarios
const drawCombos = [
  ['rock', 'rock'],
  ['paper', 'paper'],
  ['scissors', 'scissors']
];

drawCombos.forEach(([p1, p2]) => {
  const result = rps.playTwoPlayer(p1, p2);
  console.log(`${p1} vs ${p2}: ${result.explanation} (${result.result})`);
});
```

### Error Handling

```typescript
import { RockPaperScissors, InvalidMoveError, RPSError } from 'rock-paper-scissors-lib';

const rps = new RockPaperScissors();

try {
  // Invalid move
  rps.playVsComputer('lizard');
} catch (error) {
  if (error instanceof InvalidMoveError) {
    console.log('Invalid move:', error.message);
    // "Invalid move: "lizard" is not a valid move. Valid moves are: rock, paper, scissors"
  }
}

try {
  // Empty input
  rps.playTwoPlayer('', 'rock');
} catch (error) {
  if (error instanceof RPSError) {
    console.log('Error:', error.message);
    // "Invalid move: input must be a non-empty string"
  }
}

try {
  // Non-string input
  rps.validateMove(null as any);
} catch (error) {
  if (error instanceof InvalidMoveError) {
    console.log('Type error:', error.message);
  }
}
```

### Input Flexibility

```typescript
import { RockPaperScissors } from 'rock-paper-scissors-lib';

const rps = new RockPaperScissors();

// All these inputs are valid and equivalent
const variations = [
  'rock',
  'Rock', 
  'ROCK',
  '  rock  ',
  '\tROCK\n'
];

variations.forEach(move => {
  const normalized = rps.validateMove(move);
  console.log(`"${move}" -> "${normalized}"`);
  // All output: "rock"
});
```

### Performance Testing

```typescript
import { RockPaperScissors } from 'rock-paper-scissors-lib';

const rps = new RockPaperScissors();

// Measure performance
const iterations = 10000;
const start = Date.now();

for (let i = 0; i < iterations; i++) {
  rps.playVsComputer('rock');
}

const end = Date.now();
const avgTime = (end - start) / iterations;
console.log(`Average time per game: ${avgTime.toFixed(4)}ms`);
// Typically < 0.01ms
```

## Development

### Building

```bash
npm run build          # Build both CommonJS and ESM versions
npm run build:cjs      # Build CommonJS version only
npm run build:esm      # Build ES modules version only
npm run clean          # Clean build artifacts
```

### Testing

```bash
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

### Linting and Type Checking

```bash
npm run lint            # Check for linting errors
npm run lint:fix        # Fix linting errors automatically
npm run typecheck       # Run TypeScript type checking
```

### Complete CI Pipeline

```bash
npm run ci             # Run complete CI pipeline (clean, build, lint, typecheck, test)
```

## Bundle Information

- **Size**: <3KB minified
- **Dependencies**: Zero external dependencies
- **Formats**: CommonJS and ES modules
- **Performance**: Each operation completes in <1ms
- **Browser Support**: Modern browsers supporting ES2017+

## Requirements

- TypeScript 4.9+
- Node.js 16+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow TDD methodology (write tests first)
4. Ensure 100% test coverage
5. Run the complete CI pipeline
6. Submit a pull request

## License

ISC