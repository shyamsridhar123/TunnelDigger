// Sprite Manager - Handles drawing sprites and animations (Classic Arcade Style)
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

        // --- Classic Dig Dug Pixel Art (12x12) with Enhanced Shading ---

        // Player (Dig Dug) - Enhanced with highlights and depth
        const playerMap = [
            "....WWWW....",
            "...WHHHWW...",
            "..WHSSSSHL..",
            "..WSKKKSHL..",
            "..WHSSSSHL..",
            "...WHHHHLL..",
            "..BWHHHWLB..",
            "..BWHHHWLB..",
            "..BWHHHWLB..",
            "...BB.BB....",
            "..BB...BB...",
            ".BBD...DBB.."
        ];
        const playerColors = {
            'W': '#FFFFFF', // White suit
            'H': '#E8E8E8', // Light grey highlight
            'L': '#CCCCCC', // Shadow on suit
            'B': '#0066FF', // Bright blue
            'D': '#0044AA', // Dark blue shadow
            'S': '#FFCCAA', // Skin tone
            'K': '#000000'  // Black eyes
        };
        cache('player', playerMap, playerColors);

        // Pooka (Red balloon monster) - Enhanced with highlights and shading
        const pookaMap = [
            "....RRRR....",
            "..RRHHHRR...",
            ".RHHHRRRRRD.",
            ".RWWHRRRWWD.",
            ".RKKHRRRKKD.",
            ".RWWRRRRRWD.",
            ".RRRRRRRRRRD",
            ".RRRRMRRRRRD",
            ".RRRDDDRRRD.",
            "..RR....RR..",
            "..RD....RD..",
            ".RRD....RRD."
        ];
        const pookaColors = {
            'R': '#FF2020', // Bright red body
            'H': '#FF6060', // Highlight (lighter red)
            'D': '#CC0000', // Dark shadow
            'M': '#FF4040', // Mid-tone
            'W': '#FFFFFF', // White goggles
            'K': '#000000'  // Black pupils
        };
        cache('pooka', pookaMap, pookaColors);

        // Fygar (Green dragon) - Enhanced with scales, wings, and fire belly
        const fygarMap = [
            "....HHHH....",
            "...HHGGGG...",
            "..HWWGGGGG..",
            "..HKKGGGGGD.",
            ".HGGGGGGGGGD",
            ".GGYYYYYGDD.",
            ".GGYYYYYGDD.",
            ".HGGGGGGGDD.",
            "..HGGGGGDD..",
            "..GG....GG..",
            "..GD....GD..",
            ".GGD....GGD."
        ];
        const fygarColors = {
            'G': '#00CC00', // Main green body
            'H': '#40E040', // Highlight green
            'D': '#008800', // Dark green shadow
            'Y': '#FFAA00', // Orange-yellow belly/fire
            'W': '#FFFFFF', // White eyes
            'K': '#000000'  // Black pupils
        };
        cache('fygar', fygarMap, fygarColors);

        // Ghost (Ethereal floating spirit with wavy edges)
        const ghostMap = [
            "....WWWW....",
            "..WWLLLLWW..",
            ".WLLLLLLLLL.",
            ".WGGLLLLGGW.",
            ".WKKLLLLKKW.",
            ".WGGLLLLLGW.",
            ".WLLLLLLLLL.",
            ".WLLLLLLLLL.",
            ".WLWLWLWLWL.",
            "..W.W.W.W...",
            "............",
            "............"
        ];
        const ghostColors = {
            'W': '#FFFFFF', // White body
            'L': '#E8E8FF', // Light blue-white glow
            'G': '#AAAACC', // Pale blue-grey goggles
            'K': '#666688'  // Dark blue-grey pupils
        };
        cache('ghost', ghostMap, ghostColors);

        // Rock - 3D boulder with highlights, cracks, and shading
        const rockMap = [
            "....LLLL....",
            "..LLHHHHGG..",
            ".LHHHHHHHGGG",
            ".LHHGHHCGGDD",
            ".LHHHHHHHGDD",
            ".LGGHCHHGGDD",
            ".LGGGGGGGGDD",
            ".GGGGGGGGDDD",
            ".GGGDDDGGDD.",
            "..GGDDDDDD..",
            "....DDDD....",
            "............"
        ];
        const rockColors = {
            'L': '#A0A0A0', // Light highlight
            'H': '#909090', // High-mid tone
            'G': '#707070', // Main grey
            'D': '#404040', // Dark shadow
            'C': '#353535'  // Crack lines
        };
        cache('rock', rockMap, rockColors);

        // Bonus (Turnip/Radish - Classic Dig Dug vegetable with shine)
        const bonusMap = [
            "....GGGG....",
            "...GHHGGG...",
            "..GHH.HG....",
            ".PPPHPPPP...",
            ".PPPPPPPPW..",
            ".PPPPPPPPPW.",
            "..PPPPPPPP..",
            "...PPPPPP...",
            "....PPPP....",
            ".....PP.....",
            "............",
            "............"
        ];
        const bonusColors = {
            'P': '#FF4488', // Pink/red turnip
            'W': '#FFAACC', // White shine/highlight
            'G': '#22CC22', // Green leaves
            'H': '#44EE44'  // Light green highlight
        };
        cache('bonus', bonusMap, bonusColors);

        // Flower (for lives display) - Enhanced with depth and shine
        const flowerMap = [
            "............",
            "....PH......",
            "...PHHP.....",
            "..PHYYPH....",
            "..PHYYPH....",
            "...PDDP.....",
            "....GH......",
            "....GH......",
            "...GHHG.....",
            "....GD......",
            "....GD......",
            "............"
        ];
        const flowerColors = {
            'P': '#FF69B4', // Pink petals
            'H': '#FFA0D0', // Highlight pink
            'D': '#CC4080', // Dark pink shadow
            'Y': '#FFFF00', // Yellow center
            'G': '#00AA00', // Green stem
        };
        cache('flower', flowerMap, flowerColors);

        // Inflated Pooka stages (for pumping animation) - stretched with stress marks
        const inflatedPookaMap = [
            "...HHHHHH...",
            ".HHHHHHHHHH.",
            "HHHHHHHHHHHR",
            "HWWHHHHHWWHR",
            "HKKHHHHHKKHR",
            "HWWHHHHHWWHR",
            "HHHHHHHHHHHR",
            "HHHHHMHHHHRR",
            "HHHHRRRHHRRR",
            ".HHRRRRRRRR.",
            "..RRRRRRRR..",
            "...RRRRRR..."
        ];
        cache('pooka_inflated', inflatedPookaMap, pookaColors);
        
        // Create additional inflated stages
        const inflatedFygarMap = [
            "...HHHHHH...",
            ".HHHHHHHHHH.",
            "HHHHHHHHHHGD",
            "HWWHHHHHWWGD",
            "HKKHHHHHKKGD",
            "HWWHHHHHWWGD",
            "HHYYYYYYYYGD",
            "HHYYYYYYYYGD",
            "HHHHHHHHHGDD",
            ".HHHHHHHGDD.",
            "..GGGGGGDD..",
            "...GGGGDD..."
        ];
        cache('fygar_inflated', inflatedFygarMap, fygarColors);
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

    // Draw dirt tile with arcade-style speckled texture and rounded edges
    drawDirt(x, y, row, neighbors = {up:false,down:false,left:false,right:false}) {
        const size = CONFIG.TILE_SIZE;
        
        // Determine color based on depth (row)
        let layerIndex = 0;
        if (row >= 3 && row < 6) layerIndex = 0;
        else if (row >= 6 && row < 9) layerIndex = 1;
        else if (row >= 9 && row < 12) layerIndex = 2;
        else if (row >= 12) layerIndex = 3;
        
        if (layerIndex >= CONFIG.COLOR_DIRT_LAYERS.length) layerIndex = CONFIG.COLOR_DIRT_LAYERS.length - 1;
        
        const baseColor = CONFIG.COLOR_DIRT_LAYERS[layerIndex];
        const edgeColor = this.darkenColor(baseColor, 0.5);
        const highlightColor = this.lightenColor(baseColor, 0.2);
        
        // Calculate corner radius based on neighbor tunnels
        const radius = 10;
        
        // Draw the dirt shape with rounded corners where it meets tunnels
        this.ctx.beginPath();
        
        // Start from top-left
        if (neighbors.up || neighbors.left) {
            this.ctx.moveTo(x + radius, y + radius);
        } else {
            this.ctx.moveTo(x, y);
        }
        
        // Top edge
        if (neighbors.up) {
            this.ctx.lineTo(x + radius, y + radius);
            this.ctx.quadraticCurveTo(x + size/2, y + radius * 1.5, x + size - radius, y + radius);
        } else {
            this.ctx.lineTo(x + size, y);
        }
        
        // Top-right corner
        if (neighbors.up || neighbors.right) {
            this.ctx.lineTo(x + size - radius, y + radius);
        }
        
        // Right edge
        if (neighbors.right) {
            this.ctx.quadraticCurveTo(x + size - radius * 1.5, y + size/2, x + size - radius, y + size - radius);
        } else {
            this.ctx.lineTo(x + size, y + size);
        }
        
        // Bottom-right corner
        if (neighbors.down || neighbors.right) {
            this.ctx.lineTo(x + size - radius, y + size - radius);
        }
        
        // Bottom edge
        if (neighbors.down) {
            this.ctx.quadraticCurveTo(x + size/2, y + size - radius * 1.5, x + radius, y + size - radius);
        } else {
            this.ctx.lineTo(x, y + size);
        }
        
        // Bottom-left corner
        if (neighbors.down || neighbors.left) {
            this.ctx.lineTo(x + radius, y + size - radius);
        }
        
        // Left edge
        if (neighbors.left) {
            this.ctx.quadraticCurveTo(x + radius * 1.5, y + size/2, x + radius, y + radius);
        } else {
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.closePath();
        
        // Fill with base color
        this.ctx.fillStyle = baseColor;
        this.ctx.fill();
        
        // Draw darker border around tunnel edges for definition
        if (neighbors.up || neighbors.down || neighbors.left || neighbors.right) {
            this.ctx.strokeStyle = edgeColor;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }
        
        // Now fill the full tile for texture but clip to our shape isn't needed
        // Just fill the rectangle for texture
        this.ctx.fillStyle = baseColor;
        this.ctx.fillRect(x, y, size, size);
        
        // Re-cut the tunnel edges with actual transparency
        // Clear the curved edge areas to show background through
        if (neighbors.up) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.quadraticCurveTo(x + size/2, y + radius, x + size, y);
            this.ctx.lineTo(x + size, y);
            this.ctx.lineTo(x, y);
            this.ctx.closePath();
            this.ctx.clip();
            this.ctx.clearRect(x, y, size, radius + 2);
            this.ctx.restore();
            
            // Draw the curved edge border
            this.ctx.strokeStyle = edgeColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + radius/2);
            this.ctx.quadraticCurveTo(x + size/2, y + radius, x + size, y + radius/2);
            this.ctx.stroke();
        }
        
        if (neighbors.down) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + size);
            this.ctx.quadraticCurveTo(x + size/2, y + size - radius, x + size, y + size);
            this.ctx.lineTo(x + size, y + size);
            this.ctx.lineTo(x, y + size);
            this.ctx.closePath();
            this.ctx.clip();
            this.ctx.clearRect(x, y + size - radius - 2, size, radius + 2);
            this.ctx.restore();
            
            // Draw the curved edge border
            this.ctx.strokeStyle = edgeColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + size - radius/2);
            this.ctx.quadraticCurveTo(x + size/2, y + size - radius, x + size, y + size - radius/2);
            this.ctx.stroke();
        }
        
        if (neighbors.left) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.quadraticCurveTo(x + radius, y + size/2, x, y + size);
            this.ctx.lineTo(x, y + size);
            this.ctx.lineTo(x, y);
            this.ctx.closePath();
            this.ctx.clip();
            this.ctx.clearRect(x, y, radius + 2, size);
            this.ctx.restore();
            
            // Draw the curved edge border
            this.ctx.strokeStyle = edgeColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x + radius/2, y);
            this.ctx.quadraticCurveTo(x + radius, y + size/2, x + radius/2, y + size);
            this.ctx.stroke();
        }
        
        if (neighbors.right) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(x + size, y);
            this.ctx.quadraticCurveTo(x + size - radius, y + size/2, x + size, y + size);
            this.ctx.lineTo(x + size, y + size);
            this.ctx.lineTo(x + size, y);
            this.ctx.closePath();
            this.ctx.clip();
            this.ctx.clearRect(x + size - radius - 2, y, radius + 2, size);
            this.ctx.restore();
            
            // Draw the curved edge border
            this.ctx.strokeStyle = edgeColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x + size - radius/2, y);
            this.ctx.quadraticCurveTo(x + size - radius, y + size/2, x + size - radius/2, y + size);
            this.ctx.stroke();
        }
        
        // Create arcade-style speckled texture using deterministic random
        const dotSize = 2;
        const spacing = 6;
        
        // Lighter speckles
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        for (let dy = 0; dy < size; dy += spacing) {
            for (let dx = 0; dx < size; dx += spacing) {
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
    
    // Helper to lighten a color
    lightenColor(hex, factor) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        const lr = Math.min(255, Math.floor(r + (255 - r) * factor));
        const lg = Math.min(255, Math.floor(g + (255 - g) * factor));
        const lb = Math.min(255, Math.floor(b + (255 - b) * factor));
        
        return `rgb(${lr}, ${lg}, ${lb})`;
    }
    
    // Helper to darken a color
    darkenColor(hex, factor) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        const dr = Math.floor(r * (1 - factor));
        const dg = Math.floor(g * (1 - factor));
        const db = Math.floor(b * (1 - factor));
        
        return `rgb(${dr}, ${dg}, ${db})`;
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
