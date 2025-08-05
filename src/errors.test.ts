import { RPSError, InvalidMoveError } from './errors';

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