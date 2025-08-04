import { TicTacToe } from '../src/TicTacToe';

describe('TicTacToe', () => {
  describe('constructor', () => {
    it('should create a new game with empty board', () => {
      const game = new TicTacToe();
      
      expect(game.getCurrentPlayer()).toBe('X');
      expect(game.getGameStatus()).toBe('in-progress');
      expect(game.getWinner()).toBeNull();
      
      // Check empty board
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(game.getCellState(row, col)).toBeNull();
        }
      }
    });
  });

  describe('makeMove', () => {
    it('should place X on first move', () => {
      const game = new TicTacToe();
      const newGame = game.makeMove(0, 0);
      
      expect(newGame.getCellState(0, 0)).toBe('X');
      expect(newGame.getCurrentPlayer()).toBe('O');
      expect(newGame.getGameStatus()).toBe('in-progress');
    });

    it('should alternate players', () => {
      const game = new TicTacToe();
      const game1 = game.makeMove(0, 0);
      const game2 = game1.makeMove(0, 1);
      
      expect(game2.getCellState(0, 0)).toBe('X');
      expect(game2.getCellState(0, 1)).toBe('O');
      expect(game2.getCurrentPlayer()).toBe('X');
    });

    it('should throw error for occupied cell', () => {
      const game = new TicTacToe();
      const game1 = game.makeMove(0, 0);
      
      expect(() => game1.makeMove(0, 0)).toThrow('Cell is already occupied');
    });

    it('should throw error for out of bounds move', () => {
      const game = new TicTacToe();
      
      expect(() => game.makeMove(-1, 0)).toThrow('Move is out of bounds');
      expect(() => game.makeMove(0, -1)).toThrow('Move is out of bounds');
      expect(() => game.makeMove(3, 0)).toThrow('Move is out of bounds');
      expect(() => game.makeMove(0, 3)).toThrow('Move is out of bounds');
    });
  });

  describe('win detection', () => {
    it('should detect horizontal win', () => {
      let game = new TicTacToe();
      game = game.makeMove(0, 0); // X
      game = game.makeMove(1, 0); // O
      game = game.makeMove(0, 1); // X
      game = game.makeMove(1, 1); // O
      game = game.makeMove(0, 2); // X wins
      
      expect(game.getGameStatus()).toBe('won');
      expect(game.getWinner()).toBe('X');
    });

    it('should detect vertical win', () => {
      let game = new TicTacToe();
      game = game.makeMove(0, 0); // X
      game = game.makeMove(0, 1); // O
      game = game.makeMove(1, 0); // X
      game = game.makeMove(0, 2); // O
      game = game.makeMove(2, 0); // X wins
      
      expect(game.getGameStatus()).toBe('won');
      expect(game.getWinner()).toBe('X');
    });

    it('should detect diagonal win', () => {
      let game = new TicTacToe();
      game = game.makeMove(0, 0); // X
      game = game.makeMove(0, 1); // O
      game = game.makeMove(1, 1); // X
      game = game.makeMove(0, 2); // O
      game = game.makeMove(2, 2); // X wins
      
      expect(game.getGameStatus()).toBe('won');
      expect(game.getWinner()).toBe('X');
    });

    it('should detect anti-diagonal win', () => {
      let game = new TicTacToe();
      game = game.makeMove(0, 2); // X
      game = game.makeMove(0, 0); // O
      game = game.makeMove(1, 1); // X
      game = game.makeMove(0, 1); // O
      game = game.makeMove(2, 0); // X wins
      
      expect(game.getGameStatus()).toBe('won');
      expect(game.getWinner()).toBe('X');
    });

    it('should prevent moves after game ends', () => {
      let game = new TicTacToe();
      game = game.makeMove(0, 0); // X
      game = game.makeMove(1, 0); // O
      game = game.makeMove(0, 1); // X
      game = game.makeMove(1, 1); // O
      game = game.makeMove(0, 2); // X wins
      
      expect(() => game.makeMove(2, 2)).toThrow('Game has already ended');
    });
  });

  describe('draw detection', () => {
    it('should detect draw when board is full with no winner', () => {
      let game = new TicTacToe();
      // Create a draw scenario
      game = game.makeMove(0, 0); // X
      game = game.makeMove(0, 1); // O
      game = game.makeMove(0, 2); // X
      game = game.makeMove(1, 1); // O
      game = game.makeMove(1, 0); // X
      game = game.makeMove(2, 0); // O
      game = game.makeMove(1, 2); // X
      game = game.makeMove(2, 2); // O
      game = game.makeMove(2, 1); // X
      
      expect(game.getGameStatus()).toBe('draw');
      expect(game.getWinner()).toBeNull();
    });
  });
});