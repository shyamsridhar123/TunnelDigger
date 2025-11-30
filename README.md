# Tunnel Digger

A browser-based 2D arcade action game inspired by classic digging games. Dig tunnels, defeat monsters, and survive!

## 🎮 Game Features

- **Dig Tunnels**: Create paths through the underground by moving through dirt
- **Defeat Monsters**: Use your air pump to inflate and pop enemies
- **Drop Rocks**: Dig underneath rocks to crush monsters below
- **Power-ups**: Collect bonus items for extra points
- **Progressive Difficulty**: Each level brings more monsters and challenges
- **Retro Style**: Classic 8-bit graphics and chiptune sound effects

## 🕹️ How to Play

### Controls

**Desktop:**
- **Arrow Keys** or **WASD**: Move your character
- **Spacebar**: Use air pump (inflate adjacent monster)
- **P** or **ESC**: Pause game

**Mobile:**
- Use on-screen D-pad and pump button

### Gameplay

1. Dig tunnels by moving through dirt tiles
2. Avoid or defeat monsters:
   - **Pump Method**: Press spacebar near a monster to inflate it. Pump 4 times to defeat it!
   - **Rock Method**: Dig underneath rocks to make them fall and crush monsters below
3. Collect golden bonus items for extra points
4. Defeat all monsters to complete the level
5. Be careful - monsters can hurt you, and so can falling rocks!

### Monster Types

- **Basic (Red)**: Standard speed, follows you through tunnels
- **Fast (Orange)**: Moves faster, appears in later levels
- **Ghost (Purple)**: Can phase through dirt, very dangerous!

### Scoring

- Monster defeated by pump: 200 points
- Monster defeated by rock: 300 points
- Bonus item: 500 points
- Level complete: 1000 × level number
- Chain bonus: Defeat monsters quickly for multiplier!

## 🚀 Getting Started

### Running Locally

1. Clone or download this repository
2. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)
3. That's it! No build process or dependencies required

### Running with a Local Server (Recommended)

For best performance, use a local web server:

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npx http-server
```

Then open `http://localhost:8000` in your browser.

## 📁 Project Structure

```
DigDug/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All game styling
├── js/
│   ├── config.js       # Game configuration and constants
│   ├── utils.js        # Utility functions and input handling
│   ├── audio.js        # Audio manager (Web Audio API)
│   ├── sprites.js      # Sprite rendering system
│   ├── grid.js         # Game grid/field management
│   ├── player.js       # Player character logic
│   ├── monster.js      # Monster AI and behavior
│   ├── rock.js         # Rock physics
│   ├── particles.js    # Particle effects system
│   ├── game.js         # Main game engine
│   └── main.js         # Entry point and UI handlers
└── README.md           # This file
```

## 🎨 Technical Details

- **Engine**: Pure JavaScript (ES6+) with HTML5 Canvas
- **Graphics**: Custom pixel-art style rendering system
- **Audio**: Web Audio API for procedural sound generation
- **No Dependencies**: Runs entirely in the browser without external libraries
- **Mobile Friendly**: Responsive design with touch controls

## 🛠️ Development

### Customization

You can easily customize the game by editing `js/config.js`:

- Adjust difficulty (monster count, speed)
- Change scoring values
- Modify grid size
- Tweak gameplay parameters

### Adding Features

The modular code structure makes it easy to extend:

- Add new monster types in `monster.js`
- Create new power-ups in `particles.js`
- Implement new level patterns in `grid.js`
- Add visual effects in `sprites.js`

## 📜 License & Credits

### Code
All game code is original and created for this project. You are free to:
- Use the code for learning purposes
- Modify and extend the game
- Create derivative works

**Attribution appreciated but not required.**

### Assets
- **Graphics**: All sprites are original pixel art
- **Audio**: Procedurally generated using Web Audio API
- **Inspiration**: Classic arcade games (gameplay mechanics only, no copyrighted assets used)

## 🎯 Roadmap

### Current Status: Prototype (v0.1)
✅ Core gameplay loop  
✅ Player movement and digging  
✅ Monster AI  
✅ Rock physics  
✅ Scoring system  
✅ Sound effects  
✅ Mobile controls  

### Planned Features (Alpha - v0.2)
- [ ] Enhanced sprite animations
- [ ] Background music tracks
- [ ] More monster varieties
- [ ] Special power-ups (speed boost, shield, etc.)
- [ ] Level variety and themes

### Future (Beta - v0.3+)
- [ ] Boss monsters
- [ ] Multiple playable characters
- [ ] Local high score storage
- [ ] Level editor
- [ ] Online leaderboard

## 🐛 Known Issues

- Some mobile devices may have audio latency
- Performance may vary on older devices
- Ghost monsters can occasionally get stuck in corners

## 🤝 Contributing

This is a solo learning project, but suggestions and feedback are welcome! Feel free to:
- Report bugs
- Suggest features
- Share gameplay experiences

## 📞 Support

Having issues? Check these common solutions:

**Problem: No sound**
- Solution: Click on the game window to enable audio (browser security requirement)

**Problem: Game runs slowly**
- Solution: Close other browser tabs, try a different browser

**Problem: Controls not working**
- Solution: Click on the game canvas to focus it

## 🎮 Tips & Tricks

1. **Plan your tunnels**: Think ahead about escape routes
2. **Rock strategy**: Position rocks above monster spawn areas
3. **Chain combos**: Defeat monsters quickly for score multipliers
4. **Safe zones**: Create cross-tunnel patterns for quick escapes
5. **Watch for ghosts**: They can phase through walls - stay in tunnels!

## 📊 Game Statistics

- Grid Size: 36×28 tiles
- Tile Size: 16×16 pixels
- Canvas Resolution: 576×448 pixels
- Starting Lives: 3
- Monster Types: 3

---

**Enjoy the game! Dig deep and defeat all monsters! 🎮⛏️👾**
