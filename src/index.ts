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