// ============================================================================
// Types
// ============================================================================

/** Represents a player in Tic-Tac-Toe game */
export type Player = 'X' | 'O';

/** Represents a cell on the board - can be empty (null) or contain a player's mark */
export type Cell = Player | null;

/** Represents the current status of the game */
export type GameStatus = 'ongoing' | 'won' | 'draw';

/** Represents the game board as a 3x3 grid */
export type Board = Cell[][];

// ============================================================================
// Errors
// ============================================================================

/**
 * Base error class for all Tic-Tac-Toe related errors.
 * Extends the native Error class with a specific name for easier error handling.
 */
export class TicTacToeError extends Error {
  /**
   * Create a new TicTacToeError.
   * @param message - Error message describing what went wrong
   */
  constructor(message: string) {
    super(message);
    this.name = 'TicTacToeError';
  }
}

/**
 * Error thrown when attempting to make an invalid move.
 * This includes moves to occupied cells, out-of-bounds coordinates, or invalid coordinates.
 */
export class InvalidMoveError extends TicTacToeError {
  /**
   * Create a new InvalidMoveError.
   * @param message - Error message describing the invalid move
   */
  constructor(message: string) {
    super(message);
    this.name = 'InvalidMoveError';
  }
}

/**
 * Error thrown when attempting to make a move on a completed game.
 * This applies to games that have been won or ended in a draw.
 */
export class GameCompletedError extends TicTacToeError {
  /**
   * Create a new GameCompletedError.
   * @param message - Error message describing why the move cannot be made
   */
  constructor(message: string) {
    super(message);
    this.name = 'GameCompletedError';
  }
}

// ============================================================================
// Main Class
// ============================================================================

/**
 * Immutable Tic-Tac-Toe game implementation.
 * Each move returns a new game instance, preserving the original state.
 * 
 * @example
 * ```typescript
 * // Create a new game
 * const game = new TicTacToe();
 * 
 * // Make moves (each returns a new game instance)
 * const game2 = game.makeMove(0, 0); // X plays top-left
 * const game3 = game2.makeMove(1, 1); // O plays center
 * 
 * // Check game state
 * console.log(game3.currentPlayer); // 'X'
 * console.log(game3.gameStatus); // 'ongoing' | 'won' | 'draw'
 * ```
 */
export class TicTacToe {
  private readonly _board: Board;
  private readonly _currentPlayer: Player;
  private readonly _gameStatus: GameStatus;
  private readonly _winner: Player | null;

  /**
   * Create a new TicTacToe game instance.
   * @param board - Optional board state (for internal use when creating new instances)
   * @param currentPlayer - Optional current player (for internal use)
   * @param gameStatus - Optional game status (for internal use)
   * @param winner - Optional winner (for internal use)
   */
  constructor(
    board?: Board,
    currentPlayer?: Player,
    gameStatus?: GameStatus,
    winner?: Player | null
  ) {
    this._board = board || [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    this._currentPlayer = currentPlayer || 'X';
    this._gameStatus = gameStatus || 'ongoing';
    this._winner = winner || null;
  }

  /**
   * Get the current game board state.
   * Returns a deep copy to maintain immutability.
   */
  get board(): Board {
    return this._board.map(row => [...row]);
  }

  /**
   * Get the current player whose turn it is.
   */
  get currentPlayer(): Player {
    return this._currentPlayer;
  }

  /**
   * Get the current status of the game.
   */
  get gameStatus(): GameStatus {
    return this._gameStatus;
  }

  /**
   * Get the winner of the game, or null if the game is ongoing or ended in a draw.
   */
  get winner(): Player | null {
    return this._winner;
  }

  /**
   * Make a move at the specified coordinates.
   * Returns a new TicTacToe instance with the updated state.
   * 
   * @param row - Row index (0-2)
   * @param col - Column index (0-2)
   * @throws {InvalidMoveError} When coordinates are invalid or cell is occupied
   * @throws {GameCompletedError} When trying to move on a completed game
   * @returns New TicTacToe instance with the move applied
   */
  makeMove(row: number, col: number): TicTacToe {
    // Check if game is completed first
    if (this._gameStatus !== 'ongoing') {
      throw new GameCompletedError('Cannot make a move on a completed game');
    }

    // Validate coordinates
    if (row < 0 || row > 2) {
      throw new InvalidMoveError('Row must be between 0 and 2');
    }
    if (col < 0 || col > 2) {
      throw new InvalidMoveError('Column must be between 0 and 2');
    }

    // Check if cell is already occupied
    if (this._board[row][col] !== null) {
      throw new InvalidMoveError(`Cell at position (${row}, ${col}) is already occupied`);
    }

    // Create new board with the move
    const newBoard = this._board.map(boardRow => [...boardRow]);
    newBoard[row][col] = this._currentPlayer;

    // Switch player
    const nextPlayer: Player = this._currentPlayer === 'X' ? 'O' : 'X';

    // Check for win or draw conditions
    const winner = this.checkWinner(newBoard);
    const newGameStatus: GameStatus = winner ? 'won' : (this.isBoardFull(newBoard) ? 'draw' : 'ongoing');
    const newWinner: Player | null = winner;

    // Return new game instance
    return new TicTacToe(newBoard, nextPlayer, newGameStatus, newWinner);
  }

  /**
   * Check if there's a winner on the given board.
   * @param board - The board to check
   * @returns The winning player or null if no winner
   */
  private checkWinner(board: Board): Player | null {
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (board[row][0] && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        return board[row][0];
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (board[0][col] && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        return board[0][col];
      }
    }

    // Check diagonal (top-left to bottom-right)
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return board[0][0];
    }

    // Check diagonal (top-right to bottom-left)
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return board[0][2];
    }

    return null;
  }

  /**
   * Check if the board is completely full.
   * @param board - The board to check
   * @returns True if all cells are occupied, false otherwise
   */
  private isBoardFull(board: Board): boolean {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          return false;
        }
      }
    }
    return true;
  }
}