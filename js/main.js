// =================================================================================
// --- MAIN MODULE ---
// The core of the engine. Manages state, the game loop, and initialization.
// Coordinates all other modules.
// =================================================================================
document.addEventListener('DOMContentLoaded', () => {

    let gameState;
    let gameMode = 'mainMenu';
    const keysPressed = {};
    let activeInteractable = null;

    function createNewGameState() {
        return {
            player: { x: 100, y: 100, inventory: [] },
            flags: {},
            dialogueNodes: {},
            activeQuests: [],
            completedQuests: [],
            questStates: {},
            objectStates: {}
        };
    }

    function saveGame() {
        localStorage.setItem('forestOfLoveSave', JSON.stringify(gameState));
        alert("Game Saved!");
    }

    function loadGame() {
        const saved = localStorage.getItem('forestOfLoveSave');
        if (saved) {
            gameState = JSON.parse(saved);
            return true;
        }
        return false;
    }

    function startGame() {
        document.getElementById('main-menu-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        spawnGameObjects();
        switchGameMode('gameplay');
    }

    function spawnGameObjects() {
        const world = document.getElementById('world-space');
        world.innerHTML = '';
        gameData.gameObjects.forEach(objData => {
            const isRemoved = gameState.objectStates[objData.id]?.removed ?? objData.removed;
            if (isRemoved) return;
            const objEl = document.createElement('div');
            objEl.id = objData.id;
            objEl.className = `game-object ${objData.type}`;
            objEl.dataset.id = objData.id;
            if (objData.type === 'player') {
                 objEl.style.left = gameState.player.x + 'px';
                 objEl.style.top = gameState.player.y + 'px';
            } else {
                objEl.style.left = objData.x + 'px';
                objEl.style.top = objData.y + 'px';
            }
            if (objData.type === 'character') {
                objEl.textContent = gameData.characters[objData.id].name.slice(0, 1);
            }
            world.appendChild(objEl);
        });
    }

    function gameLoop() {
        if (gameMode === 'gameplay') {
            engineInteraction.handlePlayerMovement(keysPressed);
            activeInteractable = engineInteraction.checkProximity();
        }
        requestAnimationFrame(gameLoop);
    }

    function switchGameMode(newMode) {
        gameMode = newMode;
        document.getElementById('dialogue-overlay').style.display = 'none';
        document.getElementById('interaction-prompt').style.display = 'none';
        if (newMode !== 'modal') {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        }
        if (gameMode === 'dialogue') {
            document.getElementById('dialogue-overlay').style.display = 'block';
        }
    }

    function startDialogue(charId) {
        switchGameMode('dialogue');
        let nodeId;

        const savedNode = gameState.dialogueNodes[charId];
        const hasMet = gameState.flags[`${charId}_met`];
        const mainStartNode = gameData.dialogue[charId]['start'];
        const unmetStartNode = gameData.dialogue[charId]['start_unmet'];
        
        const charQuest = gameData.characters[charId].questId;
        const isQuestActiveOrDone = charQuest && (gameState.activeQuests.includes(charQuest) || gameState.completedQuests.includes(charQuest));

        if (savedNode && savedNode !== 'default' && gameData.dialogue[charId][savedNode]) {
            nodeId = savedNode;
        }
        else if (mainStartNode && !isQuestActiveOrDone && engineSystems.conditionChecker.check(mainStartNode.condition)) {
            nodeId = 'start';
        }
        else if (!hasMet && unmetStartNode) {
            nodeId = 'start_unmet';
        }
        else if (savedNode && gameData.dialogue[charId][savedNode]) {
             nodeId = savedNode;
        }
        else {
            nodeId = 'default';
        }

        renderDialogueNode(charId, nodeId);
    }

    function renderDialogueNode(charId, nodeId) {
        const node = gameData.dialogue[charId][nodeId];
        if (!node || engineSystems.conditionChecker.check(node.condition) === false) {
            endDialogue();
            return;
        }

        document.getElementById('dialogue-name').textContent = gameData.characters[charId].name;
        document.getElementById('dialogue-text').textContent = node.text;
        const choicesEl = document.getElementById('dialogue-choices');
        choicesEl.innerHTML = '';

        engineSystems.eventProcessor.process(node.events);
        engineUI.updateAll();
        spawnGameObjects();

        let hasChoices = false;
        if (node.choices) {
            node.choices.forEach((choice, index) => {
                if (engineSystems.conditionChecker.check(choice.condition)) {
                    hasChoices = true;
                    const button = document.createElement('button');
                    button.textContent = `(${index + 1}) ${choice.text}`;
                    button.onclick = () => renderDialogueNode(charId, choice.nextNode);
                    choicesEl.appendChild(button);
                }
            });
        }
        
        const endButton = document.createElement('button');
        if (hasChoices) {
            endButton.textContent = `(0) Goodbye`;
        } else {
            endButton.textContent = `[Goodbye]`;
        }
        endButton.onclick = endDialogue;
        choicesEl.appendChild(endButton);
    }
    
    function endDialogue() {
        switchGameMode('gameplay');
    }

    function init() {
        const gameStateProvider = () => gameState;
        engineSystems.init(gameStateProvider);
        engineUI.init(gameStateProvider);
        engineInteraction.init(gameStateProvider);

        document.getElementById('new-game-btn').addEventListener('click', () => {
            gameState = createNewGameState();
            startGame();
        });
        document.getElementById('continue-game-btn').addEventListener('click', () => {
            if (loadGame()) {
                startGame();
            } else {
                alert("No save file found. Starting New Game.");
                gameState = createNewGameState();
                startGame();
            }
        });

        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            keysPressed[key] = true;

            if (gameMode === 'dialogue') {
                if (!isNaN(key)) {
                    const choiceButtons = Array.from(document.querySelectorAll('#dialogue-choices button'));
                    const targetButton = choiceButtons.find(btn => btn.textContent.trim().startsWith(`(${key})`));
                    if (targetButton) {
                        targetButton.click();
                    }
                } else if (key === ' ' || key === 'enter') {
                    const choiceButtons = document.querySelectorAll('#dialogue-choices button');
                    if (choiceButtons.length === 1 && choiceButtons[0].textContent.trim().startsWith('[')) {
                        choiceButtons[0].click();
                    }
                }
            } else if (gameMode === 'gameplay') {
                if (key === ' ') {
                   const charId = engineInteraction.interact(activeInteractable);
                   if (charId) startDialogue(charId);
                }
                if (key === 'i') {
                    const isOpen = engineUI.toggleModal('inventory');
                    switchGameMode(isOpen ? 'modal' : 'gameplay');
                }
                if (key === 'q') {
                    const isOpen = engineUI.toggleModal('quest-log');
                    switchGameMode(isOpen ? 'modal' : 'gameplay');
                }
                if (key === 'c') {
                    const isOpen = engineUI.toggleModal('critter-log');
                    switchGameMode(isOpen ? 'modal' : 'gameplay');
                }
            }
            
            if (key === 'escape' && gameMode === 'modal') {
                switchGameMode('gameplay');
            }
        });

        window.addEventListener('keyup', (e) => {
            keysPressed[e.key.toLowerCase()] = false;
        });

        gameLoop();
    }
    
    init();
});