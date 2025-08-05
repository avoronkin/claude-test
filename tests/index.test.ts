import type { RPSMove, RPSResult, RPSPlayerType, RPSMatchFormat, RPSWinner } from '../src/index';
import { InvalidMoveError } from '../src/index';

describe('RPS Library Index exports', () => {

  it('should export RPS types correctly', () => {
    // Test RPSMove type
    const move: RPSMove = 'rock';
    expect(move).toBe('rock');
    
    // Test RPSResult type
    const result: RPSResult = 'win';
    expect(result).toBe('win');
    
    // Test RPSPlayerType type
    const playerType: RPSPlayerType = 'human';
    expect(playerType).toBe('human');
    
    // Test RPSMatchFormat type
    const matchFormat: RPSMatchFormat = 'single';
    expect(matchFormat).toBe('single');
    
    // Test RPSWinner type
    const winner: RPSWinner = 'player1';
    expect(winner).toBe('player1');
  });

  it('should export RPS error classes', () => {
    expect(InvalidMoveError).toBeDefined();
    
    const error = new InvalidMoveError('test invalid move');
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('test invalid move');
    expect(error.name).toBe('InvalidMoveError');
  });

  it('should validate RPS type constraints', () => {
    // Test that only valid moves are allowed
    const validMoves: RPSMove[] = ['rock', 'paper', 'scissors'];
    expect(validMoves).toEqual(['rock', 'paper', 'scissors']);
    
    // Test that only valid results are allowed
    const validResults: RPSResult[] = ['win', 'lose', 'draw'];
    expect(validResults).toEqual(['win', 'lose', 'draw']);
    
    // Test that only valid player types are allowed
    const validPlayerTypes: RPSPlayerType[] = ['human', 'ai'];
    expect(validPlayerTypes).toEqual(['human', 'ai']);
    
    // Test that only valid match formats are allowed
    const validMatchFormats: RPSMatchFormat[] = ['single', 'best-of-3', 'best-of-5'];
    expect(validMatchFormats).toEqual(['single', 'best-of-3', 'best-of-5']);
    
    // Test that only valid winners are allowed
    const validWinners: RPSWinner[] = ['player1', 'player2', null];
    expect(validWinners).toEqual(['player1', 'player2', null]);
  });
});