/**
 * @fileoverview TypeScript Games Library
 * 
 * A comprehensive TypeScript library providing multiple game implementations
 * with immutable state management, comprehensive error handling, strict typing, and zero dependencies.
 */

// Export all RPS types, errors, and main class
export type { RPSMove, RPSResult, RPSWinner, RPSGameResult } from './games/rock-paper-scissors/RockPaperScissors';
export { RPSError, InvalidMoveError, RockPaperScissors } from './games/rock-paper-scissors/RockPaperScissors';

// Export all Tic-Tac-Toe types, errors, and main class
export type { Player, Cell, GameStatus, Board } from './games/tic-tac-toe/TicTacToe';
export { TicTacToeError, InvalidMoveError as TTTInvalidMoveError, GameCompletedError, TicTacToe } from './games/tic-tac-toe/TicTacToe';

// Export all 2048 types, errors, and main class
export type { Direction, CellValue, Grid, GameState as Game2048State, MoveResult } from './games/2048/Game2048';
export { Game2048Error, InvalidMoveError as Game2048InvalidMoveError, UndoNotAvailableError, Game2048 } from './games/2048/Game2048';