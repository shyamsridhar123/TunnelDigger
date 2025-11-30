# Copilot Instructions for Tunnel Digger

This is a pure JavaScript, browser-based 2D arcade game (Dig Dug inspired). The project uses a custom game engine without external frameworks like Phaser.

## 🏗 Architecture & Core Components

- **Entry Point**: `js/main.js` initializes the `Game` instance and handles DOM/UI events.
- **Game Loop**: Managed by `Game` class in `js/game.js`. Uses `requestAnimationFrame`.
  - `update(deltaTime)`: Logic updates.
  - `draw()`: Rendering via `SpriteManager`.
- **Grid System**: `js/grid.js` manages the 2D tile map (`tiles[][]`).
  - Coordinates: `gridX/gridY` (tile indices) vs `x/y` (pixel positions).
  - Use `Utils.gridToPixel` and `Utils.pixelToGrid` for conversion.
- **Configuration**: `js/config.js` contains all game constants (`CONFIG` object). **Always** use `CONFIG` for magic numbers (speeds, sizes, colors).
- **Entities**:
  - `Player` (`js/player.js`): Handles movement, digging, and pumping.
  - `Monster` (`js/monster.js`): AI behavior (chase, ghost mode).
  - `Rock` (`js/rock.js`): Physics for falling rocks.

## 🛠 Development Workflows

- **Running**: Open `index.html` in a browser. No build step required.
- **Debugging**: Use browser DevTools.
- **Assets**: Images are managed by `SpriteManager`. Audio by `AudioManager`.

## 🧩 Common Patterns & Conventions

- **Movement**: Entities move smoothly between grid tiles.
  - Logic: `targetX`/`targetY` are set based on grid destination.
  - Update: Position is interpolated towards target in `update()`.
- **Collision**:
  - Terrain: Checked via `Grid.getTile(x, y)` and `Grid.isWalkable(x, y)`.
  - Entity-Entity: Bounding box checks in `Game.update()`.
- **State Management**: Use `GAME_STATE` enum (in `js/config.js`) to control flow (TITLE, PLAYING, PAUSED).
- **Digging**: `Grid.dig(x, y)` changes tile from `TILE_DIRT` to `TILE_TUNNEL`.

## ⚠️ Critical Implementation Details

- **Grid Bounds**: Always check `Utils.isValidGridPosition(x, y)` before accessing `grid.tiles`.
- **Mobile Support**: `InputHandler` supports both keyboard and touch controls. Ensure UI elements are responsive.
- **Performance**: Avoid creating new objects in the `gameLoop`. Reuse objects or pools (e.g., particles) where possible.

## 📂 Key File Map

- `js/game.js`: Main loop, entity management, collision detection.
- `js/grid.js`: Map generation, tile manipulation.
- `js/config.js`: Game balance settings (speed, score, dimensions).
- `js/utils.js`: Helper functions for math, collision, and random generation.
