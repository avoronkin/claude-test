// Import RockPaperScissors class and types from the compiled library
import { RockPaperScissors, type RPSGameResult, type RPSMove } from '../../dist/esm/index.js';

console.log('🎮 Game script loaded');

// Game instance and DOM elements
let game: RockPaperScissors;
let currentGameResult: RPSGameResult | null = null;

// DOM element references
const moveButtons = document.querySelectorAll('.move-btn') as NodeListOf<HTMLButtonElement>;
const playAgainBtn = document.getElementById('play-again-btn') as HTMLButtonElement;
const resultArea = document.getElementById('result-area') as HTMLElement;
const initialMessage = document.getElementById('initial-message') as HTMLElement;
const resultText = document.getElementById('result-text') as HTMLElement;
const resultExplanation = document.getElementById('result-explanation') as HTMLElement;
const playerMoveIcon = document.getElementById('player-move-icon') as HTMLElement;
const playerMoveText = document.getElementById('player-move-text') as HTMLElement;
const computerMoveIcon = document.getElementById('computer-move-icon') as HTMLElement;
const computerMoveText = document.getElementById('computer-move-text') as HTMLElement;

// Move icons mapping
const moveIcons: Record<RPSMove, string> = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing game');
    initializeGame();
});

// Create game instance and wire up button click handlers
function initializeGame(): void {
    try {
        console.log('🎯 Creating RockPaperScissors instance');
        game = new RockPaperScissors();
        console.log('✅ Game instance created successfully');
        setupEventListeners();
        console.log('🎧 Event listeners setup complete');
    } catch (error) {
        console.error('❌ Error initializing game:', error);
        handleError(error as Error);
    }
}

function setupEventListeners(): void {
    // Add click handlers for move buttons
    moveButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const move = (event.currentTarget as HTMLButtonElement).dataset.move as RPSMove;
            if (move) {
                playGame(move);
            }
        });
    });

    // Add click handler for play again button
    playAgainBtn.addEventListener('click', resetGame);
}

// Implement move selection logic that calls playVsComputer()
function playGame(playerMove: RPSMove): void {
    try {
        console.log('🎲 Playing game with move:', playerMove);
        // Call the library's playVsComputer method
        currentGameResult = game.playVsComputer(playerMove);
        console.log('🎯 Game result:', currentGameResult);
        
        // Display game results with moves and explanation
        displayGameResult(currentGameResult);
        
    } catch (error) {
        console.error('❌ Error playing game:', error);
        // Add error handling for any potential edge cases
        handleError(error as Error);
    }
}

// Display game results with moves and explanation
function displayGameResult(gameResult: RPSGameResult): void {
    console.log('📊 Displaying game result:', gameResult);
    
    // Hide initial message and show result area
    initialMessage.classList.add('hidden');
    resultArea.classList.remove('hidden');

    // Display player move
    const playerIcon = moveIcons[gameResult.playerMove];
    if (playerIcon) {
        playerMoveIcon.textContent = playerIcon;
    }
    playerMoveText.textContent = capitalizeFirstLetter(gameResult.playerMove);

    // Display computer move
    const computerIcon = moveIcons[gameResult.computerMove];
    if (computerIcon) {
        computerMoveIcon.textContent = computerIcon;
    }
    computerMoveText.textContent = capitalizeFirstLetter(gameResult.computerMove);

    // Display result with appropriate styling
    const resultElement = resultText;
    const explanationElement = resultExplanation;
    
    // Clear previous result classes
    resultElement.className = 'result-text';
    
    switch (gameResult.result) {
        case 'win':
            resultElement.textContent = 'You Win! 🎉';
            resultElement.classList.add('win');
            explanationElement.textContent = getWinExplanation(gameResult.playerMove, gameResult.computerMove);
            break;
        case 'lose':
            resultElement.textContent = 'You Lose 😔';
            resultElement.classList.add('lose');
            explanationElement.textContent = getLoseExplanation(gameResult.playerMove, gameResult.computerMove);
            break;
        case 'draw':
            resultElement.textContent = 'It\'s a Draw 🤝';
            resultElement.classList.add('draw');
            explanationElement.textContent = 'Great minds think alike!';
            break;
        default:
            resultElement.textContent = 'Unknown Result';
            explanationElement.textContent = '';
    }
}

// Implement play again functionality to reset game state
function resetGame(): void {
    console.log('🔄 Resetting game');
    
    // Hide result area and show initial message
    resultArea.classList.add('hidden');
    initialMessage.classList.remove('hidden');
    
    // Clear current game result
    currentGameResult = null;
    
    // Clear result displays
    playerMoveIcon.textContent = '';
    playerMoveText.textContent = '';
    computerMoveIcon.textContent = '';
    computerMoveText.textContent = '';
    resultText.textContent = '';
    resultExplanation.textContent = '';
    
    // Re-enable move buttons (in case they were disabled)
    moveButtons.forEach(button => {
        button.disabled = false;
    });
}

// Add error handling for any potential edge cases
function handleError(error: Error): void {
    console.error('🚨 Game Error:', error);
    
    // Display user-friendly error message
    resultArea.classList.remove('hidden');
    initialMessage.classList.add('hidden');
    
    resultText.textContent = 'Oops! Something went wrong';
    resultText.className = 'result-text error';
    resultExplanation.textContent = error.message || 'Please try again';
    
    // Clear move displays
    playerMoveIcon.textContent = '';
    playerMoveText.textContent = '';
    computerMoveIcon.textContent = '';
    computerMoveText.textContent = '';
}

// Utility functions
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getWinExplanation(playerMove: RPSMove, computerMove: RPSMove): string {
    const explanations: Record<string, string> = {
        'rock-scissors': 'Rock crushes Scissors',
        'paper-rock': 'Paper covers Rock',
        'scissors-paper': 'Scissors cuts Paper'
    };
    
    const key = `${playerMove}-${computerMove}`;
    return explanations[key] || 'You won this round!';
}

function getLoseExplanation(playerMove: RPSMove, computerMove: RPSMove): string {
    const explanations: Record<string, string> = {
        'scissors-rock': 'Rock crushes Scissors',
        'rock-paper': 'Paper covers Rock',
        'paper-scissors': 'Scissors cuts Paper'
    };
    
    const key = `${playerMove}-${computerMove}`;
    return explanations[key] || 'Computer won this round!';
}