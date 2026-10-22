import { Signal } from './signal';

/**
 * 3-mask IEEE-style sampled logic value.
 * Supports any bit width N (1, 4, 8, 16, etc.).
 *
 * - `value`: bit i = 1 if High (1), 0 if Low (0), X, or Z
 * - `xMask`: bit i = 1 if bit i is X (unknown / contention)
 * - `zMask`: bit i = 1 if bit i is Z (high impedance / floating)
 */
export interface SampledValue {
  value: number;
  xMask: number;
  zMask: number;
}

export interface WaveformTransition {
  tick: number;
  sample: SampledValue;
}

/**
 * Checks equality between two sampled values
 */
export function areSamplesEqual(a: SampledValue | null | undefined, b: SampledValue | null | undefined): boolean {
  if (!a || !b) return a === b;
  return a.value === b.value && a.xMask === b.xMask && a.zMask === b.zMask;
}

/**
 * Converts a simulator Signal into a 3-mask SampledValue with generic width N.
 */
export function signalToSample(signal: Signal | number | undefined, width: number = 1): SampledValue {
  if (width <= 1) {
    if (signal === 'X') return { value: 0, xMask: 1, zMask: 0 };
    if (signal === 'Z' || signal === undefined) return { value: 0, xMask: 0, zMask: 1 };
    const bit = signal === 1 ? 1 : 0;
    return { value: bit, xMask: 0, zMask: 0 };
  }

  let value = 0;
  let xMask = 0;
  let zMask = 0;

  if (Array.isArray(signal)) {
    for (let i = 0; i < width; i++) {
      const bit = signal[i] ?? 'Z';
      if (bit === 1) {
        value |= (1 << i);
      } else if (bit === 'X') {
        xMask |= (1 << i);
      } else if (bit === 'Z') {
        zMask |= (1 << i);
      }
    }
  } else if (typeof signal === 'number') {
    value = signal & ((1 << width) - 1);
  } else if (signal === 'X') {
    xMask = (1 << width) - 1;
  } else if (signal === 'Z' || signal === undefined) {
    zMask = (1 << width) - 1;
  }

  return { value, xMask, zMask };
}

/**
 * Formats a SampledValue into readable text according to format mode.
 * Handles partial X/Z in hex format (e.g. 0x0X, 0xX5).
 */
export function formatSample(
  sample: SampledValue | null | undefined,
  width: number = 1,
  format: 'HEX' | 'DEC' | 'BIN' = 'HEX'
): string {
  if (!sample) return '-';

  if (width <= 1) {
    if (sample.xMask & 1) return 'X';
    if (sample.zMask & 1) return 'Z';
    return (sample.value & 1).toString();
  }

  if (format === 'BIN') {
    let s = '';
    for (let i = width - 1; i >= 0; i--) {
      if ((sample.xMask >> i) & 1) s += 'X';
      else if ((sample.zMask >> i) & 1) s += 'Z';
      else s += ((sample.value >> i) & 1).toString();
    }
    return s;
  }

  if (format === 'HEX') {
    const numNibbles = Math.ceil(width / 4);
    let s = '';
    for (let nib = numNibbles - 1; nib >= 0; nib--) {
      const shift = nib * 4;
      const nibbleX = (sample.xMask >> shift) & 0xF;
      const nibbleZ = (sample.zMask >> shift) & 0xF;
      const nibbleVal = (sample.value >> shift) & 0xF;

      if (nibbleX !== 0) {
        s += 'X';
      } else if (nibbleZ === 0xF) {
        s += 'Z';
      } else if (nibbleZ !== 0) {
        s += '?';
      } else {
        s += nibbleVal.toString(16).toUpperCase();
      }
    }
    return '0x' + s;
  }

  // DEC
  if (sample.xMask !== 0) return 'X';
  if (sample.zMask !== 0) return 'Z';
  return sample.value.toString(10);
}

/**
 * Represents a single recorded signal trace in the logic analyzer.
 * Uses transition-based recording (Value Change Dump) and a circular buffer.
 * Preserves the baseline sample upon eviction so long-static signals can be rendered.
 */
export class WaveformChannel {
  readonly id: string;
  name: string;
  readonly width: number;
  color: string;
  format: 'HEX' | 'DEC' | 'BIN';
  capacity: number;

  private transitions: WaveformTransition[] = [];
  private baseSample: SampledValue | null = null;
  private lastSample: SampledValue | null = null;
  private lastTick: number = -1;

  constructor(options: {
    id: string;
    name: string;
    width?: number;
    color?: string;
    format?: 'HEX' | 'DEC' | 'BIN';
    capacity?: number;
  }) {
    this.id = options.id;
    this.name = options.name;
    this.width = Math.max(1, options.width ?? 1);
    this.color = options.color ?? '#10b981';
    this.format = options.format ?? (this.width > 1 ? 'HEX' : 'BIN');
    this.capacity = Math.max(8, options.capacity ?? 256);
  }

  /**
   * Records a steady-state sample at tick T.
   * Returns true if a transition was recorded, or false if skipped due to identical value.
   */
  addSample(tick: number, sample: SampledValue): boolean {
    if (this.lastSample && areSamplesEqual(this.lastSample, sample)) {
      this.lastTick = tick;
      return false; // Value unchanged, no new transition entry needed
    }

    const transition: WaveformTransition = { tick, sample };

    if (this.transitions.length >= this.capacity) {
      // Evict oldest transition and preserve it as the baseline for visible window start
      const evicted = this.transitions.shift()!;
      this.baseSample = evicted.sample;
    }

    this.transitions.push(transition);
    this.lastSample = sample;
    this.lastTick = tick;
    return true;
  }

  /**
   * Retrieves the effective value at any discrete tick T.
   * If T is before the oldest active transition, returns the evicted baseSample.
   */
  getValueAt(tick: number): SampledValue | null {
    if (this.transitions.length === 0) {
      return this.baseSample;
    }

    if (tick < this.transitions[0].tick) {
      return this.baseSample ?? this.transitions[0].sample;
    }

    for (let i = this.transitions.length - 1; i >= 0; i--) {
      if (this.transitions[i].tick <= tick) {
        return this.transitions[i].sample;
      }
    }

    return this.baseSample ?? this.transitions[0].sample;
  }

  /**
   * Returns visible transitions and the initial sample for a time window [startTick, endTick].
   */
  getVisibleSlice(startTick: number, endTick: number): {
    initialSample: SampledValue | null;
    transitions: WaveformTransition[];
  } {
    const initialSample = this.getValueAt(startTick);
    const transitions = this.transitions.filter((t) => t.tick > startTick && t.tick <= endTick);
    return { initialSample, transitions };
  }

  getTransitions(): readonly WaveformTransition[] {
    return this.transitions;
  }

  getBaseSample(): SampledValue | null {
    return this.baseSample;
  }

  getLastSample(): SampledValue | null {
    return this.lastSample;
  }

  getLastTick(): number {
    return this.lastTick;
  }

  clear() {
    this.transitions = [];
    this.baseSample = null;
    this.lastSample = null;
    this.lastTick = -1;
  }
}

/**
 * Top-level Waveform Engine managing all active analyzer channels.
 */
export class WaveformEngine {
  private channels: Map<string, WaveformChannel> = new Map();
  private currentTick: number = 0;
  private recording: boolean = true;

  get isRecording(): boolean {
    return this.recording;
  }

  setRecording(enabled: boolean) {
    this.recording = enabled;
  }

  get tick(): number {
    return this.currentTick;
  }

  addChannel(options: {
    id: string;
    name: string;
    width?: number;
    color?: string;
    format?: 'HEX' | 'DEC' | 'BIN';
    capacity?: number;
  }): WaveformChannel {
    const channel = new WaveformChannel(options);
    this.channels.set(options.id, channel);
    return channel;
  }

  removeChannel(id: string) {
    this.channels.delete(id);
  }

  getChannel(id: string): WaveformChannel | undefined {
    return this.channels.get(id);
  }

  getAllChannels(): WaveformChannel[] {
    return Array.from(this.channels.values());
  }

  /**
   * Advances the engine by one discrete settled simulation tick.
   * `signals`: map of channelId -> Signal (e.g. 'comp:reg8:q' -> [1, 0, 1, 0, 0, 0, 0, 0])
   */
  step(signals: Record<string, Signal | number | undefined>, manualTick?: number) {
    const targetTick = manualTick !== undefined ? manualTick : this.currentTick + 1;
    this.currentTick = targetTick;

    // Zero-overhead check: if recording is off or no channels exist, return immediately
    if (!this.recording || this.channels.size === 0) {
      return;
    }

    for (const [id, channel] of this.channels.entries()) {
      const sig = signals[id];
      const sample = signalToSample(sig, channel.width);
      channel.addSample(this.currentTick, sample);
    }
  }

  clear() {
    for (const channel of this.channels.values()) {
      channel.clear();
    }
  }

  reset() {
    this.currentTick = 0;
    this.clear();
  }
}
