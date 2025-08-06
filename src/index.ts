/**
 * @fileoverview Rock Paper Scissors Library
 * 
 * A TypeScript library providing a stateless Rock Paper Scissors game implementation
 * with comprehensive error handling, strict typing, and zero dependencies.
 */

// Export all RPS types, errors, and main class from consolidated file
export type { RPSMove, RPSResult, RPSWinner, RPSGameResult } from './RockPaperScissors';
export { RPSError, InvalidMoveError, RockPaperScissors } from './RockPaperScissors';