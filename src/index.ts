/**
 * @fileoverview Rock Paper Scissors Library
 * 
 * A TypeScript library providing a stateless Rock Paper Scissors game implementation
 * with comprehensive error handling, strict typing, and zero dependencies.
 */

// Export RPS-specific types for public API usage
export type { RPSMove, RPSResult, RPSWinner, RPSGameResult } from './types';

// Export RPS-specific error classes for proper error handling
export { RPSError, InvalidMoveError } from './errors';

// Note: RockPaperScissors class export will be added in T003