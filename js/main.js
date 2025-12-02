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
    
    // Setup mobile controls
    setupMobileControls();
    
    // Initial mobile check
    updateMobileLayout();
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

function updateMobileLayout() {
    const mobileControls = document.getElementById('mobile-controls');
    if (isMobileDevice()) {
        mobileControls.classList.add('active');
    } else {
        mobileControls.classList.remove('active');
    }
}

function setupMobileControls() {
    const mobileControls = document.getElementById('mobile-controls');
    if (!mobileControls) return;
    
    // Prevent default touch behaviors
    mobileControls.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    // D-pad controls
    const dpadButtons = mobileControls.querySelectorAll('.dpad .control-btn');
    dpadButtons.forEach(btn => {
        const key = btn.dataset.key;
        
        // Touch start - simulate key down
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.add('active');
            
            if (game && game.input) {
                // Use the InputHandler's method directly
                game.input.handleTouchStart(key);
            }
        }, { passive: false });
        
        // Touch end - simulate key up
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.remove('active');
            
            if (game && game.input) {
                game.input.handleTouchEnd(key);
            }
        }, { passive: false });
        
        // Touch cancel
        btn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            btn.classList.remove('active');
            
            if (game && game.input) {
                game.input.handleTouchEnd(key);
            }
        }, { passive: false });
        
        // Mouse events for testing on desktop
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            btn.classList.add('active');
            if (game && game.input) {
                game.input.handleTouchStart(key);
            }
        });
        
        btn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            btn.classList.remove('active');
            if (game && game.input) {
                game.input.handleTouchEnd(key);
            }
        });
    });
    
    // Action button (pump)
    const actionBtn = mobileControls.querySelector('.action-btn');
    if (actionBtn) {
        actionBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            actionBtn.classList.add('active');
            
            if (game && game.input) {
                game.input.handleTouchStart('pump');
            }
        }, { passive: false });
        
        actionBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            actionBtn.classList.remove('active');
            
            if (game && game.input) {
                game.input.handleTouchEnd('pump');
            }
        }, { passive: false });
        
        actionBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            actionBtn.classList.remove('active');
            
            if (game && game.input) {
                game.input.handleTouchEnd('pump');
            }
        }, { passive: false });
        
        // Mouse events for testing
        actionBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            actionBtn.classList.add('active');
            if (game && game.input) {
                game.input.handleTouchStart('pump');
            }
        });
        
        actionBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            actionBtn.classList.remove('active');
            if (game && game.input) {
                game.input.handleTouchEnd('pump');
            }
        });
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    updateMobileLayout();
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
