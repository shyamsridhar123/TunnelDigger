// Classic Arcade Particle system - Dig Dug style
class Particle {
    constructor(x, y, vx, vy, color, life, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = options.size || Utils.randomInt(2, 4);
        this.alive = true;
        this.type = options.type || 'square'; // Arcade uses squares!
        this.gravity = options.gravity !== undefined ? options.gravity : 0.15;
        this.friction = options.friction || 0.99;
    }

    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.life -= deltaTime;
        
        if (this.life <= 0) {
            this.alive = false;
        }
    }

    draw(spriteManager) {
        if (!this.alive) return;
        
        const lifeRatio = this.life / this.maxLife;
        const alpha = lifeRatio;
        const size = Math.max(1, Math.floor(this.size * (0.5 + lifeRatio * 0.5)));
        
        const ctx = spriteManager.ctx;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        
        // Pixel-perfect squares for arcade feel
        const drawX = Math.floor(this.x);
        const drawY = Math.floor(this.y);
        ctx.fillRect(drawX, drawY, size, size);
        
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(deltaTime);
            
            if (!this.particles[i].alive) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(spriteManager) {
        for (const particle of this.particles) {
            particle.draw(spriteManager);
        }
    }

    // Classic arcade explosion - square particles
    createExplosion(x, y, color, count = 16) {
        const colors = [color, '#FFFFFF', '#FFFF00', '#FF8800'];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Utils.randomFloat(2, 5);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 1; // Slight upward bias
            const life = Utils.randomFloat(300, 500);
            const particleColor = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push(new Particle(x, y, vx, vy, particleColor, life, {
                size: Utils.randomInt(3, 6),
                gravity: 0.12
            }));
        }
    }

    // Burst effect for collecting items
    createBurst(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
            const vx = Utils.randomFloat(-3, 3);
            const vy = Utils.randomFloat(-4, -1);
            const life = Utils.randomFloat(250, 400);
            
            this.particles.push(new Particle(x, y, vx, vy, color, life, {
                size: Utils.randomInt(2, 4)
            }));
        }
    }

    // Trail effect
    createTrail(x, y, color) {
        const vx = Utils.randomFloat(-0.5, 0.5);
        const vy = Utils.randomFloat(-1, 0);
        const life = Utils.randomFloat(100, 200);
        
        this.particles.push(new Particle(x, y, vx, vy, color, life, {
            size: Utils.randomInt(2, 3),
            gravity: 0.05
        }));
    }

    // Dirt/dust effect for digging - brown tones
    createDust(x, y) {
        const dustColors = ['#C08040', '#A06030', '#805020', '#D09050'];
        
        for (let i = 0; i < 6; i++) {
            const vx = Utils.randomFloat(-2, 2);
            const vy = Utils.randomFloat(-3, -0.5);
            const life = Utils.randomFloat(200, 400);
            const color = dustColors[Math.floor(Math.random() * dustColors.length)];
            
            this.particles.push(new Particle(x, y, vx, vy, color, life, {
                size: Utils.randomInt(2, 5),
                gravity: 0.18
            }));
        }
    }
    
    // Sparkle effect for score/bonus
    createSparkle(x, y, color) {
        const sparkColors = [color, '#FFFFFF', '#FFFF00'];
        
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = Utils.randomFloat(1, 3);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 2;
            const life = Utils.randomFloat(300, 500);
            const pColor = sparkColors[Math.floor(Math.random() * sparkColors.length)];
            
            this.particles.push(new Particle(x, y, vx, vy, pColor, life, {
                size: Utils.randomInt(2, 4),
                gravity: -0.02 // Float up slightly
            }));
        }
    }
    
    // Rock crumble effect
    createRockCrumble(x, y) {
        const rockColors = ['#808080', '#606060', '#A0A0A0', '#707070'];
        
        for (let i = 0; i < 12; i++) {
            const vx = Utils.randomFloat(-3, 3);
            const vy = Utils.randomFloat(-2, 1);
            const life = Utils.randomFloat(400, 700);
            const color = rockColors[Math.floor(Math.random() * rockColors.length)];
            
            this.particles.push(new Particle(x, y, vx, vy, color, life, {
                size: Utils.randomInt(3, 7),
                gravity: 0.25
            }));
        }
    }

    clear() {
        this.particles = [];
    }
}
