/**
 * Pure Web Audio API 56k Dial-Up Modem Synthesizer
 * Dial tone -> DTMF digits -> Carrier handshake warble -> Data static hiss
 */

class DialupAudioEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: AudioNode[] = [];
  private timers: number[] = [];

  public play(): void {
    this.stop();
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      this.ctx = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.11, ctx.currentTime);
      master.connect(ctx.destination);
      this.activeNodes.push(master);

      const now = ctx.currentTime;

      // 1. Dial tone (350Hz + 440Hz) for 0.35s
      this.playTone(ctx, master, 350, now, 0.35, 0.45);
      this.playTone(ctx, master, 440, now, 0.35, 0.45);

      // 2. DTMF dialing sequence (6 digits)
      const dtmfPairs: [number, number][] = [
        [697, 1209],
        [770, 1477],
        [852, 1336],
        [697, 1336],
        [941, 1336],
        [770, 1209],
      ];
      dtmfPairs.forEach(([f1, f2], i) => {
        const start = now + 0.4 + i * 0.11;
        this.playTone(ctx, master, f1, start, 0.075, 0.45);
        this.playTone(ctx, master, f2, start, 0.075, 0.45);
      });

      // 3. Carrier handshake answer tone (2100Hz warble)
      const handshakeStart = now + 1.15;
      const carrier = ctx.createOscillator();
      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(2100, handshakeStart);
      carrier.frequency.setValueAtTime(1650, handshakeStart + 0.25);
      carrier.frequency.setValueAtTime(2100, handshakeStart + 0.45);
      carrier.frequency.setValueAtTime(1200, handshakeStart + 0.65);

      const carrierGain = ctx.createGain();
      carrierGain.gain.setValueAtTime(0.0001, handshakeStart);
      carrierGain.gain.linearRampToValueAtTime(0.4, handshakeStart + 0.03);
      carrierGain.gain.setValueAtTime(0.4, handshakeStart + 0.85);
      carrierGain.gain.exponentialRampToValueAtTime(0.0001, handshakeStart + 0.95);

      carrier.connect(carrierGain);
      carrierGain.connect(master);
      carrier.start(handshakeStart);
      carrier.stop(handshakeStart + 0.96);
      this.activeNodes.push(carrier, carrierGain);

      // 4. V.90 screech / filtered noise burst
      const noiseStart = now + 2.05;
      const noiseDuration = 1.6;
      const bufferSize = Math.floor(ctx.sampleRate * noiseDuration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        const mod = Math.sin(2 * Math.PI * 1800 * t) * 0.35 + Math.sin(2 * Math.PI * 950 * t) * 0.25;
        data[i] = (Math.random() * 2 - 1) * 0.55 + mod;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1750, noiseStart);
      bandpass.Q.setValueAtTime(1.4, noiseStart);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, noiseStart);
      noiseGain.gain.linearRampToValueAtTime(0.45, noiseStart + 0.08);
      noiseGain.gain.setValueAtTime(0.38, noiseStart + noiseDuration - 0.25);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, noiseStart + noiseDuration);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(master);
      noise.start(noiseStart);
      noise.stop(noiseStart + noiseDuration);
      this.activeNodes.push(noise, bandpass, noiseGain);

      const cleanupId = window.setTimeout(() => this.stop(), 4000);
      this.timers.push(cleanupId);
    } catch {
      // Audio playback blocked or unavailable; silently ignore
    }
  }

  private playTone(
    ctx: AudioContext,
    dest: AudioNode,
    freq: number,
    start: number,
    duration: number,
    volume: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.008);
    gain.gain.setValueAtTime(volume, start + duration - 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(start);
    osc.stop(start + duration + 0.01);
    this.activeNodes.push(osc, gain);
  }

  public stop(): void {
    this.timers.forEach((id) => clearTimeout(id));
    this.timers = [];
    this.activeNodes.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
      this.ctx = null;
    }
  }
}

export const dialupAudio = new DialupAudioEngine();
