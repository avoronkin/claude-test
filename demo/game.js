// Import RockPaperScissors class from compiled library (Task 3.1)
import { RockPaperScissors } from './rps-lib.js';

// Game instance and DOM elements
let game;
let currentGameResult = null;

// DOM element references
const moveButtons = document.querySelectorAll('.move-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const resultArea = document.getElementById('result-area');
const initialMessage = document.getElementById('initial-message');
const resultText = document.getElementById('result-text');
const resultExplanation = document.getElementById('result-explanation');
const playerMoveIcon = document.getElementById('player-move-icon');
const playerMoveText = document.getElementById('player-move-text');
const computerMoveIcon = document.getElementById('computer-move-icon');
const computerMoveText = document.getElementById('computer-move-text');

// Move icons mapping
const moveIcons = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

// Task 3.2: Create game instance and wire up button click handlers
function initializeGame() {
    try {
        game = new RockPaperScissors();
        setupEventListeners();
    } catch (error) {
        handleError(error);
    }
}

function setupEventListeners() {
    // Add click handlers for move buttons
    moveButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const move = event.currentTarget.dataset.move;
            if (move) {
                playGame(move);
            }
        });
    });

    // Add click handler for play again button
    playAgainBtn.addEventListener('click', resetGame);
}

// Task 3.3: Implement move selection logic that calls playVsComputer()
function playGame(playerMove) {
    try {
        // Call the library's playVsComputer method
        currentGameResult = game.playVsComputer(playerMove);
        
        // Task 3.4: Display game results with moves and explanation
        displayGameResult(currentGameResult);
        
    } catch (error) {
        // Task 3.6: Add error handling for any potential edge cases
        handleError(error);
    }
}

// Task 3.4: Display game results with moves and explanation
function displayGameResult(gameResult) {
    // Hide initial message and show result area
    initialMessage.classList.add('hidden');
    resultArea.classList.remove('hidden');

    // Display player move
    playerMoveIcon.textContent = moveIcons[gameResult.playerMove];
    playerMoveText.textContent = capitalizeFirstLetter(gameResult.playerMove);

    // Display computer move
    computerMoveIcon.textContent = moveIcons[gameResult.computerMove];
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

// Task 3.5: Implement play again functionality to reset game state
function resetGame() {
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

// Task 3.6: Add error handling for any potential edge cases
function handleError(error) {
    console.error('Game Error:', error);
    
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
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getWinExplanation(playerMove, computerMove) {
    const explanations = {
        'rock-scissors': 'Rock crushes Scissors',
        'paper-rock': 'Paper covers Rock',
        'scissors-paper': 'Scissors cuts Paper'
    };
    
    const key = `${playerMove}-${computerMove}`;
    return explanations[key] || 'You won this round!';
}

function getLoseExplanation(playerMove, computerMove) {
    const explanations = {
        'scissors-rock': 'Rock crushes Scissors',
        'rock-paper': 'Paper covers Rock',
        'paper-scissors': 'Scissors cuts Paper'
    };
    
    const key = `${playerMove}-${computerMove}`;
    return explanations[key] || 'Computer won this round!';
}