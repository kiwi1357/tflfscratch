// =================================================================================
// --- RENDERER MODULE ---
// Handles all drawing logic to the canvas.
// =================================================================================

const engineRenderer = {
    _ctx: null,
    _getGameState: null,
    _getTransientState: null,

    init(ctx, gameStateProvider, transientStateProvider) {
        this._ctx = ctx;
        this._getGameState = gameStateProvider;
        this._getTransientState = transientStateProvider;
    },

    draw(gameMode) {
        const gameState = this._getGameState();
        const transientState = this._getTransientState();
        if (!this._ctx) return;

        this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);

        if (gameMode === 'titleScreen') {
            this._drawTitleScreen(transientState);
            return;
        }
        if (gameMode === 'mainMenu') {
            this._drawMainMenu(transientState);
            return;
        }

        if (gameState) {
            this._drawWorld(gameState);
            this._drawSprites(gameState);
            // this._drawHitboxes(gameState);
            this._drawUi(gameMode, gameState, transientState);
            this._drawGamepad(transientState);
        }
    },

    _drawTitleScreen(transientState) {
        const canvas = this._ctx.canvas;
        const bgImage = assetLoader.images.startMenu;
        if (bgImage) this._ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        const menuItems = ['Play', 'Gallery', 'Settings', 'Support Us', 'Controls'];
        transientState.titleScreen.menuItemBounds = [];
        this._ctx.textAlign = 'center';
        this._ctx.font = "38px 'Segoe UI', sans-serif";
        this._ctx.fillStyle = 'white';
        this._ctx.shadowColor = 'black';
        this._ctx.shadowBlur = 5;
        menuItems.forEach((item, index) => {
            const textMetrics = this._ctx.measureText(item);
            const y = 280 + (index * 50);
            const bounds = { x: (canvas.width / 2) - (textMetrics.width / 2) - 20, y: y - 38, width: textMetrics.width + 40, height: 48 };
            transientState.titleScreen.menuItemBounds.push(bounds);
            if (index === transientState.titleScreen.selectedIndex) {
                this._ctx.fillStyle = '#ffc400';
                this._ctx.fillText(`> ${item} <`, canvas.width / 2, y);
            } else {
                this._ctx.fillStyle = '#ffffff';
                this._ctx.fillText(item, canvas.width / 2, y);
            }
        });
        this._ctx.shadowBlur = 0;
        this._ctx.textAlign = 'left';
    },

    _drawMainMenu(transientState) {
        const canvas = this._ctx.canvas;
        const bgImage = assetLoader.images.startMenu;
        if (bgImage) this._ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        const menuItems = ['Continue Saved Game', 'Start New Game', 'Back'];
        transientState.mainMenu.menuItemBounds = [];
        this._ctx.textAlign = 'center';
        this._ctx.font = "38px 'Segoe UI', sans-serif";
        this._ctx.fillStyle = 'white';
        this._ctx.shadowColor = 'black';
        this._ctx.shadowBlur = 5;
        menuItems.forEach((item, index) => {
            const textMetrics = this._ctx.measureText(item);
            const y = 350 + (index * 50);
            const bounds = { x: (canvas.width / 2) - (textMetrics.width / 2) - 20, y: y - 38, width: textMetrics.width + 40, height: 48 };
            transientState.mainMenu.menuItemBounds.push(bounds);
            if (index === transientState.mainMenu.selectedIndex) {
                this._ctx.fillStyle = '#ffc400';
                this._ctx.fillText(`> ${item} <`, canvas.width / 2, y);
            } else {
                this._ctx.fillStyle = '#ffffff';
                this._ctx.fillText(item, canvas.width / 2, y);
            }
        });
        this._ctx.shadowBlur = 0;
        this._ctx.textAlign = 'left';
    },

    _drawWorld(gameState) {
        const { camera } = gameState;
        const { map, tileset, tileSize } = gameData;
        const canvas = this._ctx.canvas;
        const startCol = Math.floor(camera.x / tileSize), endCol = Math.ceil((camera.x + canvas.width) / tileSize);
        const startRow = Math.floor(camera.y / tileSize), endRow = Math.ceil((camera.y + canvas.height) / tileSize);
        for (let y = startRow; y < endRow; y++) {
            for (let x = startCol; x < endCol; x++) {
                if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) continue;
                const tile = tileset[map[y][x]];
                if (tile) {
                    this._ctx.fillStyle = tile.color;
                    this._ctx.fillRect(Math.floor((x * tileSize) - camera.x), Math.floor((y * tileSize) - camera.y), tileSize, tileSize);
                }
            }
        }
    },

    _drawSprites(gameState) {
        const { camera, player } = gameState;
        const playerSprite = gameData.characters.player.sprite;
        this._ctx.fillStyle = playerSprite.color;
        this._ctx.fillRect(Math.floor(player.x - camera.x), Math.floor(player.y - camera.y), playerSprite.width, playerSprite.height);
        gameData.gameObjects.forEach(obj => {
            if (gameState.objectStates[obj.id]?.removed ?? obj.removed) return;
            const def = obj.type === 'character' ? gameData.characters[obj.id] : gameData.items[obj.id];
            if (!def || !def.sprite) return;
            this._ctx.fillStyle = def.sprite.color;
            this._ctx.fillRect(Math.floor(obj.x - camera.x), Math.floor(obj.y - camera.y), def.sprite.width, def.sprite.height);
        });
    },

    _drawHitboxes(gameState) {
        const { camera, player } = gameState;
        this._ctx.fillStyle = 'rgba(255, 0, 255, 0.4)';
        const playerDef = gameData.characters.player;
        const playerScreenX = Math.floor(player.x - camera.x), playerScreenY = Math.floor(player.y - camera.y);
        this._ctx.beginPath();
        this._ctx.moveTo(playerScreenX + playerDef.hitbox[0].x, playerScreenY + playerDef.hitbox[0].y);
        for (let i = 1; i < playerDef.hitbox.length; i++) this._ctx.lineTo(playerScreenX + playerDef.hitbox[i].x, playerScreenY + playerDef.hitbox[i].y);
        this._ctx.closePath(); this._ctx.fill();
        gameData.gameObjects.forEach(obj => {
            if (gameState.objectStates[obj.id]?.removed ?? obj.removed) return;
            const def = obj.type === 'character' ? gameData.characters[obj.id] : gameData.items[obj.id];
            if (!def || !def.hitbox) return;
            const screenX = Math.floor(obj.x - camera.x), screenY = Math.floor(obj.y - camera.y);
            this._ctx.beginPath();
            this._ctx.moveTo(screenX + def.hitbox[0].x, screenY + def.hitbox[0].y);
            for (let i = 1; i < def.hitbox.length; i++) this._ctx.lineTo(screenX + def.hitbox[i].x, screenY + def.hitbox[i].y);
            this._ctx.closePath(); this._ctx.fill();
        });
    },

    _drawUi(gameMode, gameState, transientState) {
        if (gameMode === 'paused') {
            this._drawPauseMenu(transientState);
        } else if (gameMode === 'modal') {
            this._drawModal(gameState);
        } else if (gameMode === 'dialogue') {
            this._drawDialogueBox(gameState);
        } else if (gameState && gameState.interaction.possible) {
            this._drawInteractionPrompt();
        }
    },

    _drawInteractionPrompt() {
        const canvas = this._ctx.canvas;
        const text = "[SPACE] to Interact";
        this._ctx.font = "20px 'Segoe UI', sans-serif";
        const textWidth = this._ctx.measureText(text).width;
        const x = (canvas.width / 2) - (textWidth / 2), y = canvas.height - 50, padding = 10;
        this._ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this._ctx.fillRect(x - padding, y - 20 - padding, textWidth + (padding * 2), 20 + (padding * 2));
        this._ctx.fillStyle = 'white';
        this._ctx.fillText(text, x, y);
    },

    _drawDialogueBox(gameState) {
        const canvas = this._ctx.canvas;
        const boxHeight = 180, boxY = canvas.height - boxHeight;
        this._ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this._ctx.fillRect(10, boxY, canvas.width - 20, boxHeight - 10);
        this._ctx.strokeStyle = 'white';
        this._ctx.lineWidth = 3;
        this._ctx.strokeRect(10, boxY, canvas.width - 20, boxHeight - 10);
        const charName = gameData.characters[gameState.dialogue.charId].name;
        this._ctx.font = "bold 24px 'Segoe UI', sans-serif";
        const nameWidth = this._ctx.measureText(charName).width;
        this._ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this._ctx.fillRect(40, boxY - 20, nameWidth + 20, 40);
        this._ctx.strokeRect(40, boxY - 20, nameWidth + 20, 40);
        this._ctx.fillStyle = '#ffcc66';
        this._ctx.fillText(charName, 50, boxY + 10);
        this._ctx.font = "22px 'Segoe UI', sans-serif";
        this._ctx.fillStyle = 'white';
        const lines = this._wrapText(gameState.dialogue.text, canvas.width - 60);
        lines.forEach((line, index) => this._ctx.fillText(line, 30, boxY + 50 + (index * 25)));
        if (gameState.dialogue.choices.length > 0) {
            gameState.dialogue.choices.forEach((choice, index) => this._ctx.fillText(`(${index + 1}) ${choice.text}`, 40, boxY + 110 + (index * 25)));
        } else {
            this._ctx.font = "18px 'Segoe UI', sans-serif";
            this._ctx.fillStyle = '#aaa';
            this._ctx.fillText("[SPACE to continue]", canvas.width - 200, canvas.height - 25);
        }
    },

    _drawModal(gameState) {
        const canvas = this._ctx.canvas;
        this._ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this._ctx.fillRect(0, 0, canvas.width, canvas.height);
        switch (gameState.modal.active) {
            case 'inventory': this._drawInventoryModal(gameState); break;
            case 'quest-log': this._drawQuestLogModal(gameState); break;
            case 'critter-log': this._drawCritterLogModal(gameState); break;
        }
    },

    _drawInventoryModal(gameState) {
        const canvas = this._ctx.canvas;
        const boxWidth = 600, boxHeight = 400;
        const x = (canvas.width - boxWidth) / 2, y = (canvas.height - boxHeight) / 2;
        this._ctx.fillStyle = '#2c2c3e';
        this._ctx.fillRect(x, y, boxWidth, boxHeight);
        this._ctx.strokeStyle = 'white';
        this._ctx.lineWidth = 2;
        this._ctx.strokeRect(x, y, boxWidth, boxHeight);
        this._ctx.fillStyle = 'white';
        this._ctx.font = "bold 28px 'Segoe UI', sans-serif";
        this._ctx.fillText("Inventory", x + 20, y + 40);
        const slotSize = 60, padding = 10, cols = 8;
        gameState.player.inventory.forEach((itemId, index) => {
            const item = gameData.items[itemId];
            const slotX = x + 20 + (index % cols) * (slotSize + padding);
            const slotY = y + 70 + Math.floor(index / cols) * (slotSize + padding);
            this._ctx.strokeStyle = '#aaa';
            this._ctx.strokeRect(slotX, slotY, slotSize, slotSize);
            if (item) {
                this._ctx.fillStyle = item.sprite.color;
                this._ctx.fillRect(slotX + 5, slotY + 5, slotSize - 10, slotSize - 10);
            }
        });
    },

    _drawQuestLogModal(gameState) {
        const canvas = this._ctx.canvas;
        const boxWidth = 700, boxHeight = 450;
        const x = (canvas.width - boxWidth) / 2, y = (canvas.height - boxHeight) / 2;
        this._ctx.fillStyle = '#2c2c3e';
        this._ctx.fillRect(x, y, boxWidth, boxHeight);
        this._ctx.strokeStyle = 'white';
        this._ctx.strokeRect(x, y, boxWidth, boxHeight);
        this._ctx.fillStyle = 'white';
        this._ctx.font = "bold 28px 'Segoe UI', sans-serif";
        this._ctx.fillText("Quest Log", x + 20, y + 40);
        const questId = gameState.activeQuests[0];
        if (questId) {
            const quest = gameData.quests[questId];
            const questState = gameState.questStates[questId];
            this._ctx.font = "bold 22px 'Segoe UI', sans-serif";
            this._ctx.fillText(quest.title, x + 20, y + 80);
            this._ctx.font = "18px 'Segoe UI', sans-serif";
            this._ctx.fillStyle = '#ccc';
            this._wrapText(quest.description, boxWidth - 40).forEach((line, i) => this._ctx.fillText(line, x + 20, y + 110 + (i * 22)));
            quest.objectives.forEach((obj, i) => {
                const isComplete = questState && questState.objectives[i];
                this._ctx.fillStyle = isComplete ? '#888' : 'white';
                this._ctx.fillText(`${isComplete ? '[X]' : '[ ]'} ${obj}`, x + 30, y + 180 + (i * 25));
            });
        }
    },

    _drawCritterLogModal(gameState) {
        const canvas = this._ctx.canvas;
        const boxWidth = 700, boxHeight = 450;
        const x = (canvas.width - boxWidth) / 2, y = (canvas.height - boxHeight) / 2;
        this._ctx.fillStyle = '#2c2c3e';
        this._ctx.fillRect(x, y, boxWidth, boxHeight);
        this._ctx.strokeStyle = 'white';
        this._ctx.strokeRect(x, y, boxWidth, boxHeight);
        this._ctx.fillStyle = 'white';
        this._ctx.font = "bold 28px 'Segoe UI', sans-serif";
        this._ctx.fillText("Critter Log", x + 20, y + 40);
        Object.keys(gameData.characters).filter(c => c !== 'player').forEach((charId, index) => {
            const hasMet = gameState.flags[`${charId}_met`];
            const name = hasMet ? gameData.characters[charId].name : '???';
            this._ctx.font = "20px 'Segoe UI', sans-serif";
            this._ctx.fillStyle = hasMet ? 'white' : '#777';
            this._ctx.fillText(name, x + 20, y + 80 + (index * 30));
        });
    },

    _drawPauseMenu(transientState) {
        const canvas = this._ctx.canvas;
        const menuItems = ['Options', 'Save', 'Menu', 'Chapter Select', 'Cheats', 'Quit'];
        transientState.pause.menuItemBounds = [];
        this._ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this._ctx.fillRect(0, 0, canvas.width, canvas.height);
        this._ctx.fillStyle = '#ffc400';
        this._ctx.font = "bold 80px 'Segoe UI', sans-serif";
        this._ctx.textAlign = 'center';
        this._ctx.fillText("Pause", canvas.width / 2, 150);
        this._ctx.font = "36px 'Segoe UI', sans-serif";
        menuItems.forEach((item, index) => {
            const textMetrics = this._ctx.measureText(item);
            const y = 250 + (index * 50);
            const bounds = { x: (canvas.width / 2) - (textMetrics.width / 2) - 20, y: y - 36, width: textMetrics.width + 40, height: 48 };
            transientState.pause.menuItemBounds.push(bounds);
            if (index === transientState.pause.selectedIndex) {
                this._ctx.fillStyle = '#ffffff';
                this._ctx.fillText(`> ${item} <`, canvas.width / 2, y);
            } else {
                this._ctx.fillStyle = '#cccccc';
                this._ctx.fillText(item, canvas.width / 2, y);
            }
        });
        this._ctx.textAlign = 'left';
    },

    _drawGamepad(transientState) {
        const canvas = this._ctx.canvas;
        transientState.gamepad = { buttonBounds: {} };
        const dpadX = 100, dpadY = canvas.height - 100, size = 40, gap = 5;
        const up =    { x: dpadX, y: dpadY - size - gap, width: size, height: size };
        const down =  { x: dpadX, y: dpadY + size + gap, width: size, height: size };
        const left =  { x: dpadX - size - gap, y: dpadY, width: size, height: size };
        const right = { x: dpadX + size + gap, y: dpadY, width: size, height: size };
        transientState.gamepad.buttonBounds.up = up;
        transientState.gamepad.buttonBounds.down = down;
        transientState.gamepad.buttonBounds.left = left;
        transientState.gamepad.buttonBounds.right = right;
        this._ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
        this._ctx.fillRect(up.x, up.y, up.width, up.height);
        this._ctx.fillRect(down.x, down.y, down.width, down.height);
        this._ctx.fillRect(left.x, left.y, left.width, left.height);
        this._ctx.fillRect(right.x, right.y, right.width, right.height);
        const btnAX = canvas.width - 100, btnAY = canvas.height - 80, btnARadius = 35;
        const btnBX = canvas.width - 180, btnBY = canvas.height - 120, btnBRadius = 25;
        const btnPX = canvas.width - 80, btnPY = canvas.height - 170, btnPRadius = 20;
        transientState.gamepad.buttonBounds.a = { x: btnAX - btnARadius, y: btnAY - btnARadius, width: btnARadius * 2, height: btnARadius * 2, radius: btnARadius };
        transientState.gamepad.buttonBounds.b = { x: btnBX - btnBRadius, y: btnBY - btnBRadius, width: btnBRadius * 2, height: btnBRadius * 2, radius: btnBRadius };
        transientState.gamepad.buttonBounds.p = { x: btnPX - btnPRadius, y: btnPY - btnPRadius, width: btnPRadius * 2, height: btnPRadius * 2, radius: btnPRadius };
        this._ctx.fillStyle = 'rgba(200, 50, 50, 0.7)';
        this._ctx.beginPath(); this._ctx.arc(btnAX, btnAY, btnARadius, 0, Math.PI * 2); this._ctx.fill();
        this._ctx.fillStyle = 'rgba(50, 150, 50, 0.7)';
        this._ctx.beginPath(); this._ctx.arc(btnBX, btnBY, btnBRadius, 0, Math.PI * 2); this._ctx.fill();
        this._ctx.fillStyle = 'rgba(50, 50, 200, 0.7)';
        this._ctx.beginPath(); this._ctx.arc(btnPX, btnPY, btnPRadius, 0, Math.PI * 2); this._ctx.fill();
        this._ctx.fillStyle = 'white';
        this._ctx.font = "bold 30px 'Segoe UI', sans-serif";
        this._ctx.textAlign = 'center';
        this._ctx.fillText("A", btnAX, btnAY + 10);
        this._ctx.font = "bold 20px 'Segoe UI', sans-serif";
        this._ctx.fillText("B", btnBX, btnBY + 7);
        this._ctx.fillText("P", btnPX, btnPY + 7);
        this._ctx.textAlign = 'left';
    },

    _wrapText(text, maxWidth) {
        if (!text) return [];
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = this._ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
};
