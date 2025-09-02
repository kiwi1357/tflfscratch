// =================================================================================
// --- UI MODULE ---
// Handles all rendering and UI updates to the DOM.
// =================================================================================

const engineUI = {
    _getGameState: null,

    init(gameStateProvider) {
        this._getGameState = gameStateProvider;
    },

    updateAll() {
         if (document.getElementById('quest-log').style.display === 'block') this.renderQuestLog();
         if (document.getElementById('inventory').style.display === 'block') this.renderInventory();
         if (document.getElementById('critter-log').style.display === 'block') this.renderCritterLog();
    },

    renderQuestLog() {
        const gameState = this._getGameState();
        const listEl = document.getElementById('quest-list');
        listEl.innerHTML = '<h3>Active</h3>';
        (gameState.activeQuests || []).forEach(qId => {
            listEl.innerHTML += `<div onclick="engineUI.renderQuestDetails('${qId}')">${gameData.quests[qId].title}</div>`;
        });
        // Render completed quests
        listEl.innerHTML += '<h3 style="margin-top: 20px;">Completed</h3>';
         (gameState.completedQuests || []).forEach(qId => {
            listEl.innerHTML += `<div onclick="engineUI.renderQuestDetails('${qId}')" style="color: #888;">${gameData.quests[qId].title}</div>`;
        });

        this.renderQuestDetails((gameState.activeQuests || [])[0]);
    },

    renderQuestDetails(questId) {
        const gameState = this._getGameState();
        const detailsEl = document.getElementById('quest-details');
        if (!questId || !gameData.quests[questId]) { detailsEl.innerHTML = '<p>Select a quest to see details.</p>'; return; }
        const quest = gameData.quests[questId];
        const questState = gameState.questStates[questId];
        let html = `<h3>${quest.title}</h3><p>${quest.description}</p><ul>`;
        quest.objectives.forEach((objText, index) => {
            const isComplete = questState && questState.objectives[index];
            html += `<li style="text-decoration: ${isComplete ? 'line-through' : 'none'}; color: ${isComplete ? '#888' : '#fff'};">${objText}</li>`;
        });
        html += '</ul>';
        detailsEl.innerHTML = html;
        // Highlight the selected quest in the list
        document.querySelectorAll('#quest-list div').forEach(d => {
            d.classList.toggle('active', d.textContent === quest.title);
        });
    },

    renderCritterLog() {
        const gameState = this._getGameState();
        const listEl = document.getElementById('resident-list');
        listEl.innerHTML = '';
        Object.keys(gameData.characters).forEach(charId => {
            const name = gameState.flags[`${charId}_met`] ? gameData.characters[charId].name : '???';
            listEl.innerHTML += `<div onclick="engineUI.renderCritterDetails('${charId}')">${name}</div>`;
        });
        this.renderCritterDetails(Object.keys(gameData.characters)[0]);
    },

    renderCritterDetails(charId) {
        const gameState = this._getGameState();
        const detailsEl = document.getElementById('critter-details');
        if (!gameState.flags[`${charId}_met`]) {
            detailsEl.innerHTML = '<h3>???</h3><p>You have not met this resident yet.</p>'; return;
        }
        let html = `<h3>${gameData.characters[charId].name}</h3>`;
        // Example of how you would display unlocked bio info based on flags
        html += '<h4>Notes</h4><ul>';
        if (charId === 'bucky') {
            html += `<li>Handyman: ${gameState.flags['bucky_handyman_unlocked'] ? 'A natural talent for fixing things.' : '???'}</li>`;
        }
         if (charId === 'finley') {
            html += `<li>Historian: ${gameState.flags['finley_historian_unlocked'] ? 'Knows everything about the valley.' : '???'}</li>`;
        }
        html += '</ul>';
        detailsEl.innerHTML = html;
        // Highlight the selected character in the list
         document.querySelectorAll('#resident-list div').forEach(d => {
            d.classList.toggle('active', d.textContent === gameData.characters[charId].name);
        });
    },

    renderInventory() {
        const gameState = this._getGameState();
        const gridEl = document.getElementById('inventory-grid');
        gridEl.innerHTML = '';
        for (let i = 0; i < 24; i++) { // Create 24 empty slots
            const itemId = gameState.player.inventory[i];
            const item = itemId ? gameData.items[itemId] : null;
            gridEl.innerHTML += `<div class="inventory-slot" title="${item ? item.description : 'Empty'}">${item ? item.name.slice(0,1) : ''}</div>`;
        }
    },
    
    toggleModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal.style.display === 'block') {
            return false; // Indicate that we are closing
        } else {
            // Call the specific render function for the modal being opened
            this[modalId === 'quest-log' ? 'renderQuestLog' : modalId === 'critter-log' ? 'renderCritterLog' : 'renderInventory']();
            modal.style.display = 'block';
            return true; // Indicate that we are opening
        }
    }
};