// =================================================================================
// --- INTERACTION MODULE ---
// Handles player movement, proximity checks, and interaction logic.
// =================================================================================

const engineInteraction = {
    _getGameState: null,

    init(gameStateProvider) {
        this._getGameState = gameStateProvider;
    },

    handlePlayerMovement(keysPressed) {
        const gameState = this._getGameState();
        if (!gameState) return;

        let { x, y } = gameState.player;
        const speed = gameData.settings.playerSpeed;

        if (keysPressed['w'] || keysPressed['arrowup']) y -= speed;
        if (keysPressed['s'] || keysPressed['arrowdown']) y += speed;
        if (keysPressed['a'] || keysPressed['arrowleft']) x -= speed;
        if (keysPressed['d'] || keysPressed['arrowright']) x += speed;

        const world = gameData.world;
        const playerSprite = gameData.characters.player.sprite;
        x = Math.max(0, Math.min(x, world.width - playerSprite.width));
        y = Math.max(0, Math.min(y, world.height - playerSprite.height));
        
        gameState.player.x = x;
        gameState.player.y = y;
    },

    checkProximity() {
        const gameState = this._getGameState();
        if (!gameState) return null;

        const playerDef = gameData.characters.player;
        const playerPoint = {
            x: gameState.player.x + (playerDef.sprite.width / 2),
            y: gameState.player.y + (playerDef.sprite.height / 2)
        };

        // Find the first object the player is interacting with
        for (const obj of gameData.gameObjects) {
            const isRemoved = gameState.objectStates[obj.id]?.removed ?? obj.removed;
            if (isRemoved) continue;

            const definition = obj.type === 'character' ? gameData.characters[obj.id] : gameData.items[obj.id];
            if (!definition || !definition.hitbox) continue;

            // Translate hitbox to world coordinates
            const worldHitbox = definition.hitbox.map(p => ({ x: p.x + obj.x, y: p.y + obj.y }));

            if (enginePhysics.pointInPolygon(playerPoint, worldHitbox)) {
                return obj; // Return the game object itself
            }
        }

        return null; // No interaction found
    },

    interact(target) {
        console.log("Interaction target:", JSON.stringify(target)); // NEW DEBUG LOG
        const gameState = this._getGameState();
        if (!target || !gameState) return null;

        const { id, type } = target;
        
        if (type === 'item') {
            console.log('Attempting to pick up item:', id);
            // Add item to inventory if it's not already there
            if (!gameState.player.inventory.includes(id)) {
                gameState.player.inventory.push(id);
            }
            console.log('Inventory is now:', JSON.stringify(gameState.player.inventory));
            // Mark the object as removed in the game state
            if (!gameState.objectStates[id]) gameState.objectStates[id] = {};
            gameState.objectStates[id].removed = true;

            // Create a list of events to process based on which item was picked up
            let eventsToProcess = [];
            if (id === 'driftwood') {
                eventsToProcess.push({ type: "COMPLETE_OBJECTIVE", questId: "bridgeRepair", objectiveIndex: 1 });
            } else if (id === 'sugar') {
                eventsToProcess.push({ type: "COMPLETE_OBJECTIVE", questId: "sugarAndSpice", objectiveIndex: 1 });
            } else if (id === 'lost_book') {
                eventsToProcess.push({ type: "COMPLETE_OBJECTIVE", questId: "aLostChapter", objectiveIndex: 1 });
            }

            // Process all events related to picking up this item
            engineSystems.eventProcessor.process(eventsToProcess);
            
            return null; // Item interaction does not start a dialogue
        }
        
        return id; // Character interaction returns the ID to start dialogue
    }
};