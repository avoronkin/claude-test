import { 
  RPSMove, 
  RPSResult,
  RPSGameResult
} from './types';

describe('Rock Paper Scissors Types', () => {
  describe('RPSMove', () => {
    test('should accept valid moves', () => {
      const validMoves: RPSMove[] = ['rock', 'paper', 'scissors'];
      expect(validMoves).toHaveLength(3);
    });
  });

  describe('RPSResult', () => {
    test('should accept valid results', () => {
      const validResults: RPSResult[] = ['win', 'lose', 'draw'];
      expect(validResults).toHaveLength(3);
    });
  });

  describe('RPSGameResult', () => {
    test('should have correct structure for win result', () => {
      const gameResult: RPSGameResult = {
        player1Move: 'rock',
        player2Move: 'scissors',
        result: 'win',
        winner: 'player1',
        explanation: 'Rock crushes scissors'
      };

      expect(gameResult.result).toBe('win');
      expect(gameResult.winner).toBe('player1');
      expect(gameResult.explanation).toContain('Rock crushes scissors');
    });

    test('should have correct structure for draw result', () => {
      const gameResult: RPSGameResult = {
        player1Move: 'rock',
        player2Move: 'rock',
        result: 'draw',
        winner: null,
        explanation: 'Both players chose rock'
      };

      expect(gameResult.result).toBe('draw');
      expect(gameResult.winner).toBeNull();
      expect(gameResult.explanation).toContain('Both players chose');
    });

    test('should have correct structure for computer vs player result', () => {
      const gameResult: RPSGameResult = {
        playerMove: 'paper',
        computerMove: 'rock',
        result: 'win',
        winner: 'player',
        explanation: 'Paper covers rock'
      };

      expect(gameResult.playerMove).toBe('paper');
      expect(gameResult.computerMove).toBe('rock');
      expect(gameResult.result).toBe('win');
      expect(gameResult.winner).toBe('player');
    });
  });
});