export type BitSignal = 0 | 1 | 'Z' | 'X';
export type Signal = BitSignal | BitSignal[];

export function isBusSignal(s: Signal): s is BitSignal[] {
  return Array.isArray(s);
}

/**
 * Resolves single-bit drivers on a wire/net
 */
export function resolveBitSignals(signals: BitSignal[]): BitSignal {
  if (!signals || signals.length === 0) {
    return 'Z';
  }

  const active = signals.filter((s) => s !== 'Z');
  if (active.length === 0) {
    return 'Z';
  }

  if (active.includes('X')) {
    return 'X';
  }

  const hasZero = active.includes(0);
  const hasOne = active.includes(1);

  if (hasZero && hasOne) {
    return 'X'; // Contention
  }

  return hasOne ? 1 : 0;
}

/**
 * Resolves multiple signals driving the same wire/net, supporting both single-bit and bus signals.
 */
export function resolveSignals(signals: Signal[]): Signal {
  if (!signals || signals.length === 0) {
    return 'Z';
  }

  const hasBus = signals.some(Array.isArray);
  if (hasBus) {
    let maxWidth = 8;
    for (const s of signals) {
      if (Array.isArray(s) && s.length > maxWidth) maxWidth = s.length;
    }
    const resolved: BitSignal[] = [];
    for (let bit = 0; bit < maxWidth; bit++) {
      const bitDrivers: BitSignal[] = [];
      for (const s of signals) {
        if (Array.isArray(s)) {
          bitDrivers.push(s[bit] ?? 'Z');
        } else if (s !== 'Z') {
          if (bit === 0) bitDrivers.push(s);
          else bitDrivers.push('Z');
        }
      }
      resolved.push(resolveBitSignals(bitDrivers));
    }
    return resolved;
  }

  return resolveBitSignals(signals as BitSignal[]);
}

export function normalizeToBit(signal: Signal | undefined, defaultVal: BitSignal = 0): BitSignal {
  if (signal === undefined) return defaultVal;
  if (Array.isArray(signal)) return signal[0] ?? defaultVal;
  return signal;
}

export function normalizeToBus(
  signal: Signal | undefined,
  width: number = 8,
  defaultVal: BitSignal = 0
): BitSignal[] {
  if (signal === undefined) return Array(width).fill(defaultVal);
  if (Array.isArray(signal)) {
    const res = [...signal];
    while (res.length < width) res.push(defaultVal);
    return res.slice(0, width);
  }
  const res: BitSignal[] = Array(width).fill(defaultVal);
  res[0] = signal;
  return res;
}

export function numberToBus(val: number, width: number = 8): BitSignal[] {
  const safeVal = Math.max(0, Math.floor(val));
  const res: BitSignal[] = [];
  for (let i = 0; i < width; i++) {
    res.push(((safeVal >> i) & 1) === 1 ? 1 : 0);
  }
  return res;
}

export function busToNumber(bus: BitSignal[]): number | null {
  let val = 0;
  for (let i = 0; i < bus.length; i++) {
    const bit = bus[i];
    if (bit === 'X' || bit === 'Z') return null;
    if (bit === 1) {
      val |= (1 << i);
    }
  }
  return val;
}

export function busToString(
  bus: BitSignal[],
  radix: 'hex' | 'dec' | 'bin' = 'hex'
): string {
  const num = busToNumber(bus);
  if (num === null) {
    if (bus.includes('X')) return '??';
    return 'ZZ';
  }
  switch (radix) {
    case 'hex':
      return `0x${num.toString(16).toUpperCase().padStart(Math.ceil(bus.length / 4), '0')}`;
    case 'dec':
      return num.toString(10);
    case 'bin':
      return bus
        .slice()
        .reverse()
        .map((b) => (b === 1 ? '1' : b === 0 ? '0' : b))
        .join('');
  }
}

export function signalToBoolean(signal: Signal, defaultVal: boolean = false): boolean {
  if (Array.isArray(signal)) {
    const num = busToNumber(signal);
    return num !== null ? num !== 0 : defaultVal;
  }
  if (signal === 1) return true;
  if (signal === 0) return false;
  return defaultVal;
}

export function booleanToSignal(val: boolean): BitSignal {
  return val ? 1 : 0;
}

export function getSignalColor(signal: Signal): string {
  if (Array.isArray(signal)) {
    if (signal.includes('X')) return '#ef4444'; // Red (error/contention)
    if (signal.every((b) => b === 'Z')) return '#f59e0b'; // Amber (floating)
    if (signal.some((b) => b === 1)) return '#10b981'; // Neon Emerald (active data)
    return '#475569'; // Slate 600 (all zeros)
  }
  switch (signal) {
    case 1:
      return '#10b981'; // Neon Emerald (HIGH)
    case 0:
      return '#475569'; // Slate 600 (LOW)
    case 'X':
      return '#ef4444'; // Red (CONFLICT / ERROR)
    case 'Z':
      return '#f59e0b'; // Amber (FLOATING)
    default:
      return '#334155';
  }
}

export function getSignalGlow(signal: Signal): string {
  if (Array.isArray(signal)) {
    if (signal.includes('X')) return 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.7))';
    if (signal.some((b) => b === 1)) return 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.7))';
    return 'none';
  }
  switch (signal) {
    case 1:
      return 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.7))';
    case 'X':
      return 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.7))';
    case 'Z':
      return 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))';
    default:
      return 'none';
  }
}
