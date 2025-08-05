import type { RPSMove, RPSResult, RPSWinner, RPSGameResult } from '../src/index';
import { RPSError, InvalidMoveError } from '../src/index';

describe('RPS Library Index exports', () => {

  it('should export RPS types correctly', () => {
    // Test RPSMove type
    const move: RPSMove = 'rock';
    expect(move).toBe('rock');
    
    // Test RPSResult type
    const result: RPSResult = 'win';
    expect(result).toBe('win');
    
    // Test RPSWinner type
    const winner: RPSWinner = 'player1';
    expect(winner).toBe('player1');
  });

  it('should export RPS error classes', () => {
    expect(RPSError).toBeDefined();
    expect(InvalidMoveError).toBeDefined();
    
    const rpsError = new RPSError('test rps error');
    expect(rpsError).toBeInstanceOf(Error);
    expect(rpsError.message).toBe('test rps error');
    expect(rpsError.name).toBe('RPSError');
    
    const invalidMoveError = new InvalidMoveError('test invalid move');
    expect(invalidMoveError).toBeInstanceOf(Error);
    expect(invalidMoveError).toBeInstanceOf(RPSError);
    expect(invalidMoveError.message).toBe('test invalid move');
    expect(invalidMoveError.name).toBe('InvalidMoveError');
  });

  it('should validate RPS type constraints', () => {
    // Test that only valid moves are allowed
    const validMoves: RPSMove[] = ['rock', 'paper', 'scissors'];
    expect(validMoves).toEqual(['rock', 'paper', 'scissors']);
    
    // Test that only valid results are allowed
    const validResults: RPSResult[] = ['win', 'lose', 'draw'];
    expect(validResults).toEqual(['win', 'lose', 'draw']);
    
    // Test that only valid winners are allowed
    const validWinners: RPSWinner[] = ['player1', 'player2', 'computer', 'player', null];
    expect(validWinners).toEqual(['player1', 'player2', 'computer', 'player', null]);
  });

  it('should export RPSGameResult interface', () => {
    // Test RPSGameResult for two player game
    const twoPlayerResult: RPSGameResult = {
      player1Move: 'rock',
      player2Move: 'scissors',
      result: 'win',
      winner: 'player1',
      explanation: 'Rock crushes scissors'
    };
    
    expect(twoPlayerResult.result).toBe('win');
    expect(twoPlayerResult.winner).toBe('player1');
    
    // Test RPSGameResult for vs computer game
    const vsComputerResult: RPSGameResult = {
      playerMove: 'paper',
      computerMove: 'rock',
      result: 'win',
      winner: 'player',
      explanation: 'Paper covers rock'
    };
    
    expect(vsComputerResult.result).toBe('win');
    expect(vsComputerResult.winner).toBe('player');
  });
});