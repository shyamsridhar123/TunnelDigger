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
        // Mobile controls are now set up in main.js
        // This avoids duplicate event listeners
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
        if (key === 'up') {
            this.keys['arrowup'] = true;
            this.keys['w'] = true;
        }
        if (key === 'down') {
            this.keys['arrowdown'] = true;
            this.keys['s'] = true;
        }
        if (key === 'left') {
            this.keys['arrowleft'] = true;
            this.keys['a'] = true;
        }
        if (key === 'right') {
            this.keys['arrowright'] = true;
            this.keys['d'] = true;
        }
        if (key === 'pump') {
            this.keys[' '] = true;
            this.keys['space'] = true;
        }
    }

    handleTouchEnd(key) {
        this.keys[key] = false;
        
        if (key === 'up') {
            this.keys['arrowup'] = false;
            this.keys['w'] = false;
        }
        if (key === 'down') {
            this.keys['arrowdown'] = false;
            this.keys['s'] = false;
        }
        if (key === 'left') {
            this.keys['arrowleft'] = false;
            this.keys['a'] = false;
        }
        if (key === 'right') {
            this.keys['arrowright'] = false;
            this.keys['d'] = false;
        }
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
