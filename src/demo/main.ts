import { RockPaperScissors, type RPSGameResult, type RPSMove } from '../index';
import './style.css';

console.log('🎮 TypeScript Demo loaded');

// Game instance and state
let game: RockPaperScissors;

// DOM element references with proper typing
const moveButtons = document.querySelectorAll<HTMLButtonElement>('.move-btn');
const playAgainBtn = document.getElementById('play-again-btn') as HTMLButtonElement;
const resultArea = document.getElementById('result-area') as HTMLElement;
const initialMessage = document.getElementById('initial-message') as HTMLElement;
const resultText = document.getElementById('result-text') as HTMLElement;
const resultExplanation = document.getElementById('result-explanation') as HTMLElement;
const playerMoveIcon = document.getElementById('player-move-icon') as HTMLElement;
const playerMoveText = document.getElementById('player-move-text') as HTMLElement;
const computerMoveIcon = document.getElementById('computer-move-icon') as HTMLElement;
const computerMoveText = document.getElementById('computer-move-text') as HTMLElement;

// Move icons mapping with proper typing
const moveIcons: Record<RPSMove, string> = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
} as const;

// Game state interface
interface GameState {
    isPlaying: boolean;
    currentResult: RPSGameResult | null;
}

const gameState: GameState = {
    isPlaying: false,
    currentResult: null
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing TypeScript demo');
    initializeGame();
});

/**
 * Initialize the game instance and setup event listeners
 */
function initializeGame(): void {
    try {
        console.log('🎯 Creating RockPaperScissors instance');
        game = new RockPaperScissors();
        console.log('✅ Game instance created successfully');
        
        setupEventListeners();
        updateUI();
        
        console.log('🎧 TypeScript demo initialization complete');
    } catch (error) {
        console.error('❌ Error initializing game:', error);
        handleError(error as Error);
    }
}

/**
 * Setup all event listeners for the game
 */
function setupEventListeners(): void {
    console.log('🔗 Setting up event listeners');
    
    // Add click handlers for move buttons
    moveButtons.forEach((button, index) => {
        const move = button.dataset.move as RPSMove;
        console.log(`🎯 Setting up button ${index}: ${move}`);
        
        button.addEventListener('click', () => {
            if (!gameState.isPlaying) {
                playGame(move);
            }
        });
        
        // Add keyboard support
        button.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (!gameState.isPlaying) {
                    playGame(move);
                }
            }
        });
    });

    // Add click handler for play again button
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', resetGame);
        playAgainBtn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                resetGame();
            }
        });
        console.log('🔄 Play again button listeners added');
    }
}

/**
 * Play a game round with the specified player move
 */
function playGame(playerMove: RPSMove): void {
    try {
        console.log('🎲 Playing game with move:', playerMove);
        
        // Clear previous game result immediately when starting new game
        clearPreviousGameResult();
        
        // Clear previous selection before starting new game
        clearButtonSelection();
        
        gameState.isPlaying = true;
        updateButtonStates();
        
        // Add a delay for better UX and to show the clearing effect
        setTimeout(() => {
            // Call the library's playVsComputer method
            const result = game.playVsComputer(playerMove);
            gameState.currentResult = result;
            
            console.log('🎉 Game result:', result);
            
            // Display game results with animation
            displayGameResultWithAnimation(result);
            
            gameState.isPlaying = false;
            updateButtonStates();
        }, 300); // Increased delay to show clearing effect
        
    } catch (error) {
        console.error('❌ Error playing game:', error);
        gameState.isPlaying = false;
        updateButtonStates();
        handleError(error as Error);
    }
}

/**
 * Display the game result in the UI
 */
function displayGameResult(gameResult: RPSGameResult): void {
    console.log('📊 Displaying game result:', gameResult);
    
    // Hide initial message and show result area
    if (initialMessage) initialMessage.classList.add('hidden');
    if (resultArea) resultArea.classList.remove('hidden');

    // Display player move
    if (playerMoveIcon && playerMoveText && gameResult.playerMove) {
        const playerIcon = moveIcons[gameResult.playerMove];
        playerMoveIcon.textContent = playerIcon;
        playerMoveText.textContent = capitalizeFirstLetter(gameResult.playerMove);
    }

    // Display computer move
    if (computerMoveIcon && computerMoveText && gameResult.computerMove) {
        const computerIcon = moveIcons[gameResult.computerMove];
        computerMoveIcon.textContent = computerIcon;
        computerMoveText.textContent = capitalizeFirstLetter(gameResult.computerMove);
    }

    // Display result with appropriate styling
    if (resultText && resultExplanation) {
        resultText.className = 'result-text';
        
        switch (gameResult.result) {
            case 'win':
                resultText.textContent = 'You Win! 🎉';
                resultText.classList.add('win');
                resultExplanation.textContent = gameResult.playerMove && gameResult.computerMove 
                    ? getWinExplanation(gameResult.playerMove, gameResult.computerMove)
                    : 'You won this round!';
                break;
            case 'lose':
                resultText.textContent = 'You Lose 😔';
                resultText.classList.add('lose');
                resultExplanation.textContent = gameResult.playerMove && gameResult.computerMove
                    ? getLoseExplanation(gameResult.playerMove, gameResult.computerMove)
                    : 'Computer won this round!';
                break;
            case 'draw':
                resultText.textContent = 'It\'s a Draw 🤝';
                resultText.classList.add('draw');
                resultExplanation.textContent = 'Great minds think alike!';
                break;
            default:
                resultText.textContent = 'Unknown Result';
                resultExplanation.textContent = '';
        }
    }
    
    console.log('✅ Display updated successfully');
}

/**
 * Display the game result with smooth animation
 */
function displayGameResultWithAnimation(gameResult: RPSGameResult): void {
    console.log('📊 Displaying game result with animation:', gameResult);
    
    // Remove any existing animation classes
    if (resultArea) {
        resultArea.classList.remove('fade-out', 'fade-in');
    }
    if (initialMessage) {
        initialMessage.classList.remove('fade-in', 'fade-out');
    }
    
    // Hide initial message with fade out
    if (initialMessage) {
        initialMessage.classList.add('fade-out');
        setTimeout(() => {
            initialMessage.classList.add('hidden');
        }, 150);
    }
    
    // Display the result content first (hidden)
    displayGameResult(gameResult);
    
    // Show result area with fade in animation
    setTimeout(() => {
        if (resultArea) {
            resultArea.classList.remove('hidden');
            resultArea.classList.add('fade-in');
        }
    }, 200);
}

/**
 * Reset the game to initial state
 */
function resetGame(): void {
    console.log('🔄 Resetting game');
    
    // Hide result area and show initial message
    if (resultArea) resultArea.classList.add('hidden');
    if (initialMessage) initialMessage.classList.remove('hidden');
    
    // Clear current game result
    gameState.currentResult = null;
    gameState.isPlaying = false;
    
    // Clear result displays
    clearResultDisplays();
    clearButtonSelection();
    updateButtonStates();
    
    console.log('✅ Game reset complete');
}

/**
 * Clear all result display elements
 */
function clearResultDisplays(): void {
    const elements = [
        playerMoveIcon, playerMoveText,
        computerMoveIcon, computerMoveText,
        resultText, resultExplanation
    ];
    
    elements.forEach(element => {
        if (element) element.textContent = '';
    });
    
    if (resultText) resultText.className = 'result-text';
}

/**
 * Clear button selection/active states
 */
function clearButtonSelection(): void {
    moveButtons.forEach(button => {
        // Remove any active/selected classes that might be added by browser
        button.blur(); // Remove focus
        button.classList.remove('active', 'selected', 'pressed');
        
        // Reset any inline styles that might indicate selection
        button.style.transform = '';
        button.style.boxShadow = '';
        button.style.backgroundColor = '';
        button.style.borderColor = '';
    });
    
    console.log('🧹 Button selection cleared');
}

/**
 * Clear previous game result immediately when starting new game
 */
function clearPreviousGameResult(): void {
    console.log('🧽 Clearing previous game result');
    
    // Hide result area and show initial message
    if (resultArea) {
        resultArea.classList.add('hidden');
        resultArea.classList.add('fade-out');
    }
    if (initialMessage) {
        initialMessage.classList.remove('hidden');
        initialMessage.classList.add('fade-in');
    }
    
    // Clear result displays immediately
    clearResultDisplays();
    
    // Clear game state
    gameState.currentResult = null;
}

/**
 * Update button states based on game state
 */
function updateButtonStates(): void {
    moveButtons.forEach(button => {
        button.disabled = gameState.isPlaying;
        if (gameState.isPlaying) {
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
        } else {
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    });
}

/**
 * Update the entire UI based on current state
 */
function updateUI(): void {
    updateButtonStates();
    
    if (gameState.currentResult) {
        displayGameResult(gameState.currentResult);
    } else {
        // Show initial state
        if (resultArea) resultArea.classList.add('hidden');
        if (initialMessage) initialMessage.classList.remove('hidden');
    }
}

/**
 * Handle errors gracefully
 */
function handleError(error: Error): void {
    console.error('🚨 Game Error:', error);
    
    // Display user-friendly error message
    if (resultArea) resultArea.classList.remove('hidden');
    if (initialMessage) initialMessage.classList.add('hidden');
    
    if (resultText) {
        resultText.textContent = 'Oops! Something went wrong';
        resultText.className = 'result-text error';
    }
    
    if (resultExplanation) {
        resultExplanation.textContent = error.message || 'Please try again';
    }
    
    // Clear move displays
    clearResultDisplays();
    
    // Reset game state
    gameState.isPlaying = false;
    gameState.currentResult = null;
    updateButtonStates();
}

/**
 * Utility function to capitalize first letter
 */
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Get explanation for win scenario
 */
function getWinExplanation(playerMove: RPSMove, computerMove: RPSMove): string {
    const explanations: Record<string, string> = {
        'rock-scissors': 'Rock crushes Scissors',
        'paper-rock': 'Paper covers Rock',
        'scissors-paper': 'Scissors cuts Paper'
    };
    
    const key = `${playerMove}-${computerMove}`;
    return explanations[key] || 'You won this round!';
}

/**
 * Get explanation for lose scenario
 */
function getLoseExplanation(playerMove: RPSMove, computerMove: RPSMove): string {
    const explanations: Record<string, string> = {
        'scissors-rock': 'Rock crushes Scissors',
        'rock-paper': 'Paper covers Rock',
        'paper-scissors': 'Scissors cuts Paper'
    };
    
    const key = `${playerMove}-${computerMove}`;
    return explanations[key] || 'Computer won this round!';
}

// Export for potential testing
export {
    initializeGame,
    playGame,
    resetGame,
    gameState
};