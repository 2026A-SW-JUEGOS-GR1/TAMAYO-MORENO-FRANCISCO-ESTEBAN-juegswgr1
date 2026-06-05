// src/scenes/VictoryScene.js
import AudioManager from '../utils/AudioManager.js';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data) {
    this.finalScore = data?.score || 0;
    this.timeLeft = data?.timeLeft || 0;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#0a0d06');

    // Gold particle celebration
    const particles = this.add.graphics();
    for (let i = 0; i < 50; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      const alpha = Math.random() * 0.5 + 0.2;
      const colors = [0xFFD700, 0xDAA520, 0xFFA500, 0xFFFF00];
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.fillStyle(color, alpha);
      particles.fillCircle(px, py, Math.random() * 4 + 1);
    }

    // Victory title with shadow
    this.add.text(width / 2 + 3, height / 5 + 3, '🏆 VICTORY! 🏆', {
      fontFamily: '"Courier New", monospace',
      fontSize: '48px',
      color: '#000000',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.5);

    const title = this.add.text(width / 2, height / 5, '🏆 VICTORY! 🏆', {
      fontFamily: '"Courier New", monospace',
      fontSize: '48px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Title celebration animation
    title.setAlpha(0).setScale(0.5);
    this.tweens.add({
      targets: title,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 800,
      ease: 'Back.easeOut',
    });

    // Escaped message
    this.add.text(width / 2, height / 5 + 60, 'You escaped the temple!', {
      fontFamily: '"Courier New", monospace',
      fontSize: '20px',
      color: '#DEB887',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Score display
    const totalScore = this.finalScore + (this.timeLeft * 10);

    const scoreBox = this.add.rectangle(width / 2, height / 2 + 10, 350, 140, 0x1a1209, 0.8);
    scoreBox.setStrokeStyle(2, 0xFFD700);

    this.add.text(width / 2, height / 2 - 30, `Idol Score: ${this.finalScore}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '22px',
      color: '#FFFFFF',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 5, `Time Bonus: +${this.timeLeft * 10}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '22px',
      color: '#00FF88',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 45, `TOTAL: ${totalScore}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '28px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Restart prompt
    const restartText = this.add.text(width / 2, height - 80, '▶ Press SPACE to Play Again ◀', {
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

    // Stop BGM and play victory sound
    AudioManager.stopBGM();
    AudioManager.play('victory');

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('MenuScene');
    });
  }
}
