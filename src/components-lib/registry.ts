import { ComponentDef } from '../engine/types';
import { Signal, signalToBoolean, booleanToSignal } from '../engine/signal';

/**
 * Gate helper: evaluates N-input logic gate
 */
function evalGate(
  inputs: Record<string, Signal>,
  gateType: string,
  numInputs: number = 2
): Signal {
  const values: Signal[] = [];
  for (let i = 0; i < numInputs; i++) {
    const val = inputs[`in${i}`] ?? inputs[`in`] ?? 'Z';
    values.push(val);
  }

  // If any input is 'X' (fault/contention), output is usually 'X' unless dominating
  if (values.includes('X')) {
    // Dominating input check:
    // For AND/NAND, any 0 dominates
    if ((gateType === 'AND' || gateType === 'NAND') && values.includes(0)) {
      // 0 dominates
    } else if ((gateType === 'OR' || gateType === 'NOR') && values.includes(1)) {
      // 1 dominates
    } else {
      return 'X';
    }
  }

  // Unconnected or floating inputs: treat 'Z' as floating (or 0 with pull-down)
  // In sandbox, treat Z as 0 (LOW) for convenience
  const bools = values.map((v) => (v === 1 ? true : false));

  let res = false;
  switch (gateType) {
    case 'AND':
      res = bools.every(Boolean);
      return booleanToSignal(res);
    case 'NAND':
      res = !bools.every(Boolean);
      return booleanToSignal(res);
    case 'OR':
      res = bools.some(Boolean);
      return booleanToSignal(res);
    case 'NOR':
      res = !bools.some(Boolean);
      return booleanToSignal(res);
    case 'XOR':
      // Odd number of 1s
      res = bools.filter(Boolean).length % 2 === 1;
      return booleanToSignal(res);
    case 'XNOR':
      res = bools.filter(Boolean).length % 2 === 0;
      return booleanToSignal(res);
    default:
      return 'X';
  }
}

export const COMPONENT_DEFINITIONS: ComponentDef[] = [
  // ================= GATES =================
  {
    type: 'AND',
    category: 'gate',
    name: 'AND Gate',
    description: 'Outputs 1 if all inputs are 1',
    pins: [
      { id: 'in0', dir: 'in', label: 'A' },
      { id: 'in1', dir: 'in', label: 'B' },
      { id: 'out', dir: 'out', label: 'Y' },
    ],
    defaultParams: { inputs: 2, label: 'AND' },
    eval: (inputs, _state, params) => ({
      outputs: { out: evalGate(inputs, 'AND', params?.inputs ?? 2) },
    }),
  },
  {
    type: 'OR',
    category: 'gate',
    name: 'OR Gate',
    description: 'Outputs 1 if any input is 1',
    pins: [
      { id: 'in0', dir: 'in', label: 'A' },
      { id: 'in1', dir: 'in', label: 'B' },
      { id: 'out', dir: 'out', label: 'Y' },
    ],
    defaultParams: { inputs: 2, label: 'OR' },
    eval: (inputs, _state, params) => ({
      outputs: { out: evalGate(inputs, 'OR', params?.inputs ?? 2) },
    }),
  },
  {
    type: 'NOT',
    category: 'gate',
    name: 'NOT Gate (Inverter)',
    description: 'Inverts the input signal',
    pins: [
      { id: 'in', dir: 'in', label: 'A' },
      { id: 'out', dir: 'out', label: 'Y' },
    ],
    defaultParams: { label: 'NOT' },
    eval: (inputs) => {
      const inVal = inputs['in'] ?? 'Z';
      if (inVal === 'X') return { outputs: { out: 'X' } };
      const b = signalToBoolean(inVal, false);
      return { outputs: { out: booleanToSignal(!b) } };
    },
  },
  {
    type: 'XOR',
    category: 'gate',
    name: 'XOR Gate',
    description: 'Outputs 1 if inputs are different',
    pins: [
      { id: 'in0', dir: 'in', label: 'A' },
      { id: 'in1', dir: 'in', label: 'B' },
      { id: 'out', dir: 'out', label: 'Y' },
    ],
    defaultParams: { inputs: 2, label: 'XOR' },
    eval: (inputs, _state, params) => ({
      outputs: { out: evalGate(inputs, 'XOR', params?.inputs ?? 2) },
    }),
  },
  {
    type: 'NAND',
    category: 'gate',
    name: 'NAND Gate',
    description: 'Outputs 0 only if all inputs are 1',
    pins: [
      { id: 'in0', dir: 'in', label: 'A' },
      { id: 'in1', dir: 'in', label: 'B' },
      { id: 'out', dir: 'out', label: 'Y' },
    ],
    defaultParams: { inputs: 2, label: 'NAND' },
    eval: (inputs, _state, params) => ({
      outputs: { out: evalGate(inputs, 'NAND', params?.inputs ?? 2) },
    }),
  },
  {
    type: 'NOR',
    category: 'gate',
    name: 'NOR Gate',
    description: 'Outputs 1 only if all inputs are 0',
    pins: [
      { id: 'in0', dir: 'in', label: 'A' },
      { id: 'in1', dir: 'in', label: 'B' },
      { id: 'out', dir: 'out', label: 'Y' },
    ],
    defaultParams: { inputs: 2, label: 'NOR' },
    eval: (inputs, _state, params) => ({
      outputs: { out: evalGate(inputs, 'NOR', params?.inputs ?? 2) },
    }),
  },
  {
    type: 'XNOR',
    category: 'gate',
    name: 'XNOR Gate',
    description: 'Outputs 1 if inputs are identical',
    pins: [
      { id: 'in0', dir: 'in', label: 'A' },
      { id: 'in1', dir: 'in', label: 'B' },
      { id: 'out', dir: 'out', label: 'Y' },
    ],
    defaultParams: { inputs: 2, label: 'XNOR' },
    eval: (inputs, _state, params) => ({
      outputs: { out: evalGate(inputs, 'XNOR', params?.inputs ?? 2) },
    }),
  },
  {
    type: 'BUFFER',
    category: 'gate',
    name: 'Buffer',
    description: 'Passes input signal through',
    pins: [
      { id: 'in', dir: 'in', label: 'A' },
      { id: 'out', dir: 'out', label: 'Y' },
    ],
    defaultParams: { label: 'BUF' },
    eval: (inputs) => ({
      outputs: { out: inputs['in'] ?? 'Z' },
    }),
  },
  {
    type: 'TRI_STATE',
    category: 'gate',
    name: 'Tri-State Buffer',
    description: 'Outputs input when enabled, else high-impedance Z',
    pins: [
      { id: 'in', dir: 'in', label: 'IN' },
      { id: 'enable', dir: 'in', label: 'EN' },
      { id: 'out', dir: 'out', label: 'OUT' },
    ],
    defaultParams: { label: 'TRI' },
    eval: (inputs) => {
      const en = inputs['enable'] ?? 'Z';
      if (en === 1) {
        return { outputs: { out: inputs['in'] ?? 'Z' } };
      }
      return { outputs: { out: 'Z' } };
    },
  },

  // ================= INPUTS & SOURCES =================
  {
    type: 'SWITCH',
    category: 'io',
    name: 'Toggle Switch',
    description: 'Click to toggle between 0 and 1',
    pins: [{ id: 'out', dir: 'out', label: 'Q' }],
    defaultParams: { state: 0, label: 'Switch' },
    eval: (_inputs, _state, params) => ({
      outputs: { out: params?.state === 1 ? 1 : 0 },
    }),
  },
  {
    type: 'BUTTON',
    category: 'io',
    name: 'Push Button',
    description: 'Outputs 1 while pressed',
    pins: [{ id: 'out', dir: 'out', label: 'Q' }],
    defaultParams: { pressed: false, label: 'Button' },
    eval: (_inputs, _state, params) => ({
      outputs: { out: params?.pressed ? 1 : 0 },
    }),
  },
  {
    type: 'CLOCK',
    category: 'io',
    name: 'Clock Generator',
    description: 'Oscillating square wave clock',
    pins: [{ id: 'out', dir: 'out', label: 'CLK' }],
    defaultParams: { frequency: 1, label: 'Clock', high: false },
    eval: (_inputs, _state, params) => ({
      outputs: { out: params?.high ? 1 : 0 },
    }),
  },
  {
    type: 'CONST_HIGH',
    category: 'io',
    name: 'Constant 1 (VCC)',
    description: 'Always outputs 1 (HIGH)',
    pins: [{ id: 'out', dir: 'out', label: 'VCC' }],
    defaultParams: { label: '1 (VCC)' },
    eval: () => ({
      outputs: { out: 1 },
    }),
  },
  {
    type: 'CONST_LOW',
    category: 'io',
    name: 'Constant 0 (GND)',
    description: 'Always outputs 0 (LOW)',
    pins: [{ id: 'out', dir: 'out', label: 'GND' }],
    defaultParams: { label: '0 (GND)' },
    eval: () => ({
      outputs: { out: 0 },
    }),
  },

  // ================= OUTPUTS & DISPLAYS =================
  {
    type: 'LED',
    category: 'display',
    name: 'LED Indicator',
    description: 'Lights up when input is 1',
    pins: [{ id: 'in', dir: 'in', label: 'IN' }],
    defaultParams: { color: '#10b981', label: 'LED' },
    defaultState: { lit: false },
    eval: (inputs) => {
      const v = inputs['in'] ?? 'Z';
      return {
        outputs: {},
        state: { lit: v === 1 },
      };
    },
  },
  {
    type: 'PROBE',
    category: 'display',
    name: 'Logic Probe',
    description: 'Shows live value (0, 1, Z, X)',
    pins: [{ id: 'in', dir: 'in', label: 'IN' }],
    defaultParams: { label: 'Probe' },
    defaultState: { value: 'Z' },
    eval: (inputs) => ({
      outputs: {},
      state: { value: inputs['in'] ?? 'Z' },
    }),
  },
  {
    type: 'SEVEN_SEGMENT',
    category: 'display',
    name: '7-Segment Display',
    description: 'Displays numeric digits (segments a-g)',
    pins: [
      { id: 'a', dir: 'in', label: 'a' },
      { id: 'b', dir: 'in', label: 'b' },
      { id: 'c', dir: 'in', label: 'c' },
      { id: 'd', dir: 'in', label: 'd' },
      { id: 'e', dir: 'in', label: 'e' },
      { id: 'f', dir: 'in', label: 'f' },
      { id: 'g', dir: 'in', label: 'g' },
    ],
    defaultParams: { label: '7-Seg' },
    defaultState: { segments: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 } },
    eval: (inputs) => ({
      outputs: {},
      state: {
        segments: {
          a: inputs['a'] === 1 ? 1 : 0,
          b: inputs['b'] === 1 ? 1 : 0,
          c: inputs['c'] === 1 ? 1 : 0,
          d: inputs['d'] === 1 ? 1 : 0,
          e: inputs['e'] === 1 ? 1 : 0,
          f: inputs['f'] === 1 ? 1 : 0,
          g: inputs['g'] === 1 ? 1 : 0,
        },
      },
    }),
  },

  // ================= COMBINATIONAL BLOCKS =================
  {
    type: 'HALF_ADDER',
    category: 'block',
    name: 'Half Adder',
    description: 'Adds 2 bits, outputs Sum and Carry',
    pins: [
      { id: 'a', dir: 'in', label: 'A' },
      { id: 'b', dir: 'in', label: 'B' },
      { id: 'sum', dir: 'out', label: 'Σ' },
      { id: 'carry', dir: 'out', label: 'C' },
    ],
    defaultParams: { label: 'Half Adder' },
    eval: (inputs) => {
      const a = inputs['a'] === 1 ? 1 : 0;
      const b = inputs['b'] === 1 ? 1 : 0;
      return {
        outputs: {
          sum: booleanToSignal((a ^ b) === 1),
          carry: booleanToSignal((a & b) === 1),
        },
      };
    },
  },
  {
    type: 'FULL_ADDER_BLOCK',
    category: 'block',
    name: 'Full Adder (IC Block)',
    description: '1-bit Full Adder with Carry In and Carry Out',
    pins: [
      { id: 'a', dir: 'in', label: 'A' },
      { id: 'b', dir: 'in', label: 'B' },
      { id: 'cin', dir: 'in', label: 'Cin' },
      { id: 'sum', dir: 'out', label: 'Σ' },
      { id: 'cout', dir: 'out', label: 'Cout' },
    ],
    defaultParams: { label: 'Full Adder' },
    eval: (inputs) => {
      const a = inputs['a'] === 1 ? 1 : 0;
      const b = inputs['b'] === 1 ? 1 : 0;
      const cin = inputs['cin'] === 1 ? 1 : 0;
      const total = a + b + cin;
      return {
        outputs: {
          sum: booleanToSignal(total % 2 === 1),
          cout: booleanToSignal(total >= 2),
        },
      };
    },
  },

  // ================= SEQUENTIAL CIRCUITS =================
  {
    type: 'D_FLIP_FLOP',
    category: 'sequential',
    name: 'D Flip-Flop',
    description: 'Stores bit on rising edge of clock',
    pins: [
      { id: 'd', dir: 'in', label: 'D' },
      { id: 'clk', dir: 'in', label: 'CLK' },
      { id: 'q', dir: 'out', label: 'Q' },
      { id: 'qbar', dir: 'out', label: 'Q̄' },
    ],
    defaultParams: { label: 'D-FF' },
    defaultState: { q: 0, lastClk: 0 },
    eval: (inputs, state) => {
      const d = inputs['d'] === 1 ? 1 : 0;
      const clk = inputs['clk'] === 1 ? 1 : 0;
      const lastClk = state?.lastClk ?? 0;
      let q = state?.q ?? 0;

      // Positive edge detection (0 -> 1)
      if (lastClk === 0 && clk === 1) {
        q = d;
      }

      const qSignal: Signal = q === 1 ? 1 : 0;
      const qbarSignal: Signal = q === 1 ? 0 : 1;

      return {
        outputs: { q: qSignal, qbar: qbarSignal },
        state: { q, lastClk: clk },
      };
    },
  },
  {
    type: 'SR_LATCH',
    category: 'sequential',
    name: 'SR Latch',
    description: 'Set-Reset Memory Latch',
    pins: [
      { id: 's', dir: 'in', label: 'S' },
      { id: 'r', dir: 'in', label: 'R' },
      { id: 'q', dir: 'out', label: 'Q' },
      { id: 'qbar', dir: 'out', label: 'Q̄' },
    ],
    defaultParams: { label: 'SR Latch' },
    defaultState: { q: 0 },
    eval: (inputs, state) => {
      const s = inputs['s'] === 1;
      const r = inputs['r'] === 1;
      let q = state?.q ?? 0;

      if (s && r) {
        // Invalid state
        return {
          outputs: { q: 'X', qbar: 'X' },
          state: { q },
        };
      }
      if (s) {
        q = 1;
      } else if (r) {
        q = 0;
      }

      return {
        outputs: {
          q: q === 1 ? 1 : 0,
          qbar: q === 1 ? 0 : 1,
        },
        state: { q },
      };
    },
  },
];

export const REGISTRY = new Map<string, ComponentDef>(
  COMPONENT_DEFINITIONS.map((def) => [def.type, def])
);

export function getComponentDef(type: string): ComponentDef | undefined {
  return REGISTRY.get(type);
}
