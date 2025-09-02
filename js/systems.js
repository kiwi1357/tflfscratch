// =================================================================================
// --- SYSTEMS MODULE ---
// Handles the data-processing "brain" of the engine.
// =================================================================================

const engineSystems = {
    eventProcessor: {
        process(events, gameState) {
            if (!events) return;
            events.forEach(event => {
                switch (event.type) {
                    case "SET_FLAG":
                        gameState.flags[event.flag] = true;
                        break;
                    case "ACTIVATE_QUEST":
                        if (!gameState.activeQuests.includes(event.questId)) {
                            gameState.activeQuests.push(event.questId);
                            gameState.questStates[event.questId] = { objectives: [] };
                        }
                        break;
                    case "COMPLETE_OBJECTIVE":
                        if(gameState.questStates[event.questId]) {
                            gameState.questStates[event.questId].objectives[event.objectiveIndex] = true;
                        }
                        break;
                    case "SET_DIALOGUE_NODE":
                        gameState.dialogueNodes[event.charId] = event.nodeId;
                        break;
                    case "REMOVE_ITEM":
                        gameState.player.inventory = gameState.player.inventory.filter(item => item !== event.itemId);
                        break;
                    case "UNHIDE_OBJECT":
                        gameState.objectStates[event.objectId] = { removed: false };
                        // This event also requires a UI update, handled in main.js
                        break;
                }
            });
        }
    },
    conditionChecker: {
        check(condition, gameState) {
            if (!condition) return true;
            switch (condition.type) {
                case "HAS_ITEM":
                    return gameState.player.inventory.includes(condition.itemId);
                case "HAS_FLAG":
                    return gameState.flags[condition.flag] === true;
                default:
                    return true;
            }
        }
    }
};