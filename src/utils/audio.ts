/**
 * Audio synthesis engine for AH20 Hayat
 * Generates realistic water and ambient reminder sounds using Web Audio API
 */

export type SoundTone = 'bubbles' | 'drop' | 'zen' | 'ocean' | 'crystal';

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Synthesize realistic water bubbles popping (فقاقيع المياه)
   */
  private playWaterBubbles(ctx: AudioContext, masterGain: GainNode) {
    const bubbleCount = 7;
    const now = ctx.currentTime;

    for (let i = 0; i < bubbleCount; i++) {
      const startTime = now + i * (0.07 + Math.random() * 0.05);
      const duration = 0.09 + Math.random() * 0.04;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const biquad = ctx.createBiquadFilter();

      // Bandpass filter for liquid resonance
      biquad.type = 'bandpass';
      biquad.Q.value = 6 + Math.random() * 4;

      const baseFreq = 380 + Math.random() * 320;
      const endFreq = baseFreq * (1.6 + Math.random() * 0.4); // upward pitch glide characteristic of water bubbles

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

      biquad.frequency.setValueAtTime(baseFreq * 1.2, startTime);
      biquad.frequency.exponentialRampToValueAtTime(endFreq * 1.2, startTime + duration);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.85, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(biquad);
      biquad.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    }
  }

  /**
   * Synthesize crisp water droplet (قطرة ماء)
   */
  private playWaterDrop(ctx: AudioContext, masterGain: GainNode) {
    const now = ctx.currentTime;
    
    // Primary droplet
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
    
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.9, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.4);

    // Subtle second echo droplet
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const echoTime = now + 0.16;

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(700, echoTime);
    osc2.frequency.exponentialRampToValueAtTime(1600, echoTime + 0.08);

    gain2.gain.setValueAtTime(0.001, echoTime);
    gain2.gain.linearRampToValueAtTime(0.4, echoTime + 0.015);
    gain2.gain.exponentialRampToValueAtTime(0.001, echoTime + 0.25);

    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(echoTime);
    osc2.stop(echoTime + 0.3);
  }

  /**
   * Synthesize calm Tibetan/Zen singing bowl chime (جرس زن)
   */
  private playZenChime(ctx: AudioContext, masterGain: GainNode) {
    const now = ctx.currentTime;
    const freqs = [528, 1056, 1584, 2112];
    const gains = [0.7, 0.35, 0.15, 0.05];

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);
      
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(gains[idx], now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + idx * 0.2);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 2.2);
    });
  }

  /**
   * Synthesize gentle ocean wave sweep (موج البحر)
   */
  private playOceanWave(ctx: AudioContext, masterGain: GainNode) {
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 2.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink noise generation
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.12;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 0.9);
    filter.frequency.exponentialRampToValueAtTime(200, now + 2.2);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    noise.start(now);
    noise.stop(now + 2.2);
  }

  /**
   * Synthesize crystal chime (رنين كريستالي)
   */
  private playCrystalBell(ctx: AudioContext, masterGain: GainNode) {
    const now = ctx.currentTime;
    const chords = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
    
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.4, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startTime);
      osc.stop(startTime + 1.3);
    });
  }

  /**
   * Play any of the available tones with volume
   */
  public playTone(tone: SoundTone, volume: number = 0.8) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), ctx.currentTime);
      masterGain.connect(ctx.destination);

      switch (tone) {
        case 'bubbles':
          this.playWaterBubbles(ctx, masterGain);
          break;
        case 'drop':
          this.playWaterDrop(ctx, masterGain);
          break;
        case 'zen':
          this.playZenChime(ctx, masterGain);
          break;
        case 'ocean':
          this.playOceanWave(ctx, masterGain);
          break;
        case 'crystal':
          this.playCrystalBell(ctx, masterGain);
          break;
        default:
          this.playWaterBubbles(ctx, masterGain);
      }
    } catch (err) {
      console.warn('Audio playback not permitted or supported yet:', err);
    }
  }

  /**
   * Play drink completion sound effect (celebratory gentle wave + bubble)
   */
  public playDrinkSuccess(volume: number = 0.7) {
    this.playTone('bubbles', volume);
  }
}

export const soundEngine = new SoundEngine();
