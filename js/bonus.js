// Bonus Item Class
class BonusItem {
    constructor(gridX, gridY, grid) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.grid = grid;
        
        // Position in pixels
        const pos = Utils.gridToPixel(gridX, gridY);
        this.x = pos.x;
        this.y = pos.y;
        
        this.collected = false;
        this.active = true;
        this.timer = 0;
        this.blinkSpeed = 0.2;
        
        // Mark grid? Bonus items usually sit on top of dirt or in tunnels
        // We don't block movement, so we don't set a tile type that blocks
    }

    update(deltaTime) {
        if (this.collected) return;
        
        this.timer += deltaTime / 1000;
    }

    draw(spriteManager) {
        if (this.collected || !this.active) return;
        
        // Simple blink effect
        if (Math.floor(this.timer / this.blinkSpeed) % 2 === 0) {
            const size = CONFIG.TILE_SIZE;
            const padding = 4;
            
            spriteManager.ctx.fillStyle = CONFIG.COLOR_BONUS;
            spriteManager.ctx.beginPath();
            spriteManager.ctx.moveTo(this.x + size/2, this.y + padding);
            spriteManager.ctx.lineTo(this.x + size - padding, this.y + size/2);
            spriteManager.ctx.lineTo(this.x + size/2, this.y + size - padding);
            spriteManager.ctx.lineTo(this.x + padding, this.y + size/2);
            spriteManager.ctx.closePath();
            spriteManager.ctx.fill();
            
            // Shine
            spriteManager.ctx.fillStyle = '#FFFFFF';
            spriteManager.ctx.fillRect(this.x + size/2 - 2, this.y + size/2 - 2, 4, 4);
        }
    }

    checkCollision(player) {
        if (this.collected || !this.active) return false;
        
        // Simple grid-based collision
        // Or pixel-based for smoother pickup
        const dist = Utils.distance(
            this.x + CONFIG.TILE_SIZE/2, 
            this.y + CONFIG.TILE_SIZE/2,
            player.x + CONFIG.TILE_SIZE/2,
            player.y + CONFIG.TILE_SIZE/2
        );
        
        return dist < CONFIG.TILE_SIZE * 0.8;
    }

    collect() {
        this.collected = true;
        this.active = false;
    }
}
