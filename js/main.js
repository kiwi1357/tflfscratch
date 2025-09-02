// =================================================================================
// --- MAIN MODULE ---
// The core of the engine. Manages state, the game loop, and initialization.
// Coordinates all other modules.
// =================================================================================
document.addEventListener('DOMContentLoaded', () => {

    // This makes gameState accessible to other scripts like ui.js
    window.gameState = {}; 
    let gameMode = 'mainMenu'; // mainMenu, gameplay, dialogue, modal
    const keysPressed = {};
    let activeInteractable = null;

    // --- CORE STATE MANAGEMENT FUNCTIONS ---
    function createNewGameState() {
        return {
            player: { x: 100, y: 100, inventory: [] },
            flags: {},
            dialogueNodes: {},
            activeQuests: [],
            questStates: {},
            objectStates: {}
        };
    }

    function saveGame() {
        localStorage.setItem('forestOfLoveSave', JSON.stringify(window.gameState));
        alert("Game Saved!");
    }

    function loadGame() {
        const saved = localStorage.getItem('forestOfLoveSave');
        if (saved) {
            window.gameState = JSON.parse(saved);
            return true;
        }
        return false;
    }

    // --- GAME FLOW FUNCTIONS ---
    function startGame() {
        document.getElementById('main-menu-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        spawnGameObjects();
        switchGameMode('gameplay');
    }

    function spawnGameObjects() {
        const world = document.getElementById('world-space');
        world.innerHTML = ''; // Clear previous objects
        gameData.gameObjects.forEach(objData => {
            const isRemoved = window.gameState.objectStates[objData.id]?.removed ?? objData.removed;
            if (isRemoved) return;

            const objEl = document.createElement('div');
            objEl.id = objData.id;
            objEl.className = `game-object ${objData.type}`;
            objEl.dataset.id = objData.id;
            
            if (objData.type === 'player') {
                 objEl.style.left = window.gameState.player.x + 'px';
                 objEl.style.top = window.gameState.player.y + 'px';
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
            engineInteraction.handlePlayerMovement(window.gameState, keysPressed);
            activeInteractable = engineInteraction.checkProximity(window.gameState);
        }
        requestAnimationFrame(gameLoop);
    }

    function switchGameMode(newMode) {
        gameMode = newMode;
        document.getElementById('dialogue-overlay').style.display = 'none';
        document.getElementById('interaction-prompt').style.display = 'none';
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        if (gameMode === 'dialogue') {
            document.getElementById('dialogue-overlay').style.display = 'block';
        }
    }

    // --- DIALOGUE FUNCTIONS ---
    function startDialogue(charId) {
        switchGameMode('dialogue');
        let currentNodeId;
        const currentSavedNode = window.gameState.dialogueNodes[charId];
        
        // Prioritize the saved node if it exists in the game data
        if (currentSavedNode && gameData.dialogue[charId][currentSavedNode]) {
            currentNodeId = currentSavedNode;
        } else {
            // Otherwise, figure out the correct starting point
            const hasMetCharacter = window.gameState.flags[`${charId}_met`];
            const unmetNodeExists = gameData.dialogue[charId]['start_unmet'];
            if (!hasMetCharacter && unmetNodeExists) {
                currentNodeId = 'start_unmet';
            } else {
                currentNodeId = 'start';
            }
        }
        
        // Final fallback to the default node if the chosen one is invalid
        if (!gameData.dialogue[charId][currentNodeId]) {
            currentNodeId = 'default';
        }

        renderDialogueNode(charId, currentNodeId);
    }

    function renderDialogueNode(charId, nodeId) {
        const node = gameData.dialogue[charId][nodeId];

        if (!node || engineSystems.conditionChecker.check(node.condition, window.gameState) === false) { 
            endDialogue(); 
            return;
        }

        document.getElementById('dialogue-name').textContent = gameData.characters[charId].name;
        document.getElementById('dialogue-text').textContent = node.text;
        const choicesEl = document.getElementById('dialogue-choices');
        choicesEl.innerHTML = '';

        engineSystems.eventProcessor.process(node.events, window.gameState);
        engineUI.updateAll(window.gameState);
        spawnGameObjects();

        if (node.choices) {
            node.choices.forEach((choice, index) => {
                if (engineSystems.conditionChecker.check(choice.condition, window.gameState)) {
                    const button = document.createElement('button');
                    button.textContent = `(${index + 1}) ${choice.text}`;
                    button.onclick = () => renderDialogueNode(charId, choice.nextNode);
                    choicesEl.appendChild(button);
                }
            });
        }
        
        // **UX TWEAK**: Only show a "Continue" button if there are no other choices.
        if (!choicesEl.hasChildNodes()) {
            const endButton = document.createElement('button');
            endButton.textContent = `[Continue]`;
            endButton.onclick = endDialogue;
            choicesEl.appendChild(endButton);
        }
    }
    
    function endDialogue() { switchGameMode('gameplay'); }

    // --- INITIALIZATION & EVENT LISTENERS ---
    function init() {
        document.getElementById('new-game-btn').addEventListener('click', () => {
            window.gameState = createNewGameState();
            startGame();
        });
        document.getElementById('continue-game-btn').addEventListener('click', () => {
            if (loadGame()) {
                startGame();
            } else {
                alert("No save file found.");
            }
        });

        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            keysPressed[key] = true;
            if (gameMode === 'gameplay') {
                if (key === ' ') {
                   const charId = engineInteraction.interact(activeInteractable, window.gameState);
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
            } else if (gameMode === 'dialogue') {
                if (!isNaN(key) && key !== '0') { // Allow number keys but not 0
                    const choiceButtons = document.querySelectorAll('#dialogue-choices button');
                    const button = choiceButtons[parseInt(key) - 1];
                    if (button) button.click();
                } else if (key === ' ' || key === 'enter') { // Allow space/enter for the single "Continue" button
                    const choiceButtons = document.querySelectorAll('#dialogue-choices button');
                    if(choiceButtons.length === 1) choiceButtons[0].click();
                }
            }
            if (key === 'escape') {
                if (gameMode === 'modal' || gameMode === 'dialogue') switchGameMode('gameplay');
            }
        });
        window.addEventListener('keyup', (e) => { keysPressed[e.key.toLowerCase()] = false; });
        gameLoop();
    }

    init();
});