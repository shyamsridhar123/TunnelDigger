// Main entry point
let game;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Get canvas
    const canvas = document.getElementById('game-canvas');
    
    // Set canvas size from config
    canvas.width = CONFIG.CANVAS_WIDTH;
    canvas.height = CONFIG.CANVAS_HEIGHT;
    
    // Create game instance
    game = new Game(canvas);
    game.init();
    game.start();
    
    // Setup UI event listeners
    setupUIListeners();
    
    // Check if mobile
    if (isMobileDevice()) {
        document.getElementById('mobile-controls').classList.remove('hidden');
    }
});

function setupUIListeners() {
    // Title screen
    document.getElementById('start-button').addEventListener('click', () => {
        document.getElementById('title-screen').classList.add('hidden');
        game.startGame();
    });
    
    document.getElementById('instructions-button').addEventListener('click', () => {
        document.getElementById('title-screen').classList.add('hidden');
        document.getElementById('instructions-screen').classList.remove('hidden');
    });
    
    // Instructions screen
    document.getElementById('back-button').addEventListener('click', () => {
        document.getElementById('instructions-screen').classList.add('hidden');
        document.getElementById('title-screen').classList.remove('hidden');
    });
    
    // Game over screen
    document.getElementById('restart-button').addEventListener('click', () => {
        document.getElementById('game-over-screen').classList.add('hidden');
        game.startGame();
    });
    
    document.getElementById('menu-button').addEventListener('click', () => {
        document.getElementById('game-over-screen').classList.add('hidden');
        game.showTitle();
    });
    
    // Level complete screen
    document.getElementById('next-level-button').addEventListener('click', () => {
        game.nextLevel();
    });
    
    // Pause screen
    document.getElementById('resume-button').addEventListener('click', () => {
        game.togglePause();
    });
    
    document.getElementById('quit-button').addEventListener('click', () => {
        document.getElementById('pause-screen').classList.add('hidden');
        game.paused = false;
        game.showTitle();
    });
    
    // Music toggle
    document.getElementById('music-toggle').addEventListener('click', (e) => {
        if (game && game.audioManager) {
            const enabled = game.audioManager.toggleMusic();
            e.target.textContent = enabled ? '🔊' : '🔇';
        }
    });

    // Pause button
    document.getElementById('pause-button').addEventListener('click', () => {
        if (game && game.state === GAME_STATE.PLAYING) {
            game.togglePause();
        }
    });

    // Stop button (return to menu)
    document.getElementById('stop-button').addEventListener('click', () => {
        if (game) {
            if (game.paused) {
                document.getElementById('pause-screen').classList.add('hidden');
                game.paused = false;
            }
            game.showTitle();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Pause with Escape or P
        if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
            game.togglePause();
        }
        
        // Prevent arrow keys from scrolling
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    });
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
}

// Handle window resize
window.addEventListener('resize', () => {
    const mobileControls = document.getElementById('mobile-controls');
    if (isMobileDevice()) {
        mobileControls.classList.remove('hidden');
    } else {
        mobileControls.classList.add('hidden');
    }
});

// Prevent context menu on canvas
document.getElementById('game-canvas').addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Handle page visibility changes (pause when tab not visible)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && game && game.state === GAME_STATE.PLAYING && !game.paused) {
        game.togglePause();
    }
});
