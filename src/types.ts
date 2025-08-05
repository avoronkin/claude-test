/** Represents a player in the tic-tac-toe game */
export type Player = 'X' | 'O';

/** Represents the content of a single cell on the board */
export type Cell = Player | null;

/** Represents the 3x3 game board as a tuple of tuples */
export type Board = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell]
];

/** Represents the current status of the game */
export type GameStatus = 'in-progress' | 'won' | 'draw';

/**
 * Interface defining the complete state of a tic-tac-toe game.
 * All implementations should provide read-only access to these properties.
 */
export interface GameState {
  /** The current board state */
  readonly board: Board;
  
  /** The player whose turn it is to move */
  readonly currentPlayer: Player;
  
  /** The current game status */
  readonly status: GameStatus;
  
  /** The winning player, or null if game is not won */
  readonly winner: Player | null;
}

// ============================================================================
// Rock Paper Scissors Types
// ============================================================================

/** Represents a move in Rock Paper Scissors game */
export type RPSMove = 'rock' | 'paper' | 'scissors';

/** Represents the result of a single round from player's perspective */
export type RPSResult = 'win' | 'lose' | 'draw';

/** Represents the current status of the RPS game */
export type RPSGameStatus = 'waiting' | 'in-progress' | 'completed';

/** Represents the type of player (human or AI) */
export type RPSPlayerType = 'human' | 'ai';

/** Represents different match formats */
export type RPSMatchFormat = 'single' | 'best-of-3' | 'best-of-5';

/** Represents the winner of a round or match */
export type RPSWinner = 'player1' | 'player2' | null;

/** Represents a single round in the game */
export interface RPSRound {
  /** The round number (1-based) */
  readonly roundNumber: number;
  
  /** Player 1's move */
  readonly player1Move: RPSMove;
  
  /** Player 2's move */
  readonly player2Move: RPSMove;
  
  /** The result from player 1's perspective */
  readonly result: RPSResult;
  
  /** The winner of this round */
  readonly winner: RPSWinner;
}

/**
 * Interface defining the complete state of a Rock Paper Scissors game.
 * Supports both single rounds and best-of-N match formats.
 */
export interface RPSGameState {
  /** The current game status */
  readonly status: RPSGameStatus;
  
  /** Current round number (0-based, 0 means no rounds played yet) */
  readonly currentRound: number;
  
  /** Maximum number of rounds for this match format */
  readonly maxRounds: number;
  
  /** The match format being played */
  readonly matchFormat: RPSMatchFormat;
  
  /** Player 1's current score (rounds won) */
  readonly player1Score: number;
  
  /** Player 2's current score (rounds won) */
  readonly player2Score: number;
  
  /** Array of completed rounds */
  readonly rounds: readonly RPSRound[];
  
  /** The overall winner of the match, or null if not completed */
  readonly winner: RPSWinner;
  
  /** Whether the match ended in a draw */
  readonly isDraw: boolean;
}
