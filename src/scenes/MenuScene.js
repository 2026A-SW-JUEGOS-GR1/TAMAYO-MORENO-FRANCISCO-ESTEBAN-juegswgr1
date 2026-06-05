// src/scenes/MenuScene.js
import AudioManager from '../utils/AudioManager.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Dark background
    this.cameras.main.setBackgroundColor('#0d0906');

    // Torch-like ambient particles
    const particles = this.add.graphics();
    for (let i = 0; i < 30; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      const alpha = Math.random() * 0.3;
      particles.fillStyle(0xFFD700, alpha);
      particles.fillCircle(px, py, Math.random() * 3 + 1);
    }

    // Title with shadow
    this.add.text(width / 2 + 3, height / 4 + 3, 'MAZE JONES', {
      fontFamily: '"Courier New", monospace',
      fontSize: '56px',
      color: '#000000',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.5);

    const title = this.add.text(width / 2, height / 4, 'MAZE JONES', {
      fontFamily: '"Courier New", monospace',
      fontSize: '56px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Title pulse animation
    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Subtitle
    this.add.text(width / 2, height / 4 + 50, 'Temple of the Golden Idols', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      color: '#B8860B',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Instructions box
    const boxY = height / 2 + 20;
    const box = this.add.rectangle(width / 2, boxY, 420, 180, 0x1a1209, 0.8);
    box.setStrokeStyle(2, 0x8B5E3C);

    const instructions = [
      '🎮 WASD or Arrow Keys to move',
      '🗿 Collect all golden idols',
      '🚪 Find the exit to escape',
      '🦂 Avoid the scorpions!',
      '⏱️ Beat the clock!',
    ];

    instructions.forEach((text, i) => {
      this.add.text(width / 2, boxY - 65 + i * 32, text, {
        fontFamily: '"Courier New", monospace',
        fontSize: '16px',
        color: '#DEB887',
      }).setOrigin(0.5);
    });

    // Start prompt with blinking
    const startText = this.add.text(width / 2, height - 80, '▶ Press SPACE to Start ◀', {
      fontFamily: '"Courier New", monospace',
      fontSize: '24px',
      color: '#00FF88',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Version/credits
    this.add.text(width / 2, height - 20, 'v1.0 — Escape the Temple!', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: '#555',
    }).setOrigin(0.5);

    // Start BGM
    AudioManager.play('bgm');

    // Input handler → show narrative intro before game
    this.input.keyboard.once('keydown-SPACE', () => {
      this.cameras.main.fadeOut(350, 0, 0, 0);
      this.time.delayedCall(370, () => {
        this.scene.start('NarrativeScene');
      });
    });
  }
}
