import { describe, it, expect } from 'vitest';
import {
  signalToSample,
  formatSample,
  WaveformChannel,
  WaveformEngine,
  areSamplesEqual,
} from './waveform';

describe('Waveform Engine & Logic Analyzer Core', () => {
  describe('Signal to 3-Mask Sample Conversion', () => {
    it('converts 1-bit signals correctly', () => {
      expect(signalToSample(0, 1)).toEqual({ value: 0, xMask: 0, zMask: 0 });
      expect(signalToSample(1, 1)).toEqual({ value: 1, xMask: 0, zMask: 0 });
      expect(signalToSample('X', 1)).toEqual({ value: 0, xMask: 1, zMask: 0 });
      expect(signalToSample('Z', 1)).toEqual({ value: 0, xMask: 0, zMask: 1 });
      expect(signalToSample(undefined, 1)).toEqual({ value: 0, xMask: 0, zMask: 1 });
    });

    it('converts 8-bit clean bus signals', () => {
      // 0x05 = 5 = [1, 0, 1, 0, 0, 0, 0, 0]
      const sample = signalToSample([1, 0, 1, 0, 0, 0, 0, 0], 8);
      expect(sample).toEqual({ value: 5, xMask: 0, zMask: 0 });
      expect(formatSample(sample, 8, 'HEX')).toBe('0x05');
      expect(formatSample(sample, 8, 'DEC')).toBe('5');
      expect(formatSample(sample, 8, 'BIN')).toBe('00000101');
    });

    it('converts and formats 8-bit bus with partial X and Z bits', () => {
      // Bit 0 = 1, Bit 1 = 'X', Bits 2..7 = 0
      const mixedX = signalToSample([1, 'X', 0, 0, 0, 0, 0, 0], 8);
      expect(mixedX.xMask & 2).toBe(2);
      expect(formatSample(mixedX, 8, 'HEX')).toBe('0x0X'); // Lower nibble has X!
      expect(formatSample(mixedX, 8, 'BIN')).toBe('000000X1');

      // High nibble has X, lower nibble has 5 (0xX5)
      const highX = signalToSample([1, 0, 1, 0, 'X', 0, 0, 0], 8);
      expect(formatSample(highX, 8, 'HEX')).toBe('0xX5');

      // All Z bus
      const allZ = signalToSample(['Z', 'Z', 'Z', 'Z', 'Z', 'Z', 'Z', 'Z'], 8);
      expect(formatSample(allZ, 8, 'HEX')).toBe('0xZZ');
    });
  });

  describe('Value Change Dump (VCD) & Empirical Memory Efficiency', () => {
    it('only records on value transitions, avoiding duplicate objects for static signals', () => {
      const channel = new WaveformChannel({ id: 'acc_bus', name: 'ACC[7:0]', width: 8, capacity: 256 });

      const sample5 = signalToSample([1, 0, 1, 0, 0, 0, 0, 0], 8); // 0x05

      // Simulate 500 steady ticks where the value remains constant at 0x05
      let transitionsRecorded = 0;
      for (let tick = 0; tick < 500; tick++) {
        if (channel.addSample(tick, sample5)) {
          transitionsRecorded++;
        }
      }

      // Exactly 1 transition should be stored, not 500!
      expect(transitionsRecorded).toBe(1);
      expect(channel.getTransitions().length).toBe(1);

      // Value at tick 450 should still read 0x05
      expect(channel.getValueAt(450)).toEqual(sample5);

      // Now change value at tick 500 to 0x08:
      const sample8 = signalToSample([0, 0, 0, 1, 0, 0, 0, 0], 8); // 0x08
      expect(channel.addSample(500, sample8)).toBe(true);

      expect(channel.getTransitions().length).toBe(2);
      expect(channel.getValueAt(499)).toEqual(sample5);
      expect(channel.getValueAt(500)).toEqual(sample8);

      // Empirical reduction measurement:
      const storedTransitions = channel.getTransitions().length;
      const totalEvaluations = 501;
      const reductionPercent = ((totalEvaluations - storedTransitions) / totalEvaluations) * 100;
      // Stored 2 transitions instead of 501 entries -> 99.6% reduction
      expect(reductionPercent).toBeGreaterThan(99);
    });
  });

  describe('Ring Buffer Eviction & Base Sample Preservation', () => {
    it('preserves baseSample so signals static across eviction can still be rendered', () => {
      // Set small capacity of 8 transitions
      const channel = new WaveformChannel({
        id: 'clk_trace',
        name: 'CLK',
        width: 1,
        capacity: 8,
      });

      // Initial state at tick 0: 0
      channel.addSample(0, { value: 0, xMask: 0, zMask: 0 });

      // Run 20 toggling transitions (0 -> 1 -> 0 ...) at ticks 10, 20, 30...
      for (let i = 1; i <= 20; i++) {
        const val = i % 2;
        channel.addSample(i * 10, { value: val, xMask: 0, zMask: 0 });
      }

      // Buffer length must be capped at capacity (8)
      expect(channel.getTransitions().length).toBe(8);

      // The oldest active transition in buffer is now tick 130 (20 - 8 + 1 = 13, 13 * 10 = 130)
      expect(channel.getTransitions()[0].tick).toBe(130);

      // baseSample must be defined from the most recently evicted transition
      expect(channel.getBaseSample()).not.toBeNull();

      // Querying before tick 130 (e.g. tick 50 or 100) must return valid sample via baseSample
      const pastSample = channel.getValueAt(50);
      expect(pastSample).not.toBeNull();
      expect([0, 1]).toContain(pastSample?.value);

      // Visible slice for window [0, 200]
      const slice = channel.getVisibleSlice(0, 200);
      expect(slice.initialSample).not.toBeNull();
      expect(slice.transitions.length).toBe(8);
    });

    it('long-static channel remaining constant across eviction renders correctly at window start', () => {
      const channel = new WaveformChannel({
        id: 'acc_out',
        name: 'ACC[7:0]',
        width: 8,
        capacity: 8,
      });

      const initialVal = signalToSample(42, 8); // 0x2A
      channel.addSample(0, initialVal);

      // Add 10 transitions on another timeline or fast counter
      for (let i = 1; i <= 10; i++) {
        channel.addSample(i * 10, signalToSample(42 + i, 8));
      }

      // Eviction occurred (11 total transitions, capacity 8)
      expect(channel.getTransitions().length).toBe(8);

      // Query at tick 0 (which was evicted) resolves via baseSample rather than returning null
      const resolvedOld = channel.getValueAt(0);
      expect(resolvedOld).not.toBeNull();
    });
  });

  describe('WaveformEngine Monotonic Ticks & Zero-Overhead', () => {
    it('runs with zero overhead when recording is disabled', () => {
      const engine = new WaveformEngine();
      engine.setRecording(false);
      engine.addChannel({ id: 'c1', name: 'CLK', width: 1 });

      engine.step({ c1: 1 });
      engine.step({ c1: 0 });

      // Tick advances
      expect(engine.tick).toBe(2);
      // But no samples recorded!
      expect(engine.getChannel('c1')?.getTransitions().length).toBe(0);
    });

    it('advances discrete simulation ticks monotonically and samples settled signals', () => {
      const engine = new WaveformEngine();
      const clkChan = engine.addChannel({ id: 'clk', name: 'CLK', width: 1 });
      const accChan = engine.addChannel({ id: 'acc', name: 'ACC[7:0]', width: 8 });

      // Tick 1: CLK = 1, ACC = 5
      engine.step({ clk: 1, acc: [1, 0, 1, 0, 0, 0, 0, 0] });
      expect(engine.tick).toBe(1);
      expect(clkChan.getValueAt(1)?.value).toBe(1);
      expect(accChan.getValueAt(1)?.value).toBe(5);

      // Tick 2: CLK = 0, ACC = 5 (ACC unchanged)
      engine.step({ clk: 0, acc: [1, 0, 1, 0, 0, 0, 0, 0] });
      expect(engine.tick).toBe(2);
      expect(clkChan.getValueAt(2)?.value).toBe(0);
      expect(clkChan.getTransitions().length).toBe(2);
      expect(accChan.getTransitions().length).toBe(1); // Unchanged!

      // Tick 3: CLK = 1, ACC = 10
      engine.step({ clk: 1, acc: [0, 1, 0, 1, 0, 0, 0, 0] });
      expect(engine.tick).toBe(3);
      expect(accChan.getValueAt(3)?.value).toBe(10);
      expect(accChan.getTransitions().length).toBe(2);
    });
  });
});
