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