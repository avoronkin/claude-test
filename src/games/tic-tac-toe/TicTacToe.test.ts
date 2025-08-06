import { TicTacToe, InvalidMoveError, GameCompletedError } from './TicTacToe';

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