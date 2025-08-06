import { 
  RockPaperScissors,
  RPSError,
  InvalidMoveError,
  type RPSMove,
  type RPSResult,
  type RPSGameResult
} from './RockPaperScissors';

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

describe('Rock Paper Scissors Error Classes', () => {
  describe('RPSError', () => {
    test('should create RPSError with correct message and name', () => {
      const message = 'A generic RPS error occurred';
      const error = new RPSError(message);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(RPSError);
      expect(error.message).toBe(message);
      expect(error.name).toBe('RPSError');
    });
  });

  describe('InvalidMoveError', () => {
    test('should create InvalidMoveError with correct message and name', () => {
      const message = 'Invalid move: "lizard" is not a valid move';
      const error = new InvalidMoveError(message);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(RPSError);
      expect(error).toBeInstanceOf(InvalidMoveError);
      expect(error.message).toBe(message);
      expect(error.name).toBe('InvalidMoveError');
    });

    test('should be thrown when invalid move is provided', () => {
      expect(() => {
        throw new InvalidMoveError('Invalid move: "spock" is not supported');
      }).toThrow(InvalidMoveError);
      
      expect(() => {
        throw new InvalidMoveError('Invalid move: "spock" is not supported');
      }).toThrow(RPSError);
    });

    test('should have proper error message for invalid input types', () => {
      const error = new InvalidMoveError('Invalid move: input must be a string');
      expect(error.message).toContain('input must be a string');
    });

    test('should have proper error message for empty input', () => {
      const error = new InvalidMoveError('Invalid move: empty string provided');
      expect(error.message).toContain('empty string');
    });
  });
});

describe('RockPaperScissors', () => {
  let rps: RockPaperScissors;

  beforeEach(() => {
    rps = new RockPaperScissors();
  });

  describe('Constructor', () => {
    test('should create RockPaperScissors instance', () => {
      expect(rps).toBeInstanceOf(RockPaperScissors);
    });
  });

  describe('playTwoPlayer method signature', () => {
    test('should have playTwoPlayer method', () => {
      expect(typeof rps.playTwoPlayer).toBe('function');
    });

    test('should return RPSGameResult', () => {
      const result = rps.playTwoPlayer('rock', 'scissors');
      expect(result).toHaveProperty('player1Move');
      expect(result).toHaveProperty('player2Move');
      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('winner');
      expect(result).toHaveProperty('explanation');
    });
  });

  describe('playVsComputer method signature', () => {
    test('should have playVsComputer method', () => {
      expect(typeof rps.playVsComputer).toBe('function');
    });

    test('should return RPSGameResult', () => {
      const result = rps.playVsComputer('rock');
      expect(result).toHaveProperty('playerMove');
      expect(result).toHaveProperty('computerMove');
      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('winner');
      expect(result).toHaveProperty('explanation');
    });
  });

  describe('validateMove method', () => {
    test('should have validateMove method', () => {
      expect(typeof rps.validateMove).toBe('function');
    });

    test('should accept valid moves in lowercase', () => {
      expect(rps.validateMove('rock')).toBe('rock');
      expect(rps.validateMove('paper')).toBe('paper');
      expect(rps.validateMove('scissors')).toBe('scissors');
    });

    test('should normalize uppercase moves to lowercase', () => {
      expect(rps.validateMove('ROCK')).toBe('rock');
      expect(rps.validateMove('PAPER')).toBe('paper');
      expect(rps.validateMove('SCISSORS')).toBe('scissors');
    });

    test('should normalize mixed case moves', () => {
      expect(rps.validateMove('Rock')).toBe('rock');
      expect(rps.validateMove('PaPeR')).toBe('paper');
      expect(rps.validateMove('ScIsSoRs')).toBe('scissors');
    });

    test('should trim whitespace from moves', () => {
      expect(rps.validateMove('  rock  ')).toBe('rock');
      expect(rps.validateMove('\tpaper\n')).toBe('paper');
      expect(rps.validateMove(' SCISSORS ')).toBe('scissors');
    });

    test('should throw InvalidMoveError for invalid moves', () => {
      expect(() => rps.validateMove('invalid')).toThrow(InvalidMoveError);
      expect(() => rps.validateMove('lizard')).toThrow(InvalidMoveError);
      expect(() => rps.validateMove('spock')).toThrow(InvalidMoveError);
    });

    test('should throw InvalidMoveError for empty strings', () => {
      expect(() => rps.validateMove('')).toThrow(InvalidMoveError);
      expect(() => rps.validateMove('   ')).toThrow(InvalidMoveError);
    });

    test('should throw InvalidMoveError for non-string inputs', () => {
      expect(() => rps.validateMove(null as any)).toThrow(InvalidMoveError);
      expect(() => rps.validateMove(undefined as any)).toThrow(InvalidMoveError);
      expect(() => rps.validateMove(123 as any)).toThrow(InvalidMoveError);
    });

    test('should provide descriptive error messages', () => {
      expect(() => rps.validateMove('lizard')).toThrow('Invalid move: "lizard" is not a valid move');
      expect(() => rps.validateMove('')).toThrow('Invalid move: input must be a non-empty string');
    });
  });

  describe('Game Logic', () => {
    describe('determineWinner helper', () => {
      test('rock should beat scissors', () => {
        const result = rps.playTwoPlayer('rock', 'scissors');
        expect(result.result).toBe('win');
        expect(result.winner).toBe('player1');
        expect(result.explanation).toContain('Rock crushes scissors');
      });

      test('scissors should beat paper', () => {
        const result = rps.playTwoPlayer('scissors', 'paper');
        expect(result.result).toBe('win');
        expect(result.winner).toBe('player1');
        expect(result.explanation).toContain('Scissors cuts paper');
      });

      test('paper should beat rock', () => {
        const result = rps.playTwoPlayer('paper', 'rock');
        expect(result.result).toBe('win');
        expect(result.winner).toBe('player1');
        expect(result.explanation).toContain('Paper covers rock');
      });

      test('player2 rock should beat player1 scissors', () => {
        const result = rps.playTwoPlayer('scissors', 'rock');
        expect(result.result).toBe('lose');
        expect(result.winner).toBe('player2');
        expect(result.explanation).toContain('Rock crushes scissors');
      });

      test('player2 scissors should beat player1 paper', () => {
        const result = rps.playTwoPlayer('paper', 'scissors');
        expect(result.result).toBe('lose');
        expect(result.winner).toBe('player2');
        expect(result.explanation).toContain('Scissors cuts paper');
      });

      test('player2 paper should beat player1 rock', () => {
        const result = rps.playTwoPlayer('rock', 'paper');
        expect(result.result).toBe('lose');
        expect(result.winner).toBe('player2');
        expect(result.explanation).toContain('Paper covers rock');
      });

      test('same moves should result in draw', () => {
        const rockResult = rps.playTwoPlayer('rock', 'rock');
        expect(rockResult.result).toBe('draw');
        expect(rockResult.winner).toBeNull();
        expect(rockResult.explanation).toContain('Both players chose rock');

        const paperResult = rps.playTwoPlayer('paper', 'paper');
        expect(paperResult.result).toBe('draw');
        expect(paperResult.winner).toBeNull();
        expect(paperResult.explanation).toContain('Both players chose paper');

        const scissorsResult = rps.playTwoPlayer('scissors', 'scissors');
        expect(scissorsResult.result).toBe('draw');
        expect(scissorsResult.winner).toBeNull();
        expect(scissorsResult.explanation).toContain('Both players chose scissors');
      });
    });

    describe('playVsComputer method', () => {
      test('should generate random computer moves', () => {
        const results: string[] = [];
        for (let i = 0; i < 100; i++) {
          const result = rps.playVsComputer('rock');
          if (result.computerMove) {
            results.push(result.computerMove);
          }
        }

        const uniqueMoves = [...new Set(results)];
        expect(uniqueMoves.length).toBeGreaterThan(1);
        expect(uniqueMoves.every(move => ['rock', 'paper', 'scissors'].includes(move))).toBe(true);
      });

      test('should work with player winning scenarios', () => {
        const originalRandom = Math.random;
        
        Math.random = jest.fn(() => 0.9);
        const result1 = rps.playVsComputer('rock');
        expect(result1.playerMove).toBe('rock');
        expect(result1.computerMove).toBe('scissors');
        expect(result1.result).toBe('win');
        expect(result1.winner).toBe('player');
        expect(result1.explanation).toContain('Rock crushes scissors');

        Math.random = originalRandom;
      });

      test('should work with computer winning scenarios', () => {
        const originalRandom = Math.random;
        
        Math.random = jest.fn(() => 0.4);
        const result = rps.playVsComputer('rock');
        expect(result.playerMove).toBe('rock');
        expect(result.computerMove).toBe('paper');
        expect(result.result).toBe('lose');
        expect(result.winner).toBe('computer');
        expect(result.explanation).toContain('Paper covers rock');

        Math.random = originalRandom;
      });

      test('should work with draw scenarios', () => {
        const originalRandom = Math.random;
        
        Math.random = jest.fn(() => 0.1);
        const result = rps.playVsComputer('rock');
        expect(result.playerMove).toBe('rock');
        expect(result.computerMove).toBe('rock');
        expect(result.result).toBe('draw');
        expect(result.winner).toBeNull();
        expect(result.explanation).toContain('Both players chose rock');

        Math.random = originalRandom;
      });

      test('should validate player input', () => {
        expect(() => rps.playVsComputer('invalid')).toThrow(InvalidMoveError);
        expect(() => rps.playVsComputer('')).toThrow(InvalidMoveError);
      });
    });
  });

  describe('Performance Requirements', () => {
    test('playTwoPlayer should complete in less than 1ms', () => {
      const iterations = 1000;
      const start = process.hrtime.bigint();
      
      for (let i = 0; i < iterations; i++) {
        rps.playTwoPlayer('rock', 'scissors');
      }
      
      const end = process.hrtime.bigint();
      const totalTimeMs = Number(end - start) / 1000000;
      const avgTimeMs = totalTimeMs / iterations;
      
      expect(avgTimeMs).toBeLessThan(1);
    });

    test('playVsComputer should complete in less than 1ms', () => {
      const iterations = 1000;
      const start = process.hrtime.bigint();
      
      for (let i = 0; i < iterations; i++) {
        rps.playVsComputer('rock');
      }
      
      const end = process.hrtime.bigint();
      const totalTimeMs = Number(end - start) / 1000000;
      const avgTimeMs = totalTimeMs / iterations;
      
      expect(avgTimeMs).toBeLessThan(1);
    });

    test('validateMove should complete in less than 1ms', () => {
      const iterations = 10000;
      const start = process.hrtime.bigint();
      
      for (let i = 0; i < iterations; i++) {
        rps.validateMove('ROCK');
      }
      
      const end = process.hrtime.bigint();
      const totalTimeMs = Number(end - start) / 1000000;
      const avgTimeMs = totalTimeMs / iterations;
      
      expect(avgTimeMs).toBeLessThan(1);
    });
  });
});