// Import the TicTacToe game class
import { TicTacToe, Player, GameStatus, GameMode, GameStatistics } from '../TicTacToe';

// DOM element references
const boardElement = document.getElementById('board') as HTMLElement;
const cells = document.querySelectorAll<HTMLButtonElement>('.cell');
const playerIndicator = document.getElementById('player-indicator') as HTMLElement;
const gameMessage = document.getElementById('game-message') as HTMLElement;
const newGameBtn = document.getElementById('new-game-btn') as HTMLButtonElement;
const resultArea = document.querySelector('.game-result') as HTMLElement;
const resultTitle = document.getElementById('result-title') as HTMLElement;
const resultMessage = document.getElementById('result-message') as HTMLElement;
const sideSelectionInputs = document.querySelectorAll<HTMLInputElement>('input[name="player-side"]');
const resetStatsBtn = document.getElementById('reset-stats-btn') as HTMLButtonElement;

// Statistics display elements
const statGamesPlayed = document.getElementById('stat-games-played') as HTMLElement;
const statHumanWins = document.getElementById('stat-human-wins') as HTMLElement;
const statAIWins = document.getElementById('stat-ai-wins') as HTMLElement;
const statDraws = document.getElementById('stat-draws') as HTMLElement;
const statWinRate = document.getElementById('stat-win-rate') as HTMLElement;

// Statistics Manager Class
class StatisticsManager {
    private readonly storageKey = 'tic-tac-toe-ai-stats';
    
    /**
     * Get current statistics from local storage
     */
    getStats(): GameStatistics {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const stats = JSON.parse(stored);
                // Recalculate win rate to ensure accuracy
                stats.winRate = stats.gamesPlayed > 0 ? (stats.humanWins / stats.gamesPlayed) * 100 : 0;
                return stats;
            }
        } catch (error) {
            console.warn('Failed to load statistics:', error);
        }
        
        // Return default statistics
        return {
            gamesPlayed: 0,
            humanWins: 0,
            aiWins: 0,
            draws: 0,
            winRate: 0
        };
    }
    
    /**
     * Record a game result and update statistics
     */
    recordGameResult(result: 'human_win' | 'ai_win' | 'draw'): void {
        const stats = this.getStats();
        
        stats.gamesPlayed++;
        
        switch (result) {
            case 'human_win':
                stats.humanWins++;
                break;
            case 'ai_win':
                stats.aiWins++;
                break;
            case 'draw':
                stats.draws++;
                break;
        }
        
        stats.winRate = (stats.humanWins / stats.gamesPlayed) * 100;
        
        this.saveStats(stats);
    }
    
    /**
     * Reset all statistics
     */
    resetStats(): void {
        const defaultStats: GameStatistics = {
            gamesPlayed: 0,
            humanWins: 0,
            aiWins: 0,
            draws: 0,
            winRate: 0
        };
        
        this.saveStats(defaultStats);
    }
    
    /**
     * Save statistics to local storage
     */
    private saveStats(stats: GameStatistics): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(stats));
        } catch (error) {
            console.warn('Failed to save statistics:', error);
        }
    }
}

// Game state
let currentGame: TicTacToe;
let statisticsManager: StatisticsManager;

/**
 * Initialize a new game with AI opponent
 */
function initGame(): void {
    // Get selected player side
    const selectedSide = getSelectedPlayerSide();
    
    // Determine who goes first randomly
    const firstPlayer = Math.random() < 0.5 ? 'X' : 'O';
    
    // Create new AI game
    currentGame = new TicTacToe(undefined, firstPlayer, undefined, undefined, GameMode.HUMAN_VS_AI, selectedSide);
    
    updateDisplay();
    enableBoard();
    hideResult();
    
    // If AI goes first, make AI move after short delay
    if (currentGame.isAITurn) {
        setTimeout(() => {
            makeAIMove();
        }, 500);
    }
}

/**
 * Get the selected player side from radio buttons
 */
function getSelectedPlayerSide(): Player {
    const checkedInput = document.querySelector<HTMLInputElement>('input[name="player-side"]:checked');
    return (checkedInput?.value as Player) || 'X';
}

/**
 * Update statistics display on page
 */
function updateStatisticsDisplay(): void {
    const stats = statisticsManager.getStats();
    
    statGamesPlayed.textContent = stats.gamesPlayed.toString();
    statHumanWins.textContent = stats.humanWins.toString();
    statAIWins.textContent = stats.aiWins.toString();
    statDraws.textContent = stats.draws.toString();
    statWinRate.textContent = `${stats.winRate.toFixed(1)}%`;
}

/**
 * Record game completion and update statistics
 */
function recordGameCompletion(): void {
    if (currentGame.gameStatus === 'won') {
        const winner = currentGame.winner;
        const humanSide = currentGame.humanPlayerSide;
        
        if (winner === humanSide) {
            statisticsManager.recordGameResult('human_win');
        } else {
            statisticsManager.recordGameResult('ai_win');
        }
    } else if (currentGame.gameStatus === 'draw') {
        statisticsManager.recordGameResult('draw');
    }
    
    updateStatisticsDisplay();
}

/**
 * Make AI move with visual feedback
 */
async function makeAIMove(): Promise<void> {
    if (!currentGame.isAITurn || currentGame.gameStatus !== 'ongoing') {
        return;
    }
    
    // Show thinking message
    updateDisplay();
    
    // Add delay for UX (between 100-500ms as specified)
    const delay = 200 + Math.random() * 300; // Random delay between 200-500ms
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
        // Make AI move
        currentGame = currentGame.makeAIMove();
        
        // Update display with new game state
        updateDisplay();
        
        // If game is still ongoing and it's still AI turn (shouldn't happen), make another move
        if (currentGame.isAITurn && currentGame.gameStatus === 'ongoing') {
            setTimeout(() => makeAIMove(), 300);
        }
    } catch (error) {
        console.error('Error making AI move:', error);
    }
}

/**
 * Update the game display with current state
 */
function updateDisplay(): void {
    // Update player indicator
    const player = currentGame.currentPlayer;
    playerIndicator.textContent = player;
    playerIndicator.className = player === 'X' ? '' : 'player-o';
    
    // Update board display
    const board = currentGame.board;
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const cellValue = board[row][col];
        
        // Update cell content
        cell.textContent = cellValue || '';
        
        // Update cell classes
        cell.className = 'cell';
        if (cellValue === 'X') {
            cell.classList.add('x');
        } else if (cellValue === 'O') {
            cell.classList.add('o');
        }
        
        // Disable occupied cells
        cell.disabled = cellValue !== null;
    });
    
    // Update game message based on status
    updateGameMessage();
}

/**
 * Update the game status message
 */
function updateGameMessage(): void {
    const status = currentGame.gameStatus;
    const player = currentGame.currentPlayer;
    const isAITurn = currentGame.isAITurn;
    const humanSide = currentGame.humanPlayerSide;
    
    switch (status) {
        case 'ongoing':
            if (isAITurn) {
                gameMessage.textContent = 'Ход компьютера...';
            } else {
                gameMessage.textContent = `Your turn (${player}) - Click any empty cell to make your move`;
            }
            break;
        case 'won':
            const winner = currentGame.winner;
            if (winner === humanSide) {
                gameMessage.textContent = `Congratulations! You won! 🎉`;
            } else {
                gameMessage.textContent = `Computer wins! Better luck next time.`;
            }
            showResult(status, winner);
            break;
        case 'draw':
            gameMessage.textContent = 'It\'s a draw! Good game!';
            showResult(status, null);
            break;
    }
}

/**
 * Show the game result
 */
function showResult(status: GameStatus, winner: Player | null): void {
    resultArea.classList.remove('hidden');
    
    if (status === 'won' && winner) {
        resultTitle.textContent = 'Game Over!';
        resultMessage.textContent = `Player ${winner} wins! 🎉`;
        resultMessage.className = `winner-${winner.toLowerCase()}`;
        
        // Highlight winning combination
        highlightWinningCells();
    } else if (status === 'draw') {
        resultTitle.textContent = 'Game Over!';
        resultMessage.textContent = 'It\'s a draw! 🤝';
        resultMessage.className = 'draw';
    }
    
    // Record game completion for statistics
    recordGameCompletion();
    
    disableBoard();
}

/**
 * Hide the game result
 */
function hideResult(): void {
    resultArea.classList.add('hidden');
    resultMessage.className = '';
}

/**
 * Highlight the winning combination of cells
 */
function highlightWinningCells(): void {
    const board = currentGame.board;
    const winner = currentGame.winner;
    
    if (!winner) return;
    
    // Check all possible winning combinations
    const winningCombinations = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonals
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];
    
    for (const combination of winningCombinations) {
        const isWinning = combination.every(([row, col]) => board[row][col] === winner);
        
        if (isWinning) {
            // Highlight the winning cells
            combination.forEach(([row, col]) => {
                const cellIndex = row * 3 + col;
                const cell = cells[cellIndex];
                cell.classList.add('winning');
            });
            break;
        }
    }
}

/**
 * Handle cell click events
 */
function handleCellClick(event: Event): void {
    const target = event.target as HTMLButtonElement;
    const row = parseInt(target.dataset.row || '0');
    const col = parseInt(target.dataset.col || '0');
    
    try {
        // Only allow moves when it's human player's turn
        if (currentGame.isAITurn) {
            return; // Ignore clicks during AI turn
        }
        
        // Make the move
        currentGame = currentGame.makeMove(row, col);
        
        // Update the display
        updateDisplay();
        
        // Add click animation
        target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            target.style.transform = '';
        }, 100);
        
        // If game is still ongoing and it's AI's turn, make AI move
        if (currentGame.gameStatus === 'ongoing' && currentGame.isAITurn) {
            setTimeout(() => {
                makeAIMove();
            }, 300);
        }
        
    } catch (error) {
        // Handle invalid moves
        console.warn('Invalid move:', error);
        
        // Visual feedback for invalid move
        target.style.backgroundColor = '#fed7d7';
        setTimeout(() => {
            target.style.backgroundColor = '';
        }, 200);
    }
}

/**
 * Enable board interaction
 */
function enableBoard(): void {
    cells.forEach(cell => {
        if (!cell.textContent) {
            cell.disabled = false;
        }
    });
}

/**
 * Disable board interaction
 */
function disableBoard(): void {
    cells.forEach(cell => {
        cell.disabled = true;
    });
}

/**
 * Handle keyboard navigation for accessibility
 */
function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        (event.target as HTMLButtonElement).click();
    }
}

/**
 * Initialize the demo when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize statistics manager
    statisticsManager = new StatisticsManager();
    
    // Initialize game and statistics display
    initGame();
    updateStatisticsDisplay();
    
    // Add event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('keydown', handleKeyDown);
    });
    
    newGameBtn.addEventListener('click', initGame);
    newGameBtn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            initGame();
        }
    });
    
    // Add event listeners for side selection
    sideSelectionInputs.forEach(input => {
        input.addEventListener('change', initGame);
    });
    
    // Add event listener for statistics reset
    resetStatsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all statistics?')) {
            statisticsManager.resetStats();
            updateStatisticsDisplay();
        }
    });
    
    // Focus management for accessibility
    boardElement.addEventListener('keydown', (event) => {
        const focusedCell = document.activeElement as HTMLButtonElement;
        const focusedIndex = Array.from(cells).indexOf(focusedCell);
        
        if (focusedIndex === -1) return;
        
        let newIndex = focusedIndex;
        
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                newIndex = focusedIndex - 3;
                break;
            case 'ArrowDown':
                event.preventDefault();
                newIndex = focusedIndex + 3;
                break;
            case 'ArrowLeft':
                event.preventDefault();
                newIndex = focusedIndex - 1;
                break;
            case 'ArrowRight':
                event.preventDefault();
                newIndex = focusedIndex + 1;
                break;
        }
        
        // Wrap around and focus new cell
        if (newIndex >= 0 && newIndex < cells.length) {
            cells[newIndex].focus();
        }
    });
    
    // Set initial focus to center cell for better UX
    cells[4].focus();
});

// Export for potential external use
export { initGame };