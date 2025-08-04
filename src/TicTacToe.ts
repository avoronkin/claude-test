import { Player, Cell, Board, GameStatus, GameState } from './types';
import { InvalidMoveError, GameEndedError } from './errors';

/**
 * A TypeScript implementation of the classic Tic-Tac-Toe game with immutable state management.
 * 
 * This class provides a complete game engine for tic-tac-toe with comprehensive error handling,
 * win/draw detection, and strict TypeScript typing. Each move returns a new game instance,
 * ensuring immutable state behavior.
 * 
 * @example
 * ```typescript
 * const game = new TicTacToe();
 * const game2 = game.makeMove(0, 0); // X plays at top-left
 * const game3 = game2.makeMove(1, 1); // O plays at center
 * console.log(game3.getCurrentPlayer()); // 'X'
 * ```
 */
export class TicTacToe implements GameState {
  /** The current game board state as a 3x3 grid */
  public readonly board: Board;
  
  /** The player whose turn it is to move ('X' or 'O') */
  public readonly currentPlayer: Player;
  
  /** The current status of the game */
  public readonly status: GameStatus;
  
  /** The winning player, or null if game is not won */
  public readonly winner: Player | null;

  /**
   * Creates a new TicTacToe game instance.
   * 
   * @param board - Optional initial board state (defaults to empty 3x3 grid)
   * @param currentPlayer - The player who moves first (defaults to 'X')
   * @param status - Initial game status (defaults to 'in-progress')
   * @param winner - The winning player if game is already won (defaults to null)
   */
  constructor(
    board?: Board,
    currentPlayer: Player = 'X',
    status: GameStatus = 'in-progress',
    winner: Player | null = null
  ) {
    this.board = board || this.createEmptyBoard();
    this.currentPlayer = currentPlayer;
    this.status = status;
    this.winner = winner;
  }

  private createEmptyBoard(): Board {
    return [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
  }

  /**
   * Gets the player whose turn it is to move.
   * 
   * @returns The current player ('X' or 'O')
   */
  public getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  /**
   * Gets the current status of the game.
   * 
   * @returns 'in-progress' if game is ongoing, 'won' if someone won, 'draw' if tied
   */
  public getGameStatus(): GameStatus {
    return this.status;
  }

  /**
   * Gets the winning player if the game has been won.
   * 
   * @returns The winning player ('X' or 'O'), or null if game is not won
   */
  public getWinner(): Player | null {
    return this.winner;
  }

  /**
   * Gets the state of a specific cell on the board.
   * 
   * @param row - The row index (0-2)
   * @param col - The column index (0-2)
   * @returns The cell content ('X', 'O', or null for empty)
   * @throws {InvalidMoveError} When coordinates are out of bounds
   */
  public getCellState(row: number, col: number): Cell {
    this.validateCoordinates(row, col);
    return this.board[row][col];
  }

  /**
   * Makes a move at the specified position and returns a new game instance.
   * 
   * This method implements immutable state - the original game instance is not modified.
   * Instead, a new TicTacToe instance is returned with the updated state.
   * 
   * @param row - The row index (0-2) where to place the current player's mark
   * @param col - The column index (0-2) where to place the current player's mark
   * @returns A new TicTacToe instance with the move applied
   * @throws {GameEndedError} When attempting to move after game has ended
   * @throws {InvalidMoveError} When coordinates are out of bounds or cell is occupied
   */
  public makeMove(row: number, col: number): TicTacToe {
    this.validateMove(row, col);

    const newBoard = this.copyBoard();
    newBoard[row][col] = this.currentPlayer;

    const winResult = this.checkWin(newBoard);
    const isDraw = this.checkDraw(newBoard);

    let newStatus: GameStatus = 'in-progress';
    let newWinner: Player | null = null;

    if (winResult) {
      newStatus = 'won';
      newWinner = this.currentPlayer;
    } else if (isDraw) {
      newStatus = 'draw';
    }

    const nextPlayer: Player = this.currentPlayer === 'X' ? 'O' : 'X';

    return new TicTacToe(
      newBoard,
      newStatus === 'in-progress' ? nextPlayer : this.currentPlayer,
      newStatus,
      newWinner
    );
  }

  private validateMove(row: number, col: number): void {
    if (this.status !== 'in-progress') {
      throw new GameEndedError('Game has already ended');
    }

    this.validateCoordinates(row, col);

    if (this.board[row][col] !== null) {
      throw new InvalidMoveError('Cell is already occupied');
    }
  }

  private validateCoordinates(row: number, col: number): void {
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      throw new InvalidMoveError('Move is out of bounds');
    }
  }

  private copyBoard(): Board {
    return [
      [...this.board[0]],
      [...this.board[1]],
      [...this.board[2]]
    ];
  }

  private checkWin(board: Board): boolean {
    // Check horizontal lines
    for (let row = 0; row < 3; row++) {
      if (board[row][0] !== null && 
          board[row][0] === board[row][1] && 
          board[row][1] === board[row][2]) {
        return true;
      }
    }

    // Check vertical lines
    for (let col = 0; col < 3; col++) {
      if (board[0][col] !== null && 
          board[0][col] === board[1][col] && 
          board[1][col] === board[2][col]) {
        return true;
      }
    }

    // Check diagonal lines
    if (board[0][0] !== null && 
        board[0][0] === board[1][1] && 
        board[1][1] === board[2][2]) {
      return true;
    }

    if (board[0][2] !== null && 
        board[0][2] === board[1][1] && 
        board[1][1] === board[2][0]) {
      return true;
    }

    return false;
  }

  private checkDraw(board: Board): boolean {
    // Check if all cells are filled
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