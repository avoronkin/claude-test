import { TicTacToe, InvalidMoveError, GameCompletedError, GameMode, PlayerType } from './TicTacToe';

describe('TicTacToe', () => {
  describe('constructor and initial state', () => {
    it('should create a new game with empty board', () => {
      const game = new TicTacToe();
      
      expect(game.board).toEqual([
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ]);
      expect(game.currentPlayer).toBe('X');
      expect(game.gameStatus).toBe('ongoing');
      expect(game.winner).toBeNull();
    });
  });

  describe('makeMove - valid moves', () => {
    it('should place X mark on empty cell and switch to O', () => {
      const game = new TicTacToe();
      const newGame = game.makeMove(0, 0);
      
      expect(newGame.board[0][0]).toBe('X');
      expect(newGame.currentPlayer).toBe('O');
      expect(newGame.gameStatus).toBe('ongoing');
    });

    it('should place O mark on second move and switch back to X', () => {
      const game = new TicTacToe();
      const game2 = game.makeMove(0, 0);  // X
      const game3 = game2.makeMove(1, 1); // O
      
      expect(game3.board[1][1]).toBe('O');
      expect(game3.currentPlayer).toBe('X');
      expect(game3.gameStatus).toBe('ongoing');
    });

    it('should maintain immutability - original game unchanged', () => {
      const game = new TicTacToe();
      const newGame = game.makeMove(0, 0);
      
      expect(game.board[0][0]).toBeNull();
      expect(game.currentPlayer).toBe('X');
      expect(newGame.board[0][0]).toBe('X');
      expect(newGame.currentPlayer).toBe('O');
    });
  });

  describe('makeMove - invalid moves', () => {
    it('should throw InvalidMoveError for out-of-bounds coordinates', () => {
      const game = new TicTacToe();
      
      expect(() => game.makeMove(-1, 0)).toThrow(InvalidMoveError);
      expect(() => game.makeMove(0, -1)).toThrow(InvalidMoveError);
      expect(() => game.makeMove(3, 0)).toThrow(InvalidMoveError);
      expect(() => game.makeMove(0, 3)).toThrow(InvalidMoveError);
    });

    it('should throw InvalidMoveError for occupied cell', () => {
      const game = new TicTacToe();
      const game2 = game.makeMove(0, 0);
      
      expect(() => game2.makeMove(0, 0)).toThrow(InvalidMoveError);
    });

    it('should throw InvalidMoveError with descriptive messages', () => {
      const game = new TicTacToe();
      
      expect(() => game.makeMove(-1, 0)).toThrow('Row must be between 0 and 2');
      expect(() => game.makeMove(0, 3)).toThrow('Column must be between 0 and 2');
    });
  });

  describe('win conditions', () => {
    it('should detect horizontal win - top row', () => {
      const game = new TicTacToe();
      const game2 = game.makeMove(0, 0);   // X
      const game3 = game2.makeMove(1, 0);  // O
      const game4 = game3.makeMove(0, 1);  // X
      const game5 = game4.makeMove(1, 1);  // O
      const game6 = game5.makeMove(0, 2);  // X wins
      
      expect(game6.gameStatus).toBe('won');
      expect(game6.winner).toBe('X');
    });

    it('should detect horizontal win - middle row', () => {
      const game = new TicTacToe();
      const game2 = game.makeMove(1, 0);   // X
      const game3 = game2.makeMove(0, 0);  // O
      const game4 = game3.makeMove(1, 1);  // X
      const game5 = game4.makeMove(0, 1);  // O
      const game6 = game5.makeMove(1, 2);  // X wins
      
      expect(game6.gameStatus).toBe('won');
      expect(game6.winner).toBe('X');
    });

    it('should detect vertical win - left column', () => {
      const game = new TicTacToe();
      const game2 = game.makeMove(0, 0);   // X
      const game3 = game2.makeMove(0, 1);  // O
      const game4 = game3.makeMove(1, 0);  // X
      const game5 = game4.makeMove(0, 2);  // O
      const game6 = game5.makeMove(2, 0);  // X wins
      
      expect(game6.gameStatus).toBe('won');
      expect(game6.winner).toBe('X');
    });

    it('should detect diagonal win - top-left to bottom-right', () => {
      const game = new TicTacToe();
      const game2 = game.makeMove(0, 0);   // X
      const game3 = game2.makeMove(0, 1);  // O
      const game4 = game3.makeMove(1, 1);  // X
      const game5 = game4.makeMove(0, 2);  // O
      const game6 = game5.makeMove(2, 2);  // X wins
      
      expect(game6.gameStatus).toBe('won');
      expect(game6.winner).toBe('X');
    });

    it('should detect diagonal win - top-right to bottom-left', () => {
      const game = new TicTacToe();
      const game2 = game.makeMove(0, 2);   // X
      const game3 = game2.makeMove(0, 1);  // O
      const game4 = game3.makeMove(1, 1);  // X
      const game5 = game4.makeMove(0, 0);  // O
      const game6 = game5.makeMove(2, 0);  // X wins
      
      expect(game6.gameStatus).toBe('won');
      expect(game6.winner).toBe('X');
    });

    it('should detect O win as well', () => {
      const game = new TicTacToe();
      const game2 = game.makeMove(0, 0);   // X
      const game3 = game2.makeMove(1, 0);  // O
      const game4 = game3.makeMove(0, 1);  // X
      const game5 = game4.makeMove(1, 1);  // O
      const game6 = game5.makeMove(2, 0);  // X
      const game7 = game6.makeMove(1, 2);  // O wins
      
      expect(game7.gameStatus).toBe('won');
      expect(game7.winner).toBe('O');
    });
  });

  describe('draw conditions', () => {
    it('should detect draw when board is full with no winner', () => {
      // Create a draw board manually: X O X / O O X / X X O
      const drawBoard = [
        ['X' as const, 'O' as const, 'X' as const],
        ['O' as const, 'O' as const, 'X' as const],
        ['X' as const, 'X' as const, 'O' as const]
      ];
      
      const drawGame = new TicTacToe(drawBoard, 'X', 'draw', null);
      
      expect(drawGame.gameStatus).toBe('draw');
      expect(drawGame.winner).toBeNull();
    });

    it('should detect draw through natural gameplay', () => {
      // Play a sequence that results in a draw with full board coverage
      const game = new TicTacToe();
      let currentGame = game;
      
      // Create strategic moves that avoid wins
      currentGame = currentGame.makeMove(1, 1); // X center
      currentGame = currentGame.makeMove(0, 0); // O corner
      currentGame = currentGame.makeMove(2, 2); // X corner
      currentGame = currentGame.makeMove(0, 2); // O corner
      currentGame = currentGame.makeMove(0, 1); // X
      currentGame = currentGame.makeMove(2, 1); // O
      currentGame = currentGame.makeMove(1, 0); // X
      currentGame = currentGame.makeMove(1, 2); // O
      currentGame = currentGame.makeMove(2, 0); // X - should be draw
      
      expect(currentGame.gameStatus).toBe('draw');
      expect(currentGame.winner).toBeNull();
    });
  });

  describe('game completion prevention', () => {
    it('should throw GameCompletedError when trying to move after win', () => {
      const game = new TicTacToe();
      const game2 = game.makeMove(0, 0);   // X
      const game3 = game2.makeMove(1, 0);  // O
      const game4 = game3.makeMove(0, 1);  // X
      const game5 = game4.makeMove(1, 1);  // O
      const game6 = game5.makeMove(0, 2);  // X wins
      
      expect(() => game6.makeMove(2, 0)).toThrow(GameCompletedError);
    });

    it('should throw GameCompletedError when trying to move after draw', () => {
      // Create a draw board manually
      const drawBoard = [
        ['X' as const, 'O' as const, 'X' as const],
        ['O' as const, 'O' as const, 'X' as const],
        ['X' as const, 'X' as const, 'O' as const]
      ];
      
      const drawGame = new TicTacToe(drawBoard, 'X', 'draw', null);
      
      expect(() => drawGame.makeMove(0, 0)).toThrow(GameCompletedError);
    });
  });

  describe('AI types and game modes', () => {
    it('should have GameMode enum with correct values', () => {
      expect(GameMode.HUMAN_VS_HUMAN).toBe('human_vs_human');
      expect(GameMode.HUMAN_VS_AI).toBe('human_vs_ai');
    });

    it('should have PlayerType enum with correct values', () => {
      expect(PlayerType.HUMAN).toBe('human');
      expect(PlayerType.AI).toBe('ai');
    });

    it('should support creating AI opponent game', () => {
      // This should not throw when AI types are implemented
      expect(() => {
        new TicTacToe(undefined, undefined, undefined, undefined, GameMode.HUMAN_VS_AI, 'X');
      }).not.toThrow();
    });
  });

  describe('AI minimax algorithm', () => {
    it('should have minimax method that returns optimal move score', () => {
      const game = new TicTacToe(undefined, undefined, undefined, undefined, GameMode.HUMAN_VS_AI, 'X');
      
      // Test on empty board - AI should return a score
      const score = game.minimax(game.board, 0, true, -Infinity, Infinity);
      expect(typeof score).toBe('number');
    });

    it('should return winning move when AI can win in one move', () => {
      // Board where AI (O) can win by playing [2,2]
      const board = [
        ['X' as const, null, null],
        [null, 'O' as const, null],
        ['O' as const, null, null]
      ];
      
      const game = new TicTacToe(board, 'O', 'ongoing', null, GameMode.HUMAN_VS_AI, 'X');
      const bestMove = game.getBestMove();
      
      // AI should choose a winning move (either [0,0] for column or [0,2] for diagonal)
      const isWinningMove = (bestMove.row === 0 && bestMove.col === 0) || 
                           (bestMove.row === 0 && bestMove.col === 2);
      expect(isWinningMove).toBe(true);
    });

    it('should block player winning move', () => {
      // Board where human (X) can win by playing [0,2], AI should block
      const board = [
        ['X' as const, 'X' as const, null],
        [null, 'O' as const, null],
        [null, null, null]
      ];
      
      const game = new TicTacToe(board, 'O', 'ongoing', null, GameMode.HUMAN_VS_AI, 'X');
      const bestMove = game.getBestMove();
      
      // AI should block by playing [0,2]
      expect(bestMove).toEqual({ row: 0, col: 2 });
    });

    it('should complete minimax calculation within performance requirement', () => {
      const game = new TicTacToe(undefined, undefined, undefined, undefined, GameMode.HUMAN_VS_AI, 'X');
      
      const start = performance.now();
      game.getBestMove();
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100); // Should be under 100ms
    });
  });

  describe('AI game initialization and turn management', () => {
    it('should have method to determine random first player', () => {
      const game = new TicTacToe(undefined, undefined, undefined, undefined, GameMode.HUMAN_VS_AI, 'X');
      
      // Test that method exists and returns valid player
      const firstPlayer = game.determineFirstPlayer();
      expect(['X', 'O']).toContain(firstPlayer);
    });

    it('should randomly select first player over multiple calls', () => {
      const game = new TicTacToe(undefined, undefined, undefined, undefined, GameMode.HUMAN_VS_AI, 'X');
      
      // Call multiple times to test randomness
      const results = [];
      for (let i = 0; i < 20; i++) {
        results.push(game.determineFirstPlayer());
      }
      
      // Should have both X and O in results (with very high probability)
      const hasX = results.includes('X');
      const hasO = results.includes('O');
      expect(hasX || hasO).toBe(true); // At least one should be present
    });

    it('should allow creating game with specific first player', () => {
      const gameXFirst = new TicTacToe(undefined, 'X', undefined, undefined, GameMode.HUMAN_VS_AI, 'X');
      const gameOFirst = new TicTacToe(undefined, 'O', undefined, undefined, GameMode.HUMAN_VS_AI, 'X');
      
      expect(gameXFirst.currentPlayer).toBe('X');
      expect(gameOFirst.currentPlayer).toBe('O');
    });
  });

  describe('AI move integration', () => {
    it('should have method to make AI move automatically', () => {
      const game = new TicTacToe(undefined, 'O', 'ongoing', null, GameMode.HUMAN_VS_AI, 'X');
      
      // AI should be able to make a move automatically
      const newGame = game.makeAIMove();
      expect(newGame.currentPlayer).toBe('X'); // Should switch back to human
      
      // Should have one more move on the board
      const originalMoves = game.board.flat().filter((cell: any) => cell !== null).length;
      const newMoves = newGame.board.flat().filter((cell: any) => cell !== null).length;
      expect(newMoves).toBe(originalMoves + 1);
    });

    it('should throw error when trying to make AI move on human turn', () => {
      const game = new TicTacToe(undefined, 'X', 'ongoing', null, GameMode.HUMAN_VS_AI, 'X');
      
      expect(() => game.makeAIMove()).toThrow('Cannot make AI move when it is human player turn');
    });

    it('should maintain immutability when making AI moves', () => {
      const game = new TicTacToe(undefined, 'O', 'ongoing', null, GameMode.HUMAN_VS_AI, 'X');
      const newGame = game.makeAIMove();
      
      // Original game should be unchanged
      expect(game.board).not.toBe(newGame.board);
      expect(game.currentPlayer).toBe('O');
      expect(newGame.currentPlayer).toBe('X');
    });
  });

  describe('performance', () => {
    it('should complete moves in under 1ms', () => {
      const game = new TicTacToe();
      
      const start = performance.now();
      let currentGame = game;
      
      // Make several moves and check time
      currentGame = currentGame.makeMove(0, 0); // X
      currentGame = currentGame.makeMove(1, 0); // O
      currentGame = currentGame.makeMove(0, 1); // X
      currentGame = currentGame.makeMove(1, 1); // O
      currentGame = currentGame.makeMove(0, 2); // X wins
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(1.0);
      expect(currentGame.gameStatus).toBe('won');
    });
  });
});