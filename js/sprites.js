// Sprite Manager - Handles drawing sprites and animations
class SpriteManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.sprites = {};
        this.cacheSprites();
    }

    cacheSprites() {
        const size = CONFIG.TILE_SIZE;
        const pixelSize = size / 12; // 12x12 grid

        // Helper to draw pixel map
        const drawPixels = (ctx, map, colors) => {
            for (let y = 0; y < map.length; y++) {
                const row = map[y];
                for (let x = 0; x < row.length; x++) {
                    const char = row[x];
                    if (colors[char]) {
                        ctx.fillStyle = colors[char];
                        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                    }
                }
            }
        };

        // Helper to create cached sprite
        const cache = (key, map, colors) => {
            const c = document.createElement('canvas');
            c.width = size;
            c.height = size;
            const ctx = c.getContext('2d');
            drawPixels(ctx, map, colors);
            this.sprites[key] = c;
        };

        // --- Pixel Art Definitions (12x12) ---

        // Player (Dig Dug)
        const playerMap = [
            "...WWWW.....",
            "..WWRRWW....",
            ".WKKKKKKW...",
            ".WKSKKKSW...",
            ".WKKKKKKW...",
            "..WWWWWW....",
            ".BBWWWWBB...",
            ".BWWWWBW....",
            ".BWWWWBW....",
            "..BB..BB....",
            "..BB..BB....",
            ".BB....BB..."
        ];
        const playerColors = {
            'W': '#FFFFFF', // White
            'B': '#0000FF', // Blue
            'S': '#FFCCAA', // Skin
            'K': '#000000', // Black
            'R': '#FF0000'  // Red
        };
        cache('player', playerMap, playerColors);

        // Pooka (Red Monster)
        const pookaMap = [
            "....RRRR....",
            "..RRRRRRRR..",
            ".RRRRRRRRRR.",
            ".RYYYRRYYYR.",
            ".RYKYRRYKYR.",
            ".RYYYRRYYYR.",
            ".RRRRRRRRRR.",
            ".RRRRRRRRRR.",
            "..WW....WW..",
            "..WW....WW..",
            "..RR....RR.."
        ];
        const pookaColors = {
            'R': '#FF0000', // Red
            'Y': '#FFFF00', // Yellow
            'K': '#000000', // Black
            'W': '#FFFFFF'  // White
        };
        cache('pooka', pookaMap, pookaColors);

        // Fygar (Green Dragon)
        const fygarMap = [
            "....GGGG....",
            "...GWWGG....",
            "..GKWGGGG...",
            ".GGGGGGGG...",
            ".GGRRRRGG...",
            ".GGRRRRGG...",
            ".GGGGGGGG...",
            ".GGGGGGGG...",
            "..GG..GG....",
            "..GG..GG....",
            ".GG....GG..."
        ];
        const fygarColors = {
            'G': '#00AA00', // Green
            'R': '#FF0000', // Red wings
            'W': '#FFFFFF', // White eyes
            'K': '#000000'  // Black pupils
        };
        cache('fygar', fygarMap, fygarColors);

        // Ghost (White Pooka)
        const ghostMap = pookaMap; // Same shape
        const ghostColors = {
            'R': '#FFFFFF', // White body
            'Y': '#CCCCCC', // Grey goggles
            'K': '#000000',
            'W': '#EEEEEE'
        };
        cache('ghost', ghostMap, ghostColors);

        // Rock
        const rockMap = [
            "....OOOO....",
            "..OOOOOOOO..",
            ".OOOOOOOOOO.",
            ".OODOOOODOO.",
            ".OOOOOOOOOO.",
            ".OOODOOOODO.",
            ".OOOOOOOOOO.",
            ".OOOOOOOOOO.",
            "..OOOOOOOO..",
            "....OOOO...."
        ];
        const rockColors = {
            'O': '#FFB851', // Orange/Brown
            'D': '#A0522D'  // Dark Brown
        };
        cache('rock', rockMap, rockColors);

        // Bonus (Carrot/Veggie)
        const bonusMap = [
            "....GGGG....",
            "...GGGGGG...",
            "..OO..OO....",
            ".OOOOOOOO...",
            ".OOOOOOOO...",
            "..OOOOOO....",
            "...OOOO.....",
            "....OO......",
            "....OO......",
            "....O......."
        ];
        const bonusColors = {
            'O': '#FF8800', // Orange
            'G': '#00FF00'  // Green
        };
        cache('bonus', bonusMap, bonusColors);

        // Flower (for lives display)
        const flowerMap = [
            "............",
            "....RR......",
            "...RRRR.....",
            "..RRYYRR....",
            "..RRYYRR....",
            "...RRRR.....",
            "....GG......",
            "....GG......",
            "...GGGG.....",
            "....GG......",
            "....GG......",
            "............"
        ];
        const flowerColors = {
            'R': '#FF69B4', // Pink petals
            'Y': '#FFFF00', // Yellow center
            'G': '#00AA00'  // Green stem
        };
        cache('flower', flowerMap, flowerColors);
    }

    // Get a sprite canvas for external use (like lives display)
    getSprite(key) {
        return this.sprites[key];
    }

    // Create a small version of a sprite for UI
    createSmallSprite(key, targetSize) {
        const original = this.sprites[key];
        if (!original) return null;
        
        const c = document.createElement('canvas');
        c.width = targetSize;
        c.height = targetSize;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(original, 0, 0, targetSize, targetSize);
        return c;
    }

    // Draw a colored rectangle (placeholder for sprites)
    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    // Draw player sprite
    drawPlayer(x, y, direction, frame = 0, pumpDist = 0) {
        const size = CONFIG.TILE_SIZE;
        
        // Use floor to align to pixel grid and prevent jitter/flashing
        const drawX = Math.floor(x);
        const drawY = Math.floor(y);

        // Draw pump hose if pumping
        if (frame > 0) {
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 2;
            const vec = Utils.getDirectionVector(direction);
            
            // Use actual distance to target if provided, otherwise default length
            // Subtract a bit so it doesn't overlap the center of the monster too much
            const length = pumpDist > 0 ? pumpDist - size/4 : size * 1.5;
            
            this.ctx.beginPath();
            this.ctx.moveTo(drawX + size/2, drawY + size/2);
            this.ctx.lineTo(drawX + size/2 + vec.x * length, drawY + size/2 + vec.y * length);
            this.ctx.stroke();
            
            // Draw pump tip
            this.ctx.fillStyle = '#FF0000';
            this.ctx.beginPath();
            this.ctx.arc(drawX + size/2 + vec.x * length, drawY + size/2 + vec.y * length, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Draw Player Sprite from Cache
        this.ctx.save();
        this.ctx.translate(drawX + size/2, drawY + size/2);
        if (direction === DIRECTION.LEFT) {
            this.ctx.scale(-1, 1);
        }
        // Draw centered image
        this.ctx.drawImage(this.sprites['player'], -size/2, -size/2);
        this.ctx.restore();
    }

    // Draw monster sprite
    drawMonster(x, y, type, isGhost, inflateStage = 0, frame = 0) {
        const size = CONFIG.TILE_SIZE;
        const scale = 1 + (inflateStage * 0.5); // Inflate effect
        
        // Use floor to align to pixel grid
        const drawX = Math.floor(x);
        const drawY = Math.floor(y);

        this.ctx.save();
        this.ctx.translate(drawX + size/2, drawY + size/2);
        
        // Ghost mode transparency
        if (isGhost) {
            this.ctx.globalAlpha = 0.8;
        }
        
        // Scale for inflation
        this.ctx.scale(scale, scale);
        
        let spriteKey = 'pooka';
        if (type === MONSTER_TYPE.FAST) spriteKey = 'fygar';
        if (isGhost) spriteKey = 'ghost';
        
        // Draw centered image
        if (this.sprites[spriteKey]) {
            this.ctx.drawImage(this.sprites[spriteKey], -size/2, -size/2);
        }
        
        this.ctx.restore();
    }

    // Draw rock sprite
    drawRock(x, y, rockObj = null) {
        const size = CONFIG.TILE_SIZE;
        let drawX = x;
        
        // Wobble effect
        if (rockObj && rockObj.wobbling) {
            const wobbleOffset = Math.sin(Date.now() / 50) * 2;
            drawX += wobbleOffset;
        }

        // Use floor to align to pixel grid
        drawX = Math.floor(drawX);
        const drawY = Math.floor(y);

        if (this.sprites['rock']) {
            this.ctx.drawImage(this.sprites['rock'], drawX, drawY);
        }
    }

    // Draw bonus item
    drawBonus(x, y) {
        const size = CONFIG.TILE_SIZE;
        
        // Use floor to align to pixel grid
        const drawX = Math.floor(x);
        const drawY = Math.floor(y);

        if (this.sprites['bonus']) {
            this.ctx.drawImage(this.sprites['bonus'], drawX, drawY);
        }
    }

    // Draw dirt tile with arcade-style speckled texture
    drawDirt(x, y, row) {
        const size = CONFIG.TILE_SIZE;
        
        // Determine color based on depth (row)
        let layerIndex = 0;
        if (row >= 3 && row < 6) layerIndex = 0;
        else if (row >= 6 && row < 9) layerIndex = 1;
        else if (row >= 9 && row < 12) layerIndex = 2;
        else if (row >= 12) layerIndex = 3;
        
        if (layerIndex >= CONFIG.COLOR_DIRT_LAYERS.length) layerIndex = CONFIG.COLOR_DIRT_LAYERS.length - 1;
        
        // Fill base color
        this.ctx.fillStyle = CONFIG.COLOR_DIRT_LAYERS[layerIndex];
        this.ctx.fillRect(x, y, size, size);
        
        // Create arcade-style speckled texture using deterministic random
        const dotSize = 2;
        const spacing = 6;
        
        // Lighter speckles
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        for (let dy = 0; dy < size; dy += spacing) {
            for (let dx = 0; dx < size; dx += spacing) {
                // Use position-based seed for consistent pattern
                const seed = ((x + dx) * 7919 + (y + dy) * 6271) % 100;
                if (seed < 40) {
                    const offsetX = (seed % 3) - 1;
                    const offsetY = ((seed * 3) % 3) - 1;
                    this.ctx.fillRect(x + dx + offsetX, y + dy + offsetY, dotSize, dotSize);
                }
            }
        }
        
        // Darker speckles for depth
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let dy = 3; dy < size; dy += spacing) {
            for (let dx = 3; dx < size; dx += spacing) {
                const seed = ((x + dx) * 3571 + (y + dy) * 2909) % 100;
                if (seed < 30) {
                    this.ctx.fillRect(x + dx, y + dy, dotSize, dotSize);
                }
            }
        }
    }

    // Draw tunnel with arcade-style rounded corners
    drawTunnel(x, y, grid = null, gridX = null, gridY = null) {
        const size = CONFIG.TILE_SIZE;
        this.ctx.fillStyle = CONFIG.COLOR_TUNNEL;
        this.ctx.fillRect(x, y, size, size);
    }

    // Draw particle effect
    drawParticle(x, y, color, size) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Draw text (for score popups)
    drawText(text, x, y, color, size = 12) {
        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x, y);
    }
}
