// Synthesizes a nostalgic 56k dial-up modem connection sound using Web Audio API.
// Fails silently if browser autoplay policy blocks AudioContext.

let activeCtx: AudioContext | null = null;

export function stopDialUpSound(): void {
  if (activeCtx) {
    try {
      activeCtx.close();
    } catch {
      // ignore
    }
    activeCtx = null;
  }
}

export function playDialUpSound(): void {
  stopDialUpSound();

  try {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;

    const ctx = new AudioContextCtor();
    activeCtx = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.08;
    master.connect(ctx.destination);

    const now = ctx.currentTime;

    const scheduleTone = (freq: number, start: number, duration: number, gainVal = 0.4, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + start);
      g.gain.setValueAtTime(gainVal, now + start);
      g.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
      osc.connect(g);
      g.connect(master);
      osc.start(now + start);
      osc.stop(now + start + duration + 0.02);
    };

    // 1. Classic dial tone (350Hz + 440Hz)
    scheduleTone(350, 0.0, 0.35, 0.35);
    scheduleTone(440, 0.0, 0.35, 0.35);

    // 2. DTMF dialing sequence (555-0195)
    const dtmf: [number, number][] = [
      [770, 1336],
      [770, 1336],
      [770, 1336],
      [941, 1336],
      [697, 1209],
      [852, 1477],
      [770, 1336],
    ];
    dtmf.forEach(([f1, f2], i) => {
      const t = 0.4 + i * 0.11;
      scheduleTone(f1, t, 0.08, 0.38);
      scheduleTone(f2, t, 0.08, 0.38);
    });

    // 3. Carrier answer tone (2100Hz warble)
    scheduleTone(2100, 1.28, 0.55, 0.3);
    scheduleTone(1650, 1.85, 0.25, 0.25, 'square');
    scheduleTone(1850, 1.85, 0.25, 0.25, 'sawtooth');

    // 4. Handshake bongs & screech (bandpass filtered noise + FM tones)
    const bufferSize = Math.floor(ctx.sampleRate * 1.1);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.65;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now + 2.1);
    filter.frequency.linearRampToValueAtTime(2400, now + 2.55);
    filter.frequency.linearRampToValueAtTime(1100, now + 3.05);
    filter.Q.value = 3.2;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now + 2.08);
    noiseGain.gain.linearRampToValueAtTime(0.45, now + 2.15);
    noiseGain.gain.setValueAtTime(0.42, now + 2.95);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 3.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(now + 2.08);
    noise.stop(now + 3.2);

    // Final carrier chirps
    scheduleTone(1200, 2.15, 0.16, 0.25, 'square');
    scheduleTone(2400, 2.35, 0.18, 0.22, 'sawtooth');
    scheduleTone(980, 2.6, 0.2, 0.22, 'triangle');

    // Clean up AudioContext after sequence finishes
    window.setTimeout(() => {
      if (activeCtx === ctx) {
        stopDialUpSound();
      }
    }, 3500);
  } catch {
    // Ignore audio errors when blocked by autoplay policy
  }
}
