import { TicTacToe, Player, GameStatus, Cell, TicTacToeError, InvalidMoveError, GameEndedError } from '../src/index';

describe('Index exports', () => {
  it('should export TicTacToe class', () => {
    expect(TicTacToe).toBeDefined();
    const game = new TicTacToe();
    expect(game).toBeInstanceOf(TicTacToe);
  });

  it('should export all types', () => {
    const player: Player = 'X';
    const status: GameStatus = 'in-progress';
    const cell: Cell = null;
    
    expect(player).toBe('X');
    expect(status).toBe('in-progress');
    expect(cell).toBeNull();
  });

  it('should export error classes', () => {
    expect(TicTacToeError).toBeDefined();
    expect(InvalidMoveError).toBeDefined();
    expect(GameEndedError).toBeDefined();
    
    const error = new TicTacToeError('test');
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('test');
  });
});