/**
 * @fileoverview Tic-Tac-Toe Library
 * 
 * A TypeScript library providing a complete tic-tac-toe game implementation
 * with immutable state management, comprehensive error handling, and strict typing.
 * 
 * @example
 * ```typescript
 * import { TicTacToe } from 'tic-tac-toe-lib';
 * 
 * const game = new TicTacToe();
 * const game2 = game.makeMove(0, 0); // X plays
 * const game3 = game2.makeMove(1, 1); // O plays
 * console.log(game3.getGameStatus()); // 'in-progress'
 * ```
 */

export { TicTacToe } from './TicTacToe';
export * from './types';
export * from './errors';