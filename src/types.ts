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
