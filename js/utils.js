// Utility functions

class Utils {
    // Convert grid coordinates to pixel coordinates
    static gridToPixel(gridX, gridY) {
        return {
            x: gridX * CONFIG.TILE_SIZE,
            y: gridY * CONFIG.TILE_SIZE
        };
    }

    // Convert pixel coordinates to grid coordinates
    static pixelToGrid(pixelX, pixelY) {
        return {
            x: Math.floor(pixelX / CONFIG.TILE_SIZE),
            y: Math.floor(pixelY / CONFIG.TILE_SIZE)
        };
    }

    // Check if grid coordinates are valid
    static isValidGridPosition(x, y) {
        return x >= 0 && x < CONFIG.GRID_WIDTH && 
               y >= 0 && y < CONFIG.GRID_HEIGHT;
    }

    // Calculate distance between two points
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Calculate Manhattan distance
    static manhattanDistance(x1, y1, x2, y2) {
        return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    }

    // Get direction from one point to another
    static getDirection(fromX, fromY, toX, toY) {
        const dx = toX - fromX;
        const dy = toY - fromY;

        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
        } else if (dy !== 0) {
            return dy > 0 ? DIRECTION.DOWN : DIRECTION.UP;
        }
        return DIRECTION.NONE;
    }

    // Get vector from direction
    static getDirectionVector(direction) {
        switch (direction) {
            case DIRECTION.UP: return { x: 0, y: -1 };
            case DIRECTION.DOWN: return { x: 0, y: 1 };
            case DIRECTION.LEFT: return { x: -1, y: 0 };
            case DIRECTION.RIGHT: return { x: 1, y: 0 };
            default: return { x: 0, y: 0 };
        }
    }

    // Random integer between min and max (inclusive)
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Random float between min and max
    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Random element from array
    static randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Clamp value between min and max
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Linear interpolation
    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    // Check rectangle collision
    static rectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 &&
               x1 + w1 > x2 &&
               y1 < y2 + h2 &&
               y1 + h1 > y2;
    }

    // Deep clone object
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // Format score with leading zeros
    static formatScore(score, digits = 6) {
        return score.toString().padStart(digits, '0');
    }

    // Shuffle array (Fisher-Yates)
    static shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Check if point is in circle
    static pointInCircle(px, py, cx, cy, radius) {
        return this.distance(px, py, cx, cy) <= radius;
    }
}
