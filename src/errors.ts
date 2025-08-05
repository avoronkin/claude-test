/**
 * Base error class for all Rock Paper Scissors related errors.
 * Extends the native Error class with a specific name for easier error handling.
 */
export class RPSError extends Error {
  /**
   * Creates a new RPSError.
   * 
   * @param message - The error message describing what went wrong
   */
  constructor(message: string) {
    super(message);
    this.name = 'RPSError';
  }
}

/**
 * Error thrown when attempting to make an invalid move in Rock Paper Scissors.
 * This includes invalid move strings, unsupported moves, or invalid input types.
 */
export class InvalidMoveError extends RPSError {
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