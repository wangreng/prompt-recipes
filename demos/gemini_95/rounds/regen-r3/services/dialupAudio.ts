// Authentic 56k dial-up modem synthesizer using the Web Audio API
export interface DialupHandle {
  stop: () => void;
}

export function playDialupAudio(): DialupHandle {
  let ctx: AudioContext | null = null;
  let stopped = false;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      return { stop: () => {} };
    }
    ctx = new AudioCtx();
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.11, now);
    master.connect(ctx.destination);

    // 1. Dial tone (350Hz + 440Hz) for 0.35s
    const dialOsc1 = ctx.createOscillator();
    const dialOsc2 = ctx.createOscillator();
    dialOsc1.frequency.setValueAtTime(350, now);
    dialOsc2.frequency.setValueAtTime(440, now);
    dialOsc1.connect(master);
    dialOsc2.connect(master);
    dialOsc1.start(now);
    dialOsc2.start(now);
    dialOsc1.stop(now + 0.32);
    dialOsc2.stop(now + 0.32);

    // 2. DTMF dialing tones (7 digits)
    const dtmfPairs: [number, number][] = [
      [770, 1336],
      [770, 1336],
      [770, 1336],
      [941, 1336],
      [697, 1209],
      [852, 1477],
      [770, 1336],
    ];
    let t = now + 0.36;
    for (const [f1, f2] of dtmfPairs) {
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      o1.frequency.setValueAtTime(f1, t);
      o2.frequency.setValueAtTime(f2, t);
      o1.connect(master);
      o2.connect(master);
      o1.start(t);
      o2.start(t);
      o1.stop(t + 0.065);
      o2.stop(t + 0.065);
      t += 0.085;
    }

    // 3. Carrier answer tone (2100Hz warble)
    const carrierStart = t + 0.12;
    const carrierOsc = ctx.createOscillator();
    carrierOsc.type = 'sine';
    carrierOsc.frequency.setValueAtTime(2100, carrierStart);
    carrierOsc.frequency.setValueAtTime(1850, carrierStart + 0.25);
    carrierOsc.frequency.setValueAtTime(2100, carrierStart + 0.4);
    carrierOsc.connect(master);
    carrierOsc.start(carrierStart);
    carrierOsc.stop(carrierStart + 0.55);

    // 4. Classic screech / FSK negotiation bursts
    const screechStart = carrierStart + 0.56;
    const screechOsc = ctx.createOscillator();
    screechOsc.type = 'sawtooth';
    screechOsc.frequency.setValueAtTime(1200, screechStart);
    screechOsc.frequency.linearRampToValueAtTime(2400, screechStart + 0.18);
    screechOsc.frequency.setValueAtTime(980, screechStart + 0.22);
    screechOsc.frequency.linearRampToValueAtTime(2200, screechStart + 0.45);

    const screechGain = ctx.createGain();
    screechGain.gain.setValueAtTime(0.45, screechStart);
    screechOsc.connect(screechGain);
    screechGain.connect(master);
    screechOsc.start(screechStart);
    screechOsc.stop(screechStart + 0.65);

    // 5. Bandpassed white noise burst (classic modem static hiss)
    const noiseStart = screechStart + 0.55;
    const noiseDuration = 0.85;
    const bufferSize = Math.floor(ctx.sampleRate * noiseDuration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.7;
    }

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, noiseStart);
    filter.Q.setValueAtTime(1.8, noiseStart);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.55, noiseStart);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, noiseStart + noiseDuration);

    noiseSrc.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);
    noiseSrc.start(noiseStart);
    noiseSrc.stop(noiseStart + noiseDuration);
  } catch {
    // Audio playback may be blocked or unsupported
  }

  return {
    stop: () => {
      if (stopped) return;
      stopped = true;
      if (ctx) {
        ctx.close().catch(() => {});
        ctx = null;
      }
    },
  };
}
