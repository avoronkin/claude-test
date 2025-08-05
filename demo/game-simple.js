// Simple JavaScript version with logging for debugging
console.log('🎮 Game script loaded');

// Import from the local library copy
import { RockPaperScissors } from './index.js';

// Game instance and DOM elements
let game;
let currentGameResult = null;

// Move icons mapping
const moveIcons = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing game');
    initializeGame();
});

function initializeGame() {
    try {
        console.log('🎯 Creating RockPaperScissors instance');
        game = new RockPaperScissors();
        console.log('✅ Game instance created successfully:', game);
        
        setupEventListeners();
        console.log('🎧 Event listeners setup complete');
    } catch (error) {
        console.error('❌ Error initializing game:', error);
        handleError(error);
    }
}

function setupEventListeners() {
    const moveButtons = document.querySelectorAll('.move-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    console.log('🔗 Setting up event listeners for', moveButtons.length, 'buttons');
    
    // Add click handlers for move buttons
    moveButtons.forEach((button, index) => {
        console.log(`🎯 Setting up button ${index}:`, button.dataset.move);
        button.addEventListener('click', (event) => {
            const move = event.currentTarget.dataset.move;
            console.log('🎲 Button clicked, move:', move);
            if (move) {
                playGame(move);
            }
        });
    });

    // Add click handler for play again button
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', resetGame);
        console.log('🔄 Play again button listener added');
    }
}

function playGame(playerMove) {
    try {
        console.log('🎲 Playing game with move:', playerMove);
        console.log('🎯 Game instance:', game);
        
        // Call the library's playVsComputer method
        currentGameResult = game.playVsComputer(playerMove);
        console.log('🎉 Game result:', currentGameResult);
        
        // Display game results
        displayGameResult(currentGameResult);
        
    } catch (error) {
        console.error('❌ Error playing game:', error);
        handleError(error);
    }
}

function displayGameResult(gameResult) {
    console.log('📊 Displaying game result:', gameResult);
    
    const resultArea = document.getElementById('result-area');
    const initialMessage = document.getElementById('initial-message');
    const resultText = document.getElementById('result-text');
    const resultExplanation = document.getElementById('result-explanation');
    const playerMoveIcon = document.getElementById('player-move-icon');
    const playerMoveText = document.getElementById('player-move-text');
    const computerMoveIcon = document.getElementById('computer-move-icon');
    const computerMoveText = document.getElementById('computer-move-text');
    
    // Hide initial message and show result area
    if (initialMessage) initialMessage.classList.add('hidden');
    if (resultArea) resultArea.classList.remove('hidden');

    // Display player move
    if (playerMoveIcon) playerMoveIcon.textContent = moveIcons[gameResult.playerMove] || '❓';
    if (playerMoveText) playerMoveText.textContent = capitalizeFirstLetter(gameResult.playerMove);

    // Display computer move
    if (computerMoveIcon) computerMoveIcon.textContent = moveIcons[gameResult.computerMove] || '❓';
    if (computerMoveText) computerMoveText.textContent = capitalizeFirstLetter(gameResult.computerMove);

    // Display result with appropriate styling
    if (resultText) {
        resultText.className = 'result-text';
        
        switch (gameResult.result) {
            case 'win':
                resultText.textContent = 'You Win! 🎉';
                resultText.classList.add('win');
                if (resultExplanation) {
                    resultExplanation.textContent = getWinExplanation(gameResult.playerMove, gameResult.computerMove);
                }
                break;
            case 'lose':
                resultText.textContent = 'You Lose 😔';
                resultText.classList.add('lose');
                if (resultExplanation) {
                    resultExplanation.textContent = getLoseExplanation(gameResult.playerMove, gameResult.computerMove);
                }
                break;
            case 'draw':
                resultText.textContent = 'It\'s a Draw 🤝';
                resultText.classList.add('draw');
                if (resultExplanation) {
                    resultExplanation.textContent = 'Great minds think alike!';
                }
                break;
            default:
                resultText.textContent = 'Unknown Result';
                if (resultExplanation) {
                    resultExplanation.textContent = '';
                }
        }
    }
    
    console.log('✅ Display updated successfully');
}

function resetGame() {
    console.log('🔄 Resetting game');
    
    const resultArea = document.getElementById('result-area');
    const initialMessage = document.getElementById('initial-message');
    const resultText = document.getElementById('result-text');
    const resultExplanation = document.getElementById('result-explanation');
    const playerMoveIcon = document.getElementById('player-move-icon');
    const playerMoveText = document.getElementById('player-move-text');
    const computerMoveIcon = document.getElementById('computer-move-icon');
    const computerMoveText = document.getElementById('computer-move-text');
    
    // Hide result area and show initial message
    if (resultArea) resultArea.classList.add('hidden');
    if (initialMessage) initialMessage.classList.remove('hidden');
    
    // Clear current game result
    currentGameResult = null;
    
    // Clear result displays
    if (playerMoveIcon) playerMoveIcon.textContent = '';
    if (playerMoveText) playerMoveText.textContent = '';
    if (computerMoveIcon) computerMoveIcon.textContent = '';
    if (computerMoveText) computerMoveText.textContent = '';
    if (resultText) resultText.textContent = '';
    if (resultExplanation) resultExplanation.textContent = '';
    
    // Re-enable move buttons
    const moveButtons = document.querySelectorAll('.move-btn');
    moveButtons.forEach(button => {
        button.disabled = false;
    });
    
    console.log('✅ Game reset complete');
}

function handleError(error) {
    console.error('🚨 Game Error:', error);
    
    const resultArea = document.getElementById('result-area');
    const initialMessage = document.getElementById('initial-message');
    const resultText = document.getElementById('result-text');
    const resultExplanation = document.getElementById('result-explanation');
    
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
    const playerMoveIcon = document.getElementById('player-move-icon');
    const playerMoveText = document.getElementById('player-move-text');
    const computerMoveIcon = document.getElementById('computer-move-icon');
    const computerMoveText = document.getElementById('computer-move-text');
    
    if (playerMoveIcon) playerMoveIcon.textContent = '';
    if (playerMoveText) playerMoveText.textContent = '';
    if (computerMoveIcon) computerMoveIcon.textContent = '';
    if (computerMoveText) computerMoveText.textContent = '';
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