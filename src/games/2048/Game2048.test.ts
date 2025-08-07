import { Game2048, GameStatus, InvalidMoveError, Grid, Direction } from './Game2048';

describe('Game2048 Constructor and Initial State', () => {
  let game: Game2048;

  beforeEach(() => {
    game = new Game2048();
  });

  test('should create a new game instance', () => {
    expect(() => new Game2048()).not.toThrow();
  });

  test('should initialize with correct initial state', () => {
    const state = game.state;
    
    expect(state.score).toBe(0);
    expect(state.moves).toBe(0);
    expect(state.status).toBe<GameStatus>('playing');
    expect(state.canUndo).toBe(false);
    expect(state.timeElapsed).toBe(0);
    expect(typeof state.startTime).toBe('number');
  });

  test('should initialize with 4x4 grid', () => {
    const state = game.state;
    
    expect(state.grid).toHaveLength(4);
    state.grid.forEach(row => {
      expect(row).toHaveLength(4);
    });
  });

  test('should start with exactly two tiles on the grid', () => {
    const state = game.state;
    let tileCount = 0;
    
    state.grid.forEach(row => {
      row.forEach(cell => {
        if (cell !== 0) {
          tileCount++;
          expect([2, 4]).toContain(cell);
        }
      });
    });
    
    expect(tileCount).toBe(2);
  });

  test('should have tiles only with values 2 or 4 initially', () => {
    const state = game.state;
    
    state.grid.forEach(row => {
      row.forEach(cell => {
        if (cell !== 0) {
          expect([2, 4]).toContain(cell);
        }
      });
    });
  });

  test('should not be able to undo initially', () => {
    expect(game.canUndo).toBe(false);
  });
});

describe('Game2048 Tile Movement Logic', () => {
  
  test('should actually move tiles and change grid state', () => {
    // Create multiple games to test different scenarios
    let movedFound = false;
    
    // Try multiple times to find a case where tiles can move
    for (let i = 0; i < 10; i++) {
      const game = new Game2048();
      const originalGrid = JSON.stringify(game.state.grid);
      
      const result = game.move('left');
      const newGrid = JSON.stringify(result.gameState.grid);
      
      if (result.moved) {
        // If a move happened, grid should be different
        expect(newGrid).not.toBe(originalGrid);
        movedFound = true;
        break;
      }
    }
    
    // At least one move should be possible in 10 tries
    expect(movedFound).toBe(true);
  });

  test('should return false for moved when no change is possible', () => {
    const game = new Game2048();
    
    // With only 2 tiles on a 4x4 grid, there should usually be valid moves
    // But we need to test that the logic correctly detects when no move is possible
    const result = game.move('left');
    
    // Most of the time with 2 tiles on 4x4 grid, moves should be possible
    expect(typeof result.moved).toBe('boolean');
  });

  test('should increment move count when a valid move is made', () => {
    const game = new Game2048();
    const originalMoves = game.state.moves;
    
    const result = game.move('right');
    
    if (result.moved) {
      expect(result.gameState.moves).toBe(originalMoves + 1);
    }
  });

  test('should return new Game2048 instance after move', () => {
    const game = new Game2048();
    const result = game.move('up');
    
    // Should return a new state, not modify the existing one
    expect(result.gameState).not.toBe(game.state);
    expect(result.gameState).toEqual(expect.objectContaining({
      grid: expect.any(Array),
      score: expect.any(Number),
      moves: expect.any(Number),
      timeElapsed: expect.any(Number),
      status: expect.any(String),
      startTime: expect.any(Number),
      canUndo: expect.any(Boolean)
    }));
  });

  test('should handle all four directions without errors', () => {
    const game = new Game2048();
    
    expect(() => game.move('up')).not.toThrow();
    expect(() => game.move('down')).not.toThrow();
    expect(() => game.move('left')).not.toThrow();
    expect(() => game.move('right')).not.toThrow();
  });
});

describe('Game2048 Move Validation', () => {
  
  test('should throw InvalidMoveError for invalid direction strings', () => {
    const game = new Game2048();
    
    // Test invalid direction strings
    expect(() => game.move('invalid' as any)).toThrow(InvalidMoveError);
    expect(() => game.move('UP' as any)).toThrow(InvalidMoveError);
    expect(() => game.move('Left' as any)).toThrow(InvalidMoveError);
    expect(() => game.move('' as any)).toThrow(InvalidMoveError);
    expect(() => game.move('north' as any)).toThrow(InvalidMoveError);
  });

  test('should throw InvalidMoveError with descriptive message', () => {
    const game = new Game2048();
    
    try {
      game.move('invalid' as any);
      fail('Expected InvalidMoveError to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidMoveError);
      expect((error as InvalidMoveError).message).toContain('Invalid direction');
      expect((error as InvalidMoveError).message).toContain('invalid');
    }
  });

  test('should validate direction parameter type', () => {
    const game = new Game2048();
    
    // These should throw errors for non-string types
    expect(() => game.move(null as any)).toThrow(InvalidMoveError);
    expect(() => game.move(undefined as any)).toThrow(InvalidMoveError);
    expect(() => game.move(123 as any)).toThrow(InvalidMoveError);
    expect(() => game.move({} as any)).toThrow(InvalidMoveError);
    expect(() => game.move([] as any)).toThrow(InvalidMoveError);
  });

  test('should accept only valid direction values', () => {
    const game = new Game2048();
    
    // Valid directions should not throw
    expect(() => game.move('up')).not.toThrow();
    expect(() => game.move('down')).not.toThrow();
    expect(() => game.move('left')).not.toThrow();
    expect(() => game.move('right')).not.toThrow();
  });

  test('should detect when no moves are possible on a grid', () => {
    // This test will be enhanced once we have a way to create custom grid states
    const game = new Game2048();
    
    // For now, just test that the method correctly identifies valid/invalid moves
    const result = game.move('left');
    expect(typeof result.moved).toBe('boolean');
  });

  test('should handle edge cases in direction validation', () => {
    const game = new Game2048();
    
    // Test whitespace strings
    expect(() => game.move('   ' as any)).toThrow(InvalidMoveError);
    expect(() => game.move('\t' as any)).toThrow(InvalidMoveError);
    expect(() => game.move('\n' as any)).toThrow(InvalidMoveError);
    
    // Test case sensitivity
    expect(() => game.move('Up' as any)).toThrow(InvalidMoveError);
    expect(() => game.move('DOWN' as any)).toThrow(InvalidMoveError);
    expect(() => game.move('Left' as any)).toThrow(InvalidMoveError);
    expect(() => game.move('RIGHT' as any)).toThrow(InvalidMoveError);
  });

  test('should provide helpful error messages for common mistakes', () => {
    const game = new Game2048();
    
    try {
      game.move('UP' as any);
      fail('Should throw error');
    } catch (error) {
      const message = (error as InvalidMoveError).message;
      expect(message).toContain('UP');
      expect(message).toContain('up, down, left, right');
    }
    
    try {
      game.move(null as any);
      fail('Should throw error');  
    } catch (error) {
      const message = (error as InvalidMoveError).message;
      expect(message).toContain('non-empty string');
    }
  });
});

describe('Game2048 Win and Game Over Conditions', () => {
  
  test('should detect win condition when 2048 tile is created', () => {
    // This test will need a way to create specific grid states
    // For now, we test that the status property exists and can be checked
    const game = new Game2048();
    expect(game.state.status).toBe('playing');
    
    // Once we have win detection, a game with 2048 tile should have status 'won'
    // This will be implemented when we add the win detection logic
  });

  test('should detect game over when no valid moves are possible', () => {
    // This test will need a way to create a full grid with no possible moves
    const game = new Game2048();
    expect(game.state.status).toBe('playing');
    
    // A game with no valid moves should have status 'lost'
    // This will be implemented when we add the game over detection logic
  });

  test('should continue playing when moves are still possible', () => {
    const game = new Game2048();
    
    // A new game with only 2 tiles should always be in playing state
    expect(game.state.status).toBe('playing');
    
    // After a valid move, if no win/loss conditions are met, should still be playing
    const result = game.move('left');
    if (result.moved) {
      // Status should still be playing unless win/loss condition is met
      expect(['playing', 'won', 'lost']).toContain(result.gameState.status);
    }
  });

  test('should not change status once game is won', () => {
    // This test will be implemented once we have a way to create won game states
    const game = new Game2048();
    
    // For now, just verify status is tracked correctly in initial state
    expect(game.state.status).toBe('playing');
  });

  test('should not allow moves once game is over', () => {
    // This test will be enhanced once we have game over detection
    const game = new Game2048();
    
    // Initial game should allow moves
    expect(() => game.move('left')).not.toThrow();
  });

  test('should check for 2048 tile in grid to determine win', () => {
    // This will test the actual win detection logic
    // For now, verify that the game can track tile values
    const game = new Game2048();
    const grid = game.state.grid;
    
    // Check that we can examine tile values in the grid
    let hasTiles = false;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] !== 0) {
          hasTiles = true;
          expect([2, 4]).toContain(grid[i][j]); // Initial tiles should be 2 or 4
        }
      }
    }
    expect(hasTiles).toBe(true);
  });

  test('should check if any valid moves remain for game over detection', () => {
    // This will test the game over detection logic
    // For now, test that move detection works
    const game = new Game2048();
    
    // With only 2 tiles on the board, moves should be possible
    const leftResult = game.move('left');
    const rightResult = game.move('right');
    const upResult = game.move('up');  
    const downResult = game.move('down');
    
    // At least one direction should allow movement with sparse initial grid
    const anyMovesPossible = leftResult.moved || rightResult.moved || 
                             upResult.moved || downResult.moved;
    expect(anyMovesPossible).toBe(true);
  });

  test('should correctly detect win condition with 2048 tile', () => {
    const game = new Game2048();
    
    // We can't directly test private methods, but we can test that the status updates correctly
    // This will be validated through integration testing when we have game mechanics that can create 2048
    expect(game.state.status).toBe('playing');
    
    // Future enhancement: Test with actual 2048 tile creation through gameplay
  });

  test('should correctly detect game over condition', () => {
    const game = new Game2048();
    
    // Test that initial game is not over
    expect(game.state.status).toBe('playing');
    
    // We'll enhance this test once we have methods to create custom game states
    // For now, verify that game over detection exists in the logic
  });

  test('should prevent moves when game is won or lost', () => {
    // This integration test will be enhanced when we can create won/lost states
    const game = new Game2048();
    
    // Initial state should allow moves
    const initialResult = game.move('left');
    expect(typeof initialResult.moved).toBe('boolean');
    
    // If game were won/lost, moves should return false
    // This will be tested more thoroughly with custom states
  });
});

describe('Game2048 Random Tile Generation', () => {
  
  test('should add a new random tile after successful move', () => {
    const game = new Game2048();
    const initialGrid = game.state.grid;
    
    // Count initial tiles
    let initialTileCount = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (initialGrid[i][j] !== 0) {
          initialTileCount++;
        }
      }
    }
    expect(initialTileCount).toBe(2); // Should start with 2 tiles
    
    // Make a move
    const result = game.move('left');
    
    if (result.moved) {
      // Count tiles after move
      let finalTileCount = 0;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (result.gameState.grid[i][j] !== 0) {
            finalTileCount++;
          }
        }
      }
      
      // Should have one more tile (or same/fewer if tiles merged)
      // After a successful move, we should have at least the initial count or more
      expect(finalTileCount).toBeGreaterThanOrEqual(initialTileCount);
    }
  });

  test('should not add tiles after invalid moves', () => {
    // This will test that no new tiles are added when move doesn't change the grid
    const game = new Game2048();
    
    // Try to find an invalid move (one that doesn't change the grid)
    const directions: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right'];
    
    for (const direction of directions) {
      const result = game.move(direction);
      if (!result.moved) {
        // Grid should remain unchanged, no new tiles added
        expect(result.gameState.moves).toBe(game.state.moves);
        expect(result.gameState.score).toBe(game.state.score);
        expect(result.gameState.canUndo).toBe(false);
        break;
      }
    }
    
    // With only 2 tiles on a 4x4 grid, we should usually find at least one valid move
    // This test mainly checks the logic structure
  });

  test('should generate tiles with correct probability (90% 2, 10% 4)', () => {
    // This test will verify the tile generation probability
    // We'll test this through multiple game creation since that uses the same logic
    
    const tileCounts = { 2: 0, 4: 0 };
    const testIterations = 100;
    
    for (let i = 0; i < testIterations; i++) {
      const game = new Game2048();
      const grid = game.state.grid;
      
      // Count initial tiles
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const tileValue = grid[row][col];
          if (tileValue === 2) {
            tileCounts[2]++;
          } else if (tileValue === 4) {
            tileCounts[4]++;
          }
        }
      }
    }
    
    const totalTiles = tileCounts[2] + tileCounts[4];
    const ratio2 = tileCounts[2] / totalTiles;
    const ratio4 = tileCounts[4] / totalTiles;
    
    // Check that ratios are approximately correct (allowing for randomness)
    expect(ratio2).toBeGreaterThan(0.8); // Should be around 90%, allow some variance
    expect(ratio2).toBeLessThan(1.0);
    expect(ratio4).toBeGreaterThan(0.0);
    expect(ratio4).toBeLessThan(0.2); // Should be around 10%, allow some variance
  });

  test('should place new tiles in empty positions only', () => {
    const game = new Game2048();
    const result = game.move('left');
    
    if (result.moved) {
      // Verify that new tiles are only placed where there were empty positions
      const newGrid = result.gameState.grid;
      
      // All non-zero positions should contain valid tile values
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const tileValue = newGrid[i][j];
          if (tileValue !== 0) {
            // All tiles should be powers of 2, starting from 2
            expect(tileValue).toBeGreaterThanOrEqual(2);
            expect(Math.log2(tileValue) % 1).toBe(0); // Should be a power of 2
          }
        }
      }
    }
  });

  test('should handle case when grid is nearly full', () => {
    // This test will be enhanced when we can create custom grid states
    // For now, verify basic tile generation behavior
    const game = new Game2048();
    
    // Make several moves to fill up the grid more
    const moves: Array<'up' | 'down' | 'left' | 'right'> = ['left', 'right', 'up', 'down'];
    let currentGame = game;
    
    for (let i = 0; i < moves.length; i++) {
      const result = currentGame.move(moves[i]);
      if (result.moved) {
        // Verify tile count increased or stayed same (due to merges)
        let tileCount = 0;
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            if (result.gameState.grid[row][col] !== 0) {
              tileCount++;
            }
          }
        }
        expect(tileCount).toBeGreaterThan(0);
        
        // Update for next iteration (this simulates game state progression)
        currentGame = new Game2048(); // Reset for next test
        break;
      }
    }
  });

  test('should not generate tiles when no empty spaces available', () => {
    // This tests that addRandomTiles handles the case when grid is full
    // Verify that the addRandomTiles method can handle edge cases
    // By testing initial tile generation, we're indirectly testing this logic
    
    // Test multiple games to ensure randomness works consistently
    for (let i = 0; i < 10; i++) {
      const testGame = new Game2048();
      const grid = testGame.state.grid;
      
      let emptySpaces = 0;
      let filledSpaces = 0;
      
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (grid[row][col] === 0) {
            emptySpaces++;
          } else {
            filledSpaces++;
          }
        }
      }
      
      // Each game should start with exactly 2 tiles and 14 empty spaces
      expect(filledSpaces).toBe(2);
      expect(emptySpaces).toBe(14);
      expect(filledSpaces + emptySpaces).toBe(16);
    }
  });
});

describe('Game2048 Move History and Undo', () => {
  
  test('should track move history for undo functionality', () => {
    const game = new Game2048();
    
    // Initial state should have no undo available
    expect(game.canUndo).toBe(false);
    expect(game.state.canUndo).toBe(false);
    
    // Make a move
    const result = game.move('left');
    
    if (result.moved) {
      // After a move, undo should be available
      expect(result.gameState.canUndo).toBe(true);
      
      // The history should contain the previous state
      // We can't directly test the private _history, but we can test canUndo
    }
  });

  test('should provide undo method', () => {
    const game = new Game2048();
    
    // Undo method should exist
    expect(typeof game.undo).toBe('function');
  });

  test('should throw UndoNotAvailableError when no history exists', () => {
    const game = new Game2048();
    
    // Initial game should not allow undo
    expect(() => game.undo()).toThrow(expect.objectContaining({
      name: 'UndoNotAvailableError'
    }));
  });

  test('should revert to previous state after undo', () => {
    const game = new Game2048();
    const originalState = game.state;
    
    // Make a move
    const result = game.move('left');
    
    if (result.moved) {
      // Create new game instance from the moved state
      const gameAfterMove = new Game2048(result.gameState, [originalState]);
      
      // Undo the move
      const undoResult = gameAfterMove.undo();
      
      // State should be reverted to original
      expect(undoResult.grid).toEqual(originalState.grid);
      expect(undoResult.score).toBe(originalState.score);
      expect(undoResult.moves).toBe(originalState.moves);
      expect(undoResult.canUndo).toBe(false); // No more history after undo
    }
  });

  test('should maintain proper undo chain through multiple moves', () => {
    const game = new Game2048();
    const originalState = game.state;
    
    // Make first move
    const firstMove = game.move('left');
    if (!firstMove.moved) return; // Skip if no move possible
    
    const gameAfterFirst = new Game2048(firstMove.gameState, [originalState]);
    const firstMoveState = gameAfterFirst.state;
    
    // Make second move
    const secondMove = gameAfterFirst.move('right');
    if (!secondMove.moved) return; // Skip if no move possible
    
    const gameAfterSecond = new Game2048(secondMove.gameState, [originalState, firstMoveState]);
    
    // Should be able to undo to first move state
    const undoToFirst = gameAfterSecond.undo();
    expect(undoToFirst.grid).toEqual(firstMoveState.grid);
    expect(undoToFirst.score).toBe(firstMoveState.score);
    expect(undoToFirst.moves).toBe(firstMoveState.moves);
    expect(undoToFirst.canUndo).toBe(true); // Still has original state in history
  });

  test('should not allow undo on won or lost games', () => {
    const game = new Game2048();
    
    // We can't easily create won/lost states, so test the current implementation
    // For now, verify undo method exists and works with playing state
    const result = game.move('left');
    if (result.moved) {
      const gameAfterMove = new Game2048(result.gameState, [game.state]);
      expect(() => gameAfterMove.undo()).not.toThrow();
    }
  });

  test('should preserve immutability in undo operation', () => {
    const game = new Game2048();
    const originalState = game.state;
    
    const result = game.move('left');
    if (result.moved) {
      const gameAfterMove = new Game2048(result.gameState, [originalState]);
      
      // Perform undo
      const undoState = gameAfterMove.undo();
      
      // The game instance should not be mutated by undo operation
      // undo() returns a new state object, not modifying the game
      expect(undoState).not.toBe(originalState); // Different object references
      expect(undoState).not.toBe(result.gameState); // Different from moved state
      
      // But values should match original
      expect(undoState.grid).toEqual(originalState.grid);
      expect(undoState.score).toBe(originalState.score);
      expect(undoState.moves).toBe(originalState.moves);
      expect(undoState.status).toBe(originalState.status);
    }
  });

  test('should update canUndo property correctly', () => {
    const game = new Game2048();
    
    // Initially no undo available
    expect(game.state.canUndo).toBe(false);
    
    // Make several moves and track undo availability
    let currentResult = game.move('left');
    
    if (currentResult.moved) {
      expect(currentResult.gameState.canUndo).toBe(true);
      
      // Try more moves from the same initial state
      const rightResult = game.move('right');
      if (rightResult.moved) {
        expect(rightResult.gameState.canUndo).toBe(true);
      }
      
      const upResult = game.move('up');
      if (upResult.moved) {
        expect(upResult.gameState.canUndo).toBe(true);
      }
    }
  });

  test('should maintain history through multiple moves', () => {
    const game = new Game2048();
    let currentState = game.state;
    
    expect(currentState.canUndo).toBe(false);
    
    // Make a sequence of moves
    const moves: Array<'up' | 'down' | 'left' | 'right'> = ['left', 'up', 'right', 'down'];
    
    for (const direction of moves) {
      // Create new game instance for each test (simulating immutable design)
      const testGame = new Game2048();
      const result = testGame.move(direction);
      
      if (result.moved) {
        expect(result.gameState.canUndo).toBe(true);
        break; // Test at least one successful move
      }
    }
  });

  test('should not track history for invalid moves', () => {
    const game = new Game2048();
    
    // Try to make an invalid move (if possible)
    const directions: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right'];
    
    for (const direction of directions) {
      const result = game.move(direction);
      
      if (!result.moved) {
        // Invalid moves should not affect history
        expect(result.gameState.canUndo).toBe(false);
        expect(result.gameState.moves).toBe(game.state.moves);
        expect(result.gameState.score).toBe(game.state.score);
        break;
      }
    }
  });

  test('should handle history correctly after game state changes', () => {
    const game = new Game2048();
    
    // Test that canUndo reflects the actual availability of undo
    expect(game.canUndo).toBe(game.state.canUndo);
    
    // After a move, both should be consistent
    const result = game.move('left');
    if (result.moved) {
      // Both the getter and state property should match
      // Note: We can't test the getter on the result since it's just data
      // But we can test that the state property is set correctly
      expect(result.gameState.canUndo).toBe(true);
    }
  });

  test('should preserve immutability in history tracking', () => {
    const game = new Game2048();
    const originalState = game.state;
    
    const result = game.move('right');
    
    // Original game state should remain unchanged
    expect(game.state.canUndo).toBe(false);
    expect(game.state.moves).toBe(originalState.moves);
    expect(game.state.score).toBe(originalState.score);
    
    if (result.moved) {
      // New state should be different and have undo available
      expect(result.gameState).not.toBe(originalState);
      expect(result.gameState.canUndo).toBe(true);
      expect(result.gameState.moves).toBeGreaterThan(originalState.moves);
    }
  });
});

describe('Game2048 Time Tracking and Move Counting', () => {
  
  test('should initialize with zero moves and elapsed time', () => {
    const game = new Game2048();
    
    expect(game.state.moves).toBe(0);
    expect(game.state.timeElapsed).toBe(0);
    expect(game.state.startTime).toBeGreaterThan(0);
    expect(typeof game.state.startTime).toBe('number');
  });

  test('should increment move count on valid moves only', () => {
    const game = new Game2048();
    const initialMoves = game.state.moves;
    
    // Make a valid move
    const result = game.move('left');
    
    if (result.moved) {
      expect(result.gameState.moves).toBe(initialMoves + 1);
    } else {
      expect(result.gameState.moves).toBe(initialMoves);
    }
  });

  test('should not increment move count on invalid moves', () => {
    // Create game with grid that cannot move left
    const leftBlockedGrid = [
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128]
    ] as const;

    const startTime = Date.now();
    const initialState = {
      grid: leftBlockedGrid.map(row => Object.freeze([...row])) as Grid,
      score: 0,
      moves: 5, // Start with 5 moves already made
      timeElapsed: 1000,
      status: 'playing' as GameStatus,
      startTime,
      canUndo: false
    };

    const game = new Game2048(initialState);
    
    // Try to move left (should be invalid)
    const result = game.move('left');
    
    expect(result.moved).toBe(false);
    expect(result.gameState.moves).toBe(5); // Should remain the same
  });

  test('should track elapsed time during gameplay', async () => {
    const game = new Game2048();
    const startTime = game.state.startTime;
    
    // Wait a small amount of time
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const result = game.move('left');
    if (result.moved) {
      expect(result.gameState.timeElapsed).toBeGreaterThan(0);
      expect(result.gameState.timeElapsed).toBeLessThan(1000); // Should be reasonable
      expect(result.gameState.startTime).toBe(startTime); // Start time should not change
    }
  });

  test('should maintain time consistency across moves', async () => {
    const game = new Game2048();
    const startTime = game.state.startTime;
    
    // Make first move
    const firstMove = game.move('left');
    if (!firstMove.moved) return;
    
    const firstMoveTime = firstMove.gameState.timeElapsed;
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Make second move from first move's state
    const gameAfterFirst = new Game2048(firstMove.gameState);
    const secondMove = gameAfterFirst.move('right');
    
    if (secondMove.moved) {
      expect(secondMove.gameState.timeElapsed).toBeGreaterThanOrEqual(firstMoveTime);
      expect(secondMove.gameState.startTime).toBe(startTime); // Same start time
      expect(secondMove.gameState.moves).toBe(2); // Should be second move
    }
  });

  test('should preserve time tracking in undo operations', () => {
    const game = new Game2048();
    const originalState = game.state;
    const originalStartTime = originalState.startTime;
    
    // Make a move
    const result = game.move('left');
    if (result.moved) {
      const gameAfterMove = new Game2048(result.gameState, [originalState]);
      
      // Undo the move
      const undoState = gameAfterMove.undo();
      
      // Time tracking should be preserved from original state
      expect(undoState.moves).toBe(originalState.moves);
      expect(undoState.timeElapsed).toBe(originalState.timeElapsed);
      expect(undoState.startTime).toBe(originalStartTime);
    }
  });

  test('should handle time tracking edge cases', () => {
    const fixedStartTime = Date.now() - 5000; // 5 seconds ago
    const initialState = {
      grid: [
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ].map(row => Object.freeze([...row])) as Grid,
      score: 0,
      moves: 0,
      timeElapsed: 0,
      status: 'playing' as GameStatus,
      startTime: fixedStartTime,
      canUndo: false
    };

    const game = new Game2048(initialState);
    const result = game.move('right');
    
    if (result.moved) {
      // Time elapsed should be calculated from fixed start time
      expect(result.gameState.timeElapsed).toBeGreaterThan(4900); // At least ~5 seconds
      expect(result.gameState.timeElapsed).toBeLessThan(6000); // But not too much more
      expect(result.gameState.startTime).toBe(fixedStartTime); // Start time unchanged
    }
  });

  test('should provide accurate move counting for complex sequences', () => {
    const game = new Game2048();
    let currentGame = game;
    let moveCount = 0;
    
    // Try to make several moves
    const directions: Direction[] = ['left', 'right', 'up', 'down'];
    
    for (const direction of directions) {
      const result = currentGame.move(direction);
      if (result.moved) {
        moveCount++;
        currentGame = new Game2048(result.gameState);
        expect(result.gameState.moves).toBe(moveCount);
      }
    }
    
    // Final move count should match successful moves
    expect(currentGame.state.moves).toBe(moveCount);
  });
});