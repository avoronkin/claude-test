import { Game2048, type GameState as Game2048State, type Direction, type MoveResult } from '../Game2048';
import './style.css';

console.log('🎮 2048 TypeScript Demo loaded');

// Game instance and state
let game: Game2048;

// DOM element references with proper typing
const gameBoard = document.getElementById('game-board') as HTMLElement;
const newGameBtn = document.getElementById('new-game-btn') as HTMLButtonElement;
const undoBtn = document.getElementById('undo-btn') as HTMLButtonElement;
const scoreDisplay = document.getElementById('score-display') as HTMLElement;
const movesDisplay = document.getElementById('moves-display') as HTMLElement;
const timeDisplay = document.getElementById('time-display') as HTMLElement;
const statusMessage = document.getElementById('status-message') as HTMLElement;

// Game state interface for demo
interface DemoGameState {
    isPlaying: boolean;
    gameInstance: Game2048;
    lastMoveTime: number;
    timeUpdateInterval: number | null;
}

let demoState: DemoGameState = {
    isPlaying: false,
    gameInstance: new Game2048(),
    lastMoveTime: Date.now(),
    timeUpdateInterval: null
};

// Direction mapping for keyboard controls
const keyDirectionMap: Record<string, Direction> = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right'
} as const;

/**
 * Initialize a new game
 */
function initializeGame(): void {
    game = new Game2048();
    demoState.gameInstance = game;
    demoState.isPlaying = true;
    demoState.lastMoveTime = Date.now();
    
    updateDisplay();
    updateControls();
    startTimeUpdates();
    hideStatusMessage();
    
    console.log('🎲 New 2048 game started');
}

/**
 * Update the visual display of the game board and stats
 */
function updateDisplay(): void {
    const state = demoState.gameInstance.state;
    
    // Update game board
    updateGameBoard(state.grid);
    
    // Update stats
    scoreDisplay.textContent = state.score.toString();
    movesDisplay.textContent = state.moves.toString();
    updateTimeDisplay(state.timeElapsed);
}

/**
 * Update the game board visual representation
 */
function updateGameBoard(grid: Game2048State['grid']): void {
    const cells = gameBoard.querySelectorAll('.grid-cell');
    
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const value = grid[row][col];
        
        // Clear existing classes
        cell.className = 'grid-cell';
        cell.textContent = '';
        
        if (value > 0) {
            cell.classList.add('tile', `tile-${value}`);
            cell.textContent = value.toString();
            
            // Add animation for new tiles
            if (cell.classList.contains('new-tile')) {
                cell.classList.remove('new-tile');
            }
        }
    });
}

/**
 * Update the time display
 */
function updateTimeDisplay(timeElapsed: number): void {
    const minutes = Math.floor(timeElapsed / 60000);
    const seconds = Math.floor((timeElapsed % 60000) / 1000);
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Start the time update interval
 */
function startTimeUpdates(): void {
    if (demoState.timeUpdateInterval) {
        clearInterval(demoState.timeUpdateInterval);
    }
    
    demoState.timeUpdateInterval = window.setInterval(() => {
        if (demoState.isPlaying && demoState.gameInstance.state.status === 'playing') {
            const state = demoState.gameInstance.state;
            updateTimeDisplay(state.timeElapsed);
        }
    }, 1000);
}

/**
 * Stop the time update interval
 */
function stopTimeUpdates(): void {
    if (demoState.timeUpdateInterval) {
        clearInterval(demoState.timeUpdateInterval);
        demoState.timeUpdateInterval = null;
    }
}

/**
 * Update control button states
 */
function updateControls(): void {
    const canUndo = demoState.gameInstance.canUndo;
    undoBtn.disabled = !canUndo;
    undoBtn.setAttribute('aria-label', canUndo ? 'Undo Last Move' : 'No moves to undo');
}

/**
 * Handle a move in the specified direction
 */
function makeMove(direction: Direction): void {
    if (!demoState.isPlaying) return;
    
    try {
        const result: MoveResult = demoState.gameInstance.move(direction);
        
        if (result.moved) {
            // Update game instance with new state
            demoState.gameInstance = new Game2048(result.gameState, [demoState.gameInstance.state]);
            
            // Update display
            updateDisplay();
            updateControls();
            
            // Check for game end conditions
            if (result.gameState.status === 'won') {
                handleGameWon();
            } else if (result.gameState.status === 'lost') {
                handleGameLost();
            }
            
            console.log(`🎯 Move ${direction}: +${result.pointsScored} points, Total: ${result.gameState.score}`);
        } else {
            console.log(`❌ Invalid move: ${direction}`);
        }
    } catch (error) {
        console.error('🚨 Move error:', error);
    }
}

/**
 * Handle undo operation
 */
function handleUndo(): void {
    if (!demoState.isPlaying || !demoState.gameInstance.canUndo) return;
    
    try {
        const previousState = demoState.gameInstance.undo();
        demoState.gameInstance = new Game2048(previousState);
        
        updateDisplay();
        updateControls();
        hideStatusMessage();
        
        // Resume playing if game was ended
        if (demoState.gameInstance.state.status === 'playing') {
            demoState.isPlaying = true;
            startTimeUpdates();
        }
        
        console.log('↩️ Move undone');
    } catch (error) {
        console.error('🚨 Undo error:', error);
    }
}

/**
 * Handle game won state
 */
function handleGameWon(): void {
    demoState.isPlaying = false;
    stopTimeUpdates();
    showStatusMessage('🎉 You won! You reached 2048!', 'won');
    console.log('🏆 Game won!');
}

/**
 * Handle game lost state
 */
function handleGameLost(): void {
    demoState.isPlaying = false;
    stopTimeUpdates();
    showStatusMessage('💀 Game Over! No more moves available.', 'lost');
    console.log('💀 Game lost!');
}

/**
 * Show status message
 */
function showStatusMessage(message: string, type: 'won' | 'lost'): void {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.setAttribute('aria-live', 'assertive');
}

/**
 * Hide status message
 */
function hideStatusMessage(): void {
    statusMessage.classList.add('hidden');
    statusMessage.setAttribute('aria-live', 'polite');
}

/**
 * Handle keyboard input for game controls
 */
function handleKeyDown(event: KeyboardEvent): void {
    const direction = keyDirectionMap[event.key];
    
    if (direction) {
        event.preventDefault();
        makeMove(direction);
    } else if (event.key === 'u' || event.key === 'U') {
        event.preventDefault();
        handleUndo();
    } else if (event.key === 'n' || event.key === 'N') {
        event.preventDefault();
        initializeGame();
    }
}

/**
 * Set up event listeners
 */
function setupEventListeners(): void {
    // New game button
    newGameBtn.addEventListener('click', initializeGame);
    newGameBtn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            initializeGame();
        }
    });
    
    // Undo button
    undoBtn.addEventListener('click', handleUndo);
    undoBtn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleUndo();
        }
    });
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    
    // Game board focus management
    gameBoard.addEventListener('click', () => {
        gameBoard.focus();
    });
    
    // Touch/swipe support for mobile (basic implementation)
    let touchStartX = 0;
    let touchStartY = 0;
    
    gameBoard.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });
    
    gameBoard.addEventListener('touchend', (event) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        const minSwipeDistance = 30;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (Math.abs(diffX) > minSwipeDistance) {
                makeMove(diffX > 0 ? 'left' : 'right');
            }
        } else {
            // Vertical swipe
            if (Math.abs(diffY) > minSwipeDistance) {
                makeMove(diffY > 0 ? 'up' : 'down');
            }
        }
        
        touchStartX = 0;
        touchStartY = 0;
    }, { passive: true });
}

/**
 * Initialize the demo when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing 2048 demo...');
    
    setupEventListeners();
    initializeGame();
    
    // Focus the game board for immediate keyboard interaction
    gameBoard.focus();
    
    console.log('✅ 2048 demo ready!');
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    stopTimeUpdates();
});