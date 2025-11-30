// Particle system for visual effects
class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = Utils.randomInt(2, 4);
        this.alive = true;
    }

    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // Gravity
        this.life -= deltaTime;
        
        if (this.life <= 0) {
            this.alive = false;
        }
    }

    draw(spriteManager) {
        if (!this.alive) return;
        
        const alpha = this.life / this.maxLife;
        const size = this.size * alpha;
        spriteManager.drawParticle(this.x, this.y, this.color, size);
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    update(deltaTime) {
        // Update all particles
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

    // Create explosion effect
    createExplosion(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Utils.randomFloat(2, 5);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = Utils.randomFloat(300, 600);
            
            this.particles.push(new Particle(x, y, vx, vy, color, life));
        }
    }

    // Create burst effect
    createBurst(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            const vx = Utils.randomFloat(-3, 3);
            const vy = Utils.randomFloat(-5, -1);
            const life = Utils.randomFloat(200, 400);
            
            this.particles.push(new Particle(x, y, vx, vy, color, life));
        }
    }

    // Create trail effect
    createTrail(x, y, color) {
        const vx = Utils.randomFloat(-1, 1);
        const vy = Utils.randomFloat(-1, 1);
        const life = Utils.randomFloat(100, 200);
        
        this.particles.push(new Particle(x, y, vx, vy, color, life));
    }

    // Create dust effect (for digging)
    createDust(x, y) {
        for (let i = 0; i < 5; i++) {
            const vx = Utils.randomFloat(-2, 2);
            const vy = Utils.randomFloat(-3, -1);
            const life = Utils.randomFloat(200, 400);
            const color = '#8B4513';
            
            this.particles.push(new Particle(x, y, vx, vy, color, life));
        }
    }

    // Clear all particles
    clear() {
        this.particles = [];
    }
}
