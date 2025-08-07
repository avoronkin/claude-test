// ============================================================================
// Types
// ============================================================================

/** Represents a player in Tic-Tac-Toe game */
export type Player = 'X' | 'O';
/**
 * Enum for game mode types
 */
export enum GameMode {
  // eslint-disable-next-line no-unused-vars
  HUMAN_VS_HUMAN = 'human_vs_human',
  // eslint-disable-next-line no-unused-vars
  HUMAN_VS_AI = 'human_vs_ai'
}

/**
 * Enum for player types
 */
export enum PlayerType {
  // eslint-disable-next-line no-unused-vars
  HUMAN = 'human',
  // eslint-disable-next-line no-unused-vars
  AI = 'ai'
}
/**
 * Interface for move coordinates
 */
export interface Move {
  row: number;
  col: number;
}

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
  private readonly _gameMode: GameMode;
  private readonly _humanPlayerSide: Player;

  /**
   * Create a new TicTacToe game instance.
   * @param board - Optional board state (for internal use when creating new instances)
   * @param currentPlayer - Optional current player (for internal use)
   * @param gameStatus - Optional game status (for internal use)
   * @param winner - Optional winner (for internal use)
   */
  /**
   * Creates a new TicTacToe game instance
   * @param board Optional initial board state - defaults to empty board
   * @param currentPlayer Optional current player - defaults to 'X'  
   * @param gameStatus Optional game status - defaults to 'ongoing'
   * @param winner Optional winner - defaults to null
   * @param gameMode Optional game mode - defaults to HUMAN_VS_HUMAN
   * @param humanPlayerSide Optional human player side for AI games - defaults to 'X'
   */
  constructor(
    board?: Board,
    currentPlayer?: Player,
    gameStatus?: GameStatus,
    winner?: Player | null,
    gameMode?: GameMode,
    humanPlayerSide?: Player
  ) {
    this._board = board || [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    this._currentPlayer = currentPlayer || 'X';
    this._gameStatus = gameStatus || 'ongoing';
    this._winner = winner || null;
    this._gameMode = gameMode || GameMode.HUMAN_VS_HUMAN;
    this._humanPlayerSide = humanPlayerSide || 'X';
  }

  /**
   * Get the current game board state.
   * Returns a deep copy to maintain immutability.
   */
  get board(): Board {
    return this._board.map(row => [...row]);
  }

  /**
   * Get the player whose turn it is to make the next move.
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
   * Get the current game mode
   */
  get gameMode(): GameMode {
    return this._gameMode;
  }

  /**
   * Get which side the human player is on (X or O)
   */
  get humanPlayerSide(): Player {
    return this._humanPlayerSide;
  }

  /**
   * Check if current player is AI
   */
  get isAITurn(): boolean {
    return this._gameMode === GameMode.HUMAN_VS_AI && this._currentPlayer !== this._humanPlayerSide;
  }

  /**
   * Randomly determine which player goes first
   * @returns Player who should make the first move
   */
  determineFirstPlayer(): Player {
    return Math.random() < 0.5 ? 'X' : 'O';
  }

  /**
   * Make AI move automatically using optimal strategy
   * @returns New game instance with AI move applied
   * @throws Error if it's not AI's turn or game is completed
   */
  makeAIMove(): TicTacToe {
    // Check if game is completed
    if (this._gameStatus !== 'ongoing') {
      throw new Error('Cannot make AI move on completed game');
    }
    
    // Check if it's AI's turn
    if (!this.isAITurn) {
      throw new Error('Cannot make AI move when it is human player turn');
    }
    
    // Get best move from AI
    const bestMove = this.getBestMove();
    
    // Make the move using existing makeMove method
    return this.makeMove(bestMove.row, bestMove.col);
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
    return new TicTacToe(newBoard, nextPlayer, newGameStatus, newWinner, this._gameMode, this._humanPlayerSide);
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

  /**
   * Get the best move for AI using minimax algorithm
   * @returns Move coordinates for the optimal AI move
   */
  getBestMove(): Move {
    let bestScore = -Infinity;
    let bestMove: Move = { row: 0, col: 0 };
    
    const aiPlayer = this._humanPlayerSide === 'X' ? 'O' : 'X';
    
    // Try all possible moves
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this._board[row][col] === null) {
          // Make temporary move
          const tempBoard = this._board.map(boardRow => [...boardRow]);
          tempBoard[row][col] = aiPlayer;
          
          // Calculate score using minimax
          const score = this.minimax(tempBoard, 0, false, -Infinity, Infinity);
          
          // Update best move if this is better
          if (score > bestScore) {
            bestScore = score;
            bestMove = { row, col };
          }
        }
      }
    }
    
    return bestMove;
  }

  /**
   * Minimax algorithm with alpha-beta pruning for optimal AI moves
   * @param board Current board state
   * @param depth Current depth in the game tree
   * @param isMaximizing Whether current player is maximizing (AI) or minimizing (human)
   * @param alpha Alpha value for pruning
   * @param beta Beta value for pruning
   * @returns Score of the current board position
   */
  minimax(board: Board, depth: number, isMaximizing: boolean, alpha: number, beta: number): number {
    // Check terminal states
    const winner = this.checkWinner(board);
    const aiPlayer = this._humanPlayerSide === 'X' ? 'O' : 'X';
    const humanPlayer = this._humanPlayerSide;
    
    if (winner === aiPlayer) {
      return 10 - depth; // AI wins - prefer shorter paths to victory
    }
    if (winner === humanPlayer) {
      return depth - 10; // Human wins - prefer longer paths to defeat
    }
    if (this.isBoardFull(board)) {
      return 0; // Draw
    }
    
    if (isMaximizing) {
      // AI turn - maximize score
      let maxScore = -Infinity;
      
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (board[row][col] === null) {
            // Make move on copy
            const tempBoard = board.map(boardRow => [...boardRow]);
            tempBoard[row][col] = aiPlayer;
            
            // Recursively calculate score
            const score = this.minimax(tempBoard, depth + 1, false, alpha, beta);
            
            maxScore = Math.max(score, maxScore);
            alpha = Math.max(alpha, score);
            
            // Alpha-beta pruning
            if (beta <= alpha) {
              break;
            }
          }
        }
        // Early termination for pruning
        if (beta <= alpha) {
          break;
        }
      }
      
      return maxScore;
    } else {
      // Human turn - minimize score
      let minScore = Infinity;
      
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (board[row][col] === null) {
            // Make move on copy
            const tempBoard = board.map(boardRow => [...boardRow]);
            tempBoard[row][col] = humanPlayer;
            
            // Recursively calculate score
            const score = this.minimax(tempBoard, depth + 1, true, alpha, beta);
            
            minScore = Math.min(score, minScore);
            beta = Math.min(beta, score);
            
            // Alpha-beta pruning
            if (beta <= alpha) {
              break;
            }
          }
        }
        // Early termination for pruning
        if (beta <= alpha) {
          break;
        }
      }
      
      return minScore;
    }
  }
}