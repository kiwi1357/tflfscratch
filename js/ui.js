// =================================================================================
// --- UI MODULE ---
// Handles all rendering and UI updates to the DOM.
// =================================================================================

const engineUI = {
    // **BUG FIX**: This function no longer needs gameState passed to it.
    // It will use the global window.gameState object.
    updateAll() {
         if (document.getElementById('quest-log').style.display === 'block') this.renderQuestLog();
         if (document.getElementById('inventory').style.display === 'block') this.renderInventory();
         if (document.getElementById('critter-log').style.display === 'block') this.renderCritterLog();
    },

    renderQuestLog() {
        const listEl = document.getElementById('quest-list');
        listEl.innerHTML = '<h3>Active</h3>';
        // **BUG FIX**: onclick no longer passes gameState
        (window.gameState.activeQuests || []).forEach(qId => {
            listEl.innerHTML += `<div onclick="engineUI.renderQuestDetails('${qId}')">${gameData.quests[qId].title}</div>`;
        });
        this.renderQuestDetails((window.gameState.activeQuests || [])[0]);
    },

    renderQuestDetails(questId) {
        const detailsEl = document.getElementById('quest-details');
        if (!questId || !gameData.quests[questId]) { detailsEl.innerHTML = '<p>Select a quest.</p>'; return; }
        const quest = gameData.quests[questId];
        const questState = window.gameState.questStates[questId];
        let html = `<h3>${quest.title}</h3><p>${quest.description}</p><ul>`;
        quest.objectives.forEach((objText, index) => {
            const isComplete = questState.objectives[index];
            html += `<li style="text-decoration: ${isComplete ? 'line-through' : 'none'}">${objText}</li>`;
        });
        html += '</ul>';
        detailsEl.innerHTML = html;
        document.querySelectorAll('#quest-list div').forEach(d => {
            d.classList.toggle('active', d.textContent === quest.title);
        });
    },

    renderCritterLog() {
        const listEl = document.getElementById('resident-list');
        listEl.innerHTML = '';
        Object.keys(gameData.characters).forEach(charId => {
            const name = window.gameState.flags[`${charId}_met`] ? gameData.characters[charId].name : '???';
            // **BUG FIX**: onclick no longer passes gameState
            listEl.innerHTML += `<div onclick="engineUI.renderCritterDetails('${charId}')">${name}</div>`;
        });
        this.renderCritterDetails(Object.keys(gameData.characters)[0]);
    },

    renderCritterDetails(charId) {
        const detailsEl = document.getElementById('critter-details');
        if (!window.gameState.flags[`${charId}_met`]) {
            detailsEl.innerHTML = '<h3>???</h3><p>You have not met this resident yet.</p>'; return;
        }
        let html = `<h3>${gameData.characters[charId].name}</h3>`;
        if (charId === 'bucky') {
            html += `<p>Handyman: ${window.gameState.flags['bucky_handyman_unlocked'] ? 'Yes' : '???'}</p>`;
        }
        detailsEl.innerHTML = html;
         document.querySelectorAll('#resident-list div').forEach(d => {
            d.classList.toggle('active', d.textContent === gameData.characters[charId].name);
        });
    },

    renderInventory() {
        const gridEl = document.getElementById('inventory-grid');
        gridEl.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const itemId = window.gameState.player.inventory[i];
            const item = itemId ? gameData.items[itemId] : null;
            gridEl.innerHTML += `<div class="inventory-slot" title="${item ? item.description : ''}">${item ? item.name.slice(0,1) : ''}</div>`;
        }
    },
    
    toggleModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal.style.display === 'block') {
            return false;
        } else {
            // **BUG FIX**: This call no longer needs gameState
            this[modalId === 'quest-log' ? 'renderQuestLog' : modalId === 'critter-log' ? 'renderCritterLog' : 'renderInventory']();
            modal.style.display = 'block';
            return true;
        }
    }
};