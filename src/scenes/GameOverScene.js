// src/scenes/GameOverScene.js
import AudioManager from '../utils/AudioManager.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.reason = data?.reason || 'unknown';
    this.finalScore = data?.score || 0;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#0a0000');

    // Red vignette overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x330000, 0.4);
    overlay.fillRect(0, 0, width, height);

    // Game Over title
    this.add.text(width / 2 + 3, height / 4 + 3, 'GAME OVER', {
      fontFamily: '"Courier New", monospace',
      fontSize: '52px',
      color: '#000000',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.5);

    const title = this.add.text(width / 2, height / 4, 'GAME OVER', {
      fontFamily: '"Courier New", monospace',
      fontSize: '52px',
      color: '#FF3333',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Fade in title
    title.setAlpha(0);
    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 1000,
      ease: 'Power2',
    });

    // Reason text
    const reasonMsg = this.reason === 'time'
      ? '⏱️ Time ran out!'
      : '🦂 Stung by a scorpion!';

    this.add.text(width / 2, height / 2 - 20, reasonMsg, {
      fontFamily: '"Courier New", monospace',
      fontSize: '22px',
      color: '#DEB887',
    }).setOrigin(0.5);

    // Score
    this.add.text(width / 2, height / 2 + 30, `Final Score: ${this.finalScore}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '28px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Restart prompt
    const restartText = this.add.text(width / 2, height - 80, '▶ Press SPACE to Try Again ◀', {
      fontFamily: '"Courier New", monospace',
      fontSize: '22px',
      color: '#00FF88',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: restartText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Stop BGM and play game over sound
    AudioManager.stopBGM();
    AudioManager.play('gameover');

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('MenuScene');
    });
  }
}
