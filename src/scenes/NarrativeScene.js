// src/scenes/NarrativeScene.js
import AudioManager from '../utils/AudioManager.js';

/**
 * NarrativeScene – Cinematic story modal shown once after the main menu.
 * Premisa: El Dr. Marcus Jones, arqueólogo y aventurero, penetra el
 * Templo de los Ídolos Dorados para recuperar reliquias sagradas antes
 * de que el templo se derrumbe. Debe sortear trampas, escorpiones
 * guardianes y el laberinto de piedra para escapar con vida y la
 * gloria del descubrimiento.
 */
export default class NarrativeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NarrativeScene' });
  }

  create() {
    const { width, height } = this.scale;
    this._destroyed = false;

    // ── Dim overlay (full-screen semi-transparent black) ──────────────
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.82);
    overlay.setDepth(10);

    // ── Modal panel ───────────────────────────────────────────────────
    const panelW = 680;
    const panelH = 440;
    const panelX = width / 2;
    const panelY = height / 2;

    // Outer glow
    const glow = this.add.rectangle(panelX, panelY, panelW + 8, panelH + 8, 0xFFD700, 0.18);
    glow.setDepth(11);

    // Panel body
    const panel = this.add.rectangle(panelX, panelY, panelW, panelH, 0x0f0905, 1);
    panel.setStrokeStyle(2, 0x8B5E3C);
    panel.setDepth(11);

    // Top decorative border strip
    const topStrip = this.add.rectangle(panelX, panelY - panelH / 2 + 18, panelW, 36, 0x1a0e06, 1);
    topStrip.setDepth(12);
    const topStripBorder = this.add.rectangle(panelX, panelY - panelH / 2 + 18, panelW, 36, 0x000000, 0);
    topStripBorder.setStrokeStyle(1, 0x8B5E3C);
    topStripBorder.setDepth(12);

    // ── Corner ornaments ─────────────────────────────────────────────
    const corners = [
      { x: panelX - panelW / 2 + 14, y: panelY - panelH / 2 + 14 },
      { x: panelX + panelW / 2 - 14, y: panelY - panelH / 2 + 14 },
      { x: panelX - panelW / 2 + 14, y: panelY + panelH / 2 - 14 },
      { x: panelX + panelW / 2 - 14, y: panelY + panelH / 2 - 14 },
    ];
    corners.forEach(c => {
      const gem = this.add.rectangle(c.x, c.y, 10, 10, 0xFFD700, 1).setDepth(13);
      this.tweens.add({
        targets: gem,
        alpha: { from: 1, to: 0.4 },
        duration: 900 + Math.random() * 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // ── Header text ───────────────────────────────────────────────────
    const headerY = panelY - panelH / 2 + 18;
    this.add.text(panelX, headerY, '✦  DIARIO DEL EXPLORADOR  ✦', {
      fontFamily: '"Courier New", monospace',
      fontSize: '15px',
      color: '#B8860B',
      fontStyle: 'bold',
      letterSpacing: 3,
    }).setOrigin(0.5).setDepth(13);

    // ── Protagonist illustration (pixel-style idol glyph) ────────────
    const iconG = this.add.graphics().setDepth(13);

    // Fedora silhouette as small icon
    iconG.fillStyle(0x4A2A0A, 1);
    iconG.fillEllipse(panelX - 270, headerY + 50, 26, 10);
    iconG.fillStyle(0x5C3A1E, 1);
    iconG.fillEllipse(panelX - 270, headerY + 46, 16, 10);
    iconG.fillStyle(0xDEB887, 1);
    iconG.fillCircle(panelX - 270, headerY + 61, 8);
    iconG.fillStyle(0x8B5E3C, 1);
    iconG.fillEllipse(panelX - 270, headerY + 74, 20, 22);

    // Right side idol icon
    iconG.fillStyle(0xFFD700, 0.9);
    iconG.fillTriangle(panelX + 272, headerY + 42, panelX + 280, headerY + 70, panelX + 264, headerY + 70);
    iconG.fillStyle(0xDAA520, 1);
    iconG.fillCircle(panelX + 272, headerY + 52, 6);
    iconG.fillStyle(0x8B0000, 1);
    iconG.fillCircle(panelX + 269, headerY + 51, 1.5);
    iconG.fillCircle(panelX + 275, headerY + 51, 1.5);

    // ── Narrative text blocks ─────────────────────────────────────────
    const textStartY = panelY - panelH / 2 + 58;

    const narrativeLines = [
      { text: 'Dr. MARCUS JONES', style: { fontSize: '22px', color: '#FFD700', fontStyle: 'bold' } },
      { text: '', style: { fontSize: '10px', color: '#555' } },
      { text: '— Arqueólogo, explorador, y el último en salir con vida —', style: { fontSize: '13px', color: '#B8860B', fontStyle: 'italic' } },
      { text: '', style: { fontSize: '8px', color: '#555' } },
      {
        text: 'Tras descifrar el mapa de los Ídolos Dorados, Jones se adentra', style: {
          fontSize: '15px', color: '#DEB887',
        },
      },
      {
        text: 'en el Templo Perdido de Aurantius — una cripta milenaria oculta', style: {
          fontSize: '15px', color: '#DEB887',
        },
      },
      {
        text: 'bajo las arenas del desierto, custodiada por escorpiones', style: {
          fontSize: '15px', color: '#DEB887',
        },
      },
      {
        text: 'guardianes y trampas de piedra que se activan al amanecer.', style: {
          fontSize: '15px', color: '#DEB887',
        },
      },
      { text: '', style: { fontSize: '8px', color: '#555' } },
      {
        text: 'Tu misión: recuperar TODOS los ídolos sagrados y encontrar', style: {
          fontSize: '15px', color: '#C8A870',
        },
      },
      {
        text: 'la salida antes de que el reloj llegue a cero y el templo', style: {
          fontSize: '15px', color: '#C8A870',
        },
      },
      {
        text: 'se selle para siempre contigo dentro.', style: {
          fontSize: '15px', color: '#C8A870',
        },
      },
    ];

    let currentY = textStartY;
    narrativeLines.forEach(({ text, style }) => {
      const size = parseInt(style.fontSize);
      this.add.text(panelX, currentY, text, {
        fontFamily: '"Courier New", monospace',
        ...style,
        align: 'center',
        wordWrap: { width: panelW - 80 },
      }).setOrigin(0.5, 0).setDepth(13);
      currentY += size + (size > 18 ? 10 : 6);
    });

    // ── Bottom divider ────────────────────────────────────────────────
    const dividerY = panelY + panelH / 2 - 56;
    const divG = this.add.graphics().setDepth(13);
    divG.lineStyle(1, 0x8B5E3C, 0.6);
    divG.lineBetween(panelX - panelW / 2 + 24, dividerY, panelX + panelW / 2 - 24, dividerY);

    // Decorative diamond on divider
    divG.fillStyle(0xFFD700, 0.8);
    divG.fillTriangle(panelX - 5, dividerY - 5, panelX + 5, dividerY - 5, panelX, dividerY - 11);
    divG.fillTriangle(panelX - 5, dividerY + 5, panelX + 5, dividerY + 5, panelX, dividerY + 11);

    // ── "Press any key" prompt ────────────────────────────────────────
    const promptY = panelY + panelH / 2 - 30;
    const prompt = this.add.text(panelX, promptY, '▶  Pulsa ESPACIO para comenzar la aventura  ◀', {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      color: '#00FF88',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(14);

    this.tweens.add({
      targets: prompt,
      alpha: 0.25,
      duration: 750,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // ── Glow pulse on panel border ────────────────────────────────────
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.08, to: 0.3 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // ── Typewriter reveal animation ───────────────────────────────────
    // Fade the entire panel in
    [overlay, glow, panel, topStrip, topStripBorder].forEach(obj => {
      obj.setAlpha(0);
      this.tweens.add({ targets: obj, alpha: obj === panel ? 1 : (obj === overlay ? 0.82 : obj.alpha || 1), duration: 500, ease: 'Power2' });
    });

    // ── Input: SPACE or click to continue ─────────────────────────────
    // Delay registration so any residual click from MenuScene doesn't skip instantly
    this.time.delayedCall(650, () => {
      if (this._destroyed) return;
      this.input.keyboard.once('keydown-SPACE', () => this._proceed());
      this.input.once('pointerdown', () => this._proceed());
    });

    // ── Ambient dust particles ────────────────────────────────────────
    this._spawnParticleTimer = this.time.addEvent({
      delay: 300,
      loop: true,
      callback: this._spawnParticle,
      callbackScope: this,
      args: [panelX, panelY, panelW, panelH],
    });
  }

  _spawnParticle(panelX, panelY, panelW, panelH) {
    if (this._destroyed) return;
    const x = panelX - panelW / 2 + Math.random() * panelW;
    const y = panelY + panelH / 2;
    const dot = this.add.rectangle(x, y, 2, 2, 0xFFD700, 0.7).setDepth(12);
    this.tweens.add({
      targets: dot,
      y: y - 80 - Math.random() * 80,
      alpha: 0,
      duration: 1800 + Math.random() * 1000,
      ease: 'Sine.easeOut',
      onComplete: () => { if (dot && dot.active) dot.destroy(); },
    });
  }

  _proceed() {
    if (this._destroyed) return;
    this._destroyed = true;
    if (this._spawnParticleTimer) this._spawnParticleTimer.remove();
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.time.delayedCall(420, () => {
      this.scene.start('GameScene');
    });
  }
}
