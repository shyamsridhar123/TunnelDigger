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
    PLAYER_PUMP_RANGE: 1.5, // tiles
    PLAYER_PUMP_TIME: 300, // ms per pump action
    
    // Monster settings
    MONSTER_SPEED: 2,
    MONSTER_GHOST_SPEED: 1,
    MONSTER_GHOST_INTERVAL: 8000, // ms before going ghost
    MONSTER_GHOST_DURATION: 3000, // ms in ghost mode
    MONSTER_PUMP_STAGES: 4, // number of pumps to defeat
    MONSTER_INFLATE_DURATION: 500, // ms before deflating (reduced for snappier gameplay)
    
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
    
    // Colors (Arcade Style)
    COLOR_BACKGROUND: '#000000',
    COLOR_SKY: '#000000', // The arcade game actually has black background for tunnels, sky is drawn on top
    COLOR_DIRT_LAYERS: [
        '#E8A000', // Golden/Orange-Yellow (Top) - matches arcade
        '#D07000', // Orange
        '#B84000', // Deep Orange/Red
        '#901800'  // Dark Red/Brown
    ],
    COLOR_TUNNEL: '#000000',
    COLOR_ROCK: '#FFB851',
    COLOR_PLAYER: '#FFFFFF',
    COLOR_MONSTER: '#FF0000',
    COLOR_BONUS: '#FFD700',
    
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
