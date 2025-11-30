// Player class
class Player {
    constructor(gridX, gridY, grid) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.grid = grid;
        
        // Position in pixels
        const pos = Utils.gridToPixel(gridX, gridY);
        this.x = pos.x;
        this.y = pos.y;
        
        // Movement
        this.direction = DIRECTION.DOWN;
        this.targetX = this.x;
        this.targetY = this.y;
        this.moving = false;
        this.speed = CONFIG.PLAYER_SPEED;
        
        // Pump action
        this.pumping = false;
        this.pumpTarget = null;
        this.pumpStartTime = 0;
        this.pumpStage = 0;
        
        // State
        this.alive = true;
        this.invincible = false;
        this.invincibleUntil = 0;
        
        // Animation
        this.animationFrame = 0;
        this.lastFrameTime = 0;
    }

    update(deltaTime, input, monsters, audioManager) {
        if (!this.alive) return;
        
        // Update invincibility
        if (this.invincible && Date.now() > this.invincibleUntil) {
            this.invincible = false;
        }
        
        // Handle pump action
        // Allow holding space to pump, or mashing for faster pumping
        if (input.isKeyDown(' ')) {
            if (!this.pumping) {
                this.startPump(monsters, audioManager);
            }
        } else {
            if (this.pumping) {
                this.stopPump();
            }
        }
        
        if (this.pumping) {
            return this.updatePump(monsters, audioManager);
        }
        
        // Get input direction
        let inputDir = DIRECTION.NONE;
        if (input.isKeyDown('arrowup') || input.isKeyDown('w')) {
            inputDir = DIRECTION.UP;
        } else if (input.isKeyDown('arrowdown') || input.isKeyDown('s')) {
            inputDir = DIRECTION.DOWN;
        } else if (input.isKeyDown('arrowleft') || input.isKeyDown('a')) {
            inputDir = DIRECTION.LEFT;
        } else if (input.isKeyDown('arrowright') || input.isKeyDown('d')) {
            inputDir = DIRECTION.RIGHT;
        }
        
        // Update movement
        if (!this.moving && inputDir !== DIRECTION.NONE) {
            this.startMoving(inputDir, audioManager);
        }
        
        if (this.moving) {
            this.updateMovement();
        }
        
        // Update animation
        this.updateAnimation(deltaTime);
    }

    startMoving(direction, audioManager) {
        this.direction = direction;
        const vec = Utils.getDirectionVector(direction);
        const nextGridX = this.gridX + vec.x;
        const nextGridY = this.gridY + vec.y;
        
        // Check if we can move there
        if (!Utils.isValidGridPosition(nextGridX, nextGridY)) {
            return;
        }
        
        const tile = this.grid.getTile(nextGridX, nextGridY);
        
        // Can't move through rocks
        if (tile === CONFIG.TILE_ROCK) {
            return;
        }
        
        // Dig through dirt
        if (tile === CONFIG.TILE_DIRT) {
            this.grid.dig(nextGridX, nextGridY);
            if (audioManager) {
                audioManager.playDigSound();
            }
        }
        
        // Set target position
        const targetPos = Utils.gridToPixel(nextGridX, nextGridY);
        this.targetX = targetPos.x;
        this.targetY = targetPos.y;
        this.moving = true;
        this.gridX = nextGridX;
        this.gridY = nextGridY;
    }

    updateMovement() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.speed) {
            // Reached target
            this.x = this.targetX;
            this.y = this.targetY;
            this.moving = false;
        } else {
            // Move toward target
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    startPump(monsters, audioManager) {
        // Find monster in pump range
        const target = this.findPumpTarget(monsters);
        if (!target) return;
        
        this.pumping = true;
        this.pumpTarget = target;
        this.pumpStartTime = Date.now();
        this.pumpStage = 0;
        
        // Start inflating the monster
        target.startInflate();
        // Immediate inflate on first press/start
        target.inflate();
        
        if (audioManager) {
            audioManager.playPumpSound(1);
        }
    }

    updatePump(monsters, audioManager) {
        if (!this.pumpTarget || !this.pumpTarget.alive) {
            this.stopPump();
            return null;
        }
        
        const elapsed = Date.now() - this.pumpStartTime;
        const newStage = Math.floor(elapsed / CONFIG.PLAYER_PUMP_TIME);
        
        if (newStage > this.pumpStage) {
            this.pumpStage = newStage;
            this.pumpTarget.inflate();
            
            if (audioManager) {
                audioManager.playPumpSound(this.pumpStage + 1);
            }
        }
        
        // Check if monster is defeated (check AFTER incrementing inflateStage)
        if (this.pumpTarget.inflateStage >= CONFIG.MONSTER_PUMP_STAGES) {
            const monster = this.pumpTarget;
            monster.defeat();
            
            if (audioManager) {
                audioManager.playMonsterDefeatSound();
            }
            
            this.stopPump();
            return { defeated: true, monster: monster };
        }
        
        // Check if we're still in range
        const distance = Utils.distance(this.gridX, this.gridY, this.pumpTarget.gridX, this.pumpTarget.gridY);
        if (distance > CONFIG.PLAYER_PUMP_RANGE) {
            this.stopPump();
        }
        
        return null;
    }

    stopPump() {
        this.pumping = false;
        this.pumpTarget = null;
        this.pumpStage = 0;
    }

    findPumpTarget(monsters) {
        let closest = null;
        let closestDist = CONFIG.PLAYER_PUMP_RANGE;
        
        for (const monster of monsters) {
            if (!monster.alive || monster.isGhost) continue;
            
            const dist = Utils.distance(this.gridX, this.gridY, monster.gridX, monster.gridY);
            if (dist <= closestDist) {
                closest = monster;
                closestDist = dist;
            }
        }
        
        return closest;
    }

    updateAnimation(deltaTime) {
        this.lastFrameTime += deltaTime;
        if (this.lastFrameTime >= CONFIG.ANIMATION_FRAME_DURATION) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.lastFrameTime = 0;
        }
    }

    takeDamage() {
        if (this.invincible) return false;
        
        this.invincible = true;
        this.invincibleUntil = Date.now() + CONFIG.INVINCIBILITY_TIME;
        return true;
    }

    reset(gridX, gridY) {
        this.gridX = gridX;
        this.gridY = gridY;
        const pos = Utils.gridToPixel(gridX, gridY);
        this.x = pos.x;
        this.y = pos.y;
        this.targetX = this.x;
        this.targetY = this.y;
        this.moving = false;
        this.alive = true;
        this.invincible = true;
        this.invincibleUntil = Date.now() + CONFIG.INVINCIBILITY_TIME;
        this.pumping = false;
        this.pumpTarget = null;
    }

    draw(spriteManager) {
        if (!this.alive) return;
        
        // Flicker when invincible
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }
        
        const frame = this.pumping ? 1 : 0;
        let pumpDist = 0;
        if (this.pumping && this.pumpTarget) {
             pumpDist = Utils.distance(this.x, this.y, this.pumpTarget.x, this.pumpTarget.y);
        }
        spriteManager.drawPlayer(this.x, this.y, this.direction, frame, pumpDist);
    }
}
