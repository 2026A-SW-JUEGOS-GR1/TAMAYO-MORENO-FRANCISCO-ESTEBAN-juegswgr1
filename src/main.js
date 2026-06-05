// src/main.js
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import NarrativeScene from './scenes/NarrativeScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene from './scenes/VictoryScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'gameCanvas',
  backgroundColor: '#0d0906',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, NarrativeScene, GameScene, GameOverScene, VictoryScene],
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
});
