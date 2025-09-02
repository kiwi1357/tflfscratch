// =================================================================================
// --- SYSTEMS MODULE ---
// Handles the data-processing "brain" of the engine.
// =================================================================================

const engineSystems = {
    _getGameState: null,
    init(gameStateProvider) {
        this._getGameState = gameStateProvider;
    },

    checkQuestCompletion(questId) {
        const gameState = this._getGameState();
        const questState = gameState.questStates[questId];
        const questData = gameData.quests[questId];

        if (!questState || !questData) return;
        
        // Ensure every objective is explicitly true
        const allObjectivesComplete = questState.objectives.length === questData.objectives.length && questState.objectives.every(objective => objective === true);

        if (allObjectivesComplete) {
            if (!gameState.completedQuests.includes(questId)) {
                gameState.completedQuests.push(questId);
            }
            gameState.activeQuests = gameState.activeQuests.filter(id => id !== questId);
        }
    },

    eventProcessor: {
        process(events) {
            const gameState = engineSystems._getGameState();
            if (!events || !gameState) return;
            
            events.forEach(event => {
                switch (event.type) {
                    case "SET_FLAG":
                        gameState.flags[event.flag] = true;
                        break;
                    case "ACTIVATE_QUEST":
                        if (!gameState.activeQuests.includes(event.questId) && !gameState.completedQuests.includes(event.questId)) {
                            gameState.activeQuests.push(event.questId);
                            if (!gameState.questStates[event.questId]) {
                                gameState.questStates[event.questId] = { 
                                    objectives: Array(gameData.quests[event.questId].objectives.length).fill(false) 
                                };
                            }
                        }
                        break;
                    case "COMPLETE_OBJECTIVE":
                        if (!gameState.questStates[event.questId]) {
                             gameState.questStates[event.questId] = { 
                                objectives: Array(gameData.quests[event.questId].objectives.length).fill(false) 
                            };
                        }
                        gameState.questStates[event.questId].objectives[event.objectiveIndex] = true;
                        engineSystems.checkQuestCompletion(event.questId);
                        break;
                    case "SET_DIALOGUE_NODE":
                        gameState.dialogueNodes[event.charId] = event.nodeId;
                        break;
                    case "REMOVE_ITEM":
                        const itemIndex = gameState.player.inventory.indexOf(event.itemId);
                        if (itemIndex > -1) {
                            gameState.player.inventory.splice(itemIndex, 1);
                        }
                        break;
                    case "UNHIDE_OBJECT":
                        if (!gameState.objectStates[event.objectId]) {
                            gameState.objectStates[event.objectId] = {};
                        }
                        gameState.objectStates[event.objectId].removed = false;
                        break;
                }
            });
        }
    },
    conditionChecker: {
        check(condition) {
            const gameState = engineSystems._getGameState();
            if (!condition || !gameState) return true;
            switch (condition.type) {
                case "HAS_ITEM":
                    return gameState.player.inventory.includes(condition.itemId);
                // **THE FIX IS HERE:** New condition for checking if an item is NOT in the inventory.
                case "NOT_HAS_ITEM":
                    return !gameState.player.inventory.includes(condition.itemId);
                case "HAS_FLAG":
                    return gameState.flags[condition.flag] === true;
                default:
                    return true;
            }
        }
    }
};