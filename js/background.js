// Classic Arcade Background - Dig Dug style with blue sky and flowers
class SpaceBackground {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        
        // Pre-render the static background
        this.staticCanvas = document.createElement('canvas');
        this.staticCanvas.width = width;
        this.staticCanvas.height = height;
        this.renderStaticBackground();
        
        // Animation timing for subtle effects
        this.time = 0;
        
        // Flowers at the top (classic Dig Dug feature)
        this.flowers = [];
        this.initFlowers();
    }
    
    initFlowers() {
        // Create decorative flowers along the top (classic arcade style)
        const flowerCount = Math.floor(this.width / 60);
        for (let i = 0; i < flowerCount; i++) {
            this.flowers.push({
                x: 30 + i * 60 + Math.random() * 20 - 10,
                y: CONFIG.TILE_SIZE * 2.5 + Math.random() * 10,
                size: 6 + Math.random() * 4,
                color: this.getFlowerColor(),
                swayOffset: Math.random() * Math.PI * 2,
                swaySpeed: 0.002 + Math.random() * 0.001
            });
        }
    }
    
    getFlowerColor() {
        const colors = ['#FF69B4', '#FF6347', '#FFD700', '#FF4500', '#FF1493'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    renderStaticBackground() {
        const ctx = this.staticCanvas.getContext('2d');
        
        // Fill entire background with dark underground gradient (instead of pure black)
        // This shows through the tunnels - made slightly brighter for visibility
        const undergroundGradient = ctx.createLinearGradient(0, 0, 0, this.height);
        undergroundGradient.addColorStop(0, '#1e1e30');   // Dark blue-grey at top
        undergroundGradient.addColorStop(0.3, '#161626'); // Darker
        undergroundGradient.addColorStop(0.6, '#101018'); // Very dark blue
        undergroundGradient.addColorStop(1, '#080810');   // Almost black at bottom (deep underground)
        
        ctx.fillStyle = undergroundGradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Add subtle underground texture/rocks
        this.drawUndergroundDetails(ctx);
        
        // Draw blue sky at top (classic Dig Dug style)
        const skyHeight = CONFIG.TILE_SIZE * CONFIG.SKY_ROWS;
        
        // Gradient sky like the original
        const skyGradient = ctx.createLinearGradient(0, 0, 0, skyHeight);
        skyGradient.addColorStop(0, '#4080FF');   // Bright blue at top
        skyGradient.addColorStop(0.7, '#6090FF'); // Slightly lighter
        skyGradient.addColorStop(1, '#80A0FF');   // Lighter at horizon
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, this.width, skyHeight);
        
        // Add some simple clouds (arcade style - just white rectangles/shapes)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.drawArcadeCloud(ctx, 50, 30, 60, 20);
        this.drawArcadeCloud(ctx, 200, 50, 80, 25);
        this.drawArcadeCloud(ctx, 400, 25, 70, 22);
        this.drawArcadeCloud(ctx, 550, 45, 55, 18);
        
        // Ground line where sky meets dirt
        ctx.fillStyle = '#408020'; // Green grass line
        ctx.fillRect(0, skyHeight - 4, this.width, 4);
    }
    
    drawUndergroundDetails(ctx) {
        // Add subtle rock/cave details in the underground areas
        // These will show through when tunnels are dug
        
        // Small rocks/pebbles scattered in the underground (slightly brighter)
        const rockColors = ['#2a2a40', '#252538', '#303048', '#282838'];
        
        for (let i = 0; i < 60; i++) {
            const x = Math.random() * this.width;
            const y = CONFIG.TILE_SIZE * 3 + Math.random() * (this.height - CONFIG.TILE_SIZE * 3);
            const size = 2 + Math.random() * 5;
            
            ctx.fillStyle = rockColors[Math.floor(Math.random() * rockColors.length)];
            ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(size), Math.floor(size));
        }
        
        // Add some subtle root/vein patterns (more visible)
        ctx.strokeStyle = 'rgba(80, 65, 50, 0.2)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 20; i++) {
            const startX = Math.random() * this.width;
            const startY = CONFIG.TILE_SIZE * 4 + Math.random() * (this.height - CONFIG.TILE_SIZE * 5);
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            let x = startX;
            let y = startY;
            const segments = 3 + Math.floor(Math.random() * 4);
            
            for (let j = 0; j < segments; j++) {
                x += (Math.random() - 0.5) * 30;
                y += 10 + Math.random() * 20;
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
        
        // Add some sparse glowing mineral dots for visual interest
        ctx.fillStyle = 'rgba(100, 150, 200, 0.15)';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * this.width;
            const y = CONFIG.TILE_SIZE * 5 + Math.random() * (this.height - CONFIG.TILE_SIZE * 6);
            const size = 1 + Math.random() * 2;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawArcadeCloud(ctx, x, y, width, height) {
        // Simple pixelated cloud shape
        const step = 8;
        ctx.fillRect(x + step, y, width - step * 2, height);
        ctx.fillRect(x, y + step/2, width, height - step);
    }
    
    update(deltaTime) {
        this.time += deltaTime;
    }
    
    draw() {
        // Draw static background (sky + underground)
        this.ctx.drawImage(this.staticCanvas, 0, 0);
        
        // Draw animated flowers with gentle sway
        for (const flower of this.flowers) {
            const sway = Math.sin(this.time * flower.swaySpeed + flower.swayOffset) * 2;
            this.drawFlower(flower.x + sway, flower.y, flower.size, flower.color);
        }
    }
    
    drawFlower(x, y, size, color) {
        const ctx = this.ctx;
        
        // Stem
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size * 2);
        ctx.stroke();
        
        // Petals (simple arcade style)
        ctx.fillStyle = color;
        const petalSize = size * 0.6;
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const px = x + Math.cos(angle) * size * 0.5;
            const py = y + Math.sin(angle) * size * 0.5;
            ctx.beginPath();
            ctx.arc(px, py, petalSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Center
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
    }
}
