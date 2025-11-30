// Main Game Class
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Managers
        this.input = new InputHandler();
        this.spriteManager = new SpriteManager(this.ctx);
        this.audioManager = new AudioManager();
        this.particleSystem = new ParticleSystem();
        
        // Game objects
        this.grid = new Grid(CONFIG.GRID_WIDTH, CONFIG.GRID_HEIGHT);
        this.player = null;
        this.monsters = [];
        this.rocks = [];
        this.bonusItems = [];
        
        // Game state
        this.state = GAME_STATE.TITLE;
        this.score = 0;
        this.lives = CONFIG.STARTING_LIVES;
        this.level = 1;
        this.monstersDefeated = 0;
        this.chainMultiplier = 1;
        this.lastChainTime = 0;
        
        // Timing
        this.lastTime = 0;
        this.paused = false;
        
        // Level data
        this.totalMonsters = 0;
    }

    init() {
        this.showTitle();
    }

    showTitle() {
        this.state = GAME_STATE.TITLE;
        document.getElementById('title-screen').classList.remove('hidden');
    }

    startGame() {
        this.score = 0;
        this.lives = CONFIG.STARTING_LIVES;
        this.level = 1;
        this.state = GAME_STATE.PLAYING;
        this.loadLevel(this.level);
        this.updateUI();
    }

    loadLevel(levelNum) {
        // Clear previous level
        this.monsters = [];
        this.rocks = [];
        this.bonusItems = [];
        this.particleSystem.clear();
        
        // Generate grid
        this.grid.generateLevel(levelNum);
        
        // Create player
        this.player = new Player(CONFIG.PLAYER_START_X, CONFIG.PLAYER_START_Y, this.grid);
        
        // Define zones for spread-out placement
        // Divide the playable area into sections
        const zones = this.createPlacementZones();
        
        // Create monsters with spread-out placement
        const monsterCount = CONFIG.MONSTERS_PER_LEVEL + Math.floor((levelNum - 1) * CONFIG.DIFFICULTY_MONSTER_INCREASE);
        this.totalMonsters = monsterCount;
        this.monstersDefeated = 0;
        
        const monsterPositions = [];
        for (let i = 0; i < monsterCount; i++) {
            const pos = this.findSpreadPosition(zones, monsterPositions, 4, 8);
            
            const type = this.getMonsterTypeForLevel(levelNum, i);
            const monster = new Monster(pos.x, pos.y, this.grid, type);
            this.monsters.push(monster);
            monsterPositions.push(pos);

            // Create a small cave for the monster so it can move
            this.grid.setTile(pos.x, pos.y, CONFIG.TILE_TUNNEL);
            // Add a neighbor tile to make it a small tunnel (horizontal or vertical)
            if (Utils.randomInt(0, 1) === 0) {
                // Horizontal
                if (pos.x > 0) this.grid.setTile(pos.x - 1, pos.y, CONFIG.TILE_TUNNEL);
                if (pos.x < CONFIG.GRID_WIDTH - 1) this.grid.setTile(pos.x + 1, pos.y, CONFIG.TILE_TUNNEL);
            } else {
                // Vertical
                if (pos.y > 3) this.grid.setTile(pos.x, pos.y - 1, CONFIG.TILE_TUNNEL);
                if (pos.y < CONFIG.GRID_HEIGHT - 1) this.grid.setTile(pos.x, pos.y + 1, CONFIG.TILE_TUNNEL);
            }
        }
        
        // Create rocks with spread-out placement
        const rockCount = CONFIG.ROCKS_PER_LEVEL;
        const rockPositions = [];
        for (let i = 0; i < rockCount; i++) {
            const pos = this.findSpreadPosition(zones, rockPositions, 3, 0, true);
            const rock = new Rock(pos.x, pos.y, this.grid);
            this.rocks.push(rock);
            rockPositions.push(pos);
        }
        
        // Create bonus items with spread-out placement
        const bonusCount = CONFIG.BONUS_ITEMS_PER_LEVEL;
        const bonusPositions = [];
        for (let i = 0; i < bonusCount; i++) {
            const pos = this.findSpreadPosition(zones, bonusPositions, 5, 0);
            const bonus = new BonusItem(pos.x, pos.y, this.grid);
            this.bonusItems.push(bonus);
            bonusPositions.push(pos);
        }
    }

    // Create placement zones to ensure items are spread across the level
    createPlacementZones() {
        const zones = [];
        const zonesX = 3; // 3 columns
        const zonesY = 3; // 3 rows
        const zoneWidth = Math.floor(CONFIG.GRID_WIDTH / zonesX);
        const zoneHeight = Math.floor((CONFIG.GRID_HEIGHT - 3) / zonesY); // Skip top 3 rows (player area)
        
        for (let zy = 0; zy < zonesY; zy++) {
            for (let zx = 0; zx < zonesX; zx++) {
                zones.push({
                    x1: zx * zoneWidth,
                    y1: 3 + zy * zoneHeight,
                    x2: (zx + 1) * zoneWidth - 1,
                    y2: 3 + (zy + 1) * zoneHeight - 1,
                    used: 0
                });
            }
        }
        return zones;
    }

    // Find a spread-out position avoiding existing positions
    findSpreadPosition(zones, existingPositions, minDistance, playerMinDist = 0, needsSupport = false) {
        // Sort zones by usage to prefer less-used zones
        const sortedZones = [...zones].sort((a, b) => a.used - b.used);
        
        for (const zone of sortedZones) {
            // Try to find a valid position in this zone
            for (let attempts = 0; attempts < 20; attempts++) {
                const x = Utils.randomInt(zone.x1, zone.x2);
                const y = Utils.randomInt(zone.y1, zone.y2);
                
                // Check if position is valid
                if (!Utils.isValidGridPosition(x, y)) continue;
                
                // For rocks, need support and minimum height
                if (needsSupport) {
                    if (y < 5 || !this.grid.hasSupport(x, y)) continue;
                }
                
                // Check distance from player
                if (playerMinDist > 0 && this.player) {
                    if (Utils.distance(x, y, this.player.gridX, this.player.gridY) < playerMinDist) continue;
                }
                
                // Check distance from existing positions
                let tooClose = false;
                for (const pos of existingPositions) {
                    if (Utils.distance(x, y, pos.x, pos.y) < minDistance) {
                        tooClose = true;
                        break;
                    }
                }
                if (tooClose) continue;
                
                // Valid position found
                zone.used++;
                return { x, y };
            }
        }
        
        // Fallback: just find any valid position
        let pos = this.grid.findRandomDirtPosition();
        let attempts = 0;
        while (attempts < 50) {
            let valid = true;
            
            if (needsSupport && (pos.y < 5 || !this.grid.hasSupport(pos.x, pos.y))) {
                valid = false;
            }
            
            if (playerMinDist > 0 && this.player) {
                if (Utils.distance(pos.x, pos.y, this.player.gridX, this.player.gridY) < playerMinDist) {
                    valid = false;
                }
            }
            
            if (valid) return pos;
            
            pos = this.grid.findRandomDirtPosition();
            attempts++;
        }
        
        return pos;
    }

    getMonsterTypeForLevel(level, index) {
        // Mix of Pookas and Fygars from the start
        // Level 1: Mostly Pookas, maybe 1 Fygar
        if (level === 1) {
            return (index % 4 === 0) ? MONSTER_TYPE.FAST : MONSTER_TYPE.BASIC;
        }
        
        // Level 2+: More Fygars
        if (index % 2 === 0) return MONSTER_TYPE.FAST;
        
        return MONSTER_TYPE.BASIC;
    }

    update(deltaTime) {
        if (this.state !== GAME_STATE.PLAYING || this.paused) return;
        
        // Update music based on player movement
        if (this.audioManager && this.player) {
            this.audioManager.updateMusic(this.player.moving);
        }
        
        // Update player
        const pumpResult = this.player.update(deltaTime, this.input, this.monsters, this.audioManager);
        if (pumpResult && pumpResult.defeated) {
            this.onMonsterDefeated(pumpResult.monster, 'pump');
        }
        
        // Update monsters
        for (let i = this.monsters.length - 1; i >= 0; i--) {
            const monster = this.monsters[i];
            
            if (!monster.alive) {
                this.monsters.splice(i, 1);
                continue;
            }
            
            monster.update(deltaTime, this.player);
            
            // Check collision with player
            if (monster.checkCollisionWithPlayer(this.player)) {
                this.onPlayerHit();
            }
        }
        
        // Update rocks
        for (let i = this.rocks.length - 1; i >= 0; i--) {
            const rock = this.rocks[i];
            rock.update(deltaTime, this.audioManager);
            
            // Check collision with monsters
            for (let j = this.monsters.length - 1; j >= 0; j--) {
                const monster = this.monsters[j];
                if (rock.checkCollision(monster)) {
                    if (monster.defeat()) {
                        this.onMonsterDefeated(monster, 'rock');
                        this.particleSystem.createExplosion(
                            monster.x + CONFIG.TILE_SIZE / 2,
                            monster.y + CONFIG.TILE_SIZE / 2,
                            '#FF0000'
                        );
                    }
                }
            }
            
            // Check collision with player
            if (rock.checkCollision(this.player)) {
                this.onPlayerHit();
            }
        }
        
        // Update bonus items
        for (const bonus of this.bonusItems) {
            bonus.update(deltaTime);
            
            if (!bonus.collected && bonus.checkCollision(this.player)) {
                bonus.collect();
                this.addScore(CONFIG.SCORE_BONUS_ITEM);
                this.audioManager.playCollectSound();
                this.particleSystem.createExplosion(
                    bonus.x + CONFIG.TILE_SIZE / 2,
                    bonus.y + CONFIG.TILE_SIZE / 2,
                    CONFIG.COLOR_BONUS
                );
            }
        }
        
        // Update particles
        this.particleSystem.update(deltaTime);
        
        // Check level complete
        if (this.monstersDefeated >= this.totalMonsters) {
            this.onLevelComplete();
        }
    }

    onMonsterDefeated(monster, method) {
        this.monstersDefeated++;
        
        // Calculate score with chain multiplier
        let baseScore = method === 'pump' ? CONFIG.SCORE_MONSTER_PUMP : CONFIG.SCORE_MONSTER_ROCK;
        
        // Check for chain
        const now = Date.now();
        if (now - this.lastChainTime < 1000) {
            this.chainMultiplier += 0.5;
        } else {
            this.chainMultiplier = 1;
        }
        this.lastChainTime = now;
        
        const score = Math.floor(baseScore * this.chainMultiplier);
        this.addScore(score);
        
        // Create particles
        this.particleSystem.createExplosion(
            monster.x + CONFIG.TILE_SIZE / 2,
            monster.y + CONFIG.TILE_SIZE / 2,
            '#FF00FF',
            30
        );
    }

    onPlayerHit() {
        if (this.player.takeDamage()) {
            this.lives--;
            this.audioManager.playDamageSound();
            this.updateUI();
            
            // Create particles
            this.particleSystem.createExplosion(
                this.player.x + CONFIG.TILE_SIZE / 2,
                this.player.y + CONFIG.TILE_SIZE / 2,
                CONFIG.COLOR_PLAYER,
                20
            );
            
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                // Reset player position
                this.player.reset(CONFIG.PLAYER_START_X, CONFIG.PLAYER_START_Y);
            }
        }
    }

    onLevelComplete() {
        this.addScore(CONFIG.SCORE_LEVEL_COMPLETE * this.level);
        this.audioManager.playLevelCompleteSound();
        this.state = GAME_STATE.LEVEL_COMPLETE;
        
        document.getElementById('level-score').textContent = Utils.formatScore(this.score);
        document.getElementById('level-complete-screen').classList.remove('hidden');
    }

    nextLevel() {
        document.getElementById('level-complete-screen').classList.add('hidden');
        this.level++;
        this.state = GAME_STATE.PLAYING;
        this.loadLevel(this.level);
        this.updateUI();
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        this.audioManager.playGameOverSound();
        
        document.getElementById('final-score').textContent = Utils.formatScore(this.score);
        document.getElementById('game-over-screen').classList.remove('hidden');
    }

    addScore(points) {
        this.score += points;
        this.updateUI();
    }

    updateUI() {
        document.getElementById('score').textContent = Utils.formatScore(this.score);
        document.getElementById('level').textContent = this.level;
        
        // Update flower lives display
        const flowersContainer = document.getElementById('lives-flowers');
        if (flowersContainer) {
            flowersContainer.innerHTML = '';
            const flowerSprite = this.spriteManager.createSmallSprite('flower', 24);
            if (flowerSprite) {
                for (let i = 0; i < this.lives; i++) {
                    const img = document.createElement('img');
                    img.src = flowerSprite.toDataURL();
                    img.className = 'flower-life';
                    img.alt = 'Life';
                    flowersContainer.appendChild(img);
                }
            }
        }
    }

    togglePause() {
        if (this.state !== GAME_STATE.PLAYING) return;
        
        this.paused = !this.paused;
        const pauseScreen = document.getElementById('pause-screen');
        
        if (this.paused) {
            pauseScreen.classList.remove('hidden');
        } else {
            pauseScreen.classList.add('hidden');
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = CONFIG.COLOR_BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.state === GAME_STATE.TITLE) return;
        
        // Draw grid
        this.grid.draw(this.spriteManager);
        
        // Draw bonus items
        for (const bonus of this.bonusItems) {
            bonus.draw(this.spriteManager);
        }
        
        // Draw rocks
        for (const rock of this.rocks) {
            rock.draw(this.spriteManager);
        }
        
        // Draw monsters
        for (const monster of this.monsters) {
            monster.draw(this.spriteManager);
        }
        
        // Draw player
        if (this.player) {
            this.player.draw(this.spriteManager);
        }
        
        // Draw particles
        this.particleSystem.draw(this.spriteManager);
    }

    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update
        this.update(deltaTime);
        
        // Draw
        this.draw();
        
        // Update input state
        this.input.update();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    start() {
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
}
