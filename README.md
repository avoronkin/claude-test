# Tic-Tac-Toe Library

[![Pipeline Status](https://gitlab.com/your-username/tic-tac-toe-lib/badges/main/pipeline.svg)](https://gitlab.com/your-username/tic-tac-toe-lib/-/pipelines)
[![Coverage Report](https://gitlab.com/your-username/tic-tac-toe-lib/badges/main/coverage.svg)](https://gitlab.com/your-username/tic-tac-toe-lib/-/jobs)

A TypeScript library providing a complete tic-tac-toe game implementation with immutable state management, comprehensive error handling, and strict typing.

## Features

- 🎯 **Immutable State**: Each move returns a new game instance
- 🛡️ **Type Safety**: 100% TypeScript with strict mode enabled
- 🚨 **Error Handling**: Comprehensive error checking with custom error classes
- ✅ **Zero Dependencies**: Lightweight with no external dependencies
- 🧪 **Fully Tested**: 100% test coverage
- 📦 **Multiple Formats**: Supports both CommonJS and ES modules

## Installation

```bash
npm install tic-tac-toe-lib
```

## Quick Start

```typescript
import { TicTacToe } from 'tic-tac-toe-lib';

// Create a new game
const game = new TicTacToe();

// Make moves (returns new game instances)
const game1 = game.makeMove(0, 0);     // X plays at top-left
const game2 = game1.makeMove(1, 1);    // O plays at center
const game3 = game2.makeMove(0, 1);    // X plays at top-middle

// Check game state
console.log(game3.getCurrentPlayer()); // 'O'
console.log(game3.getGameStatus());    // 'in-progress'
console.log(game3.getCellState(0, 0)); // 'X'
```

## API Reference

### `TicTacToe` Class

#### Constructor

```typescript
new TicTacToe(board?, currentPlayer?, status?, winner?)
```

Creates a new tic-tac-toe game instance.

- `board?` - Optional initial board state (defaults to empty 3x3 grid)
- `currentPlayer?` - The player who moves first (defaults to 'X')
- `status?` - Initial game status (defaults to 'in-progress')
- `winner?` - The winning player if game is already won (defaults to null)

#### Methods

##### `makeMove(row: number, col: number): TicTacToe`

Makes a move at the specified position and returns a new game instance.

**Parameters:**
- `row` - The row index (0-2)
- `col` - The column index (0-2)

**Returns:** A new `TicTacToe` instance with the move applied

**Throws:**
- `GameEndedError` - When attempting to move after game has ended
- `InvalidMoveError` - When coordinates are out of bounds or cell is occupied

##### `getCurrentPlayer(): Player`

Gets the player whose turn it is to move.

**Returns:** `'X'` or `'O'`

##### `getGameStatus(): GameStatus`

Gets the current status of the game.

**Returns:** `'in-progress'` | `'won'` | `'draw'`

##### `getWinner(): Player | null`

Gets the winning player if the game has been won.

**Returns:** `'X'` | `'O'` | `null`

##### `getCellState(row: number, col: number): Cell`

Gets the state of a specific cell on the board.

**Parameters:**
- `row` - The row index (0-2)
- `col` - The column index (0-2)

**Returns:** `'X'` | `'O'` | `null`

**Throws:** `InvalidMoveError` when coordinates are out of bounds

#### Properties

- `board: Board` - The current game board state as a 3x3 grid
- `currentPlayer: Player` - The player whose turn it is to move
- `status: GameStatus` - The current status of the game
- `winner: Player | null` - The winning player, or null if game is not won

### Types

```typescript
type Player = 'X' | 'O';
type Cell = Player | null;
type Board = [[Cell, Cell, Cell], [Cell, Cell, Cell], [Cell, Cell, Cell]];
type GameStatus = 'in-progress' | 'won' | 'draw';

interface GameState {
  readonly board: Board;
  readonly currentPlayer: Player;
  readonly status: GameStatus;
  readonly winner: Player | null;
}
```

### Error Classes

- `TicTacToeError` - Base error class for all tic-tac-toe related errors
- `InvalidMoveError` - Thrown for invalid moves (occupied cells, out of bounds)
- `GameEndedError` - Thrown when attempting to move after game has ended

## Usage Examples

### Basic Game Flow

```typescript
import { TicTacToe } from 'tic-tac-toe-lib';

let game = new TicTacToe();

// Play a complete game
game = game.makeMove(0, 0); // X
game = game.makeMove(0, 1); // O
game = game.makeMove(1, 0); // X
game = game.makeMove(0, 2); // O
game = game.makeMove(2, 0); // X wins!

console.log(game.getGameStatus()); // 'won'
console.log(game.getWinner());     // 'X'
```

### Error Handling

```typescript
import { TicTacToe, InvalidMoveError, GameEndedError } from 'tic-tac-toe-lib';

const game = new TicTacToe();

try {
  // Try to play out of bounds
  game.makeMove(-1, 0);
} catch (error) {
  if (error instanceof InvalidMoveError) {
    console.log('Invalid move:', error.message);
  }
}

try {
  // Try to play in occupied cell
  const game2 = game.makeMove(0, 0);
  game2.makeMove(0, 0); // Same position
} catch (error) {
  if (error instanceof InvalidMoveError) {
    console.log('Cell occupied:', error.message);
  }
}
```

### Checking Board State

```typescript
import { TicTacToe } from 'tic-tac-toe-lib';

let game = new TicTacToe();
game = game.makeMove(1, 1); // X in center

// Check individual cells
console.log(game.getCellState(1, 1)); // 'X'
console.log(game.getCellState(0, 0)); // null

// Access full board
const board = game.board;
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    console.log(`Cell [${row}][${col}]:`, board[row][col]);
  }
}
```

### Draw Game

```typescript
import { TicTacToe } from 'tic-tac-toe-lib';

let game = new TicTacToe();

// Create a draw scenario
game = game.makeMove(0, 0); // X
game = game.makeMove(0, 1); // O
game = game.makeMove(0, 2); // X
game = game.makeMove(1, 1); // O
game = game.makeMove(1, 0); // X
game = game.makeMove(2, 0); // O
game = game.makeMove(1, 2); // X
game = game.makeMove(2, 2); // O
game = game.makeMove(2, 1); // X

console.log(game.getGameStatus()); // 'draw'
console.log(game.getWinner());     // null
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test                 # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
```

### Linting and Type Checking

```bash
npm run lint            # Check for linting errors
npm run lint:fix        # Fix linting errors automatically
npm run typecheck       # Run TypeScript type checking
```

## Requirements

- TypeScript 4.8+
- Node.js 14+

## License

ISC