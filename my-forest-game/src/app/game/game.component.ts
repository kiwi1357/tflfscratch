import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Phaser from 'phaser';
import { MainScene } from './scenes/main.scene'; // Import the new scene

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  phaserGame: Phaser.Game | undefined;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 540,
      width: 960,
      scene: [MainScene], // Add MainScene to the scene array
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      }
    };
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }

  ngOnDestroy(): void {
    this.phaserGame?.destroy(true);
  }
}
