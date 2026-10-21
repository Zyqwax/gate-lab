import { describe, it, expect } from 'vitest';
import { Simulator } from './simulator';
import { CircuitModel } from './types';

describe('Logic Circuit Simulator Engine', () => {
  const sim = new Simulator();

  it('evaluates basic AND gate correctly', () => {
    const circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'sw1', type: 'SWITCH', x: 0, y: 0, params: { state: 1 } },
        { id: 'sw2', type: 'SWITCH', x: 0, y: 50, params: { state: 1 } },
        { id: 'and1', type: 'AND', x: 100, y: 25, params: { inputs: 2 } },
        { id: 'led1', type: 'LED', x: 200, y: 25, params: {} },
      ],
      wires: [
        { id: 'w1', from: { comp: 'sw1', pin: 'out' }, to: { comp: 'and1', pin: 'in0' } },
        { id: 'w2', from: { comp: 'sw2', pin: 'out' }, to: { comp: 'and1', pin: 'in1' } },
        { id: 'w3', from: { comp: 'and1', pin: 'out' }, to: { comp: 'led1', pin: 'in' } },
      ],
    };

    const res = sim.evaluate(circuit);
    expect(res.pinValues['and1:out']).toBe(1);
    expect(res.componentStates['led1']?.lit).toBe(true);

    // Switch sw1 to 0
    circuit.components[0].params.state = 0;
    const res2 = sim.evaluate(circuit);
    expect(res2.pinValues['and1:out']).toBe(0);
    expect(res2.componentStates['led1']?.lit).toBe(false);
  });

  it('evaluates XOR and Inverter gates', () => {
    const circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'sw1', type: 'SWITCH', x: 0, y: 0, params: { state: 1 } },
        { id: 'sw2', type: 'SWITCH', x: 0, y: 50, params: { state: 0 } },
        { id: 'xor1', type: 'XOR', x: 100, y: 25, params: {} },
        { id: 'not1', type: 'NOT', x: 200, y: 25, params: {} },
      ],
      wires: [
        { id: 'w1', from: { comp: 'sw1', pin: 'out' }, to: { comp: 'xor1', pin: 'in0' } },
        { id: 'w2', from: { comp: 'sw2', pin: 'out' }, to: { comp: 'xor1', pin: 'in1' } },
        { id: 'w3', from: { comp: 'xor1', pin: 'out' }, to: { comp: 'not1', pin: 'in' } },
      ],
    };

    const res = sim.evaluate(circuit);
    expect(res.pinValues['xor1:out']).toBe(1); // 1 ^ 0 = 1
    expect(res.pinValues['not1:out']).toBe(0); // !1 = 0
  });

  it('detects bus contention (Signal X) when two outputs drive opposite values to the same wire', () => {
    const circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'sw1', type: 'SWITCH', x: 0, y: 0, params: { state: 1 } },
        { id: 'sw2', type: 'SWITCH', x: 0, y: 50, params: { state: 0 } },
        { id: 'probe', type: 'PROBE', x: 100, y: 25, params: {} },
      ],
      wires: [
        { id: 'w1', from: { comp: 'sw1', pin: 'out' }, to: { comp: 'probe', pin: 'in' } },
        { id: 'w2', from: { comp: 'sw2', pin: 'out' }, to: { comp: 'probe', pin: 'in' } },
      ],
    };

    const res = sim.evaluate(circuit);
    expect(res.pinValues['probe:in']).toBe('X');
    expect(res.wireValues['w1']).toBe('X');
    expect(res.wireValues['w2']).toBe('X');
  });

  /**
   * CRITICAL TEST: Discrete FULL ADDER
   * Built with:
   * - 3 Inputs: Switch A, Switch B, Switch Cin
   * - 2 XOR gates:
   *     XOR1 = A ^ B
   *     XOR2 (Sum) = XOR1 ^ Cin
   * - 2 AND gates:
   *     AND1 = A & B
   *     AND2 = XOR1 & Cin
   * - 1 OR gate:
   *     OR1 (Cout) = AND1 | AND2
   * - 2 Outputs: LED Sum, LED Cout
   */
  describe('Full Adder (Discrete 2x XOR, 2x AND, 1x OR)', () => {
    function createFullAdderCircuit(a: 0 | 1, b: 0 | 1, cin: 0 | 1): CircuitModel {
      return {
        version: 1,
        mode: 'sandbox',
        components: [
          // Inputs
          { id: 'swA', type: 'SWITCH', x: 40, y: 60, params: { state: a, label: 'A' } },
          { id: 'swB', type: 'SWITCH', x: 40, y: 160, params: { state: b, label: 'B' } },
          { id: 'swCin', type: 'SWITCH', x: 40, y: 260, params: { state: cin, label: 'Cin' } },
          // Gates
          { id: 'xor1', type: 'XOR', x: 220, y: 80, params: { label: 'XOR 1' } },
          { id: 'xor2', type: 'XOR', x: 400, y: 120, params: { label: 'XOR 2 (Sum)' } },
          { id: 'and1', type: 'AND', x: 220, y: 220, params: { label: 'AND 1' } },
          { id: 'and2', type: 'AND', x: 400, y: 240, params: { label: 'AND 2' } },
          { id: 'or1', type: 'OR', x: 560, y: 230, params: { label: 'OR 1 (Cout)' } },
          // Outputs
          { id: 'ledSum', type: 'LED', x: 560, y: 120, params: { label: 'Sum (Σ)' } },
          { id: 'ledCout', type: 'LED', x: 700, y: 230, params: { label: 'Cout' } },
        ],
        wires: [
          // A to xor1.in0 & and1.in0
          { id: 'w_a_xor1', from: { comp: 'swA', pin: 'out' }, to: { comp: 'xor1', pin: 'in0' } },
          { id: 'w_a_and1', from: { comp: 'swA', pin: 'out' }, to: { comp: 'and1', pin: 'in0' } },
          // B to xor1.in1 & and1.in1
          { id: 'w_b_xor1', from: { comp: 'swB', pin: 'out' }, to: { comp: 'xor1', pin: 'in1' } },
          { id: 'w_b_and1', from: { comp: 'swB', pin: 'out' }, to: { comp: 'and1', pin: 'in1' } },
          // xor1 out to xor2.in0 & and2.in0
          { id: 'w_xor1_xor2', from: { comp: 'xor1', pin: 'out' }, to: { comp: 'xor2', pin: 'in0' } },
          { id: 'w_xor1_and2', from: { comp: 'xor1', pin: 'out' }, to: { comp: 'and2', pin: 'in0' } },
          // Cin to xor2.in1 & and2.in1
          { id: 'w_cin_xor2', from: { comp: 'swCin', pin: 'out' }, to: { comp: 'xor2', pin: 'in1' } },
          { id: 'w_cin_and2', from: { comp: 'swCin', pin: 'out' }, to: { comp: 'and2', pin: 'in1' } },
          // Sum output: xor2 out to ledSum
          { id: 'w_sum_led', from: { comp: 'xor2', pin: 'out' }, to: { comp: 'ledSum', pin: 'in' } },
          // Cout logic: and1 out -> or1.in0, and2 out -> or1.in1
          { id: 'w_and1_or', from: { comp: 'and1', pin: 'out' }, to: { comp: 'or1', pin: 'in0' } },
          { id: 'w_and2_or', from: { comp: 'and2', pin: 'out' }, to: { comp: 'or1', pin: 'in1' } },
          // Cout output: or1 out to ledCout
          { id: 'w_cout_led', from: { comp: 'or1', pin: 'out' }, to: { comp: 'ledCout', pin: 'in' } },
        ],
      };
    }

    // Truth Table for Full Adder:
    // A  B  Cin | Sum Cout
    // 0  0   0  |  0    0
    // 0  0   1  |  1    0
    // 0  1   0  |  1    0
    // 0  1   1  |  0    1
    // 1  0   0  |  1    0
    // 1  0   1  |  0    1
    // 1  1   0  |  0    1
    // 1  1   1  |  1    1
    const testCases: [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1][] = [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 0, 1],
      [1, 0, 0, 1, 0],
      [1, 0, 1, 0, 1],
      [1, 1, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ];

    testCases.forEach(([a, b, cin, expectedSum, expectedCout]) => {
      it(`verifies A=${a}, B=${b}, Cin=${cin} => Sum=${expectedSum}, Cout=${expectedCout}`, () => {
        const circuit = createFullAdderCircuit(a, b, cin);
        const result = sim.evaluate(circuit);

        const sumVal = result.pinValues['xor2:out'];
        const coutVal = result.pinValues['or1:out'];

        expect(sumVal).toBe(expectedSum);
        expect(coutVal).toBe(expectedCout);
        expect(result.componentStates['ledSum']?.lit).toBe(expectedSum === 1);
        expect(result.componentStates['ledCout']?.lit).toBe(expectedCout === 1);
      });
    });
  });

  it('evaluates Sequential SR Latch correctly', () => {
    const circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'swS', type: 'SWITCH', x: 0, y: 0, params: { state: 1, label: 'S' } },
        { id: 'swR', type: 'SWITCH', x: 0, y: 60, params: { state: 0, label: 'R' } },
        { id: 'latch', type: 'SR_LATCH', x: 120, y: 30, params: {} },
      ],
      wires: [
        { id: 'w1', from: { comp: 'swS', pin: 'out' }, to: { comp: 'latch', pin: 's' } },
        { id: 'w2', from: { comp: 'swR', pin: 'out' }, to: { comp: 'latch', pin: 'r' } },
      ],
    };

    // SET: S=1, R=0 -> Q=1, Qbar=0
    let res = sim.evaluate(circuit);
    expect(res.pinValues['latch:q']).toBe(1);
    expect(res.pinValues['latch:qbar']).toBe(0);

    // HOLD: S=0, R=0 -> Q remains 1
    circuit.components[0].params.state = 0;
    res = sim.evaluate(circuit, res.componentStates);
    expect(res.pinValues['latch:q']).toBe(1);

    // RESET: S=0, R=1 -> Q=0, Qbar=1
    circuit.components[1].params.state = 1;
    res = sim.evaluate(circuit, res.componentStates);
    expect(res.pinValues['latch:q']).toBe(0);
    expect(res.pinValues['latch:qbar']).toBe(1);
  });

  it('evaluates dynamic multi-input (4-input) AND gate correctly', () => {
    const circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'sw0', type: 'SWITCH', x: 0, y: 0, params: { state: 1 } },
        { id: 'sw1', type: 'SWITCH', x: 0, y: 40, params: { state: 1 } },
        { id: 'sw2', type: 'SWITCH', x: 0, y: 80, params: { state: 1 } },
        { id: 'sw3', type: 'SWITCH', x: 0, y: 120, params: { state: 0 } },
        { id: 'and4', type: 'AND', x: 140, y: 60, params: { inputs: 4 } },
      ],
      wires: [
        { id: 'w0', from: { comp: 'sw0', pin: 'out' }, to: { comp: 'and4', pin: 'in0' } },
        { id: 'w1', from: { comp: 'sw1', pin: 'out' }, to: { comp: 'and4', pin: 'in1' } },
        { id: 'w2', from: { comp: 'sw2', pin: 'out' }, to: { comp: 'and4', pin: 'in2' } },
        { id: 'w3', from: { comp: 'sw3', pin: 'out' }, to: { comp: 'and4', pin: 'in3' } },
      ],
    };

    // With in3 = 0, 4-input AND should output 0
    let res = sim.evaluate(circuit);
    expect(res.pinValues['and4:in2']).toBe(1);
    expect(res.pinValues['and4:in3']).toBe(0);
    expect(res.pinValues['and4:out']).toBe(0);

    // With in3 = 1, all 4 inputs are 1 -> output 1
    circuit.components[3].params.state = 1;
    res = sim.evaluate(circuit);
    expect(res.pinValues['and4:in3']).toBe(1);
    expect(res.pinValues['and4:out']).toBe(1);
  });
});
