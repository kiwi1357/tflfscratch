// =================================================================================
// --- GAME DATABASE (THE "GAME") ---
// =================================================================================

const gameData = {

    world: {
        width: 1920,
        height: 1080
    },

    // --- PLACEHOLDER TILESET & MAP ---
    // This defines the look of our world until we have real art assets.
    tileSize: 32, // The size of each tile in pixels
    tileset: {
        0: { id: 0, color: '#5d9a5d', name: 'Grass' },         // Same as old background
        1: { id: 1, color: '#3c6a3c', name: 'Dark Grass' },    // Same as old border
        2: { id: 2, color: '#40a8d8', name: 'Water' },          // A nice blue
        3: { id: 3, color: '#d2b48c', name: 'Path' },           // A tan path color
    },
    map: [
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
        [2, 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
        [2, 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 2, 2],
        [2, 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ],

    settings: {
        playerSpeed: 3,
        interactionRadius: 50,
    },

    items: {
        "driftwood": { name: "Driftwood", description: "A sturdy piece of wood, worn smooth by the water.", sprite: { width: 20, height: 20, color: '#A0522D' }, hitbox: [{x:0,y:0},{x:20,y:0},{x:20,y:20},{x:0,y:20}] },
        "sugar": { name: "Sugar", description: "A bag of 'sugar'... an ingredient Scarlett's never been out of in her entire life!", sprite: { width: 20, height: 20, color: '#F5F5DC' }, hitbox: [{x:0,y:0},{x:20,y:0},{x:20,y:20},{x:0,y:20}] },
        "lost_book": { name: "Lost Book", description: "An old, leather-bound book titled 'A Brief History of the Valley'.", sprite: { width: 20, height: 20, color: '#D2B48C' }, hitbox: [{x:0,y:0},{x:20,y:0},{x:20,y:20},{x:0,y:20}] }
    },

    characters: {
        "player": { 
            name: "Player", 
            sprite: { width: 30, height: 30, color: '#ff6347' },
            hitbox: [ {x:0, y:0}, {x:30, y:0}, {x:30, y:30}, {x:0, y:30} ]
        },
        "bucky": { 
            name: "Barnaby \"Bucky\" Webbs", 
            questId: "bridgeRepair",
            sprite: { width: 32, height: 32, color: '#8b4513' },
            hitbox: [ {x:0, y:0}, {x:32, y:0}, {x:32, y:32}, {x:0, y:32} ]
        },
        "scarlett": { 
            name: "Scarlett", 
            questId: "sugarAndSpice",
            sprite: { width: 32, height: 32, color: '#f0e68c' },
            hitbox: [ {x:0, y:0}, {x:32, y:0}, {x:32, y:32}, {x:0, y:32} ]
        },
        "finley": { 
            name: "Finley", 
            questId: "aLostChapter",
            sprite: { width: 32, height: 32, color: '#d2691e' },
            hitbox: [ {x:0, y:0}, {x:32, y:0}, {x:32, y:32}, {x:0, y:32} ]
        }
    },
    
    gameObjects: [
        { id: "player", type: "player" },
        { id: "bucky", type: "character", x: 300, y: 200 },
        { id: "scarlett", type: "character", x: 600, y: 150 },
        { id: "finley", type: "character", x: 50, y: 300 },
        { id: "driftwood", type: "item", x: 100, y: 450 },
        { id: "sugar", type: "item", x: 700, y: 500, removed: true }, // Initially hidden
        { id: "lost_book", type: "item", x: 400, y: 550, removed: true } // Initially hidden
    ],

    quests: {
        "bridgeRepair": {
            title: "Water Under the Bridge",
            description: "Help Bucky gather building materials to fix the town bridge.",
            objectives: ["Learn about the bridge.", "Go look for driftwood.", "Return driftwood to Bucky."],
        },
        "sugarAndSpice": {
            title: "Sugar and Spice",
            description: "Scarlett needs a special bag of sugar for a recipe. She thinks she dropped it in the southern fields.",
            objectives: ["Talk to Scarlett.", "Find the lost bag of sugar.", "Return the sugar to Scarlett."]
        },
        "aLostChapter": {
            title: "A Lost Chapter",
            description: "Finley the fox has lost his important history book somewhere near the river bend.",
            objectives: ["Talk to Finley.", "Find the lost history book.", "Return the book to Finley."]
        }
    },

    dialogue: {
        "bucky": {
            "start": {
                text: "Ay pal! Good to see a new face. The name's Bucky. What brings you to our neck of the woods?",
                events: [{ type: "SET_FLAG", flag: "bucky_met" }],
                choices: [
                    { text: "Just exploring.", nextNode: "bridgeIntro" },
                    { text: "I'm looking for adventure.", nextNode: "bridgeIntro" }
                ]
            },
            "bridgeIntro": {
                text: "Well, you've come at a trying time. Our main bridge washed out in the last storm. It's cut us off proper.",
                choices: [ { text: "That sounds serious. Can I help?", nextNode: "acceptQuest" } ]
            },
            "acceptQuest": {
                text: "You'd help? Attaboy! I need some sturdy driftwood from down by the lake. Could you grab some for me?",
                events: [
                    { type: "ACTIVATE_QUEST", questId: "bridgeRepair" },
                    { type: "COMPLETE_OBJECTIVE", questId: "bridgeRepair", objectiveIndex: 0 },
                    { type: "SET_DIALOGUE_NODE", charId: "bucky", nodeId: "duringQuest" }
                ]
            },
            "duringQuest": {
                text: "Find any of that driftwood yet, pal?",
                choices: [
                    { text: "I have the driftwood right here.", nextNode: "turnInDriftwood", condition: { type: "HAS_ITEM", itemId: "driftwood" } },
                    { text: "[Gossip] Can I ask about something else?", nextNode: "gossip" },
                    { text: "I'm still looking.", nextNode: "stillLookingReply", condition: { type: "NOT_HAS_ITEM", itemId: "driftwood" } }
                ]
            },
            "stillLookingReply": {
                text: "Alright, pal. Keep at it. It's gotta be around here somewhere."
            },
            "turnInDriftwood": {
                text: "Perfect! This is exactly what I needed. You're a natural handyman, you know that? A real talent for finding things.",
                events: [
                    { type: "REMOVE_ITEM", itemId: "driftwood" },
                    { type: "COMPLETE_OBJECTIVE", questId: "bridgeRepair", objectiveIndex: 2 },
                    { type: "SET_FLAG", flag: "bucky_handyman_unlocked" },
                    { type: "SET_DIALOGUE_NODE", charId: "bucky", nodeId: "postQuest" }
                ]
            },
            "postQuest": {
                text: "Thanks again, pal. Say, if you're looking to meet more townsfolk, you should talk to Scarlett. She runs the shop and knows everyone.",
                events: [{ type: "SET_FLAG", flag: "bucky_mentioned_scarlett" }, { type: "SET_DIALOGUE_NODE", charId: "bucky", nodeId: "default" }]
            },
            "gossip": {
                text: "Sure, pal. What's on your mind?",
                choices: [
                    { text: "What can you tell me about Scarlett?", nextNode: "gossip_scarlett", condition: { type: "HAS_FLAG", flag: "scarlett_met" } },
                    { text: "What about that shy fox, Finley?", nextNode: "gossip_finley", condition: { type: "HAS_FLAG", flag: "finley_met" } },
                    { text: "What's this Summer Festival about?", nextNode: "gossip_festival", condition: { type: "HAS_FLAG", flag: "scarlett_mentioned_finley" } },
                ]
            },
            "gossip_scarlett": {
                text: "Scarlett? She's the heart of this town. A bit of a flirt, but her heart's in the right place. Runs the general store."
            },
            "gossip_finley": {
                text: "Ah, Finley. Bright kid, knows more about this valley than anyone. Spends most of his time with his nose in a book. Terribly shy, though."
            },
            "gossip_festival": {
                text: "Ah, the festival! Biggest event of the year. Finley's in charge of the history part. It's a lot of work, but worth it."
            },
            "default": {
                text: "Good to see you, pal. Let me know if you need anything.",
                 choices: [
                    { text: "[Gossip] Got a moment to chat?", nextNode: "gossip" }
                ]
            }
        },

        "scarlett": {
            "start": {
                text: "Oh, hello there! You must be the new face Bucky was talking about. Welcome! I'm Scarlett. Can I help you with something?",
                condition: { type: "HAS_FLAG", flag: "bucky_mentioned_scarlett" },
                events: [{ type: "SET_FLAG", flag: "scarlett_met" }],
                choices: [ { text: "Bucky sent me. Just saying hello.", nextNode: "sugarProblem" } ]
            },
            "start_unmet": {
                text: "Oh! A new face. Hello there. I'm Scarlett.",
                events: [{ type: "SET_FLAG", flag: "scarlett_met" }, { type: "SET_DIALOGUE_NODE", charId: "scarlett", nodeId: "default" }]
            },
            "sugarProblem": {
                text: "Well it's lovely to meet you! I'd offer you a cookie, but I'm in a bit of a pickle. I've run out of my special 'sugar'...",
                choices: [ { text: "What's so special about it?", nextNode: "acceptQuest" } ]
            },
            "acceptQuest": {
                text: "It's for a... family recipe. I think I dropped my last bag somewhere in the fields to the south. Could you possibly find it for me?",
                events: [
                    { type: "ACTIVATE_QUEST", questId: "sugarAndSpice" },
                    { type: "COMPLETE_OBJECTIVE", questId: "sugarAndSpice", objectiveIndex: 0 },
                    { type: "UNHIDE_OBJECT", objectId: "sugar" },
                    { type: "SET_DIALOGUE_NODE", charId: "scarlett", nodeId: "duringQuest" }
                ]
            },
            "duringQuest": {
                text: "Any luck finding that bag for me, sweetie?",
                choices: [
                    { text: "I found it right here!", nextNode: "turnInSugar", condition: { type: "HAS_ITEM", itemId: "sugar" } },
                    { text: "I'm still looking.", nextNode: "default", condition: { type: "NOT_HAS_ITEM", itemId: "sugar" } }
                ]
            },
            "turnInSugar": {
                text: "You're a lifesaver! Thank you so, so much. Now I can... bake. Yes. Bake.",
                events: [
                    { type: "REMOVE_ITEM", itemId: "sugar" },
                    { type: "COMPLETE_OBJECTIVE", questId: "sugarAndSpice", objectiveIndex: 2 },
                    { type: "SET_DIALOGUE_NODE", charId: "scarlett", nodeId: "postQuest" }
                ]
            },
            "postQuest": {
                text: "Come back anytime! By the way, we're planning the annual Summer Festival. If you see Finley the fox, could you ask him about it? He's the town historian but he's terribly shy.",
                events: [{ type: "SET_FLAG", flag: "scarlett_mentioned_finley" }, { type: "SET_DIALOGUE_NODE", charId: "scarlett", nodeId: "default" }]
            },
            "default": {
                text: "Hi there, sweetie! Let me know if you need anything."
            }
        },

        "finley": {
            "start": {
                text: "O-oh! H-hello. I wasn't expecting anyone. I'm Finley.",
                condition: { type: "HAS_FLAG", flag: "scarlett_mentioned_finley" },
                events: [{ type: "SET_FLAG", flag: "finley_met" }],
                choices: [
                    { text: "Scarlett sent me to ask about the festival.", nextNode: "bookProblem" }
                ]
            },
            "start_unmet": {
                text: "E-excuse me... H-hello.",
                events: [{ type: "SET_FLAG", flag: "finley_met" }, { type: "SET_DIALOGUE_NODE", charId: "finley", nodeId: "default" }]
            },
            "bookProblem": {
                text: "The festival? Oh, right! I'm supposed to be organizing the historical records for the display... but I've misplaced my main reference book! I'm so embarrassed.",
                choices: [ { text: "Maybe I can help you find it?", nextNode: "acceptQuest" } ]
            },
            "acceptQuest": {
                text: "Y-you would? Oh, thank you! It's a big leather-bound book. I think I was reading it down by the river bend, to the southeast.",
                events: [
                    { type: "ACTIVATE_QUEST", questId: "aLostChapter" },
                    { type: "COMPLETE_OBJECTIVE", questId: "aLostChapter", objectiveIndex: 0 },
                    { type: "UNHIDE_OBJECT", objectId: "lost_book" },
                    { type: "SET_DIALOGUE_NODE", charId: "finley", nodeId: "duringQuest" }
                ]
            },
            "duringQuest": {
                text: "I hope my book is okay... I'd be lost without it.",
                choices: [
                    { text: "I think this is it!", nextNode: "turnInBook", condition: { type: "HAS_ITEM", itemId: "lost_book" } },
                    { text: "I'll keep an eye out for it.", nextNode: "default", condition: { type: "NOT_HAS_ITEM", itemId: "lost_book" } }
                ]
            },
            "turnInBook": {
                text: "My book! You found it! Oh, thank you, thank you! Now I can finally get to work on the festival presentation.",
                events: [
                    { type: "REMOVE_ITEM", itemId: "lost_book" },
                    { type: "COMPLETE_OBJECTIVE", questId: "aLostChapter", objectiveIndex: 2 },
                    { type: "SET_FLAG", flag: "finley_historian_unlocked" },
                    { type: "SET_DIALOGUE_NODE", charId: "finley", nodeId: "postQuest" }
                ]
            },
            "postQuest": {
                text: "Th-thanks again. Let me know if you want to know anything about the valley's history!",
                events: [{ type: "SET_DIALOGUE_NODE", charId: "finley", nodeId: "default" }]
            },
            "default": {
                text: "H-hello again. It's a quiet day for reading."
            }
        }
    }
};