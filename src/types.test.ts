import { 
  RPSMove, 
  RPSResult, 
  RPSGameState, 
  RPSGameStatus,
  RPSPlayerType,
  RPSMatchFormat
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

  describe('RPSGameStatus', () => {
    test('should accept valid game statuses', () => {
      const validStatuses: RPSGameStatus[] = ['waiting', 'in-progress', 'completed'];
      expect(validStatuses).toHaveLength(3);
    });
  });

  describe('RPSPlayerType', () => {
    test('should accept valid player types', () => {
      const validTypes: RPSPlayerType[] = ['human', 'ai'];
      expect(validTypes).toHaveLength(2);
    });
  });

  describe('RPSMatchFormat', () => {
    test('should accept valid match formats', () => {
      const validFormats: RPSMatchFormat[] = ['single', 'best-of-3', 'best-of-5'];
      expect(validFormats).toHaveLength(3);
    });
  });

  describe('RPSGameState', () => {
    test('should have correct structure for waiting state', () => {
      const gameState: RPSGameState = {
        status: 'waiting',
        currentRound: 0,
        maxRounds: 1,
        matchFormat: 'single',
        player1Score: 0,
        player2Score: 0,
        rounds: [],
        winner: null,
        isDraw: false
      };

      expect(gameState.status).toBe('waiting');
      expect(gameState.currentRound).toBe(0);
      expect(gameState.rounds).toEqual([]);
      expect(gameState.winner).toBeNull();
    });

    test('should have correct structure for completed state', () => {
      const gameState: RPSGameState = {
        status: 'completed',
        currentRound: 1,
        maxRounds: 1,
        matchFormat: 'single',
        player1Score: 1,
        player2Score: 0,
        rounds: [
          {
            roundNumber: 1,
            player1Move: 'rock',
            player2Move: 'scissors',
            result: 'win',
            winner: 'player1'
          }
        ],
        winner: 'player1',
        isDraw: false
      };

      expect(gameState.status).toBe('completed');
      expect(gameState.winner).toBe('player1');
      expect(gameState.rounds).toHaveLength(1);
    });
  });
});