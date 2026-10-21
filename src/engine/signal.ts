export type Signal = 0 | 1 | 'Z' | 'X';

/**
 * Resolves multiple signals driving the same wire/net.
 * Handles tri-state logic ('Z') and bus contention ('X').
 */
export function resolveSignals(signals: Signal[]): Signal {
  if (!signals || signals.length === 0) {
    return 'Z';
  }

  // Filter out high-impedance drivers
  const active = signals.filter((s) => s !== 'Z');

  if (active.length === 0) {
    return 'Z';
  }

  // If any active driver is Unknown/Faulty ('X'), result is 'X'
  if (active.includes('X')) {
    return 'X';
  }

  // Check for conflicts between 0 and 1
  const hasZero = active.includes(0);
  const hasOne = active.includes(1);

  if (hasZero && hasOne) {
    return 'X'; // Bus contention!
  }

  return hasOne ? 1 : 0;
}

export function signalToBoolean(signal: Signal, defaultVal: boolean = false): boolean {
  if (signal === 1) return true;
  if (signal === 0) return false;
  return defaultVal;
}

export function booleanToSignal(val: boolean): Signal {
  return val ? 1 : 0;
}

export function getSignalColor(signal: Signal): string {
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
