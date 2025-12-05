// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Test suite for capturing gameplay screenshots
 */
test.describe('Gameplay Screenshots', () => {
  
  test('capture title screen', async ({ page }) => {
    // Navigate to the game
    await page.goto('/');
    
    // Wait for the title screen to be visible
    await page.waitForSelector('#title-screen', { state: 'visible' });
    
    // Wait a moment for any animations to settle
    await page.waitForTimeout(1000);
    
    // Take screenshot of title screen
    await page.screenshot({ 
      path: 'screenshots/title-screen.png',
      fullPage: true 
    });
  });

  test('capture gameplay', async ({ page }) => {
    // Navigate to the game
    await page.goto('/');
    
    // Wait for the title screen
    await page.waitForSelector('#title-screen', { state: 'visible' });
    
    // Click start button
    await page.click('#start-button');
    
    // Wait for game to start
    await page.waitForTimeout(1000);
    
    // Take initial gameplay screenshot
    await page.screenshot({ 
      path: 'screenshots/gameplay-start.png',
      fullPage: true 
    });
    
    // Simulate some gameplay - move around
    // Move right
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(500);
    await page.keyboard.up('ArrowRight');
    
    await page.waitForTimeout(200);
    
    // Move down
    await page.keyboard.down('ArrowDown');
    await page.waitForTimeout(500);
    await page.keyboard.up('ArrowDown');
    
    await page.waitForTimeout(200);
    
    // Move left
    await page.keyboard.down('ArrowLeft');
    await page.waitForTimeout(500);
    await page.keyboard.up('ArrowLeft');
    
    // Take screenshot after some movement
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'screenshots/gameplay-after-movement.png',
      fullPage: true 
    });
    
    // Continue gameplay for a bit longer
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(300);
    await page.keyboard.up('ArrowRight');
    
    await page.waitForTimeout(200);
    
    await page.keyboard.down('ArrowDown');
    await page.waitForTimeout(800);
    await page.keyboard.up('ArrowDown');
    
    await page.waitForTimeout(500);
    
    // Take final gameplay screenshot
    await page.screenshot({ 
      path: 'screenshots/gameplay-extended.png',
      fullPage: true 
    });
  });

  test('capture instructions screen', async ({ page }) => {
    // Navigate to the game
    await page.goto('/');
    
    // Wait for the title screen
    await page.waitForSelector('#title-screen', { state: 'visible' });
    
    // Click instructions button
    await page.click('#instructions-button');
    
    // Wait for instructions screen
    await page.waitForSelector('#instructions-screen', { state: 'visible' });
    await page.waitForTimeout(500);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'screenshots/instructions-screen.png',
      fullPage: true 
    });
  });

  test('capture gameplay with pump action', async ({ page }) => {
    // Navigate to the game
    await page.goto('/');
    
    // Wait for the title screen
    await page.waitForSelector('#title-screen', { state: 'visible' });
    
    // Click start button
    await page.click('#start-button');
    
    // Wait for game to start
    await page.waitForTimeout(1000);
    
    // Move around to find monsters
    await page.keyboard.down('ArrowDown');
    await page.waitForTimeout(1000);
    await page.keyboard.up('ArrowDown');
    
    await page.waitForTimeout(200);
    
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(800);
    await page.keyboard.up('ArrowRight');
    
    await page.waitForTimeout(500);
    
    // Try pump action (spacebar)
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'screenshots/gameplay-with-action.png',
      fullPage: true 
    });
  });

  test('capture canvas only', async ({ page }) => {
    // Navigate to the game
    await page.goto('/');
    
    // Wait for the title screen
    await page.waitForSelector('#title-screen', { state: 'visible' });
    
    // Click start button
    await page.click('#start-button');
    
    // Wait for game to start
    await page.waitForTimeout(1000);
    
    // Simulate some gameplay
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(600);
    await page.keyboard.up('ArrowRight');
    
    await page.waitForTimeout(200);
    
    await page.keyboard.down('ArrowDown');
    await page.waitForTimeout(600);
    await page.keyboard.up('ArrowDown');
    
    await page.waitForTimeout(500);
    
    // Take screenshot of just the canvas
    const canvas = await page.locator('#game-canvas');
    await canvas.screenshot({ 
      path: 'screenshots/canvas-gameplay.png' 
    });
  });
});
