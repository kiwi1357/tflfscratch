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
        const playerEl = document.getElementById('player');
        if (!playerEl || !gameState) return;

        let { x, y } = gameState.player;
        const speed = gameData.settings.playerSpeed;

        if (keysPressed['w'] || keysPressed['arrowup']) y -= speed;
        if (keysPressed['s'] || keysPressed['arrowdown']) y += speed;
        if (keysPressed['a'] || keysPressed['arrowleft']) x -= speed;
        if (keysPressed['d'] || keysPressed['arrowright']) x += speed;

        const world = document.getElementById('world-space').getBoundingClientRect();
        x = Math.max(0, Math.min(x, world.width - playerEl.offsetWidth));
        y = Math.max(0, Math.min(y, world.height - playerEl.offsetHeight));
        
        gameState.player.x = x;
        gameState.player.y = y;
        playerEl.style.left = x + 'px';
        playerEl.style.top = y + 'px';
    },

    checkProximity() {
        const gameState = this._getGameState();
        const playerEl = document.getElementById('player');
        if (!playerEl || !gameState) return null;

        const playerRect = playerEl.getBoundingClientRect();
        let closestInteractable = null;

        document.querySelectorAll('.game-object:not(#player)').forEach(obj => {
            if (obj.style.display === 'none') return;
            const objRect = obj.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow((playerRect.x + playerRect.width / 2) - (objRect.x + objRect.width / 2), 2) + 
                Math.pow((playerRect.y + playerRect.height / 2) - (objRect.y + objRect.height / 2), 2)
            );
            
            if (distance < gameData.settings.interactionRadius) {
                closestInteractable = obj;
            }
        });

        document.getElementById('interaction-prompt').style.display = closestInteractable ? 'block' : 'none';
        return closestInteractable;
    },

    /**
     * THIS FUNCTION CONTAINS THE CORRECTED LOGIC
     */
    interact(target) {
        const gameState = this._getGameState();
        if (!target || !gameState) return null;

        const id = target.dataset.id;
        const type = target.classList.contains('character') ? 'character' : 'item';
        
        if (type === 'item') {
            // Add item to inventory if it's not already there
            if (!gameState.player.inventory.includes(id)) {
                gameState.player.inventory.push(id);
            }
            // Mark the object as removed in the game state
            gameState.objectStates[id] = { removed: true };
            // Hide the object visually
            target.style.display = 'none';

            // --- THIS IS THE ROBUST FIX ---
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