import { describe, it, expect } from 'vitest';
import { TEMPLATES } from '../templates/circuits';
import { defaultSimulator } from './simulator';
import { CircuitModel } from './types';

describe('Circuit JSON Export and Import', () => {
  it('correctly serializes and deserializes Full Adder circuit without data loss', () => {
    const fullAdder = TEMPLATES[0].circuit;

    // 1. Export to JSON string
    const jsonStr = JSON.stringify(fullAdder, null, 2);
    expect(jsonStr).toContain('SWITCH');
    expect(jsonStr).toContain('XOR');
    expect(jsonStr).toContain('wires');

    // 2. Parse from JSON
    const parsed: CircuitModel = JSON.parse(jsonStr);
    expect(parsed.components.length).toBe(fullAdder.components.length);
    expect(parsed.wires.length).toBe(fullAdder.wires.length);

    // 3. Verify simulator evaluates imported circuit identically
    const originalResult = defaultSimulator.evaluate(fullAdder);
    const importedResult = defaultSimulator.evaluate(parsed);

    expect(importedResult.pinValues['xor_2:out']).toEqual(originalResult.pinValues['xor_2:out']);
    expect(importedResult.pinValues['or_1:out']).toEqual(originalResult.pinValues['or_1:out']);
  });

  it('handles wrapped template format { circuit: { components, wires } }', () => {
    const templateWrap = {
      id: 'custom-template',
      name: 'Custom',
      circuit: TEMPLATES[1].circuit,
    };

    const jsonStr = JSON.stringify(templateWrap);
    const parsed = JSON.parse(jsonStr);
    const circuitData = parsed.circuit ? parsed.circuit : parsed;

    expect(Array.isArray(circuitData.components)).toBe(true);
    expect(Array.isArray(circuitData.wires)).toBe(true);
  });
});
