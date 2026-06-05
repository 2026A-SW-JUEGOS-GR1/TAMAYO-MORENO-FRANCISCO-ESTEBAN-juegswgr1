// src/scenes/BootScene.js
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    // Generate all textures using Phaser graphics + generateTexture
    this.createPlayerTexture();
    this.createFloorTexture();
    this.createWallTexture();
    this.createExitTexture();
    this.createArtifactTexture();
    this.createEnemyTexture();

    // After assets are ready, go to Menu
    this.scene.start('MenuScene');
  }

  createPlayerTexture() {
    // Indiana Jones-style character: 32x32, top-down view
    const g = this.make.graphics({ add: false });

    // Shadow beneath character
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(16, 28, 20, 8);

    // Body / jacket (brown leather)
    g.fillStyle(0x8B5E3C, 1);
    g.fillEllipse(16, 18, 16, 20);

    // Left arm
    g.fillStyle(0x8B5E3C, 1);
    g.fillEllipse(7, 18, 6, 10);

    // Right arm
    g.fillEllipse(25, 18, 6, 10);

    // Belt
    g.fillStyle(0x3B1C0A, 1);
    g.fillRect(9, 19, 14, 3);

    // Belt buckle
    g.fillStyle(0xFFD700, 1);
    g.fillRect(14, 19, 4, 3);

    // Head (skin color)
    g.fillStyle(0xDEB887, 1);
    g.fillCircle(16, 9, 6);

    // Fedora hat - brim (wide oval)
    g.fillStyle(0x4A2A0A, 1);
    g.fillEllipse(16, 7, 20, 8);

    // Hat crown
    g.fillStyle(0x5C3A1E, 1);
    g.fillEllipse(16, 5, 12, 8);

    // Hat band
    g.fillStyle(0x3B1C0A, 1);
    g.fillRect(10, 6, 12, 2);

    // Eyes
    g.fillStyle(0x222222, 1);
    g.fillRect(13, 8, 2, 2);
    g.fillRect(17, 8, 2, 2);

    // Pants (khaki)
    g.fillStyle(0xC2A366, 1);
    g.fillRect(11, 23, 4, 5);
    g.fillRect(17, 23, 4, 5);

    // Boots (dark brown)
    g.fillStyle(0x3B1C0A, 1);
    g.fillRect(11, 27, 4, 3);
    g.fillRect(17, 27, 4, 3);

    g.generateTexture('player', 32, 32);
    g.destroy();
  }

  createFloorTexture() {
    const g = this.make.graphics({ add: false });

    // Sandy stone floor
    g.fillStyle(0x8B7D6B, 1);
    g.fillRect(0, 0, 64, 64);

    // Stone tile pattern (lines)
    g.lineStyle(1, 0x7A6B5A, 1);
    g.strokeRect(2, 2, 28, 28);
    g.strokeRect(34, 2, 28, 28);
    g.strokeRect(2, 34, 28, 28);
    g.strokeRect(34, 34, 28, 28);

    // Some dust spots
    g.fillStyle(0x6B5D4B, 0.5);
    g.fillRect(10, 10, 2, 2);
    g.fillRect(45, 22, 3, 3);
    g.fillRect(20, 50, 2, 2);
    g.fillRect(55, 45, 2, 2);

    g.generateTexture('floor', 64, 64);
    g.destroy();
  }

  createWallTexture() {
    const g = this.make.graphics({ add: false });

    // Stone wall base
    g.fillStyle(0x5C4A3A, 1);
    g.fillRect(0, 0, 64, 64);

    // Brick rows
    g.fillStyle(0x6B5545, 1);
    g.fillRect(1, 1, 30, 14);
    g.fillRect(33, 1, 30, 14);
    g.fillRect(16, 17, 30, 14);
    g.fillRect(1, 33, 30, 14);
    g.fillRect(33, 33, 30, 14);
    g.fillRect(16, 49, 30, 14);

    // Brick borders
    g.lineStyle(1, 0x3B2A1A, 1);
    g.strokeRect(1, 1, 30, 14);
    g.strokeRect(33, 1, 30, 14);
    g.strokeRect(16, 17, 30, 14);
    g.strokeRect(1, 33, 30, 14);
    g.strokeRect(33, 33, 30, 14);
    g.strokeRect(16, 49, 30, 14);

    // Moss at bottom
    g.fillStyle(0x324F1E, 0.3);
    g.fillRect(0, 52, 64, 12);

    g.generateTexture('wall', 64, 64);
    g.destroy();
  }

  createExitTexture() {
    const g = this.make.graphics({ add: false });

    // Floor base
    g.fillStyle(0x8B7D6B, 1);
    g.fillRect(0, 0, 64, 64);

    // Glow ring
    g.fillStyle(0xFFD700, 0.3);
    g.fillCircle(32, 32, 28);
    g.fillStyle(0xFFA500, 0.4);
    g.fillCircle(32, 32, 18);

    // Door frame (arch shape approximation)
    g.fillStyle(0x4A2A0A, 1);
    g.fillRect(18, 24, 4, 34);
    g.fillRect(42, 24, 4, 34);
    g.fillRect(18, 20, 28, 6);

    // Inner door (gold)
    g.fillStyle(0xDAA520, 1);
    g.fillRect(22, 26, 20, 32);

    // Door handle
    g.fillStyle(0xFFD700, 1);
    g.fillCircle(36, 42, 2);

    g.generateTexture('exit', 64, 64);
    g.destroy();
  }

  createArtifactTexture() {
    const g = this.make.graphics({ add: false });

    // Glow effect
    g.fillStyle(0xFFD700, 0.2);
    g.fillCircle(32, 32, 26);
    g.fillStyle(0xFFD700, 0.3);
    g.fillCircle(32, 32, 18);

    // Golden idol body (triangle shape)
    g.fillStyle(0xFFD700, 1);
    g.fillTriangle(32, 14, 44, 46, 20, 46);

    // Idol face circle
    g.fillStyle(0xDAA520, 1);
    g.fillCircle(32, 28, 6);

    // Eyes
    g.fillStyle(0x8B0000, 1);
    g.fillCircle(29, 27, 2);
    g.fillCircle(35, 27, 2);

    // Base pedestal
    g.fillStyle(0xB8860B, 1);
    g.fillRect(18, 46, 28, 6);

    // Shine sparkle
    g.fillStyle(0xFFF8DC, 1);
    g.fillCircle(38, 18, 2);

    g.generateTexture('artifact', 64, 64);
    g.destroy();
  }

  createEnemyTexture() {
    const g = this.make.graphics({ add: false });

    // Shadow
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(16, 28, 20, 8);

    // Scorpion body
    g.fillStyle(0x8B1A1A, 1);
    g.fillEllipse(16, 18, 14, 16);

    // Tail (curved line approximation)
    g.lineStyle(3, 0x8B1A1A, 1);
    g.lineBetween(16, 10, 16, 4);
    g.lineBetween(16, 4, 22, 2);

    // Stinger
    g.fillStyle(0xFF4444, 1);
    g.fillCircle(22, 2, 2);

    // Pincers
    g.lineStyle(2, 0x8B1A1A, 1);
    g.lineBetween(10, 14, 4, 10);
    g.lineBetween(4, 10, 6, 8);
    g.lineBetween(22, 14, 28, 10);
    g.lineBetween(28, 10, 26, 8);

    // Eyes (glowing)
    g.fillStyle(0xFF6600, 1);
    g.fillCircle(13, 16, 2);
    g.fillCircle(19, 16, 2);

    // Legs
    g.lineStyle(1, 0x5C1010, 1);
    g.lineBetween(9, 18, 3, 20);
    g.lineBetween(9, 21, 3, 23);
    g.lineBetween(9, 24, 3, 26);
    g.lineBetween(23, 18, 29, 20);
    g.lineBetween(23, 21, 29, 23);
    g.lineBetween(23, 24, 29, 26);

    g.generateTexture('enemy', 32, 32);
    g.destroy();
  }
}
