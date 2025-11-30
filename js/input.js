// Input Handler - Manages keyboard and touch input
class InputHandler {
    constructor() {
        this.keys = {};
        this.previousKeys = {};
        this.touchActive = false;
        
        // Bind methods
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        
        // Add event listeners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        
        // Mobile controls
        this.setupMobileControls();
    }

    setupMobileControls() {
        const buttons = document.querySelectorAll('.control-btn');
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleTouchStart(btn.dataset.key);
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleTouchEnd(btn.dataset.key);
            });
            // Mouse events for testing on desktop
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.handleTouchStart(btn.dataset.key);
            });
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.handleTouchEnd(btn.dataset.key);
            });
        });
    }

    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        this.keys[key] = true;
        
        // Map arrow keys to standardized names
        if (key === 'arrowup') this.keys['up'] = true;
        if (key === 'arrowdown') this.keys['down'] = true;
        if (key === 'arrowleft') this.keys['left'] = true;
        if (key === 'arrowright') this.keys['right'] = true;
        if (key === ' ') this.keys['space'] = true;
    }

    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        this.keys[key] = false;
        
        if (key === 'arrowup') this.keys['up'] = false;
        if (key === 'arrowdown') this.keys['down'] = false;
        if (key === 'arrowleft') this.keys['left'] = false;
        if (key === 'arrowright') this.keys['right'] = false;
        if (key === ' ') this.keys['space'] = false;
    }

    handleTouchStart(key) {
        this.touchActive = true;
        this.keys[key] = true;
        
        // Map virtual keys to actual keys expected by game
        if (key === 'pump') {
            this.keys[' '] = true;
            this.keys['space'] = true;
        }
    }

    handleTouchEnd(key) {
        this.keys[key] = false;
        
        if (key === 'pump') {
            this.keys[' '] = false;
            this.keys['space'] = false;
        }
    }

    // Check if key is currently held down
    isKeyDown(key) {
        return !!this.keys[key.toLowerCase()];
    }

    // Check if key was pressed this frame (not held)
    wasKeyPressed(key) {
        return this.isKeyDown(key) && !this.previousKeys[key.toLowerCase()];
    }
    
    // Update previous keys state - call at end of frame
    update() {
        this.previousKeys = { ...this.keys };
    }
    
    // Reset all inputs (useful for game over/pause)
    reset() {
        this.keys = {};
        this.previousKeys = {};
    }
}
