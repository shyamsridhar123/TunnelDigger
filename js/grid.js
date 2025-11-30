// Grid Manager - Handles the game field
class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.initialize();
    }

    initialize() {
        // Create 2D array
        this.tiles = [];
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Top rows are empty for player spawn
                if (y < 3) {
                    this.tiles[y][x] = CONFIG.TILE_EMPTY;
                } else {
                    this.tiles[y][x] = CONFIG.TILE_DIRT;
                }
            }
        }
    }

    // Get tile at position
    getTile(x, y) {
        if (!Utils.isValidGridPosition(x, y)) {
            return null;
        }
        return this.tiles[y][x];
    }

    // Set tile at position
    setTile(x, y, type) {
        if (Utils.isValidGridPosition(x, y)) {
            this.tiles[y][x] = type;
        }
    }

    // Check if position is walkable (empty or tunnel)
    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        return tile === CONFIG.TILE_EMPTY || tile === CONFIG.TILE_TUNNEL;
    }

    // Check if position is diggable
    isDiggable(x, y) {
        const tile = this.getTile(x, y);
        return tile === CONFIG.TILE_DIRT;
    }

    // Dig at position
    dig(x, y) {
        if (this.isDiggable(x, y)) {
            this.setTile(x, y, CONFIG.TILE_TUNNEL);
            return true;
        }
        return false;
    }

    // Check if tile has support underneath
    hasSupport(x, y) {
        if (y >= this.height - 1) return true;
        const below = this.getTile(x, y + 1);
        return below !== CONFIG.TILE_EMPTY && below !== CONFIG.TILE_TUNNEL;
    }

    // Find random empty position
    findRandomEmptyPosition() {
        let attempts = 0;
        const maxAttempts = 100;
        
        while (attempts < maxAttempts) {
            const x = Utils.randomInt(0, this.width - 1);
            const y = Utils.randomInt(3, this.height - 1);
            
            if (this.getTile(x, y) === CONFIG.TILE_DIRT) {
                return { x, y };
            }
            attempts++;
        }
        
        // Fallback
        return { x: Math.floor(this.width / 2), y: Math.floor(this.height / 2) };
    }

    // Find random dirt position
    findRandomDirtPosition() {
        const positions = [];
        for (let y = 3; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.tiles[y][x] === CONFIG.TILE_DIRT) {
                    positions.push({ x, y });
                }
            }
        }
        
        if (positions.length === 0) {
            return this.findRandomEmptyPosition();
        }
        
        return Utils.randomElement(positions);
    }

    // Generate level layout
    generateLevel(level) {
        this.initialize();
        
        // Create some pre-dug tunnels for variety
        const tunnelCount = 2 + level;
        for (let i = 0; i < tunnelCount; i++) {
            this.createRandomTunnel();
        }
    }

    // Create a random horizontal tunnel
    createRandomTunnel() {
        const y = Utils.randomInt(5, this.height - 3);
        const startX = Utils.randomInt(0, this.width - 10);
        const length = Utils.randomInt(5, 15);
        
        for (let x = startX; x < Math.min(startX + length, this.width); x++) {
            if (this.tiles[y][x] === CONFIG.TILE_DIRT) {
                this.tiles[y][x] = CONFIG.TILE_TUNNEL;
            }
        }
    }

    // Get all tunnel positions
    getTunnelPositions() {
        const tunnels = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.tiles[y][x] === CONFIG.TILE_TUNNEL || this.tiles[y][x] === CONFIG.TILE_EMPTY) {
                    tunnels.push({ x, y });
                }
            }
        }
        return tunnels;
    }

    // Draw the grid
    draw(spriteManager) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const pos = Utils.gridToPixel(x, y);
                const tile = this.tiles[y][x];
                
                switch (tile) {
                    case CONFIG.TILE_EMPTY:
                        // Draw black background
                        spriteManager.drawRect(pos.x, pos.y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE, CONFIG.COLOR_BACKGROUND);
                        break;
                    case CONFIG.TILE_DIRT:
                        spriteManager.drawDirt(pos.x, pos.y, y);
                        break;
                    case CONFIG.TILE_ROCK:
                        // Draw dirt underneath the rock
                        spriteManager.drawDirt(pos.x, pos.y, y);
                        break;
                    case CONFIG.TILE_TUNNEL:
                        spriteManager.drawTunnel(pos.x, pos.y);
                        break;
                    case CONFIG.TILE_BONUS:
                        spriteManager.drawTunnel(pos.x, pos.y);
                        break;
                }
            }
        }
    }

    // Clear the grid
    clear() {
        this.initialize();
    }
}
