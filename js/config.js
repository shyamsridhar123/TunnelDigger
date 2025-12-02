// Game Configuration
const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 672,  // 14 * 48
    CANVAS_HEIGHT: 720, // 15 * 48
    
    // Grid settings
    TILE_SIZE: 48,
    GRID_WIDTH: 14,
    GRID_HEIGHT: 15,
    
    // Player settings
    PLAYER_SPEED: 4,    // Increased for larger scale
    PLAYER_START_X: 7,  // Center of 14 width
    PLAYER_START_Y: 1,
    PLAYER_PUMP_RANGE: 2.0, // tiles (increased for better gameplay)
    PLAYER_PUMP_TIME: 300, // ms per pump action
    
    // Monster settings
    MONSTER_SPEED: 1.5,
    MONSTER_GHOST_SPEED: 1,
    MONSTER_GHOST_INTERVAL: 15000, // ms before going ghost (increased for fairness)
    MONSTER_GHOST_DURATION: 5000, // ms in ghost mode
    MONSTER_PUMP_STAGES: 4, // number of pumps to defeat
    MONSTER_INFLATE_DURATION: 800, // ms before deflating
    
    // Rock settings
    ROCK_FALL_SPEED: 6,
    ROCK_WOBBLE_TIME: 1000, // ms to wobble before falling
    ROCK_SETTLE_TIME: 100, // ms delay before checking fall
    
    // Game settings
    STARTING_LIVES: 3,
    INVINCIBILITY_TIME: 2000, // ms after taking damage
    
    // Scoring
    SCORE_MONSTER_PUMP: 200,
    SCORE_MONSTER_ROCK: 300,
    SCORE_BONUS_ITEM: 500,
    SCORE_LEVEL_COMPLETE: 1000,
    SCORE_CHAIN_MULTIPLIER: 1.5,
    
    // Tile types
    TILE_EMPTY: 0,
    TILE_DIRT: 1,
    TILE_ROCK: 2,
    TILE_TUNNEL: 3,
    TILE_BONUS: 4,
    
    // Colors (Classic Arcade Style - Enhanced)
    COLOR_BACKGROUND: '#0a0a14', // Dark underground blue-black
    COLOR_SKY: '#4080FF',        // Blue sky at top (classic Dig Dug)
    COLOR_DIRT_LAYERS: [
        '#D88020', // Golden/Orange-Yellow (Top) - classic arcade
        '#C06020', // Orange
        '#A04020', // Deep Orange/Red
        '#802010'  // Dark Red/Brown (Bottom)
    ],
    COLOR_TUNNEL: '#0a0a14',     // Dark underground (matches background)
    COLOR_ROCK: '#808080',       // Gray rocks
    COLOR_PLAYER: '#FFFFFF',     // White suit
    COLOR_MONSTER: '#FF0000',    // Red Pooka
    COLOR_BONUS: '#00FF00',      // Green vegetables
    
    // Classic Arcade Visual Settings
    SKY_ROWS: 3,                 // Rows of blue sky at top
    SCANLINE_ENABLED: true,      // CRT scanline effect
    PIXEL_PERFECT: true,         // Crisp pixel rendering
    
    // Particle Effects Settings
    PARTICLE_GLOW_ENABLED: false, // Keep it simple like arcade
    SCREEN_SHAKE_ENABLED: true,
    TRAIL_EFFECTS_ENABLED: false,
    
    // Animation settings
    ANIMATION_FRAME_DURATION: 100, // ms per frame
    
    // Level generation
    MONSTERS_PER_LEVEL: 4,
    ROCKS_PER_LEVEL: 8,
    BONUS_ITEMS_PER_LEVEL: 2,
    
    // Difficulty scaling
    DIFFICULTY_SPEED_INCREASE: 0.1,
    DIFFICULTY_MONSTER_INCREASE: 1,
};

// Game States
const GAME_STATE = {
    TITLE: 'title',
    INSTRUCTIONS: 'instructions',
    PLAYING: 'playing',
    PAUSED: 'paused',
    LEVEL_COMPLETE: 'level_complete',
    GAME_OVER: 'game_over'
};

// Direction constants
const DIRECTION = {
    NONE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

// Monster types
const MONSTER_TYPE = {
    BASIC: 0,
    FAST: 1,
    GHOST: 2
};
