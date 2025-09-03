// =================================================================================
// --- MAIN MODULE ---
// The core of the engine. Manages state, the game loop, and initialization.
// Coordinates all other modules.
// =================================================================================
document.addEventListener('DOMContentLoaded', () => {

    let gameState;
    let gameMode = 'titleScreen';
    const keysPressed = {};
    let activeInteractable = null;
    
    let canvas, ctx;

    let transientState = {
        titleScreen: { selectedIndex: 0, menuItemBounds: [] },
        mainMenu: null,
        pause: { selectedIndex: 0, menuItemBounds: [] },
        gamepad: { buttonBounds: {} }
    };

    function createNewGameState() {
        return {
            camera: { x: 0, y: 0 },
            player: { x: 480, y: 270, inventory: [] },
            flags: {},
            dialogueNodes: {},
            activeQuests: [],
            completedQuests: [],
            questStates: {},
            objectStates: {},
            interaction: { possible: false },
            dialogue: { active: false, charId: null, nodeId: null, text: null, choices: [] },
            modal: { active: null }
        };
    }

    function saveGame() {
        localStorage.setItem('forestOfLoveSave', JSON.stringify(gameState));
        console.log("Game Saved!");
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
        document.getElementById('game-screen').style.display = 'block';
        switchGameMode('gameplay');
    }

    function gameLoop() {
        if (gameMode === 'gameplay') {
            engineInteraction.handlePlayerMovement(keysPressed);
            gameState.camera.x = gameState.player.x - canvas.width / 2;
            gameState.camera.y = gameState.player.y - canvas.height / 2;
            activeInteractable = engineInteraction.checkProximity();
            gameState.interaction.possible = activeInteractable !== null;
        }
        engineRenderer.draw(gameMode);
        requestAnimationFrame(gameLoop);
    }

    function switchGameMode(newMode) {
        gameMode = newMode;
    }

    function toggleModal(modalId) {
        if (gameMode === 'modal' && gameState.modal.active === modalId) {
            gameState.modal.active = null;
            switchGameMode('gameplay');
        } else {
            gameState.modal.active = modalId;
            switchGameMode('modal');
        }
    }

    // --- Input Handlers ---
    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        const touch = evt.touches ? evt.touches[0] : evt;
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }

    function handleMouseDown(evt) {
        evt.preventDefault();
        const mousePos = getMousePos(canvas, evt);
        const bounds = transientState.gamepad.buttonBounds;
        if (!bounds) return;

        if (isPointInRect(mousePos, bounds.up)) keysPressed['arrowup'] = true;
        if (isPointInRect(mousePos, bounds.down)) keysPressed['arrowdown'] = true;
        if (isPointInRect(mousePos, bounds.left)) keysPressed['arrowleft'] = true;
        if (isPointInRect(mousePos, bounds.right)) keysPressed['arrowright'] = true;
    }

    function handleMouseUp(evt) {
        evt.preventDefault();
        keysPressed['arrowup'] = false;
        keysPressed['arrowdown'] = false;
        keysPressed['arrowleft'] = false;
        keysPressed['arrowright'] = false;
    }

    function handleClick(evt) {
        evt.preventDefault();
        const mousePos = getMousePos(canvas, evt);
        const bounds = transientState.gamepad.buttonBounds;
        if (!bounds) return;

        if (isPointInCircle(mousePos, bounds.a)) simulateKeyPress(' ');
        if (isPointInCircle(mousePos, bounds.b)) simulateKeyPress('escape');
        if (isPointInCircle(mousePos, bounds.p)) {
            if (gameMode === 'gameplay') switchGameMode('paused');
        }
    }

    function isPointInRect(point, rect) {
        return point.x >= rect.x && point.x <= rect.x + rect.width &&
               point.y >= rect.y && point.y <= rect.y + rect.height;
    }

    function isPointInCircle(point, circle) {
        const distance = Math.sqrt(Math.pow(point.x - (circle.x + circle.radius), 2) + Math.pow(point.y - (circle.y + circle.radius), 2));
        return distance < circle.radius;
    }

    function simulateKeyPress(key) {
        if (gameMode === 'titleScreen') handleTitleScreenInput(key);
        else if (gameMode === 'mainMenu') handleMainMenuInput(key);
        else if (gameMode === 'paused') handlePauseInput(key);
        else if (gameMode === 'dialogue') handleDialogueInput(key);
        else if (gameMode === 'gameplay') {
            const charId = engineInteraction.interact(activeInteractable);
            if (charId) startDialogue(charId);
        }
    }

    function handleTitleScreenInput(key) {
        const menuItems = ['Play', 'Gallery', 'Settings', 'Support Us', 'Controls'];
        if (key === 'arrowdown') {
            transientState.titleScreen.selectedIndex = (transientState.titleScreen.selectedIndex + 1) % menuItems.length;
        } else if (key === 'arrowup') {
            transientState.titleScreen.selectedIndex = (transientState.titleScreen.selectedIndex - 1 + menuItems.length) % menuItems.length;
        } else if (key === 'enter' || key === ' ') {
            const selectedOption = menuItems[transientState.titleScreen.selectedIndex];
            if (selectedOption === 'Play') {
                transientState.titleScreen = null;
                transientState.mainMenu = { selectedIndex: 0, menuItemBounds: [] };
                switchGameMode('mainMenu');
            } else console.log("Selected:", selectedOption);
        }
    }

    function handleMainMenuInput(key) {
        const menuItems = ['Continue Saved Game', 'Start New Game', 'Back'];
        if (key === 'arrowdown') {
            transientState.mainMenu.selectedIndex = (transientState.mainMenu.selectedIndex + 1) % menuItems.length;
        } else if (key === 'arrowup') {
            transientState.mainMenu.selectedIndex = (transientState.mainMenu.selectedIndex - 1 + menuItems.length) % menuItems.length;
        } else if (key === 'enter' || key === ' ') {
            const selectedOption = menuItems[transientState.mainMenu.selectedIndex];
            if (selectedOption === 'Start New Game') {
                transientState.mainMenu = null;
                gameState = createNewGameState();
                startGame();
            } else if (selectedOption === 'Continue Saved Game') {
                if (loadGame()) {
                    transientState.mainMenu = null;
                    startGame();
                } else console.log("No save file found.");
            } else if (selectedOption === 'Back') {
                transientState.mainMenu = null;
                transientState.titleScreen = { selectedIndex: 0, menuItemBounds: [] };
                switchGameMode('titleScreen');
            }
        }
    }

    function handlePauseInput(key) {
        const menuItems = ['Options', 'Save', 'Menu', 'Chapter Select', 'Cheats', 'Quit'];
        if (key === 'arrowdown') {
            transientState.pause.selectedIndex = (transientState.pause.selectedIndex + 1) % menuItems.length;
        } else if (key === 'arrowup') {
            transientState.pause.selectedIndex = (transientState.pause.selectedIndex - 1 + menuItems.length) % menuItems.length;
        } else if (key === 'enter' || key === ' ') {
            const selectedOption = menuItems[transientState.pause.selectedIndex];
            if (selectedOption === 'Save') saveGame();
            if (selectedOption === 'Quit') location.reload();
        } else if (key === 'escape') {
            switchGameMode('gameplay');
        }
    }

    function handleDialogueInput(key) {
        const choices = gameState.dialogue.choices;
        const choiceIndex = parseInt(key, 10) - 1;
        if (key === ' ' || key === 'enter') {
            if (choices.length === 0) endDialogue();
        } else if (choiceIndex >= 0 && choiceIndex < choices.length) {
            renderDialogueNode(gameState.dialogue.charId, choices[choiceIndex].nextNode);
        }
    }

    function handleModalInput(key) {
        if (key === 'escape' || key === 'i' || key === 'q' || key === 'c') {
            toggleModal(gameState.modal.active);
        }
    }

    // --- DIALOGUE ---
    function startDialogue(charId) {
        switchGameMode('dialogue');
        gameState.dialogue.active = true;
        gameState.dialogue.charId = charId;
        let nodeId = 'default';
        const savedNode = gameState.dialogueNodes[charId];
        const hasMet = gameState.flags[`${charId}_met`];
        const mainStartNode = gameData.dialogue[charId]['start'];
        const unmetStartNode = gameData.dialogue[charId]['start_unmet'];
        const charQuest = gameData.characters[charId].questId;
        const isQuestActiveOrDone = charQuest && (gameState.activeQuests.includes(charQuest) || gameState.completedQuests.includes(charQuest));
        if (savedNode && savedNode !== 'default' && gameData.dialogue[charId][savedNode]) {
            nodeId = savedNode;
        } else if (mainStartNode && !isQuestActiveOrDone && engineSystems.conditionChecker.check(mainStartNode.condition)) {
            nodeId = 'start';
        } else if (!hasMet && unmetStartNode) {
            nodeId = 'start_unmet';
        } else if (savedNode && gameData.dialogue[charId][savedNode]) {
             nodeId = savedNode;
        }
        renderDialogueNode(charId, nodeId);
    }

    function renderDialogueNode(charId, nodeId) {
        const node = gameData.dialogue[charId][nodeId];
        if (!node || engineSystems.conditionChecker.check(node.condition) === false) {
            endDialogue();
            return;
        }
        engineSystems.eventProcessor.process(node.events);
        gameState.dialogue.nodeId = nodeId;
        gameState.dialogue.text = node.text;
        gameState.dialogue.choices = [];
        if (node.choices) {
            node.choices.forEach(choice => {
                if (engineSystems.conditionChecker.check(choice.condition)) {
                    gameState.dialogue.choices.push(choice);
                }
            });
        }
    }
    
    function endDialogue() {
        gameState.dialogue.active = false;
        switchGameMode('gameplay');
    }

    async function init() {
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
        canvas.width = 960;
        canvas.height = 540;

        assetLoader.loadImage('startMenu', 'ReferenceImages/StartMenu.jpg');
        await assetLoader.loadAll();

        const gameStateProvider = () => gameState;
        const transientStateProvider = () => transientState;
        engineSystems.init(gameStateProvider);
        engineInteraction.init(gameStateProvider);
        engineRenderer.init(ctx, gameStateProvider, transientStateProvider);
        enginePhysics.init(gameStateProvider);

        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            keysPressed[key] = true;
            if (gameMode === 'titleScreen') handleTitleScreenInput(key);
            else if (gameMode === 'mainMenu') handleMainMenuInput(key);
            else if (gameMode === 'paused') handlePauseInput(key);
            else if (gameMode === 'dialogue') handleDialogueInput(key);
            else if (gameMode === 'modal') handleModalInput(key);
            else if (gameMode === 'gameplay') {
                if (key === 'escape') switchGameMode('paused');
                else if (key === ' ') simulateKeyPress(' ');
                else if (key === 'i') toggleModal('inventory');
                else if (key === 'q') toggleModal('quest-log');
                else if (key === 'c') toggleModal('critter-log');
            }
        });

        window.addEventListener('keyup', (e) => {
            keysPressed[e.key.toLowerCase()] = false;
        });

        // Touch and Mouse Listeners for Virtual Gamepad
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('touchstart', handleMouseDown, { passive: false });
        canvas.addEventListener('touchend', handleMouseUp, { passive: false });

        gameLoop();
    }
    
    init();
});