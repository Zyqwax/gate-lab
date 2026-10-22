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

  it('evaluates DECIMAL_INPUT -> BCD_TO_7SEG -> SEVEN_SEGMENT & DECIMAL_DISPLAY', () => {
    const circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'decIn', type: 'DECIMAL_INPUT', x: 0, y: 0, params: { value: 7 } },
        { id: 'bcd', type: 'BCD_TO_7SEG', x: 100, y: 0, params: {} },
        { id: 'sevenSeg', type: 'SEVEN_SEGMENT', x: 250, y: 0, params: {} },
        { id: 'decDisp', type: 'DECIMAL_DISPLAY', x: 250, y: 150, params: {} },
      ],
      wires: [
        // decIn to bcd
        { id: 'w1', from: { comp: 'decIn', pin: 'out3' }, to: { comp: 'bcd', pin: 'in3' } },
        { id: 'w2', from: { comp: 'decIn', pin: 'out2' }, to: { comp: 'bcd', pin: 'in2' } },
        { id: 'w3', from: { comp: 'decIn', pin: 'out1' }, to: { comp: 'bcd', pin: 'in1' } },
        { id: 'w4', from: { comp: 'decIn', pin: 'out0' }, to: { comp: 'bcd', pin: 'in0' } },
        // decIn to decDisp
        { id: 'w5', from: { comp: 'decIn', pin: 'out3' }, to: { comp: 'decDisp', pin: 'in3' } },
        { id: 'w6', from: { comp: 'decIn', pin: 'out2' }, to: { comp: 'decDisp', pin: 'in2' } },
        { id: 'w7', from: { comp: 'decIn', pin: 'out1' }, to: { comp: 'decDisp', pin: 'in1' } },
        { id: 'w8', from: { comp: 'decIn', pin: 'out0' }, to: { comp: 'decDisp', pin: 'in0' } },
        // bcd to sevenSeg
        { id: 'wa', from: { comp: 'bcd', pin: 'a' }, to: { comp: 'sevenSeg', pin: 'a' } },
        { id: 'wb', from: { comp: 'bcd', pin: 'b' }, to: { comp: 'sevenSeg', pin: 'b' } },
        { id: 'wc', from: { comp: 'bcd', pin: 'c' }, to: { comp: 'sevenSeg', pin: 'c' } },
        { id: 'wd', from: { comp: 'bcd', pin: 'd' }, to: { comp: 'sevenSeg', pin: 'd' } },
        { id: 'we', from: { comp: 'bcd', pin: 'e' }, to: { comp: 'sevenSeg', pin: 'e' } },
        { id: 'wf', from: { comp: 'bcd', pin: 'f' }, to: { comp: 'sevenSeg', pin: 'f' } },
        { id: 'wg', from: { comp: 'bcd', pin: 'g' }, to: { comp: 'sevenSeg', pin: 'g' } },
      ],
    };

    // Value 7: binary 0111 -> bcd outputs a=1, b=1, c=1, d=0, e=0, f=0, g=0
    const res = sim.evaluate(circuit);
    expect(res.pinValues['decIn:out0']).toBe(1);
    expect(res.pinValues['decIn:out1']).toBe(1);
    expect(res.pinValues['decIn:out2']).toBe(1);
    expect(res.pinValues['decIn:out3']).toBe(0);

    expect(res.pinValues['sevenSeg:a']).toBe(1);
    expect(res.pinValues['sevenSeg:b']).toBe(1);
    expect(res.pinValues['sevenSeg:c']).toBe(1);
    expect(res.pinValues['sevenSeg:d']).toBe(0);
    expect(res.pinValues['sevenSeg:e']).toBe(0);
    expect(res.pinValues['sevenSeg:f']).toBe(0);
    expect(res.pinValues['sevenSeg:g']).toBe(0);
    expect(res.componentStates['sevenSeg']?.segments?.a).toBe(1);

    expect(res.componentStates['decDisp']?.value).toBe(7);
  });

  it('evaluates DIP_SWITCH_4, BIN_TO_DEC, and DEC_TO_BIN', () => {
    const circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'dip', type: 'DIP_SWITCH_4', x: 0, y: 0, params: { bits: [1, 0, 1, 0] } }, // 5 (b0=1, b1=0, b2=1, b3=0)
        { id: 'bin2dec', type: 'BIN_TO_DEC', x: 150, y: 0, params: {} },
        { id: 'dec2bin', type: 'DEC_TO_BIN', x: 300, y: 0, params: {} },
      ],
      wires: [
        { id: 'w0', from: { comp: 'dip', pin: 'out0' }, to: { comp: 'bin2dec', pin: 'in0' } },
        { id: 'w1', from: { comp: 'dip', pin: 'out1' }, to: { comp: 'bin2dec', pin: 'in1' } },
        { id: 'w2', from: { comp: 'dip', pin: 'out2' }, to: { comp: 'bin2dec', pin: 'in2' } },
        { id: 'w3', from: { comp: 'dip', pin: 'out3' }, to: { comp: 'bin2dec', pin: 'in3' } },
        // Connect decimal line 5 from bin2dec to dec2bin in5
        { id: 'w5', from: { comp: 'bin2dec', pin: 'out5' }, to: { comp: 'dec2bin', pin: 'in5' } },
      ],
    };

    const res = sim.evaluate(circuit);
    expect(res.pinValues['bin2dec:out5']).toBe(1);
    expect(res.pinValues['bin2dec:out4']).toBe(0);
    expect(res.pinValues['bin2dec:out6']).toBe(0);

    // dec2bin should encode input 5 to binary 0101
    expect(res.pinValues['dec2bin:out0']).toBe(1);
    expect(res.pinValues['dec2bin:out1']).toBe(0);
    expect(res.pinValues['dec2bin:out2']).toBe(1);
    expect(res.pinValues['dec2bin:out3']).toBe(0);
  });

  it('runs user circuit test', () => {
    const userCircuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'fa0', type: 'FULL_ADDER_BLOCK', x: 180, y: 230, params: { label: 'Full Adder' }, state: {} },
        { id: 'dff0', type: 'D_FLIP_FLOP', x: 855, y: 240, params: { label: 'D-FF' }, state: { q: 0, lastClk: 0 } },
        { id: 'fa1', type: 'FULL_ADDER_BLOCK', x: 180, y: 360, params: { label: 'Full Adder' }, state: {} },
        { id: 'fa2', type: 'FULL_ADDER_BLOCK', x: 180, y: 495, params: { label: 'Full Adder' }, state: {} },
        { id: 'fa3', type: 'FULL_ADDER_BLOCK', x: 180, y: 630, params: { label: 'Full Adder' }, state: {} },
        { id: 'dff1', type: 'D_FLIP_FLOP', x: 855, y: 375, params: { label: 'D-FF' }, state: { q: 0, lastClk: 0 } },
        { id: 'dff2', type: 'D_FLIP_FLOP', x: 855, y: 510, params: { label: 'D-FF' }, state: { q: 0, lastClk: 0 } },
        { id: 'dff3', type: 'D_FLIP_FLOP', x: 855, y: 645, params: { label: 'D-FF' }, state: { q: 0, lastClk: 0 } },
        { id: 'buf', type: 'BUFFER', x: 480, y: 60, params: { label: 'BUF' }, state: {} },
        { id: 'tri0', type: 'TRI_STATE', x: 510, y: 255, params: { label: 'TRI' }, state: {} },
        { id: 'tri1', type: 'TRI_STATE', x: 510, y: 375, params: { label: 'TRI' }, state: {} },
        { id: 'tri2', type: 'TRI_STATE', x: 510, y: 495, params: { label: 'TRI' }, state: {} },
        { id: 'tri3', type: 'TRI_STATE', x: 510, y: 615, params: { label: 'TRI' }, state: {} },
        { id: 'sw', type: 'SWITCH', x: 210, y: 90, params: { state: 1, label: 'Switch' }, state: {} },
        { id: 'clk', type: 'CLOCK', x: 330, y: -10, params: { frequency: 1, label: 'Clock', high: false }, state: {} },
        { id: 'dec10', type: 'DECIMAL_INPUT', x: -165, y: 75, params: { label: 'Dec Input', value: 10 }, state: {} },
        { id: 'dec1', type: 'DECIMAL_INPUT', x: -165, y: 225, params: { label: 'Dec Input', value: 1 }, state: {} },
        { id: 'led', type: 'LED', x: 1140, y: 270, params: { color: '#10b981', label: 'LED' }, state: { lit: false } }
      ],
      wires: [
        { id: 'w1', from: { comp: 'fa0', pin: 'cout' }, to: { comp: 'fa1', pin: 'cin' } },
        { id: 'w2', from: { comp: 'fa1', pin: 'cout' }, to: { comp: 'fa2', pin: 'cin' } },
        { id: 'w3', from: { comp: 'fa2', pin: 'cout' }, to: { comp: 'fa3', pin: 'cin' } },
        { id: 'w4', from: { comp: 'buf', pin: 'out' }, to: { comp: 'dff0', pin: 'clk' } },
        { id: 'w5', from: { comp: 'buf', pin: 'out' }, to: { comp: 'dff1', pin: 'clk' } },
        { id: 'w6', from: { comp: 'buf', pin: 'out' }, to: { comp: 'dff2', pin: 'clk' } },
        { id: 'w7', from: { comp: 'buf', pin: 'out' }, to: { comp: 'dff3', pin: 'clk' } },
        { id: 'w8', from: { comp: 'tri3', pin: 'out' }, to: { comp: 'dff3', pin: 'd' } },
        { id: 'w9', from: { comp: 'tri2', pin: 'out' }, to: { comp: 'dff2', pin: 'd' } },
        { id: 'w10', from: { comp: 'tri1', pin: 'out' }, to: { comp: 'dff1', pin: 'd' } },
        { id: 'w11', from: { comp: 'tri0', pin: 'out' }, to: { comp: 'dff0', pin: 'd' } },
        { id: 'w12', from: { comp: 'sw', pin: 'out' }, to: { comp: 'tri0', pin: 'enable' } },
        { id: 'w13', from: { comp: 'sw', pin: 'out' }, to: { comp: 'tri1', pin: 'enable' } },
        { id: 'w14', from: { comp: 'sw', pin: 'out' }, to: { comp: 'tri2', pin: 'enable' } },
        { id: 'w15', from: { comp: 'sw', pin: 'out' }, to: { comp: 'tri3', pin: 'enable' } },
        { id: 'w16', from: { comp: 'fa3', pin: 'sum' }, to: { comp: 'tri3', pin: 'in' } },
        { id: 'w17', from: { comp: 'fa2', pin: 'sum' }, to: { comp: 'tri2', pin: 'in' } },
        { id: 'w18', from: { comp: 'fa1', pin: 'sum' }, to: { comp: 'tri1', pin: 'in' } },
        { id: 'w19', from: { comp: 'fa0', pin: 'sum' }, to: { comp: 'tri0', pin: 'in' } },
        { id: 'w20', from: { comp: 'clk', pin: 'out' }, to: { comp: 'buf', pin: 'in' } },
        { id: 'w21', from: { comp: 'dec10', pin: 'out0' }, to: { comp: 'fa0', pin: 'a' } },
        { id: 'w22', from: { comp: 'dec10', pin: 'out1' }, to: { comp: 'fa1', pin: 'a' } },
        { id: 'w23', from: { comp: 'dec10', pin: 'out2' }, to: { comp: 'fa2', pin: 'a' } },
        { id: 'w24', from: { comp: 'dec10', pin: 'out3' }, to: { comp: 'fa3', pin: 'a' } },
        { id: 'w25', from: { comp: 'dec1', pin: 'out0' }, to: { comp: 'fa0', pin: 'b' } },
        { id: 'w26', from: { comp: 'dec1', pin: 'out1' }, to: { comp: 'fa1', pin: 'b' } },
        { id: 'w27', from: { comp: 'dec1', pin: 'out2' }, to: { comp: 'fa2', pin: 'b' } },
        { id: 'w28', from: { comp: 'dec1', pin: 'out3' }, to: { comp: 'fa3', pin: 'b' } },
        { id: 'w29', from: { comp: 'dff0', pin: 'q' }, to: { comp: 'led', pin: 'in' } }
      ]
    };

    // Step 0: Initial evaluation (clk is 0)
    let res = sim.evaluate(userCircuit);
    expect(res.pinValues['fa0:sum']).toBe(1);
    expect(res.pinValues['tri0:out']).toBe(1);
    expect(res.pinValues['dff0:d']).toBe(1);
    expect(res.pinValues['dff0:clk']).toBe(0);
    expect(res.pinValues['dff0:q']).toBe(0);

    // Step 1: CLOCK becomes high (0 -> 1)
    userCircuit.components.find((c) => c.id === 'clk')!.params.high = true;
    res = sim.evaluate(userCircuit, res.componentStates);

    expect(res.pinValues['clk:out']).toBe(1);
    expect(res.pinValues['buf:out']).toBe(1);
    expect(res.pinValues['dff0:clk']).toBe(1);
    expect(res.pinValues['dff0:d']).toBe(1);
    expect(res.pinValues['dff0:q']).toBe(1);
    expect(res.componentStates['dff0']?.q).toBe(1);
    expect(res.pinValues['led:in']).toBe(1);
    expect(res.componentStates['led']?.lit).toBe(true);
  });

  it('evaluates Toggle Flip-Flop (Qbar -> D feedback loop)', () => {
    const circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'clk', type: 'CLOCK', x: 0, y: 0, params: { high: false }, state: {} },
        { id: 'tff', type: 'D_FLIP_FLOP', x: 100, y: 0, params: {}, state: { q: 0, lastClk: 0 } },
      ],
      wires: [
        { id: 'w_clk', from: { comp: 'clk', pin: 'out' }, to: { comp: 'tff', pin: 'clk' } },
        { id: 'w_fb', from: { comp: 'tff', pin: 'qbar' }, to: { comp: 'tff', pin: 'd' } },
      ],
    };

    // Step 0: clk is 0. Q is 0, Qbar is 1 -> D is 1
    let res = sim.evaluate(circuit);
    expect(res.pinValues['tff:q']).toBe(0);
    expect(res.pinValues['tff:qbar']).toBe(1);
    expect(res.pinValues['tff:d']).toBe(1);

    // Step 1: clk goes HIGH (0 -> 1). Rising edge! Q should become 1, Qbar 0 -> D becomes 0
    circuit.components[0].params.high = true;
    res = sim.evaluate(circuit, res.componentStates);
    expect(res.pinValues['tff:q']).toBe(1);
    expect(res.pinValues['tff:qbar']).toBe(0);
    expect(res.pinValues['tff:d']).toBe(0);

    // Step 2: clk goes LOW (1 -> 0). Falling edge! Q should stay 1
    circuit.components[0].params.high = false;
    res = sim.evaluate(circuit, res.componentStates);
    expect(res.pinValues['tff:q']).toBe(1);
    expect(res.pinValues['tff:qbar']).toBe(0);

    // Step 3: clk goes HIGH again (0 -> 1). Rising edge! Q should become 0 (toggled!)
    circuit.components[0].params.high = true;
    res = sim.evaluate(circuit, res.componentStates);
    expect(res.pinValues['tff:q']).toBe(0);
    expect(res.pinValues['tff:qbar']).toBe(1);
  });

  it('evaluates Push Button (BUTTON) component driving an LED', () => {
    const circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'btn', type: 'BUTTON', x: 0, y: 0, params: { pressed: false } },
        { id: 'led', type: 'LED', x: 100, y: 0, params: {} },
      ],
      wires: [
        { id: 'w1', from: { comp: 'btn', pin: 'out' }, to: { comp: 'led', pin: 'in' } },
      ],
    };

    // When button is not pressed, output is 0 and LED is unlit
    let res = sim.evaluate(circuit);
    expect(res.pinValues['btn:out']).toBe(0);
    expect(res.componentStates['led']?.lit).toBe(false);

    // When button is pressed, output is 1 and LED is lit
    circuit.components[0].params.pressed = true;
    res = sim.evaluate(circuit, res.componentStates);
    expect(res.pinValues['btn:out']).toBe(1);
    expect(res.pinValues['led:in']).toBe(1);
    expect(res.componentStates['led']?.lit).toBe(true);

    // When button is released, output returns to 0 and LED turns off
    circuit.components[0].params.pressed = false;
    res = sim.evaluate(circuit, res.componentStates);
    expect(res.pinValues['btn:out']).toBe(0);
    expect(res.pinValues['led:in']).toBe(0);
    expect(res.componentStates['led']?.lit).toBe(false);
  });

  it('evaluates MUX_2 and MUX_2x8 correctly', () => {
    // 1-Bit Mux test
    const mux1Circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'mux', type: 'MUX_2', x: 0, y: 0, params: {} },
        { id: 'sw_sel', type: 'SWITCH', x: 0, y: 50, params: { state: 0 } },
        { id: 'c0', type: 'CONST_LOW', x: 0, y: 100, params: {} },
        { id: 'c1', type: 'CONST_HIGH', x: 0, y: 150, params: {} },
      ],
      wires: [
        { id: 'w_s', from: { comp: 'sw_sel', pin: 'out' }, to: { comp: 'mux', pin: 'sel' } },
        { id: 'w_d0', from: { comp: 'c0', pin: 'out' }, to: { comp: 'mux', pin: 'd0' } },
        { id: 'w_d1', from: { comp: 'c1', pin: 'out' }, to: { comp: 'mux', pin: 'd1' } },
      ],
    };

    let res = sim.evaluate(mux1Circuit);
    expect(res.pinValues['mux:out']).toBe(0); // sel=0 -> d0=0

    mux1Circuit.components[1].params.state = 1;
    res = sim.evaluate(mux1Circuit);
    expect(res.pinValues['mux:out']).toBe(1); // sel=1 -> d1=1

    // 8-Bit Bus Mux test
    const mux8Circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'mux8', type: 'MUX_2x8', x: 0, y: 0, params: {} },
        { id: 'byte0', type: 'BYTE_INPUT', x: 0, y: 50, params: { value: 10 } },
        { id: 'byte1', type: 'BYTE_INPUT', x: 0, y: 100, params: { value: 42 } },
        { id: 'sw_sel', type: 'SWITCH', x: 0, y: 150, params: { state: 0 } },
      ],
      wires: [
        { id: 'w0', from: { comp: 'byte0', pin: 'out' }, to: { comp: 'mux8', pin: 'd0' } },
        { id: 'w1', from: { comp: 'byte1', pin: 'out' }, to: { comp: 'mux8', pin: 'd1' } },
        { id: 'ws', from: { comp: 'sw_sel', pin: 'out' }, to: { comp: 'mux8', pin: 'sel' } },
      ],
    };

    res = sim.evaluate(mux8Circuit);
    expect(res.pinValues['mux8:out']).toEqual([0, 1, 0, 1, 0, 0, 0, 0]); // 10

    mux8Circuit.components[3].params.state = 1;
    res = sim.evaluate(mux8Circuit);
    expect(res.pinValues['mux8:out']).toEqual([0, 1, 0, 1, 0, 1, 0, 0]); // 42 (32 + 8 + 2)
  });

  it('evaluates ADDER_8 and ZERO_DETECT_8', () => {
    const circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'a', type: 'BYTE_INPUT', x: 0, y: 0, params: { value: 5 } },
        { id: 'b', type: 'BYTE_INPUT', x: 0, y: 50, params: { value: 3 } },
        { id: 'adder', type: 'ADDER_8', x: 100, y: 25, params: {} },
        { id: 'zero', type: 'ZERO_DETECT_8', x: 200, y: 25, params: {} },
      ],
      wires: [
        { id: 'w_a', from: { comp: 'a', pin: 'out' }, to: { comp: 'adder', pin: 'a' } },
        { id: 'w_b', from: { comp: 'b', pin: 'out' }, to: { comp: 'adder', pin: 'b' } },
        { id: 'w_s', from: { comp: 'adder', pin: 's' }, to: { comp: 'zero', pin: 'in' } },
      ],
    };

    let res = sim.evaluate(circuit);
    expect(res.pinValues['adder:s']).toEqual([0, 0, 0, 1, 0, 0, 0, 0]); // 8
    expect(res.pinValues['adder:cout']).toBe(0);
    expect(res.pinValues['adder:ovf']).toBe(0);
    expect(res.pinValues['zero:zero']).toBe(0);

    // Overflow / Carry: 200 + 100 = 300 (44 mod 256, cout = 1)
    circuit.components[0].params.value = 200;
    circuit.components[1].params.value = 100;
    res = sim.evaluate(circuit);
    expect(res.pinValues['adder:cout']).toBe(1);

    // Zero detect: 0 + 0 = 0
    circuit.components[0].params.value = 0;
    circuit.components[1].params.value = 0;
    res = sim.evaluate(circuit);
    expect(res.pinValues['zero:zero']).toBe(1);
  });

  it('evaluates 8-Bit Accumulator end-to-end (5 + 3 = 8 with synchronous clocking)', () => {
    // Complete accumulator: Input A -> Adder.A, Register.Q -> Adder.B, Adder.S -> Mux.D0, Input A -> Mux.D1
    // Mux.OUT -> Register.D, Clock -> Register.CLK
    const circuit: CircuitModel = {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'operand', type: 'BYTE_INPUT', x: 0, y: 0, params: { value: 5 } },
        { id: 'clk', type: 'CLOCK', x: 0, y: 100, params: { high: false } },
        { id: 'mux', type: 'MUX_2x8', x: 150, y: 50, params: {} },
        { id: 'sw_load_direct', type: 'SWITCH', x: 0, y: 150, params: { state: 1 } }, // 1 = Direct load, 0 = Accumulate
        { id: 'reg', type: 'REGISTER_8', x: 300, y: 50, params: {}, state: { q: [0,0,0,0,0,0,0,0], lastClk: 0 } },
        { id: 'adder', type: 'ADDER_8', x: 150, y: 200, params: {} },
        { id: 'zero', type: 'ZERO_DETECT_8', x: 450, y: 50, params: {} },
      ],
      wires: [
        // Adder connections
        { id: 'w_add_a', from: { comp: 'operand', pin: 'out' }, to: { comp: 'adder', pin: 'a' } },
        { id: 'w_add_b', from: { comp: 'reg', pin: 'q' }, to: { comp: 'adder', pin: 'b' } },
        // Mux connections: D0 = Adder Sum (Accumulate), D1 = Direct Input (Load)
        { id: 'w_mux_d0', from: { comp: 'adder', pin: 's' }, to: { comp: 'mux', pin: 'd0' } },
        { id: 'w_mux_d1', from: { comp: 'operand', pin: 'out' }, to: { comp: 'mux', pin: 'd1' } },
        { id: 'w_mux_sel', from: { comp: 'sw_load_direct', pin: 'out' }, to: { comp: 'mux', pin: 'sel' } },
        // Register connections
        { id: 'w_reg_d', from: { comp: 'mux', pin: 'out' }, to: { comp: 'reg', pin: 'd' } },
        { id: 'w_reg_clk', from: { comp: 'clk', pin: 'out' }, to: { comp: 'reg', pin: 'clk' } },
        // Zero detector
        { id: 'w_zero', from: { comp: 'reg', pin: 'q' }, to: { comp: 'zero', pin: 'in' } },
      ],
    };

    // Step 0: Initial state - Register Q is 0x00
    let res = sim.evaluate(circuit);
    expect(res.pinValues['reg:q']).toEqual([0, 0, 0, 0, 0, 0, 0, 0]); // 0
    expect(res.pinValues['zero:zero']).toBe(1);

    // Step 1: Clock rises (0 -> 1) with Direct Load = 1, Operand = 5.
    // Register should sample 5 into Q!
    circuit.components[1].params.high = true;
    res = sim.evaluate(circuit, res.componentStates);
    expect(res.pinValues['reg:q']).toEqual([1, 0, 1, 0, 0, 0, 0, 0]); // 5
    expect(res.pinValues['zero:zero']).toBe(0);

    // Step 2: Clock falls (1 -> 0). Register should hold 5.
    circuit.components[1].params.high = false;
    res = sim.evaluate(circuit, res.componentStates);
    expect(res.pinValues['reg:q']).toEqual([1, 0, 1, 0, 0, 0, 0, 0]); // holds 5

    // Step 3: Switch to ACCUMULATE mode (sw_load_direct = 0). Set Operand = 3.
    // Adder computes A (3) + B (5) = 8.
    circuit.components[3].params.state = 0; // Accumulate from adder
    circuit.components[0].params.value = 3; // Operand = 3
    res = sim.evaluate(circuit, res.componentStates);
    // Before clock rises, Adder already has 8 at its output:
    expect(res.pinValues['adder:s']).toEqual([0, 0, 0, 1, 0, 0, 0, 0]); // 8
    expect(res.pinValues['reg:q']).toEqual([1, 0, 1, 0, 0, 0, 0, 0]); // still holds 5

    // Step 4: Clock rises (0 -> 1)! Register samples the sum (8) from the adder!
    circuit.components[1].params.high = true;
    res = sim.evaluate(circuit, res.componentStates);
    expect(res.pinValues['reg:q']).toEqual([0, 0, 0, 1, 0, 0, 0, 0]); // Q is now 8!

    // Step 5: Clock falls (1 -> 0). Register holds 8.
    // Adder now immediately reflects new sum: 8 + 3 = 11!
    circuit.components[1].params.high = false;
    res = sim.evaluate(circuit, res.componentStates);
    expect(res.pinValues['reg:q']).toEqual([0, 0, 0, 1, 0, 0, 0, 0]); // holds 8
    expect(res.pinValues['adder:s']).toEqual([1, 1, 0, 1, 0, 0, 0, 0]); // 11 (8 + 3)
  });
});

