import * as Phaser from 'phaser';
import { gameData } from '../../../../../js/gameData'; // Adjust path as needed

export class MainScene extends Phaser.Scene {
  player: Phaser.Physics.Arcade.Sprite | undefined;
  npcs: Phaser.Physics.Arcade.Group | undefined;
  items: Phaser.Physics.Arcade.Group | undefined;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Load assets here
    this.load.image('startMenuBg', 'assets/ReferenceImages/StartMenu.jpg');

    // Load tileset image
    this.load.image('tiles', 'assets/tileset.png');

    // Load sprite images
    this.load.image('playerSprite', 'assets/player.png');
    this.load.image('buckySprite', 'assets/bucky.png');
    this.load.image('scarlettSprite', 'assets/scarlett.png');
    this.load.image('finleySprite', 'assets/finley.png');
    this.load.image('itemSprite', 'assets/item.png');
  }

  create() {
    // Remove the start menu background, as this scene will now be the game world
    // this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'startMenuBg');

    // --- Create Tilemap ---
    const map = this.make.tilemap({ data: gameData.map, tileWidth: gameData.tileSize, tileHeight: gameData.tileSize });
    const tiles = map.addTilesetImage('tiles'); // 'tiles' is the key used in preload
    const layer = map.createLayer(0, tiles, 0, 0);

    // --- Create Player ---
    const playerConfig = gameData.characters.player;
    this.player = this.physics.add.sprite(gameData.player.x, gameData.player.y, 'playerSprite');
    this.player.setCollideWorldBounds(true);
    this.player.setSize(playerConfig.hitbox[2].x - playerConfig.hitbox[0].x, playerConfig.hitbox[2].y - playerConfig.hitbox[0].y);

    // --- Create NPCs and Items ---
    this.npcs = this.physics.add.group();
    this.items = this.physics.add.group();

    gameData.gameObjects.forEach(objData => {
      if (objData.removed) return; // Skip removed items

      let sprite;
      let config;
      if (objData.type === 'character') {
        config = gameData.characters[objData.id];
        sprite = this.npcs.create(objData.x, objData.y, `${objData.id}Sprite`);
      } else if (objData.type === 'item') {
        config = gameData.items[objData.id];
        sprite = this.items.create(objData.x, objData.y, 'itemSprite');
      }

      if (sprite && config) {
        sprite.setCollideWorldBounds(true);
        sprite.setImmovable(true); // NPCs and items don't move when collided with
        sprite.setSize(config.hitbox[2].x - config.hitbox[0].x, config.hitbox[2].y - config.hitbox[0].y);
        sprite.setData('id', objData.id);
        sprite.setData('type', objData.type);
      }
    });

    // --- Camera ---
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    // --- Collisions ---
    this.physics.add.collider(this.player, this.npcs);
    this.physics.add.collider(this.player, this.items);
  }

  update() {
    // Game loop logic here
  }
}
