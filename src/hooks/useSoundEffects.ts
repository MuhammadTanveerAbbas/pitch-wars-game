/** Web Audio API synthesized sounds  no external audio files required. */

type AudioContextConstructor = typeof AudioContext;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass: AudioContextConstructor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: AudioContextConstructor })
      .webkitAudioContext;
  if (!AudioContextClass) return null;
  return new AudioContextClass();
}

let sharedContext: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!sharedContext) sharedContext = getAudioContext();
  return sharedContext;
}

export function playCoinSound(): void {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch (_e) {
    /* audio context unavailable */
  }
}

export function playAlertSound(): void {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.setValueAtTime(220, ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch (_e) {
    /* audio context unavailable */
  }
}

export function playTypingSound(): void {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const bufferSize = Math.floor(ctx.sampleRate * 0.03);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch (_e) {
    /* audio context unavailable */
  }
}

export function playSuccessSound(): void {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const notes = [523, 659, 784];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      const noteStart = ctx.currentTime + index * 0.12;
      osc.frequency.setValueAtTime(freq, noteStart);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.01, noteStart + 0.3);
      osc.start(noteStart);
      osc.stop(noteStart + 0.3);
    });
  } catch (_e) {
    /* audio context unavailable */
  }
}

export function playClickSound(): void {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (_e) {
    /* audio context unavailable */
  }
}
