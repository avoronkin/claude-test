// ============================================================================
// Types
// ============================================================================

/** Represents a move in Rock Paper Scissors game */
export type RPSMove = 'rock' | 'paper' | 'scissors';

/** Represents the result of a single game from player's perspective */
export type RPSResult = 'win' | 'lose' | 'draw';

/** Represents the winner of a game - can be player1, player2, computer, player, or null for draw */
export type RPSWinner = 'player1' | 'player2' | 'computer' | 'player' | null;

/**
 * Interface representing the result of a single Rock Paper Scissors game.
 * Used by both playTwoPlayer and playVsComputer methods.
 */
export interface RPSGameResult {
  /** Player 1's move (for two player games) or player's move (for vs computer) */
  readonly player1Move?: RPSMove;
  
  /** Player 2's move (for two player games) */
  readonly player2Move?: RPSMove;
  
  /** Player's move (for vs computer games) */
  readonly playerMove?: RPSMove;
  
  /** Computer's move (for vs computer games) */
  readonly computerMove?: RPSMove;
  
  /** The result from the first player's perspective */
  readonly result: RPSResult;
  
  /** The winner of this game */
  readonly winner: RPSWinner;
  
  /** Human-readable explanation of the result */
  readonly explanation: string;
}

// ============================================================================
// Errors
// ============================================================================

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

// ============================================================================
// Main Class
// ============================================================================

/**
 * A stateless Rock Paper Scissors game implementation.
 * 
 * This class provides methods to play Rock Paper Scissors games without maintaining
 * any persistent state between method calls. Each game operation is independent
 * and returns a complete result object.
 * 
 * @example
 * ```typescript
 * const rps = new RockPaperScissors();
 * const result = rps.playTwoPlayer('rock', 'scissors');
 * console.log(result.explanation); // "Rock crushes scissors"
 * ```
 */
export class RockPaperScissors {
  /**
   * Creates a new RockPaperScissors instance.
   * 
   * The constructor doesn't take any parameters as this is a stateless implementation.
   * Each instance is independent and can be reused for multiple games.
   */
  constructor() {
    // Stateless design - no initialization needed
  }

  /**
   * Plays a Rock Paper Scissors game between two human players.
   * 
   * This method compares two moves and determines the winner according to standard
   * Rock Paper Scissors rules:
   * - Rock crushes Scissors
   * - Scissors cuts Paper  
   * - Paper covers Rock
   * - Same moves result in a draw
   * 
   * @param player1Move - The first player's move
   * @param player2Move - The second player's move
   * @returns A complete game result with moves, outcome, and explanation
   * 
   * @throws {InvalidMoveError} When either move is not a valid RPS move
   * 
   * @example
   * ```typescript
   * const rps = new RockPaperScissors();
   * const result = rps.playTwoPlayer('rock', 'scissors');
   * console.log(result.winner); // 'player1'
   * console.log(result.explanation); // 'Rock crushes scissors'
   * ```
   */
  playTwoPlayer(player1Move: string, player2Move: string): RPSGameResult {
    // Validate moves
    const validatedPlayer1Move = this.validateMove(player1Move);
    const validatedPlayer2Move = this.validateMove(player2Move);

    // Determine the game result
    const gameResult = this.determineWinner(validatedPlayer1Move, validatedPlayer2Move);

    return {
      player1Move: validatedPlayer1Move,
      player2Move: validatedPlayer2Move,
      result: gameResult.result,
      winner: gameResult.winner,
      explanation: gameResult.explanation
    };
  }

  /**
   * Plays a Rock Paper Scissors game between a human player and the computer.
   * 
   * The computer's move is generated randomly using Math.random() to ensure
   * fair and unpredictable gameplay. The method then determines the winner
   * according to standard Rock Paper Scissors rules.
   * 
   * @param playerMove - The human player's move
   * @returns A complete game result with moves, outcome, and explanation
   * 
   * @throws {InvalidMoveError} When the player's move is not a valid RPS move
   * 
   * @example
   * ```typescript
   * const rps = new RockPaperScissors();
   * const result = rps.playVsComputer('paper');
   * if (result.winner === 'player') {
   *   console.log('You win!', result.explanation);
   * }
   * ```
   */
  playVsComputer(playerMove: string): RPSGameResult {
    // Validate player move
    const validatedPlayerMove = this.validateMove(playerMove);

    // Generate computer move randomly
    const computerMove = this.generateComputerMove();

    // Determine the game result using the same logic as two-player
    const gameResult = this.determineWinnerVsComputer(validatedPlayerMove, computerMove);

    return {
      playerMove: validatedPlayerMove,
      computerMove,
      result: gameResult.result,
      winner: gameResult.winner,
      explanation: gameResult.explanation
    };
  }

  /**
   * Validates and normalizes a move string.
   * 
   * This method accepts move strings in various formats (different cases)
   * and normalizes them to lowercase. It throws an InvalidMoveError if
   * the move is not one of the valid RPS moves.
   * 
   * @param move - The move string to validate
   * @returns The normalized move as an RPSMove type
   * 
   * @throws {InvalidMoveError} When the move is not a valid RPS move
   * 
   * @example
   * ```typescript
   * const rps = new RockPaperScissors();
   * const move = rps.validateMove('ROCK'); // Returns 'rock'
   * ```
   */
  validateMove(move: string): RPSMove {
    if (!move || typeof move !== 'string') {
      throw new InvalidMoveError('Invalid move: input must be a non-empty string');
    }

    const normalizedMove = move.toLowerCase().trim();
    
    if (!normalizedMove) {
      throw new InvalidMoveError('Invalid move: input must be a non-empty string');
    }
    
    if (!['rock', 'paper', 'scissors'].includes(normalizedMove)) {
      throw new InvalidMoveError(`Invalid move: "${move}" is not a valid move. Valid moves are: rock, paper, scissors`);
    }

    return normalizedMove as RPSMove;
  }

  /**
   * Determines the winner between two moves according to Rock Paper Scissors rules.
   * This is a private helper method used by both playTwoPlayer and playVsComputer.
   * 
   * @param player1Move - The first player's validated move
   * @param player2Move - The second player's validated move
   * @returns Game result with winner, result from player1's perspective, and explanation
   */
  private determineWinner(player1Move: RPSMove, player2Move: RPSMove): {
    result: RPSResult;
    winner: RPSWinner;
    explanation: string;
  } {
    // Handle draw cases
    if (player1Move === player2Move) {
      return {
        result: 'draw',
        winner: null,
        explanation: `Both players chose ${player1Move}`
      };
    }

    // Define winning combinations (what beats what)
    const winningCombinations: Record<RPSMove, { beats: RPSMove; action: string }> = {
      rock: { beats: 'scissors', action: 'crushes' },
      paper: { beats: 'rock', action: 'covers' },
      scissors: { beats: 'paper', action: 'cuts' }
    };

    // Check if player1 wins
    if (winningCombinations[player1Move].beats === player2Move) {
      const action = winningCombinations[player1Move].action;
      return {
        result: 'win',
        winner: 'player1',
        explanation: `${this.capitalizeMove(player1Move)} ${action} ${player2Move}`
      };
    }

    // Otherwise player2 wins
    const action = winningCombinations[player2Move].action;
    return {
      result: 'lose',
      winner: 'player2',
      explanation: `${this.capitalizeMove(player2Move)} ${action} ${player1Move}`
    };
  }

  /**
   * Determines the winner for player vs computer games.
   * Similar to determineWinner but uses computer-specific winner values.
   * 
   * @param playerMove - The player's validated move
   * @param computerMove - The computer's move
   * @returns Game result with winner, result from player's perspective, and explanation
   */
  private determineWinnerVsComputer(playerMove: RPSMove, computerMove: RPSMove): {
    result: RPSResult;
    winner: RPSWinner;
    explanation: string;
  } {
    // Handle draw cases
    if (playerMove === computerMove) {
      return {
        result: 'draw',
        winner: null,
        explanation: `Both players chose ${playerMove}`
      };
    }

    // Define winning combinations (what beats what)
    const winningCombinations: Record<RPSMove, { beats: RPSMove; action: string }> = {
      rock: { beats: 'scissors', action: 'crushes' },
      paper: { beats: 'rock', action: 'covers' },
      scissors: { beats: 'paper', action: 'cuts' }
    };

    // Check if player wins
    if (winningCombinations[playerMove].beats === computerMove) {
      const action = winningCombinations[playerMove].action;
      return {
        result: 'win',
        winner: 'player',
        explanation: `${this.capitalizeMove(playerMove)} ${action} ${computerMove}`
      };
    }

    // Otherwise computer wins
    const action = winningCombinations[computerMove].action;
    return {
      result: 'lose',
      winner: 'computer',
      explanation: `${this.capitalizeMove(computerMove)} ${action} ${playerMove}`
    };
  }

  /**
   * Generates a random move for the computer using Math.random().
   * Each move (rock, paper, scissors) has an equal 1/3 probability.
   * 
   * @returns A random RPSMove for the computer
   */
  private generateComputerMove(): RPSMove {
    const moves: RPSMove[] = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
  }

  /**
   * Capitalizes the first letter of a move for display purposes.
   * 
   * @param move - The move to capitalize
   * @returns The move with the first letter capitalized
   */
  private capitalizeMove(move: RPSMove): string {
    return move.charAt(0).toUpperCase() + move.slice(1);
  }
}