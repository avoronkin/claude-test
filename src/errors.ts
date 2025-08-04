/**
 * Base error class for all tic-tac-toe related errors.
 * Extends the native Error class with a specific name for easier error handling.
 */
export class TicTacToeError extends Error {
  /**
   * Creates a new TicTacToeError.
   * 
   * @param message - The error message describing what went wrong
   */
  constructor(message: string) {
    super(message);
    this.name = 'TicTacToeError';
  }
}

/**
 * Error thrown when attempting to make an invalid move.
 * This includes moves to occupied cells or out-of-bounds coordinates.
 */
export class InvalidMoveError extends TicTacToeError {
  /**
   * Creates a new InvalidMoveError.
   * 
   * @param message - The error message describing the invalid move
   */
  constructor(message: string) {
    super(message);
    this.name = 'InvalidMoveError';
  }
}

/**
 * Error thrown when attempting to make a move after the game has already ended.
 * This occurs when trying to play after a win or draw condition has been reached.
 */
export class GameEndedError extends TicTacToeError {
  /**
   * Creates a new GameEndedError.
   * 
   * @param message - The error message describing why the move cannot be made
   */
  constructor(message: string) {
    super(message);
    this.name = 'GameEndedError';
  }
}