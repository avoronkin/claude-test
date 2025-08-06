/**
 * @fileoverview Rock Paper Scissors Library
 * 
 * A TypeScript library providing a stateless Rock Paper Scissors game implementation
 * with comprehensive error handling, strict typing, and zero dependencies.
 */

// Export all RPS types, errors, and main class from games directory
export type { RPSMove, RPSResult, RPSWinner, RPSGameResult } from './games/rock-paper-scissors/RockPaperScissors';
export { RPSError, InvalidMoveError, RockPaperScissors } from './games/rock-paper-scissors/RockPaperScissors';