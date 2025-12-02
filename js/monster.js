// Monster class
class Monster {
    constructor(gridX, gridY, grid, type = MONSTER_TYPE.BASIC) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.grid = grid;
        this.type = type;
        
        // Position in pixels
        const pos = Utils.gridToPixel(gridX, gridY);
        this.x = pos.x;
        this.y = pos.y;
        
        // Movement
        this.direction = DIRECTION.DOWN;
        this.targetX = this.x;
        this.targetY = this.y;
        this.moving = false;
        this.speed = this.getSpeed();
        
        // State
        this.alive = true;
        this.isGhost = false;
        this.ghostModeTime = 0;
        this.lastGhostToggle = Date.now() + 10000; // Delay first ghost mode by 10 seconds
        
        // Inflation
        this.inflateStage = 0;
        this.inflating = false;
        this.inflateStartTime = 0;
        
        // AI
        this.pathUpdateInterval = 800; // ms (slowed for fairer gameplay)
        this.lastPathUpdate = 0;
        this.targetPlayer = null;
        
        // Animation
        this.animationFrame = 0;
        this.lastFrameTime = 0;
    }

    getSpeed() {
        let speed = CONFIG.MONSTER_SPEED;
        if (this.type === MONSTER_TYPE.FAST) {
            speed *= 1.5;
        }
        return speed;
    }

    update(deltaTime, player) {
        if (!this.alive) return;
        
        // Update ghost mode
        this.updateGhostMode();
        
        // Update inflation
        if (this.inflating) {
            this.updateInflation();
            // Don't move while inflating
            return;
        }
        
        // Update movement
        if (!this.moving) {
            this.updateAI(player);
        } else {
            this.updateMovement();
        }
        
        // Update animation
        this.updateAnimation(deltaTime);
        
        // Update grid position
        const gridPos = Utils.pixelToGrid(this.x + CONFIG.TILE_SIZE / 2, this.y + CONFIG.TILE_SIZE / 2);
        this.gridX = gridPos.x;
        this.gridY = gridPos.y;
    }

    updateGhostMode() {
        const now = Date.now();
        const timeSinceToggle = now - this.lastGhostToggle;
        
        if (this.isGhost) {
            // Check if should exit ghost mode
            if (timeSinceToggle > CONFIG.MONSTER_GHOST_DURATION) {
                this.exitGhostMode();
            }
        } else {
            // Check if should enter ghost mode
            if (timeSinceToggle > CONFIG.MONSTER_GHOST_INTERVAL) {
                this.enterGhostMode();
            }
        }
    }

    enterGhostMode() {
        this.isGhost = true;
        this.lastGhostToggle = Date.now();
        this.speed = CONFIG.MONSTER_GHOST_SPEED;
    }

    exitGhostMode() {
        this.isGhost = false;
        this.lastGhostToggle = Date.now();
        this.speed = this.getSpeed();
        
        // Make sure we're in a valid position
        const tile = this.grid.getTile(this.gridX, this.gridY);
        if (tile === CONFIG.TILE_DIRT) {
            this.grid.setTile(this.gridX, this.gridY, CONFIG.TILE_TUNNEL);
        }
    }

    updateAI(player) {
        const now = Date.now();
        if (now - this.lastPathUpdate < this.pathUpdateInterval) {
            return;
        }
        
        this.lastPathUpdate = now;
        
        // Choose direction toward player
        const direction = this.chooseDirection(player);
        if (direction !== DIRECTION.NONE) {
            this.startMoving(direction);
        }
    }

    chooseDirection(player) {
        if (!player) return DIRECTION.NONE;
        
        // Get possible directions
        const directions = [DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT];
        const validDirections = [];
        
        for (const dir of directions) {
            const vec = Utils.getDirectionVector(dir);
            const nextX = this.gridX + vec.x;
            const nextY = this.gridY + vec.y;
            
            if (!Utils.isValidGridPosition(nextX, nextY)) continue;
            
            const tile = this.grid.getTile(nextX, nextY);
            
            // In ghost mode, can move through dirt
            if (this.isGhost) {
                if (tile !== CONFIG.TILE_ROCK) {
                    validDirections.push({ dir, x: nextX, y: nextY });
                }
            } else {
                // Normal mode - only tunnels and empty
                if (this.grid.isWalkable(nextX, nextY)) {
                    validDirections.push({ dir, x: nextX, y: nextY });
                }
            }
        }
        
        if (validDirections.length === 0) {
            return DIRECTION.NONE;
        }
        
        // Choose direction closest to player
        let bestDir = validDirections[0];
        let bestDist = Utils.manhattanDistance(bestDir.x, bestDir.y, player.gridX, player.gridY);
        
        for (const option of validDirections) {
            const dist = Utils.manhattanDistance(option.x, option.y, player.gridX, player.gridY);
            if (dist < bestDist) {
                bestDist = dist;
                bestDir = option;
            }
        }
        
        return bestDir.dir;
    }

    startMoving(direction) {
        this.direction = direction;
        const vec = Utils.getDirectionVector(direction);
        const nextGridX = this.gridX + vec.x;
        const nextGridY = this.gridY + vec.y;
        
        // Set target
        const targetPos = Utils.gridToPixel(nextGridX, nextGridY);
        this.targetX = targetPos.x;
        this.targetY = targetPos.y;
        this.moving = true;
    }

    updateMovement() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.speed) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.moving = false;
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    startInflate() {
        if (this.inflating) return;
        
        this.inflating = true;
        this.inflateStartTime = Date.now();
    }

    inflate() {
        this.inflateStage++;
        this.inflateStartTime = Date.now();
    }

    updateInflation() {
        const elapsed = Date.now() - this.inflateStartTime;
        
        // Deflate if not being pumped
        if (elapsed > CONFIG.MONSTER_INFLATE_DURATION && this.inflateStage > 0) {
            this.inflateStage--;
            this.inflateStartTime = Date.now();
            
            if (this.inflateStage === 0) {
                this.inflating = false;
            }
        }
    }

    defeat() {
        if (!this.alive) return false;
        this.alive = false;
        return true;
    }

    updateAnimation(deltaTime) {
        this.lastFrameTime += deltaTime;
        if (this.lastFrameTime >= CONFIG.ANIMATION_FRAME_DURATION) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.lastFrameTime = 0;
        }
    }

    checkCollisionWithPlayer(player) {
        if (!this.alive || !player.alive) return false;
        if (player.invincible) return false; // Don't collide with invincible player
        
        const dist = Utils.distance(this.gridX, this.gridY, player.gridX, player.gridY);
        return dist < 0.7; // Reduced from 1.0 for more forgiving collision
    }

    draw(spriteManager) {
        if (!this.alive) return;
        
        spriteManager.drawMonster(
            this.x, 
            this.y, 
            this.type, 
            this.isGhost, 
            this.inflateStage, 
            this.animationFrame
        );
    }
}
