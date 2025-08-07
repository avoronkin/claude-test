// Import the TicTacToe game class
import { TicTacToe, Player, GameStatus, GameMode } from '../TicTacToe';

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

// Game state
let currentGame: TicTacToe;

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
    // Initialize game
    initGame();
    
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