import { ComponentDef } from '../engine/types';
import { Signal, signalToBoolean, booleanToSignal } from '../engine/signal';
import { Locale } from '../i18n/translations';

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
    nameI18n: { en: 'AND Gate', tr: 'AND (VE) Kapısı' },
    description: 'Outputs 1 if all inputs are 1',
    descriptionI18n: { en: 'Outputs 1 if all inputs are 1', tr: 'Tüm girişler 1 olduğunda çıkış 1 olur' },
    pins: [
      { id: 'in0', dir: 'in', label: 'A', description: 'Input A', descriptionI18n: { en: 'Input A', tr: 'A Girişi' } },
      { id: 'in1', dir: 'in', label: 'B', description: 'Input B', descriptionI18n: { en: 'Input B', tr: 'B Girişi' } },
      { id: 'out', dir: 'out', label: 'Y', description: 'Output Y', descriptionI18n: { en: 'Output Y', tr: 'Y Çıkışı' } },
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
    nameI18n: { en: 'OR Gate', tr: 'OR (VEYA) Kapısı' },
    description: 'Outputs 1 if any input is 1',
    descriptionI18n: { en: 'Outputs 1 if any input is 1', tr: 'Girişlerden en az biri 1 olduğunda çıkış 1 olur' },
    pins: [
      { id: 'in0', dir: 'in', label: 'A', description: 'Input A', descriptionI18n: { en: 'Input A', tr: 'A Girişi' } },
      { id: 'in1', dir: 'in', label: 'B', description: 'Input B', descriptionI18n: { en: 'Input B', tr: 'B Girişi' } },
      { id: 'out', dir: 'out', label: 'Y', description: 'Output Y', descriptionI18n: { en: 'Output Y', tr: 'Y Çıkışı' } },
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
    nameI18n: { en: 'NOT Gate (Inverter)', tr: 'NOT (DEĞİL) Kapısı' },
    description: 'Inverts the input signal',
    descriptionI18n: { en: 'Inverts the input signal', tr: 'Giriş sinyalini tersine çevirir (0 → 1, 1 → 0)' },
    pins: [
      { id: 'in', dir: 'in', label: 'A', description: 'Input A', descriptionI18n: { en: 'Input A', tr: 'A Girişi' } },
      { id: 'out', dir: 'out', label: 'Y', description: 'Inverted Output Y', descriptionI18n: { en: 'Inverted Output Y', tr: 'Terslenmiş Y Çıkışı' } },
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
    nameI18n: { en: 'XOR Gate', tr: 'XOR (Özel VEYA) Kapısı' },
    description: 'Outputs 1 if inputs are different',
    descriptionI18n: { en: 'Outputs 1 if inputs are different', tr: 'Girişler birbirinden farklı olduğunda çıkış 1 olur' },
    pins: [
      { id: 'in0', dir: 'in', label: 'A', description: 'Input A', descriptionI18n: { en: 'Input A', tr: 'A Girişi' } },
      { id: 'in1', dir: 'in', label: 'B', description: 'Input B', descriptionI18n: { en: 'Input B', tr: 'B Girişi' } },
      { id: 'out', dir: 'out', label: 'Y', description: 'Output Y', descriptionI18n: { en: 'Output Y', tr: 'Y Çıkışı' } },
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
    nameI18n: { en: 'NAND Gate', tr: 'NAND (VE DEĞİL) Kapısı' },
    description: 'Outputs 0 only if all inputs are 1',
    descriptionI18n: { en: 'Outputs 0 only if all inputs are 1', tr: 'Sadece tüm girişler 1 olduğunda çıkış 0 olur' },
    pins: [
      { id: 'in0', dir: 'in', label: 'A', description: 'Input A', descriptionI18n: { en: 'Input A', tr: 'A Girişi' } },
      { id: 'in1', dir: 'in', label: 'B', description: 'Input B', descriptionI18n: { en: 'Input B', tr: 'B Girişi' } },
      { id: 'out', dir: 'out', label: 'Y', description: 'Output Y', descriptionI18n: { en: 'Output Y', tr: 'Y Çıkışı' } },
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
    nameI18n: { en: 'NOR Gate', tr: 'NOR (VEYA DEĞİL) Kapısı' },
    description: 'Outputs 1 only if all inputs are 0',
    descriptionI18n: { en: 'Outputs 1 only if all inputs are 0', tr: 'Sadece tüm girişler 0 olduğunda çıkış 1 olur' },
    pins: [
      { id: 'in0', dir: 'in', label: 'A', description: 'Input A', descriptionI18n: { en: 'Input A', tr: 'A Girişi' } },
      { id: 'in1', dir: 'in', label: 'B', description: 'Input B', descriptionI18n: { en: 'Input B', tr: 'B Girişi' } },
      { id: 'out', dir: 'out', label: 'Y', description: 'Output Y', descriptionI18n: { en: 'Output Y', tr: 'Y Çıkışı' } },
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
    nameI18n: { en: 'XNOR Gate', tr: 'XNOR (Özel VEYA DEĞİL) Kapısı' },
    description: 'Outputs 1 if inputs are identical',
    descriptionI18n: { en: 'Outputs 1 if inputs are identical', tr: 'Girişler birbirinin aynısı olduğunda çıkış 1 olur' },
    pins: [
      { id: 'in0', dir: 'in', label: 'A', description: 'Input A', descriptionI18n: { en: 'Input A', tr: 'A Girişi' } },
      { id: 'in1', dir: 'in', label: 'B', description: 'Input B', descriptionI18n: { en: 'Input B', tr: 'B Girişi' } },
      { id: 'out', dir: 'out', label: 'Y', description: 'Output Y', descriptionI18n: { en: 'Output Y', tr: 'Y Çıkışı' } },
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
    nameI18n: { en: 'Buffer', tr: 'Buffer (Tampon)' },
    description: 'Passes input signal through',
    descriptionI18n: { en: 'Passes input signal through unchanged', tr: 'Giriş sinyalini doğrudan çıkışa aktarır' },
    pins: [
      { id: 'in', dir: 'in', label: 'A', description: 'Input A', descriptionI18n: { en: 'Input A', tr: 'A Girişi' } },
      { id: 'out', dir: 'out', label: 'Y', description: 'Output Y', descriptionI18n: { en: 'Output Y', tr: 'Y Çıkışı' } },
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
    nameI18n: { en: 'Tri-State Buffer', tr: 'Üç Durumlu (Tri-State) Tampon' },
    description: 'Outputs input when enabled, else high-impedance Z',
    descriptionI18n: { en: 'Outputs input when enabled, else high-impedance Z', tr: 'Enable 1 iken girişi iletir; 0 iken yüksek empedans (Z / Yüzer) verir' },
    pins: [
      { id: 'in', dir: 'in', label: 'IN', description: 'Data Input', descriptionI18n: { en: 'Data Input', tr: 'Veri Girişi' } },
      { id: 'enable', dir: 'in', label: 'EN', description: 'Enable Control Signal', descriptionI18n: { en: 'Enable Control Signal', tr: 'Etkinleştirme (Enable) Kontrol Sinyali' } },
      { id: 'out', dir: 'out', label: 'OUT', description: 'Tri-State Output', descriptionI18n: { en: 'Tri-State Output', tr: 'Üç Durumlu Çıkış' } },
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
    nameI18n: { en: 'Toggle Switch', tr: 'Anahtar (Switch)' },
    description: 'Click to toggle between 0 and 1',
    descriptionI18n: { en: 'Click to toggle between 0 and 1', tr: 'Tıklayarak 0 ve 1 mantıksal değerleri arasında geçiş yapın' },
    pins: [{ id: 'out', dir: 'out', label: 'Q', description: 'Switch Output', descriptionI18n: { en: 'Switch Output', tr: 'Anahtar Çıkışı' } }],
    defaultParams: { state: 0, label: 'Switch' },
    eval: (_inputs, _state, params) => ({
      outputs: { out: params?.state === 1 ? 1 : 0 },
    }),
  },
  {
    type: 'BUTTON',
    category: 'io',
    name: 'Push Button',
    nameI18n: { en: 'Push Button', tr: 'Bas-Bırak Buton (Push Button)' },
    description: 'Outputs 1 while pressed',
    descriptionI18n: { en: 'Outputs 1 while pressed', tr: 'Basılı tutulduğunda 1, bırakıldığında 0 üretir' },
    pins: [{ id: 'out', dir: 'out', label: 'Q', description: 'Button Output', descriptionI18n: { en: 'Button Output', tr: 'Buton Çıkışı' } }],
    defaultParams: { pressed: false, label: 'Button' },
    eval: (_inputs, _state, params) => ({
      outputs: { out: params?.pressed ? 1 : 0 },
    }),
  },
  {
    type: 'CLOCK',
    category: 'io',
    name: 'Clock Generator',
    nameI18n: { en: 'Clock Generator', tr: 'Saat Sinyali Üreteci (Clock)' },
    description: 'Oscillating square wave clock',
    descriptionI18n: { en: 'Oscillating square wave clock', tr: 'Belirlenen frekansta periyodik kare dalga darbesi üretir' },
    pins: [{ id: 'out', dir: 'out', label: 'CLK', description: 'Clock Pulse Output', descriptionI18n: { en: 'Clock Pulse Output', tr: 'Saat Darbesi Çıkışı' } }],
    defaultParams: { frequency: 1, label: 'Clock', high: false },
    eval: (_inputs, _state, params) => ({
      outputs: { out: params?.high ? 1 : 0 },
    }),
  },
  {
    type: 'CONST_HIGH',
    category: 'io',
    name: 'Constant 1 (VCC)',
    nameI18n: { en: 'Constant 1 (VCC)', tr: 'Sabit 1 (VCC)' },
    description: 'Always outputs 1 (HIGH)',
    descriptionI18n: { en: 'Always outputs 1 (HIGH)', tr: 'Sürekli olarak mantıksal 1 (HIGH / Gerilim) üretir' },
    pins: [{ id: 'out', dir: 'out', label: 'VCC', description: 'VCC Supply', descriptionI18n: { en: 'VCC Supply', tr: 'VCC Besleme Hattı' } }],
    defaultParams: { label: '1 (VCC)' },
    eval: () => ({
      outputs: { out: 1 },
    }),
  },
  {
    type: 'CONST_LOW',
    category: 'io',
    name: 'Constant 0 (GND)',
    nameI18n: { en: 'Constant 0 (GND)', tr: 'Sabit 0 (GND)' },
    description: 'Always outputs 0 (LOW)',
    descriptionI18n: { en: 'Always outputs 0 (LOW)', tr: 'Sürekli olarak mantıksal 0 (LOW / Toprak) üretir' },
    pins: [{ id: 'out', dir: 'out', label: 'GND', description: 'GND Reference', descriptionI18n: { en: 'GND Reference', tr: 'Toprak Referans Hattı' } }],
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
    nameI18n: { en: 'LED Indicator', tr: 'LED Gösterge' },
    description: 'Lights up when input is 1',
    descriptionI18n: { en: 'Lights up when input is 1', tr: 'Giriş sinyali 1 olduğunda neon ışığı ile yanar' },
    pins: [{ id: 'in', dir: 'in', label: 'IN', description: 'LED Input', descriptionI18n: { en: 'LED Input', tr: 'LED Girişi' } }],
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
    nameI18n: { en: 'Logic Probe', tr: 'Lojik Prob' },
    description: 'Shows live value (0, 1, Z, X)',
    descriptionI18n: { en: 'Shows live value (0, 1, Z, X)', tr: 'Hattın anlık lojik durumunu (0, 1, Z, X) dijital olarak görüntüler' },
    pins: [{ id: 'in', dir: 'in', label: 'IN', description: 'Probe Input', descriptionI18n: { en: 'Probe Input', tr: 'Prob Ölçüm Girişi' } }],
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
    nameI18n: { en: '7-Segment Display', tr: '7-Segment Ekran' },
    description: 'Displays numeric digits (segments a-g)',
    descriptionI18n: { en: 'Displays numeric digits (segments a-g)', tr: '7 ayrı segment (a-g) kontrolüyle sayıları görüntüler' },
    pins: [
      { id: 'a', dir: 'in', label: 'a', description: 'Segment a', descriptionI18n: { en: 'Segment a', tr: 'Segment a' } },
      { id: 'b', dir: 'in', label: 'b', description: 'Segment b', descriptionI18n: { en: 'Segment b', tr: 'Segment b' } },
      { id: 'c', dir: 'in', label: 'c', description: 'Segment c', descriptionI18n: { en: 'Segment c', tr: 'Segment c' } },
      { id: 'd', dir: 'in', label: 'd', description: 'Segment d', descriptionI18n: { en: 'Segment d', tr: 'Segment d' } },
      { id: 'e', dir: 'in', label: 'e', description: 'Segment e', descriptionI18n: { en: 'Segment e', tr: 'Segment e' } },
      { id: 'f', dir: 'in', label: 'f', description: 'Segment f', descriptionI18n: { en: 'Segment f', tr: 'Segment f' } },
      { id: 'g', dir: 'in', label: 'g', description: 'Segment g', descriptionI18n: { en: 'Segment g', tr: 'Segment g' } },
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
    nameI18n: { en: 'Half Adder (Block)', tr: 'Yarım Toplayıcı (Half Adder Blok)' },
    description: 'Adds 2 bits, outputs Sum and Carry',
    descriptionI18n: { en: 'Adds 2 bits, outputs Sum and Carry', tr: 'İki biti toplar; Toplam (Σ) ve Elde (Carry) çıkışı verir' },
    pins: [
      { id: 'a', dir: 'in', label: 'A', description: 'Input Bit A', descriptionI18n: { en: 'Input Bit A', tr: 'Giriş Biti A' } },
      { id: 'b', dir: 'in', label: 'B', description: 'Input Bit B', descriptionI18n: { en: 'Input Bit B', tr: 'Giriş Biti B' } },
      { id: 'sum', dir: 'out', label: 'Σ', description: 'Sum Output (A ⊕ B)', descriptionI18n: { en: 'Sum Output (A ⊕ B)', tr: 'Toplam Çıkışı (A ⊕ B)' } },
      { id: 'carry', dir: 'out', label: 'C', description: 'Carry Output (A · B)', descriptionI18n: { en: 'Carry Output (A · B)', tr: 'Elde Çıkışı (A · B)' } },
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
    nameI18n: { en: 'Full Adder (IC Block)', tr: 'Tam Toplayıcı (Full Adder Blok)' },
    description: '1-bit Full Adder with Carry In and Carry Out',
    descriptionI18n: { en: '1-bit Full Adder with Carry In and Carry Out', tr: 'Elde Girişi (Cin) ve Elde Çıkışı (Cout) olan 1-bit tam toplayıcı entegre bloğu' },
    pins: [
      { id: 'a', dir: 'in', label: 'A', description: 'Input Bit A', descriptionI18n: { en: 'Input Bit A', tr: 'Giriş Biti A' } },
      { id: 'b', dir: 'in', label: 'B', description: 'Input Bit B', descriptionI18n: { en: 'Input Bit B', tr: 'Giriş Biti B' } },
      { id: 'cin', dir: 'in', label: 'Cin', description: 'Carry In', descriptionI18n: { en: 'Carry In', tr: 'Elde Girişi (Cin)' } },
      { id: 'sum', dir: 'out', label: 'Σ', description: 'Sum Output', descriptionI18n: { en: 'Sum Output', tr: 'Toplam Çıkışı (Σ)' } },
      { id: 'cout', dir: 'out', label: 'Cout', description: 'Carry Out', descriptionI18n: { en: 'Carry Out', tr: 'Elde Çıkışı (Cout)' } },
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
    nameI18n: { en: 'D Flip-Flop', tr: 'D Flip-Flop (Tetiklemeli Hafıza)' },
    description: 'Stores bit on rising edge of clock',
    descriptionI18n: { en: 'Stores bit on rising edge of clock', tr: 'Saat darbesinin yükselen kenarında (0 → 1) D girişindeki veriyi saklar' },
    pins: [
      { id: 'd', dir: 'in', label: 'D', description: 'Data Input', descriptionI18n: { en: 'Data Input', tr: 'Veri Girişi (D)' } },
      { id: 'clk', dir: 'in', label: 'CLK', description: 'Clock Input (Rising Edge)', descriptionI18n: { en: 'Clock Input (Rising Edge)', tr: 'Saat Girişi (Yükselen Kenar)' } },
      { id: 'q', dir: 'out', label: 'Q', description: 'Stored State Output', descriptionI18n: { en: 'Stored State Output', tr: 'Saklanan Durum Çıkışı (Q)' } },
      { id: 'qbar', dir: 'out', label: 'Q̄', description: 'Inverted State Output', descriptionI18n: { en: 'Inverted State Output', tr: 'Terslenmiş Durum Çıkışı (Q̄)' } },
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
    nameI18n: { en: 'SR Latch', tr: 'SR Latch (Hafıza Hücresi)' },
    description: 'Set-Reset Memory Latch',
    descriptionI18n: { en: 'Set-Reset Memory Latch', tr: 'Set (Kur) ve Reset (Sıfırla) girişleriyle 1-bit temel asenkron bellek hücresi' },
    pins: [
      { id: 's', dir: 'in', label: 'S', description: 'Set Input (Q = 1)', descriptionI18n: { en: 'Set Input (Q = 1)', tr: 'Set Girişi (Q = 1)' } },
      { id: 'r', dir: 'in', label: 'R', description: 'Reset Input (Q = 0)', descriptionI18n: { en: 'Reset Input (Q = 0)', tr: 'Reset Girişi (Q = 0)' } },
      { id: 'q', dir: 'out', label: 'Q', description: 'Latch Output', descriptionI18n: { en: 'Latch Output', tr: 'Hafıza Çıkışı (Q)' } },
      { id: 'qbar', dir: 'out', label: 'Q̄', description: 'Inverted Latch Output', descriptionI18n: { en: 'Inverted Latch Output', tr: 'Terslenmiş Hafıza Çıkışı (Q̄)' } },
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

/**
 * Returns a component definition with name, description, and pin descriptions localized to the selected locale
 */
export function getLocalizedComponentDef(def: ComponentDef, locale: Locale): ComponentDef {
  return {
    ...def,
    name: def.nameI18n ? (def.nameI18n[locale] || def.nameI18n.en) : def.name,
    description: def.descriptionI18n ? (def.descriptionI18n[locale] || def.descriptionI18n.en) : def.description,
    pins: def.pins.map((pin) => ({
      ...pin,
      description: pin.descriptionI18n ? (pin.descriptionI18n[locale] || pin.descriptionI18n.en) : pin.description,
    })),
  };
}

/**
 * Returns all component definitions localized to the selected locale
 */
export function getLocalizedComponentDefinitions(locale: Locale): ComponentDef[] {
  return COMPONENT_DEFINITIONS.map((def) => getLocalizedComponentDef(def, locale));
}
