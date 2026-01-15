# Playwright Screenshot Automation

This document describes how to use Playwright to automatically capture screenshots of the Tunnel Digger gameplay.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

All dependencies are already configured in `package.json`. To install them:

```bash
npm install
```

This will install:
- `@playwright/test` - Playwright test runner
- `playwright` - Playwright automation library

If you need to install the browser binaries:

```bash
npx playwright install chromium
```

## Running Screenshot Tests

We've created several npm scripts to make running the screenshot tests easy:

### Capture All Screenshots (Headless Mode)

```bash
npm run screengrab
```

This runs all screenshot tests in headless mode (no visible browser window) and captures:
- Title screen
- Initial gameplay
- Gameplay after movement
- Extended gameplay with multiple actions
- Instructions screen
- Gameplay with pump action
- Canvas-only screenshot

### Run with Visible Browser

To see the browser in action while capturing screenshots:

```bash
npm run screengrab:headed
```

### Debug Mode

For step-by-step debugging:

```bash
npm run test:debug
```

## Output

Screenshots are saved to the `screenshots/` directory with the following files:

- `title-screen.png` - The game's title screen
- `gameplay-start.png` - Initial gameplay state
- `gameplay-after-movement.png` - After some player movement
- `gameplay-extended.png` - Extended gameplay session
- `gameplay-with-action.png` - Gameplay with pump action
- `instructions-screen.png` - Instructions/help screen
- `canvas-gameplay.png` - Canvas element only (no UI overlay)

## Configuration

The Playwright configuration is in `playwright.config.js`. Key settings:

- **Test Directory**: `./tests`
- **Base URL**: `http://localhost:8000`
- **Web Server**: Automatically starts a Python HTTP server on port 8000
- **Browser**: Chromium (Desktop Chrome)

## Test File

The main test file is located at:
```
tests/gameplay-screenshots.spec.js
```

You can modify this file to:
- Add more test scenarios
- Change screenshot names
- Adjust timing and gameplay actions
- Capture different game states

## Customizing Tests

### Adding New Screenshot Scenarios

Edit `tests/gameplay-screenshots.spec.js` and add a new test:

```javascript
test('capture my custom scenario', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#title-screen', { state: 'visible' });
  
  // Your custom actions here
  
  await page.screenshot({ 
    path: 'screenshots/my-custom-screenshot.png',
    fullPage: true 
  });
});
```

### Adjusting Gameplay Actions

You can modify the keyboard inputs to capture different gameplay moments:

```javascript
// Move in different directions
await page.keyboard.down('ArrowUp');
await page.waitForTimeout(500);
await page.keyboard.up('ArrowUp');

// Use pump action
await page.keyboard.press('Space');

// Multiple key presses
await page.keyboard.press('ArrowDown');
await page.keyboard.press('ArrowDown');
```

### Changing Screenshot Options

Options for `page.screenshot()`:

```javascript
await page.screenshot({ 
  path: 'screenshots/my-screenshot.png',
  fullPage: true,           // Capture entire page
  clip: { x, y, width, height }, // Capture specific region
  type: 'png',              // 'png' or 'jpeg'
  quality: 100,             // For JPEG only (0-100)
});
```

### Element-Specific Screenshots

To capture only specific elements:

```javascript
const canvas = await page.locator('#game-canvas');
await canvas.screenshot({ path: 'screenshots/canvas-only.png' });
```

## Troubleshooting

### Port Already in Use

If port 8000 is already in use, you can either:
1. Stop the process using port 8000
2. Change the port in `playwright.config.js`

### Browser Not Installed

Run:
```bash
npx playwright install chromium
```

### Screenshots Not Saving

Make sure the `screenshots/` directory exists:
```bash
mkdir -p screenshots
```

## CI/CD Integration

To run these tests in a CI environment, make sure to:

1. Install dependencies: `npm ci`
2. Install Playwright browsers: `npx playwright install --with-deps chromium`
3. Run tests: `npm run screengrab`

The screenshots will be available as artifacts in your CI pipeline.

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Taking Screenshots](https://playwright.dev/docs/screenshots)
