// Rock class
class Rock {
    constructor(gridX, gridY, grid) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.grid = grid;
        
        // Position in pixels
        const pos = Utils.gridToPixel(gridX, gridY);
        this.x = pos.x;
        this.y = pos.y;
        
        // State
        this.falling = false;
        this.wobbling = false;
        this.wobbleStartTime = 0;
        this.settled = true;
        this.fallSpeed = CONFIG.ROCK_FALL_SPEED;
        this.targetY = this.y;
        this.lastCheckTime = 0;
        
        // Mark grid position
        this.grid.setTile(gridX, gridY, CONFIG.TILE_ROCK);
    }

    update(deltaTime, audioManager) {
        // Check if should start falling
        if (!this.falling && !this.wobbling && this.settled) {
            const now = Date.now();
            if (now - this.lastCheckTime > CONFIG.ROCK_SETTLE_TIME) {
                this.checkFall();
                this.lastCheckTime = now;
            }
        }

        // Handle Wobble
        if (this.wobbling) {
            if (Date.now() - this.wobbleStartTime > CONFIG.ROCK_WOBBLE_TIME) {
                this.startFall();
            }
        }
        
        // Update falling
        if (this.falling) {
            this.updateFall(audioManager);
        }
    }

    checkFall() {
        // Check if there's support below
        if (!this.grid.hasSupport(this.gridX, this.gridY)) {
            this.startWobble();
        }
    }

    startWobble() {
        if (this.wobbling || this.falling) return;
        this.wobbling = true;
        this.wobbleStartTime = Date.now();
    }

    startFall() {
        if (this.falling) return;
        
        this.wobbling = false;
        this.falling = true;
        this.settled = false;
        
        // Clear current grid position
        this.grid.setTile(this.gridX, this.gridY, CONFIG.TILE_EMPTY);
    }

    updateFall(audioManager) {
        // Move down
        this.y += this.fallSpeed;
        
        // Check grid position
        const newGridY = Math.floor((this.y + CONFIG.TILE_SIZE) / CONFIG.TILE_SIZE);
        
        if (newGridY !== this.gridY) {
            this.gridY = newGridY;
            
            // Check if we hit something
            if (!Utils.isValidGridPosition(this.gridX, this.gridY)) {
                this.destroy();
                return;
            }
            
            const tile = this.grid.getTile(this.gridX, this.gridY);
            
            // Hit ground
            if (tile === CONFIG.TILE_DIRT || tile === CONFIG.TILE_ROCK) {
                this.land(audioManager);
            }
        }
    }

    land(audioManager) {
        this.falling = false;
        this.settled = true;
        
        // Snap to grid
        const pos = Utils.gridToPixel(this.gridX, this.gridY - 1);
        this.y = pos.y;
        this.gridY = this.gridY - 1;
        
        // Mark grid
        this.grid.setTile(this.gridX, this.gridY, CONFIG.TILE_ROCK);
        
        // Play sound
        if (audioManager) {
            audioManager.playRockFallSound();
        }
    }

    destroy() {
        // Remove from grid
        if (Utils.isValidGridPosition(this.gridX, this.gridY)) {
            const tile = this.grid.getTile(this.gridX, this.gridY);
            if (tile === CONFIG.TILE_ROCK) {
                this.grid.setTile(this.gridX, this.gridY, CONFIG.TILE_EMPTY);
            }
        }
    }

    checkCollision(entity) {
        if (!this.falling) return false;
        
        // Check if entity is in the path of falling rock
        const rockBottom = this.gridY;
        const entityTop = entity.gridY;
        
        return this.gridX === entity.gridX && 
               Math.abs(rockBottom - entityTop) < 1;
    }

    draw(spriteManager) {
        spriteManager.drawRock(this.x, this.y, this);
    }
}
