// =================================================================================
// --- PHYSICS MODULE ---
// Handles collision detection.
// =================================================================================

const enginePhysics = {
    _getGameState: null,

    init(gameStateProvider) {
        this._getGameState = gameStateProvider;
    },

    /**
     * Checks if a point is inside a polygon using the ray-casting algorithm.
     * @param {{x: number, y: number}} point The point to check.
     * @param {Array<{x: number, y: number}>} polygon The polygon vertices.
     * @returns {boolean} True if the point is inside the polygon.
     */
    pointInPolygon(point, polygon) {
        const { x, y } = point;
        let isInside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;

            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) isInside = !isInside;
        }
        return isInside;
    }
};
