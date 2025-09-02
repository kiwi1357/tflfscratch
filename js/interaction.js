// =================================================================================
// --- INTERACTION MODULE ---
// Handles player movement, proximity checks, and interaction logic.
// =================================================================================

const engineInteraction = {
    handlePlayerMovement(gameState, keysPressed) {
        const playerEl = document.getElementById('player');
        if (!playerEl) return;
        let { x, y } = gameState.player;
        const speed = gameData.settings.playerSpeed;

        if (keysPressed['w']) y -= speed;
        if (keysPressed['s']) y += speed;
        if (keysPressed['a']) x -= speed;
        if (keysPressed['d']) x += speed;

        const world = document.getElementById('world-space').getBoundingClientRect();
        x = Math.max(0, Math.min(x, world.width - playerEl.offsetWidth));
        y = Math.max(0, Math.min(y, world.height - playerEl.offsetHeight));
        
        gameState.player.x = x;
        gameState.player.y = y;
        playerEl.style.left = x + 'px';
        playerEl.style.top = y + 'px';
    },

    checkProximity(gameState) {
        const playerEl = document.getElementById('player');
        if (!playerEl) return null;
        const playerRect = playerEl.getBoundingClientRect();
        let closestInteractable = null;

        document.querySelectorAll('.game-object:not(#player)').forEach(obj => {
            if (obj.style.display === 'none') return;
            const objRect = obj.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(playerRect.x - objRect.x, 2) + Math.pow(playerRect.y - objRect.y, 2)
            );
            if (distance < gameData.settings.interactionRadius) {
                closestInteractable = obj;
            }
        });
        document.getElementById('interaction-prompt').style.display = closestInteractable ? 'block' : 'none';
        return closestInteractable;
    },

    interact(target, gameState) {
        if (target) {
            const id = target.dataset.id;
            const type = target.classList.contains('character') ? 'character' : 'item';
            
            if (type === 'item') {
                gameState.player.inventory.push(id);
                gameState.objectStates[id] = { removed: true };
                target.style.display = 'none';

                // Specific quest logic for picking up this item
                if (id === 'driftwood') {
                    engineSystems.eventProcessor.process([{ type: "COMPLETE_OBJECTIVE", questId: "bridgeRepair", objectiveIndex: 1 }], gameState);
                } else if (id === 'sugar') {
                     engineSystems.eventProcessor.process([{ type: "COMPLETE_OBJECTIVE", questId: "sugarAndSpice", objectiveIndex: 1 }], gameState);
                }
                return null; // Return null because item interaction doesn't open dialogue
            }
            return id; // Return character ID to start dialogue
        }
        return null;
    }
};