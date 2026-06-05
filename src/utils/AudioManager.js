// src/utils/AudioManager.js
export default class AudioManager {
  static init() {
    if (this.audioCtx) return;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.audioCtx.createGain();

    // Reverb (convolver) for cave/temple echo feel
    this._buildReverb().then(reverb => {
      this.reverb = reverb;
      const reverbGain = this.audioCtx.createGain();
      reverbGain.gain.value = 0.22;
      this.reverb.connect(reverbGain);
      reverbGain.connect(this.masterGain);
      this.reverbGain = reverbGain;
    });

    this.masterGain.connect(this.audioCtx.destination);
    this.masterGain.gain.value = 0.3;
  }

  // Build a simple impulse-response reverb
  static async _buildReverb() {
    const sampleRate = this.audioCtx.sampleRate;
    const length = sampleRate * 2.5; // 2.5s reverb tail
    const impulse = this.audioCtx.createBuffer(2, length, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const channelData = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    const convolver = this.audioCtx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  static _connectWithReverb(sourceNode, dryGainVal = 0.8, wetGainVal = 0.2) {
    const dryGain = this.audioCtx.createGain();
    dryGain.gain.value = dryGainVal;
    sourceNode.connect(dryGain);
    dryGain.connect(this.masterGain);

    if (this.reverb) {
      const wetGain = this.audioCtx.createGain();
      wetGain.gain.value = wetGainVal;
      sourceNode.connect(this.reverb);
      this.reverb.connect(wetGain);
      wetGain.connect(this.masterGain);
    }
  }

  static playTone(frequency, duration = 0.1, type = 'sine', volume = 1) {
    this.init();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(volume * 0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  static play(name) {
    this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    switch (name) {
      case 'pickup':
        // Coin-like pickup: rising arpeggio
        this.playTone(587, 0.08, 'square', 0.6);
        setTimeout(() => this.playTone(784, 0.08, 'square', 0.6), 60);
        setTimeout(() => this.playTone(1047, 0.15, 'square', 0.5), 120);
        break;

      case 'victory':
        // Triumphant fanfare
        this.playTone(523, 0.2, 'square', 0.7);
        setTimeout(() => this.playTone(659, 0.2, 'square', 0.7), 200);
        setTimeout(() => this.playTone(784, 0.2, 'square', 0.7), 400);
        setTimeout(() => this.playTone(1047, 0.5, 'square', 0.8), 600);
        break;

      case 'gameover':
        // Descending sad tones
        this.playTone(440, 0.3, 'sawtooth', 0.5);
        setTimeout(() => this.playTone(370, 0.3, 'sawtooth', 0.5), 300);
        setTimeout(() => this.playTone(311, 0.3, 'sawtooth', 0.4), 600);
        setTimeout(() => this.playTone(261, 0.6, 'sawtooth', 0.3), 900);
        break;

      case 'bgm':
        this.playBGM();
        break;

      default:
        console.warn('AudioManager: unknown sound', name);
    }
  }

  /**
   * Enhanced BGM — Adventure/archaeological temple theme.
   * Uses multiple oscillator layers:
   *  - Bass drone (deep temple rumble)
   *  - Melody sequencer (heroic/mysterious motif on pentatonic scale)
   *  - Percussion pulses (tribal drum feel)
   *  - Shimmer high layer (golden idol sparkle)
   */
  static playBGM() {
    this.init();
    if (this.bgmNode) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // ── 1. Deep bass drone ────────────────────────────────────────────
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(55, now); // A1
    bassGain.gain.value = 0.06;
    bassOsc.connect(bassGain);
    bassGain.connect(this.masterGain);

    // Slow bass wobble (ominous pulse)
    const bassLfo = ctx.createOscillator();
    const bassLfoGain = ctx.createGain();
    bassLfo.type = 'sine';
    bassLfo.frequency.setValueAtTime(0.5, now);
    bassLfoGain.gain.value = 6;
    bassLfo.connect(bassLfoGain);
    bassLfoGain.connect(bassOsc.frequency);

    bassOsc.start(now);
    bassLfo.start(now);

    // ── 2. Mid harmony pad ────────────────────────────────────────────
    const pad1 = ctx.createOscillator();
    const pad2 = ctx.createOscillator();
    const padGain = ctx.createGain();
    pad1.type = 'sine';
    pad1.frequency.setValueAtTime(110, now); // A2
    pad2.type = 'sine';
    pad2.frequency.setValueAtTime(165, now); // E3 - perfect fifth
    padGain.gain.value = 0.035;

    // Tremolo on pad
    const tremLfo = ctx.createOscillator();
    const tremLfoGain = ctx.createGain();
    tremLfo.type = 'sine';
    tremLfo.frequency.setValueAtTime(3.5, now);
    tremLfoGain.gain.value = 0.012;
    tremLfo.connect(tremLfoGain);
    tremLfoGain.connect(padGain.gain);

    pad1.connect(padGain);
    pad2.connect(padGain);
    padGain.connect(this.masterGain);
    tremLfo.start(now);
    pad1.start(now);
    pad2.start(now);

    // ── 3. Melody sequencer (heroic/mysterious motif) ─────────────────
    // Pentatonic-ish minor scale: A3 C4 D4 E4 G4 A4 – played in a loop
    const MELODY = [
      // [freq, duration(s), delay_from_start]
      [220, 0.25, 0.0],   // A3
      [261, 0.20, 0.30],  // C4
      [294, 0.20, 0.55],  // D4
      [330, 0.35, 0.80],  // E4
      [392, 0.20, 1.20],  // G4
      [440, 0.40, 1.50],  // A4  ← heroic high note
      [392, 0.20, 2.00],  // G4
      [330, 0.20, 2.25],  // E4
      [261, 0.20, 2.55],  // C4
      [220, 0.60, 2.85],  // A3 (resolve)
      // Brief pause then counter-motif
      [294, 0.20, 4.00],  // D4
      [330, 0.20, 4.25],  // E4
      [220, 0.20, 4.55],  // A3
      [196, 0.40, 4.80],  // G3 – tension
      [220, 0.60, 5.30],  // A3 resolve
    ];
    const LOOP_DURATION = 6.5; // seconds per loop

    const scheduleLoop = (startTime) => {
      if (!this.bgmNode) return;
      MELODY.forEach(([freq, dur, offset]) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;

        const t = startTime + offset;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.055, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + dur + 0.08);
      });

      // Schedule next iteration
      this._melodyTimer = setTimeout(() => {
        scheduleLoop(ctx.currentTime + 0.05);
      }, (LOOP_DURATION - 0.3) * 1000);
    };

    // Start melody after short intro delay
    setTimeout(() => {
      if (this.bgmNode) scheduleLoop(ctx.currentTime);
    }, 800);

    // ── 4. Tribal percussion pulses ───────────────────────────────────
    const scheduleDrum = (t, freq = 80, vol = 0.07, dur = 0.18) => {
      if (!this.bgmNode) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.3, t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    };

    // Drum pattern: kick on beats 1 & 3, hi accent on 2 & 4
    const BEAT_INTERVAL = 0.5; // 120 bpm
    const scheduleDrumLoop = () => {
      if (!this.bgmNode) return;
      const t = ctx.currentTime;
      scheduleDrum(t + 0.0, 90, 0.08, 0.2);  // kick 1
      scheduleDrum(t + 0.5, 200, 0.04, 0.08); // snare 2
      scheduleDrum(t + 1.0, 90, 0.07, 0.2);  // kick 3
      scheduleDrum(t + 1.5, 200, 0.04, 0.08); // snare 4
      scheduleDrum(t + 2.0, 110, 0.09, 0.22); // kick downbeat
      scheduleDrum(t + 2.5, 200, 0.03, 0.07); // snare
      scheduleDrum(t + 3.0, 80, 0.08, 0.25);  // deep kick
      scheduleDrum(t + 3.5, 200, 0.04, 0.08); // snare

      this._drumTimer = setTimeout(() => {
        if (this.bgmNode) scheduleDrumLoop();
      }, 4 * BEAT_INTERVAL * 1000);
    };
    scheduleDrumLoop();

    // ── 5. High shimmer layer (golden, sparkly) ───────────────────────
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = 'sine';
    shimmerOsc.frequency.setValueAtTime(880, now); // A5
    shimmerGain.gain.value = 0.012;
    const shimLfo = ctx.createOscillator();
    const shimLfoG = ctx.createGain();
    shimLfo.type = 'sine';
    shimLfo.frequency.setValueAtTime(7, now);
    shimLfoG.gain.value = 0.008;
    shimLfo.connect(shimLfoG);
    shimLfoG.connect(shimmerGain.gain);
    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(this.masterGain);
    shimmerOsc.start(now);
    shimLfo.start(now);

    // ── Store references for cleanup ──────────────────────────────────
    this.bgmNode = {
      bassOsc, bassLfo, pad1, pad2, tremLfo,
      shimmerOsc, shimLfo,
    };
  }

  static stopBGM() {
    if (this.bgmNode) {
      const nodes = this.bgmNode;
      clearTimeout(this._melodyTimer);
      clearTimeout(this._drumTimer);
      Object.values(nodes).forEach(node => {
        try { node.stop(); } catch (e) { /* already stopped */ }
      });
      this.bgmNode = null;
    }
  }
}
