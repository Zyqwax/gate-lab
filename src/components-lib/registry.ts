import { ComponentDef, PinDef } from '../engine/types';
import {
  Signal,
  BitSignal,
  signalToBoolean,
  booleanToSignal,
  normalizeToBit,
  normalizeToBus,
  numberToBus,
  busToNumber,
} from '../engine/signal';
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
  {
    type: 'DIP_SWITCH_4',
    category: 'io',
    name: '4-Bit DIP Switch',
    nameI18n: { en: '4-Bit DIP Switch', tr: '4-Bit İkili Anahtar (DIP Switch)' },
    description: '4-bit binary switch block with individual toggles for each bit (0-3)',
    descriptionI18n: {
      en: '4-bit binary switch block with individual toggles for each bit (0-3)',
      tr: '0-3 arası bitler için bağımsız anahtarlarla 4-bit ikili (binary) çıkış sağlar'
    },
    pins: [
      { id: 'out3', dir: 'out', label: 'B3', description: 'Bit 3 Output (MSB - 8s)', descriptionI18n: { en: 'Bit 3 Output (MSB - 8s)', tr: 'Bit 3 Çıkışı (MSB - 8ler)' } },
      { id: 'out2', dir: 'out', label: 'B2', description: 'Bit 2 Output (4s)', descriptionI18n: { en: 'Bit 2 Output (4s)', tr: 'Bit 2 Çıkışı (4ler)' } },
      { id: 'out1', dir: 'out', label: 'B1', description: 'Bit 1 Output (2s)', descriptionI18n: { en: 'Bit 1 Output (2s)', tr: 'Bit 1 Çıkışı (2ler)' } },
      { id: 'out0', dir: 'out', label: 'B0', description: 'Bit 0 Output (LSB - 1s)', descriptionI18n: { en: 'Bit 0 Output (LSB - 1s)', tr: 'Bit 0 Çıkışı (LSB - 1ler)' } },
    ],
    defaultParams: { label: 'DIP Switch', bits: [0, 0, 0, 0] },
    eval: (_inputs, _state, params) => {
      const bits = Array.isArray(params?.bits) ? params.bits : [0, 0, 0, 0];
      return {
        outputs: {
          out0: bits[0] === 1 ? 1 : 0,
          out1: bits[1] === 1 ? 1 : 0,
          out2: bits[2] === 1 ? 1 : 0,
          out3: bits[3] === 1 ? 1 : 0,
        },
      };
    },
  },
  {
    type: 'DECIMAL_INPUT',
    category: 'io',
    name: 'Decimal Input',
    nameI18n: { en: 'Decimal Input', tr: 'Ondalık Sayı Girişi (Decimal Generator)' },
    description: 'Select a decimal number (0-15) and output it as 4-bit binary lines',
    descriptionI18n: {
      en: 'Select a decimal number (0-15) and output it as 4-bit binary lines',
      tr: '0-15 arası bir ondalık sayı seçin; doğrudan 4-bit ikili sinyal olarak çıkış versin'
    },
    pins: [
      { id: 'out3', dir: 'out', label: 'B3', description: 'Bit 3 Output (MSB - 8s)', descriptionI18n: { en: 'Bit 3 Output (MSB - 8s)', tr: 'Bit 3 Çıkışı (MSB - 8ler)' } },
      { id: 'out2', dir: 'out', label: 'B2', description: 'Bit 2 Output (4s)', descriptionI18n: { en: 'Bit 2 Output (4s)', tr: 'Bit 2 Çıkışı (4ler)' } },
      { id: 'out1', dir: 'out', label: 'B1', description: 'Bit 1 Output (2s)', descriptionI18n: { en: 'Bit 1 Output (2s)', tr: 'Bit 1 Çıkışı (2ler)' } },
      { id: 'out0', dir: 'out', label: 'B0', description: 'Bit 0 Output (LSB - 1s)', descriptionI18n: { en: 'Bit 0 Output (LSB - 1s)', tr: 'Bit 0 Çıkışı (LSB - 1ler)' } },
    ],
    defaultParams: { label: 'Dec Input', value: 0 },
    eval: (_inputs, _state, params) => {
      const val = Math.max(0, Math.min(15, Number(params?.value) || 0));
      return {
        outputs: {
          out0: (val & 1) ? 1 : 0,
          out1: (val & 2) ? 1 : 0,
          out2: (val & 4) ? 1 : 0,
          out3: (val & 8) ? 1 : 0,
        },
      };
    },
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
    defaultParams: { label: '7-Seg', color: '#ef4444' },
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
  {
    type: 'DECIMAL_DISPLAY',
    category: 'display',
    name: 'Decimal Display',
    nameI18n: { en: 'Decimal Display', tr: 'Sayısal Gösterge (Decimal Display)' },
    description: 'Displays 4-bit binary value as a numeric decimal (0-15) and hex readout',
    descriptionI18n: {
      en: 'Displays 4-bit binary value as a numeric decimal (0-15) and hex readout',
      tr: '4-bit ikili girişi büyük ve net bir ondalık sayı (0-15) ve onaltılık (Hex) olarak görüntüler'
    },
    pins: [
      { id: 'in3', dir: 'in', label: 'B3', description: 'Bit 3 (MSB - 8s)', descriptionI18n: { en: 'Bit 3 (MSB - 8s)', tr: 'Bit 3 (MSB - 8ler)' } },
      { id: 'in2', dir: 'in', label: 'B2', description: 'Bit 2 (4s)', descriptionI18n: { en: 'Bit 2 (4s)', tr: 'Bit 2 (4ler)' } },
      { id: 'in1', dir: 'in', label: 'B1', description: 'Bit 1 (2s)', descriptionI18n: { en: 'Bit 1 (2s)', tr: 'Bit 1 (2ler)' } },
      { id: 'in0', dir: 'in', label: 'B0', description: 'Bit 0 (LSB - 1s)', descriptionI18n: { en: 'Bit 0 (LSB - 1s)', tr: 'Bit 0 (LSB - 1ler)' } },
    ],
    defaultParams: { label: 'Dec Display', color: '#10b981' },
    defaultState: { value: 0 },
    eval: (inputs) => {
      const b0 = inputs['in0'] === 1 ? 1 : 0;
      const b1 = inputs['in1'] === 1 ? 1 : 0;
      const b2 = inputs['in2'] === 1 ? 1 : 0;
      const b3 = inputs['in3'] === 1 ? 1 : 0;
      const val = (b3 << 3) | (b2 << 2) | (b1 << 1) | b0;
      return {
        outputs: {},
        state: { value: val },
      };
    },
  },

  // ================= COMBINATIONAL BLOCKS =================
  {
    type: 'BCD_TO_7SEG',
    category: 'block',
    name: 'BCD to 7-Segment Decoder',
    nameI18n: { en: 'BCD to 7-Segment Decoder', tr: 'BCD → 7-Segment Çözücü' },
    description: 'Decodes 4-bit binary/BCD input to 7-segment display lines (a-g)',
    descriptionI18n: {
      en: 'Decodes 4-bit binary/BCD input to 7-segment display lines (a-g)',
      tr: '4-bit ikili/BCD girişini 7-segment ekran çıkışlarına (a-g) dönüştürür'
    },
    pins: [
      { id: 'in3', dir: 'in', label: 'B3', description: 'Bit 3 (MSB - 8s)', descriptionI18n: { en: 'Bit 3 (MSB - 8s)', tr: 'Bit 3 (MSB - 8ler)' } },
      { id: 'in2', dir: 'in', label: 'B2', description: 'Bit 2 (4s)', descriptionI18n: { en: 'Bit 2 (4s)', tr: 'Bit 2 (4ler)' } },
      { id: 'in1', dir: 'in', label: 'B1', description: 'Bit 1 (2s)', descriptionI18n: { en: 'Bit 1 (2s)', tr: 'Bit 1 (2ler)' } },
      { id: 'in0', dir: 'in', label: 'B0', description: 'Bit 0 (LSB - 1s)', descriptionI18n: { en: 'Bit 0 (LSB - 1s)', tr: 'Bit 0 (LSB - 1ler)' } },
      { id: 'a', dir: 'out', label: 'a', description: 'Segment a', descriptionI18n: { en: 'Segment a', tr: 'Segment a' } },
      { id: 'b', dir: 'out', label: 'b', description: 'Segment b', descriptionI18n: { en: 'Segment b', tr: 'Segment b' } },
      { id: 'c', dir: 'out', label: 'c', description: 'Segment c', descriptionI18n: { en: 'Segment c', tr: 'Segment c' } },
      { id: 'd', dir: 'out', label: 'd', description: 'Segment d', descriptionI18n: { en: 'Segment d', tr: 'Segment d' } },
      { id: 'e', dir: 'out', label: 'e', description: 'Segment e', descriptionI18n: { en: 'Segment e', tr: 'Segment e' } },
      { id: 'f', dir: 'out', label: 'f', description: 'Segment f', descriptionI18n: { en: 'Segment f', tr: 'Segment f' } },
      { id: 'g', dir: 'out', label: 'g', description: 'Segment g', descriptionI18n: { en: 'Segment g', tr: 'Segment g' } },
    ],
    defaultParams: { label: 'BCD→7SEG' },
    eval: (inputs) => {
      const b0 = inputs['in0'] === 1 ? 1 : 0;
      const b1 = inputs['in1'] === 1 ? 1 : 0;
      const b2 = inputs['in2'] === 1 ? 1 : 0;
      const b3 = inputs['in3'] === 1 ? 1 : 0;
      const val = (b3 << 3) | (b2 << 2) | (b1 << 1) | b0;

      const table: Record<number, Record<string, number>> = {
        0:  { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0 },
        1:  { a: 0, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
        2:  { a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1 },
        3:  { a: 1, b: 1, c: 1, d: 1, e: 0, f: 0, g: 1 },
        4:  { a: 0, b: 1, c: 1, d: 0, e: 0, f: 1, g: 1 },
        5:  { a: 1, b: 0, c: 1, d: 1, e: 0, f: 1, g: 1 },
        6:  { a: 1, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 },
        7:  { a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
        8:  { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1 },
        9:  { a: 1, b: 1, c: 1, d: 1, e: 0, f: 1, g: 1 },
        10: { a: 1, b: 1, c: 1, d: 0, e: 1, f: 1, g: 1 }, // A
        11: { a: 0, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 }, // b
        12: { a: 1, b: 0, c: 0, d: 1, e: 1, f: 1, g: 0 }, // C
        13: { a: 0, b: 1, c: 1, d: 1, e: 1, f: 0, g: 1 }, // d
        14: { a: 1, b: 0, c: 0, d: 1, e: 1, f: 1, g: 1 }, // E
        15: { a: 1, b: 0, c: 0, d: 0, e: 1, f: 1, g: 1 }, // F
      };

      const segs = table[val] ?? { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 };
      return {
        outputs: {
          a: segs.a ? 1 : 0,
          b: segs.b ? 1 : 0,
          c: segs.c ? 1 : 0,
          d: segs.d ? 1 : 0,
          e: segs.e ? 1 : 0,
          f: segs.f ? 1 : 0,
          g: segs.g ? 1 : 0,
        },
      };
    },
  },
  {
    type: 'BIN_TO_DEC',
    category: 'block',
    name: 'Binary to Decimal Decoder',
    nameI18n: { en: 'Binary to Decimal Decoder', tr: 'İkili → Ondalık Çözücü (4→10)' },
    description: '4-bit binary to 10 decimal lines (0-9) active high decoder',
    descriptionI18n: {
      en: '4-bit binary to 10 decimal lines (0-9) active high decoder',
      tr: '4-bit ikili girişi 10 adet aktif-yüksek ondalık (0-9) çıkış hattına dönüştürür'
    },
    pins: [
      { id: 'in3', dir: 'in', label: 'B3', description: 'Bit 3 (MSB)', descriptionI18n: { en: 'Bit 3 (MSB)', tr: 'Bit 3 (MSB)' } },
      { id: 'in2', dir: 'in', label: 'B2', description: 'Bit 2', descriptionI18n: { en: 'Bit 2', tr: 'Bit 2' } },
      { id: 'in1', dir: 'in', label: 'B1', description: 'Bit 1', descriptionI18n: { en: 'Bit 1', tr: 'Bit 1' } },
      { id: 'in0', dir: 'in', label: 'B0', description: 'Bit 0 (LSB)', descriptionI18n: { en: 'Bit 0 (LSB)', tr: 'Bit 0 (LSB)' } },
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `out${i}`,
        dir: 'out' as const,
        label: `${i}`,
        description: `Decimal Output ${i}`,
        descriptionI18n: { en: `Decimal Output ${i}`, tr: `Ondalık Çıkış ${i}` },
      })),
    ],
    defaultParams: { label: 'BIN→DEC' },
    eval: (inputs) => {
      const b0 = inputs['in0'] === 1 ? 1 : 0;
      const b1 = inputs['in1'] === 1 ? 1 : 0;
      const b2 = inputs['in2'] === 1 ? 1 : 0;
      const b3 = inputs['in3'] === 1 ? 1 : 0;
      const val = (b3 << 3) | (b2 << 2) | (b1 << 1) | b0;

      const outputs: Record<string, Signal> = {};
      for (let i = 0; i < 10; i++) {
        outputs[`out${i}`] = val === i ? 1 : 0;
      }
      return { outputs };
    },
  },
  {
    type: 'DEC_TO_BIN',
    category: 'block',
    name: 'Decimal to Binary Encoder',
    nameI18n: { en: 'Decimal to Binary Encoder', tr: 'Ondalık → İkili Kodlayıcı (10→4)' },
    description: '10 decimal lines (0-9) to 4-bit binary priority encoder',
    descriptionI18n: {
      en: '10 decimal lines (0-9) to 4-bit binary priority encoder',
      tr: '10 ondalık hattı (0-9) 4-bit ikili (binary) çıkışa dönüştüren öncelikli kodlayıcı'
    },
    pins: [
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `in${9 - i}`,
        dir: 'in' as const,
        label: `${9 - i}`,
        description: `Decimal Input ${9 - i}`,
        descriptionI18n: { en: `Decimal Input ${9 - i}`, tr: `Ondalık Giriş ${9 - i}` },
      })),
      { id: 'out3', dir: 'out', label: 'B3', description: 'Bit 3 (MSB)', descriptionI18n: { en: 'Bit 3 (MSB)', tr: 'Bit 3 (MSB)' } },
      { id: 'out2', dir: 'out', label: 'B2', description: 'Bit 2', descriptionI18n: { en: 'Bit 2', tr: 'Bit 2' } },
      { id: 'out1', dir: 'out', label: 'B1', description: 'Bit 1', descriptionI18n: { en: 'Bit 1', tr: 'Bit 1' } },
      { id: 'out0', dir: 'out', label: 'B0', description: 'Bit 0 (LSB)', descriptionI18n: { en: 'Bit 0 (LSB)', tr: 'Bit 0 (LSB)' } },
    ],
    defaultParams: { label: 'DEC→BIN' },
    eval: (inputs) => {
      let activeVal = 0;
      for (let i = 9; i >= 1; i--) {
        if (inputs[`in${i}`] === 1) {
          activeVal = i;
          break;
        }
      }
      return {
        outputs: {
          out0: (activeVal & 1) ? 1 : 0,
          out1: (activeVal & 2) ? 1 : 0,
          out2: (activeVal & 4) ? 1 : 0,
          out3: (activeVal & 8) ? 1 : 0,
        },
      };
    },
  },
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

  // ================= BUS / ROUTING =================
  {
    type: 'BUS_SPLIT',
    category: 'bus',
    name: 'Bus Splitter (8-Bit)',
    nameI18n: { en: 'Bus Splitter (8-Bit)', tr: 'Veri Yolu Ayırıcı (8-Bit)' },
    description: 'Splits 8-bit bus into 8 single-bit lines (OUT0 = LSB)',
    descriptionI18n: { en: 'Splits 8-bit bus into 8 single-bit lines (OUT0 = LSB)', tr: '8-bitlik veri yolunu 8 bağımsız tek-bit çıkışına ayırır (OUT0 = LSB)' },
    pins: [
      { id: 'in', dir: 'in', label: 'BUS', width: 8, description: '8-Bit Bus Input', descriptionI18n: { en: '8-Bit Bus Input', tr: '8-Bit Veri Yolu Girişi' } },
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `out${i}`,
        dir: 'out' as const,
        label: `${i}`,
        width: 1,
        description: `Bit ${i} Output`,
        descriptionI18n: { en: `Bit ${i} Output`, tr: `Bit ${i} Çıkışı` },
      })),
    ],
    defaultParams: { label: 'SPLIT-8' },
    eval: (inputs) => {
      const bus = normalizeToBus(inputs['in'], 8, 'Z');
      const outputs: Record<string, Signal> = {};
      for (let i = 0; i < 8; i++) {
        outputs[`out${i}`] = bus[i] ?? 'Z';
      }
      return { outputs };
    },
  },
  {
    type: 'BUS_MERGE',
    category: 'bus',
    name: 'Bus Merger (8-Bit)',
    nameI18n: { en: 'Bus Merger (8-Bit)', tr: 'Veri Yolu Birleştirici (8-Bit)' },
    description: 'Merges 8 single-bit lines into one 8-bit bus (IN0 = LSB)',
    descriptionI18n: { en: 'Merges 8 single-bit lines into one 8-bit bus (IN0 = LSB)', tr: '8 adet tek-bit giriş hattını tek bir 8-bitlik veri yolunda birleştirir (IN0 = LSB)' },
    pins: [
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `in${i}`,
        dir: 'in' as const,
        label: `${i}`,
        width: 1,
        description: `Bit ${i} Input`,
        descriptionI18n: { en: `Bit ${i} Input`, tr: `Bit ${i} Girişi` },
      })),
      { id: 'out', dir: 'out', label: 'BUS', width: 8, description: '8-Bit Bus Output', descriptionI18n: { en: '8-Bit Bus Output', tr: '8-Bit Veri Yolu Çıkışı' } },
    ],
    defaultParams: { label: 'MERGE-8' },
    eval: (inputs) => {
      const bus: BitSignal[] = [];
      for (let i = 0; i < 8; i++) {
        bus.push(normalizeToBit(inputs[`in${i}`], 0));
      }
      return { outputs: { out: bus } };
    },
  },
  {
    type: 'BUS_CONST',
    category: 'bus',
    name: 'Constant 8-Bit Bus',
    nameI18n: { en: 'Constant 8-Bit Bus', tr: 'Sabit 8-Bit Veri Yolu' },
    description: 'Outputs constant 8-bit value (configurable in hex/dec)',
    descriptionI18n: { en: 'Outputs constant 8-bit value (configurable in hex/dec)', tr: 'Sürekli sabit 8-bitlik değer (0-255 / 0x00-0xFF) üretir' },
    pins: [
      { id: 'out', dir: 'out', label: 'BUS', width: 8, description: '8-Bit Bus Output', descriptionI18n: { en: '8-Bit Bus Output', tr: '8-Bit Veri Yolu Çıkışı' } },
    ],
    defaultParams: { value: 0, label: '0x00' },
    eval: (_inputs, _state, params) => {
      const val = Number(params?.value) || 0;
      return { outputs: { out: numberToBus(val, 8) } };
    },
  },

  // ================= MULTIPLEXERS & DEMULTIPLEXERS =================
  {
    type: 'MUX_2',
    category: 'mux',
    name: '2:1 Multiplexer (1-Bit)',
    nameI18n: { en: '2:1 Multiplexer (1-Bit)', tr: '2:1 Çoklayıcı (1-Bit Mux)' },
    description: 'Selects between D0 (SEL=0) and D1 (SEL=1)',
    descriptionI18n: { en: 'Selects between D0 (SEL=0) and D1 (SEL=1)', tr: 'Seçim sinyaline göre D0 (SEL=0) veya D1 (SEL=1) girişini çıkışa aktarır' },
    pins: [
      { id: 'd0', dir: 'in', label: 'D0', description: 'Data Input 0', descriptionI18n: { en: 'Data Input 0', tr: 'Veri Girişi 0' } },
      { id: 'd1', dir: 'in', label: 'D1', description: 'Data Input 1', descriptionI18n: { en: 'Data Input 1', tr: 'Veri Girişi 1' } },
      { id: 'sel', dir: 'in', label: 'SEL', description: 'Select Input', descriptionI18n: { en: 'Select Input', tr: 'Seçim Girişi' } },
      { id: 'out', dir: 'out', label: 'Y', description: 'Mux Output', descriptionI18n: { en: 'Mux Output', tr: 'Mux Çıkışı' } },
    ],
    defaultParams: { label: 'MUX 2:1' },
    eval: (inputs) => {
      const sel = inputs['sel'];
      const d0 = inputs['d0'] ?? 'Z';
      const d1 = inputs['d1'] ?? 'Z';
      if (sel === 1) return { outputs: { out: d1 } };
      if (sel === 0) return { outputs: { out: d0 } };
      if (d0 === d1) return { outputs: { out: d0 } };
      return { outputs: { out: 'X' } };
    },
  },
  {
    type: 'MUX_2x8',
    category: 'mux',
    name: '2:1 Bus Multiplexer (8-Bit)',
    nameI18n: { en: '2:1 Bus Multiplexer (8-Bit)', tr: '2:1 Veri Yolu Çoklayıcı (8-Bit Bus Mux)' },
    description: 'Selects between 8-bit bus D0 (SEL=0) and D1 (SEL=1)',
    descriptionI18n: { en: 'Selects between 8-bit bus D0 (SEL=0) and D1 (SEL=1)', tr: '8-bitlik iki veri yolundan birini seçer: SEL=0 ise D0, SEL=1 ise D1' },
    pins: [
      { id: 'd0', dir: 'in', label: 'D0', width: 8, description: '8-Bit Input 0', descriptionI18n: { en: '8-Bit Input 0', tr: '8-Bit Giriş 0' } },
      { id: 'd1', dir: 'in', label: 'D1', width: 8, description: '8-Bit Input 1', descriptionI18n: { en: '8-Bit Input 1', tr: '8-Bit Giriş 1' } },
      { id: 'sel', dir: 'in', label: 'SEL', width: 1, description: 'Select Control', descriptionI18n: { en: 'Select Control', tr: 'Seçim Kontrolü' } },
      { id: 'out', dir: 'out', label: 'Y', width: 8, description: '8-Bit Output', descriptionI18n: { en: '8-Bit Output', tr: '8-Bit Çıkış' } },
    ],
    defaultParams: { label: 'MUX 2x8' },
    eval: (inputs) => {
      const sel = inputs['sel'];
      const d0 = normalizeToBus(inputs['d0'], 8, 'Z');
      const d1 = normalizeToBus(inputs['d1'], 8, 'Z');
      if (sel === 1) return { outputs: { out: d1 } };
      if (sel === 0) return { outputs: { out: d0 } };
      const out: BitSignal[] = [];
      for (let i = 0; i < 8; i++) {
        out.push(d0[i] === d1[i] ? d0[i] : 'X');
      }
      return { outputs: { out } };
    },
  },
  {
    type: 'MUX_4',
    category: 'mux',
    name: '4:1 Multiplexer (1-Bit)',
    nameI18n: { en: '4:1 Multiplexer (1-Bit)', tr: '4:1 Çoklayıcı (4:1 Mux)' },
    description: 'Selects between D0..D3 with 2-bit select (S1, S0)',
    descriptionI18n: { en: 'Selects between D0..D3 with 2-bit select (S1, S0)', tr: '2-bit seçim hattı (S1, S0) ile 4 girişten birini çıkışa aktarır' },
    pins: [
      { id: 'd0', dir: 'in', label: 'D0', description: 'Data Input 0', descriptionI18n: { en: 'Data Input 0', tr: 'Veri Girişi 0' } },
      { id: 'd1', dir: 'in', label: 'D1', description: 'Data Input 1', descriptionI18n: { en: 'Data Input 1', tr: 'Veri Girişi 1' } },
      { id: 'd2', dir: 'in', label: 'D2', description: 'Data Input 2', descriptionI18n: { en: 'Data Input 2', tr: 'Veri Girişi 2' } },
      { id: 'd3', dir: 'in', label: 'D3', description: 'Data Input 3', descriptionI18n: { en: 'Data Input 3', tr: 'Veri Girişi 3' } },
      { id: 's0', dir: 'in', label: 'S0', description: 'Select Bit 0 (LSB)', descriptionI18n: { en: 'Select Bit 0 (LSB)', tr: 'Seçim Biti 0 (En düşük anlamlı)' } },
      { id: 's1', dir: 'in', label: 'S1', description: 'Select Bit 1 (MSB)', descriptionI18n: { en: 'Select Bit 1 (MSB)', tr: 'Seçim Biti 1 (En yüksek anlamlı)' } },
      { id: 'out', dir: 'out', label: 'Y', description: 'Multiplexer Output', descriptionI18n: { en: 'Multiplexer Output', tr: 'Çoklayıcı Çıkışı' } },
    ],
    defaultParams: { label: 'MUX 4:1' },
    eval: (inputs) => {
      const s0 = inputs['s0'];
      const s1 = inputs['s1'];
      if (s0 === 'X' || s0 === 'Z' || s1 === 'X' || s1 === 'Z') {
        return { outputs: { out: 'X' } };
      }
      const idx = (s1 === 1 ? 2 : 0) + (s0 === 1 ? 1 : 0);
      return { outputs: { out: inputs[`d${idx}`] ?? 'Z' } };
    },
  },
  {
    type: 'MUX_8',
    category: 'mux',
    name: '8:1 Multiplexer (1-Bit)',
    nameI18n: { en: '8:1 Multiplexer (1-Bit)', tr: '8:1 Çoklayıcı (8:1 Mux)' },
    description: 'Selects between D0..D7 with 3-bit select (S2, S1, S0)',
    descriptionI18n: { en: 'Selects between D0..D7 with 3-bit select (S2, S1, S0)', tr: '3-bit seçim hattı (S2, S1, S0) ile 8 girişten birini çıkışa aktarır' },
    pins: [
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `d${i}`,
        dir: 'in' as const,
        label: `D${i}`,
        description: `Data Input ${i}`,
        descriptionI18n: { en: `Data Input ${i}`, tr: `Veri Girişi ${i}` },
      })),
      { id: 's0', dir: 'in', label: 'S0', description: 'Select Bit 0 (LSB)', descriptionI18n: { en: 'Select Bit 0 (LSB)', tr: 'Seçim Biti 0 (En düşük anlamlı)' } },
      { id: 's1', dir: 'in', label: 'S1', description: 'Select Bit 1', descriptionI18n: { en: 'Select Bit 1', tr: 'Seçim Biti 1' } },
      { id: 's2', dir: 'in', label: 'S2', description: 'Select Bit 2 (MSB)', descriptionI18n: { en: 'Select Bit 2 (MSB)', tr: 'Seçim Biti 2 (En yüksek anlamlı)' } },
      { id: 'out', dir: 'out', label: 'Y', description: 'Multiplexer Output', descriptionI18n: { en: 'Multiplexer Output', tr: 'Çoklayıcı Çıkışı' } },
    ],
    defaultParams: { label: 'MUX 8:1' },
    eval: (inputs) => {
      const s0 = inputs['s0'];
      const s1 = inputs['s1'];
      const s2 = inputs['s2'];
      if (s0 === 'X' || s0 === 'Z' || s1 === 'X' || s1 === 'Z' || s2 === 'X' || s2 === 'Z') {
        return { outputs: { out: 'X' } };
      }
      const idx = (s2 === 1 ? 4 : 0) + (s1 === 1 ? 2 : 0) + (s0 === 1 ? 1 : 0);
      return { outputs: { out: inputs[`d${idx}`] ?? 'Z' } };
    },
  },
  {
    type: 'DEMUX_1_2',
    category: 'mux',
    name: '1:2 Demultiplexer',
    nameI18n: { en: '1:2 Demultiplexer', tr: '1:2 Dağıtıcı (Demux)' },
    description: 'Routes IN to Y0 (SEL=0) or Y1 (SEL=1)',
    descriptionI18n: { en: 'Routes IN to Y0 (SEL=0) or Y1 (SEL=1)', tr: 'Giriş sinyalini SEL=0 iken Y0 çıkışına, SEL=1 iken Y1 çıkışına iletir' },
    pins: [
      { id: 'in', dir: 'in', label: 'IN', description: 'Data Input', descriptionI18n: { en: 'Data Input', tr: 'Veri Girişi' } },
      { id: 'sel', dir: 'in', label: 'SEL', description: 'Select Control', descriptionI18n: { en: 'Select Control', tr: 'Seçim Kontrolü' } },
      { id: 'out0', dir: 'out', label: 'Y0', description: 'Output 0 (when SEL=0)', descriptionI18n: { en: 'Output 0 (when SEL=0)', tr: 'Çıkış 0 (SEL=0 iken)' } },
      { id: 'out1', dir: 'out', label: 'Y1', description: 'Output 1 (when SEL=1)', descriptionI18n: { en: 'Output 1 (when SEL=1)', tr: 'Çıkış 1 (SEL=1 iken)' } },
    ],
    defaultParams: { label: 'DEMUX 1:2' },
    eval: (inputs) => {
      const sel = inputs['sel'];
      const val = inputs['in'] ?? 0;
      if (sel === 0) return { outputs: { out0: val, out1: 0 } };
      if (sel === 1) return { outputs: { out0: 0, out1: val } };
      return { outputs: { out0: 'X', out1: 'X' } };
    },
  },

  // ================= REGISTERS & FLIP-FLOPS =================
  {
    type: 'D_FF_RESET',
    category: 'sequential',
    name: 'D Flip-Flop with Async Clear',
    nameI18n: { en: 'D Flip-Flop with Async Clear', tr: 'Asenkron Sıfırlamalı D Flip-Flop' },
    description: 'D-FF with asynchronous CLR (CLR=1 resets Q to 0 immediately)',
    descriptionI18n: { en: 'D-FF with asynchronous CLR (CLR=1 resets Q to 0 immediately)', tr: 'Asenkron CLR girişli D-FF (CLR=1 iken saatten bağımsız anında sıfırlar)' },
    pins: [
      { id: 'd', dir: 'in', label: 'D', description: 'Data Input', descriptionI18n: { en: 'Data Input', tr: 'Veri Girişi' } },
      { id: 'clk', dir: 'in', label: 'CLK', description: 'Clock Input', descriptionI18n: { en: 'Clock Input', tr: 'Saat Girişi' } },
      { id: 'clr', dir: 'in', label: 'CLR', description: 'Asynchronous Clear (Active High)', descriptionI18n: { en: 'Asynchronous Clear (Active High)', tr: 'Asenkron Sıfırlama (Aktif Yüksek)' } },
      { id: 'q', dir: 'out', label: 'Q', description: 'Normal Output Q', descriptionI18n: { en: 'Normal Output Q', tr: 'Normal Çıkış Q' } },
      { id: 'qbar', dir: 'out', label: 'Q̄', description: 'Inverted Output Q̄', descriptionI18n: { en: 'Inverted Output Q̄', tr: 'Ters Çıkış Q̄' } },
    ],
    defaultParams: { label: 'D-FF (CLR)' },
    defaultState: { q: 0, lastClk: 0 },
    eval: (_inputs, state) => {
      const q = state?.q ?? 0;
      return {
        outputs: {
          q: q === 1 ? 1 : 0,
          qbar: q === 1 ? 0 : 1,
        },
        state,
      };
    },
  },
  {
    type: 'D_FF_ENABLE',
    category: 'sequential',
    name: 'D Flip-Flop with Enable',
    nameI18n: { en: 'D Flip-Flop with Enable', tr: 'Yetkilendirmeli (Enable) D Flip-Flop' },
    description: 'D-FF that only updates on clock edge when EN=1',
    descriptionI18n: { en: 'D-FF that only updates on clock edge when EN=1', tr: 'Yalnızca EN=1 iken saat darbesinde güncellenen D-FF' },
    pins: [
      { id: 'd', dir: 'in', label: 'D', description: 'Data Input', descriptionI18n: { en: 'Data Input', tr: 'Veri Girişi' } },
      { id: 'clk', dir: 'in', label: 'CLK', description: 'Clock Input', descriptionI18n: { en: 'Clock Input', tr: 'Saat Girişi' } },
      { id: 'en', dir: 'in', label: 'EN', description: 'Clock Enable', descriptionI18n: { en: 'Clock Enable', tr: 'Saat Yetkilendirme' } },
      { id: 'q', dir: 'out', label: 'Q', description: 'Normal Output Q', descriptionI18n: { en: 'Normal Output Q', tr: 'Normal Çıkış Q' } },
      { id: 'qbar', dir: 'out', label: 'Q̄', description: 'Inverted Output Q̄', descriptionI18n: { en: 'Inverted Output Q̄', tr: 'Ters Çıkış Q̄' } },
    ],
    defaultParams: { label: 'D-FF (EN)' },
    defaultState: { q: 0, lastClk: 0 },
    eval: (_inputs, state) => {
      const q = state?.q ?? 0;
      return {
        outputs: {
          q: q === 1 ? 1 : 0,
          qbar: q === 1 ? 0 : 1,
        },
        state,
      };
    },
  },
  {
    type: 'REGISTER_8',
    category: 'sequential',
    name: '8-Bit Register with Load & Async Clear',
    nameI18n: { en: '8-Bit Register with Load & Async Clear', tr: 'Asenkron Sıfırlamalı ve Yüklemeli 8-Bit Kütük' },
    description: '8-bit register with asynchronous active-high clear and synchronous clock-edge load (when CLR=0 and LOAD=1).',
    descriptionI18n: {
      en: '8-bit register with asynchronous active-high clear and synchronous clock-edge load (when CLR=0 and LOAD=1).',
      tr: 'Asenkron aktif-yüksek sıfırlama (CLR=1) ve yükselen saat kenarında senkron yükleme (CLR=0, LOAD=1) yapan 8-bit kütük.',
    },
    pins: [
      { id: 'd', dir: 'in', label: 'D', width: 8, description: '8-Bit Data Input', descriptionI18n: { en: '8-Bit Data Input', tr: '8-Bit Veri Girişi' } },
      { id: 'clk', dir: 'in', label: 'CLK', width: 1, description: 'Clock Input', descriptionI18n: { en: 'Clock Input', tr: 'Saat Girişi' } },
      { id: 'load', dir: 'in', label: 'LD', width: 1, description: 'Load Enable', descriptionI18n: { en: 'Load Enable', tr: 'Yükleme Yetkilendirme' } },
      { id: 'clr', dir: 'in', label: 'CLR', width: 1, description: 'Async Clear', descriptionI18n: { en: 'Async Clear', tr: 'Asenkron Sıfırlama' } },
      { id: 'q', dir: 'out', label: 'Q', width: 8, description: '8-Bit Data Output', descriptionI18n: { en: '8-Bit Data Output', tr: '8-Bit Veri Çıkışı' } },
    ],
    defaultParams: { label: 'REG-8' },
    defaultState: { q: [0, 0, 0, 0, 0, 0, 0, 0], lastClk: 0 },
    eval: (_inputs, state) => {
      const q = Array.isArray(state?.q) ? state.q : [0, 0, 0, 0, 0, 0, 0, 0];
      return {
        outputs: { q },
        state,
      };
    },
  },

  // ================= 8-BIT ARITHMETIC =================
  {
    type: 'ADDER_8',
    category: 'arithmetic',
    name: '8-Bit Full Adder',
    nameI18n: { en: '8-Bit Full Adder', tr: '8-Bit Tam Toplayıcı' },
    description: 'Computes S[7:0] = A + B + CIN with Carry-out and Overflow flags',
    descriptionI18n: { en: 'Computes S[7:0] = A + B + CIN with Carry-out and Overflow flags', tr: 'A ve B 8-bitlik sayılarını CIN ile toplar: S = A + B + CIN. COUT ve OVF bayrakları üretir.' },
    pins: [
      { id: 'a', dir: 'in', label: 'A', width: 8, description: '8-Bit Input A', descriptionI18n: { en: '8-Bit Input A', tr: '8-Bit A Girişi' } },
      { id: 'b', dir: 'in', label: 'B', width: 8, description: '8-Bit Input B', descriptionI18n: { en: '8-Bit Input B', tr: '8-Bit B Girişi' } },
      { id: 'cin', dir: 'in', label: 'CIN', width: 1, description: 'Carry In', descriptionI18n: { en: 'Carry In', tr: 'Elde Girişi' } },
      { id: 's', dir: 'out', label: 'S', width: 8, description: '8-Bit Sum Output', descriptionI18n: { en: '8-Bit Sum Output', tr: '8-Bit Toplam Çıkışı' } },
      { id: 'cout', dir: 'out', label: 'COUT', width: 1, description: 'Carry Out', descriptionI18n: { en: 'Carry Out', tr: 'Elde Çıkışı' } },
      { id: 'ovf', dir: 'out', label: 'OVF', width: 1, description: 'Signed Overflow', descriptionI18n: { en: 'Signed Overflow', tr: 'İşaretli Taşma Bayrağı' } },
    ],
    defaultParams: { label: 'ADDER-8' },
    eval: (inputs) => {
      const a = normalizeToBus(inputs['a'], 8, 0);
      const b = normalizeToBus(inputs['b'], 8, 0);
      let carry: BitSignal = normalizeToBit(inputs['cin'], 0);

      const s: BitSignal[] = [];
      let c6: BitSignal = 0;
      let c7: BitSignal = 0;

      for (let i = 0; i < 8; i++) {
        const ai = a[i];
        const bi = b[i];
        if (ai === 'X' || bi === 'X' || carry === 'X') {
          s.push('X');
          carry = 'X';
        } else {
          const aBit = ai === 1 ? 1 : 0;
          const bBit = bi === 1 ? 1 : 0;
          const cBit = carry === 1 ? 1 : 0;
          const sum = aBit ^ bBit ^ cBit;
          const nextCarry = (aBit & bBit) | (cBit & (aBit ^ bBit));
          s.push(sum === 1 ? 1 : 0);
          carry = nextCarry === 1 ? 1 : 0;
        }
        if (i === 6) c6 = carry;
        if (i === 7) c7 = carry;
      }

      let ovf: BitSignal = 'X';
      if (c6 !== 'X' && c7 !== 'X') {
        ovf = ((c6 === 1 ? 1 : 0) ^ (c7 === 1 ? 1 : 0)) === 1 ? 1 : 0;
      }

      return {
        outputs: {
          s,
          cout: carry,
          ovf,
        },
      };
    },
  },
  {
    type: 'ZERO_DETECT_8',
    category: 'arithmetic',
    name: '8-Bit Zero Detector',
    nameI18n: { en: '8-Bit Zero Detector', tr: '8-Bit Sıfır Algılayıcı' },
    description: 'Outputs 1 if all 8 bits of input bus are 0',
    descriptionI18n: { en: 'Outputs 1 if all 8 bits of input bus are 0', tr: '8-bitlik giriş veri yolunun tüm bitleri 0 ise 1 (Zero Flag) üretir' },
    pins: [
      { id: 'in', dir: 'in', label: 'IN', width: 8, description: '8-Bit Bus Input', descriptionI18n: { en: '8-Bit Bus Input', tr: '8-Bit Veri Yolu Girişi' } },
      { id: 'zero', dir: 'out', label: 'Z', width: 1, description: 'Zero Flag Output', descriptionI18n: { en: 'Zero Flag Output', tr: 'Sıfır Bayrağı Çıkışı' } },
    ],
    defaultParams: { label: 'ZERO?' },
    eval: (inputs) => {
      const bus = normalizeToBus(inputs['in'], 8, 0);
      if (bus.includes('X')) return { outputs: { zero: 'X' } };
      const isZero = bus.every((b) => b === 0);
      return { outputs: { zero: isZero ? 1 : 0 } };
    },
  },

  // ================= 8-BIT INPUT & OUTPUT =================
  {
    type: 'DIP_SWITCH_8',
    category: 'io',
    name: '8-Bit DIP Switch',
    nameI18n: { en: '8-Bit DIP Switch', tr: '8-Bit DIP Anahtar' },
    description: '8 independent micro switches outputting an 8-bit bus',
    descriptionI18n: { en: '8 independent micro switches outputting an 8-bit bus', tr: '8 bağımsız mikro anahtar ile 8-bitlik veri yolu üretir' },
    pins: [
      { id: 'out', dir: 'out', label: 'BUS', width: 8, description: '8-Bit Bus Output', descriptionI18n: { en: '8-Bit Bus Output', tr: '8-Bit Veri Yolu Çıkışı' } },
    ],
    defaultParams: { bits: [0, 0, 0, 0, 0, 0, 0, 0], label: 'DIP-8' },
    eval: (_inputs, _state, params) => {
      const bits = Array.isArray(params?.bits) ? params.bits : [0, 0, 0, 0, 0, 0, 0, 0];
      return { outputs: { out: bits } };
    },
  },
  {
    type: 'BYTE_INPUT',
    category: 'io',
    name: '8-Bit Byte Input',
    nameI18n: { en: '8-Bit Byte Input', tr: '8-Bit Sayısal Giriş (Byte In)' },
    description: 'Numeric 0-255 / 0x00-0xFF input generator',
    descriptionI18n: { en: 'Numeric 0-255 / 0x00-0xFF input generator', tr: '0-255 / 0x00-0xFF arası sayı girilebilen 8-bit veri üreteci' },
    pins: [
      { id: 'out', dir: 'out', label: 'BUS', width: 8, description: '8-Bit Bus Output', descriptionI18n: { en: '8-Bit Bus Output', tr: '8-Bit Veri Yolu Çıkışı' } },
    ],
    defaultParams: { value: 0, label: 'Byte In' },
    eval: (_inputs, _state, params) => {
      const val = Math.max(0, Math.min(255, Number(params?.value) || 0));
      return { outputs: { out: numberToBus(val, 8) } };
    },
  },
  {
    type: 'MANUAL_CLOCK',
    category: 'io',
    name: 'Manual Step Clock Button',
    nameI18n: { en: 'Manual Step Clock Button', tr: 'Manuel Adım Saati Butonu' },
    description: 'Generates a clean rising edge pulse upon click for single-step debugging',
    descriptionI18n: { en: 'Generates a clean rising edge pulse upon click for single-step debugging', tr: 'Her basışta tek bir temiz saat darbesi üretir; adım adım hata ayıklama içindir' },
    pins: [
      { id: 'out', dir: 'out', label: 'CLK', width: 1, description: 'Clock Pulse Output', descriptionI18n: { en: 'Clock Pulse Output', tr: 'Saat Darbesi Çıkışı' } },
    ],
    defaultParams: { high: false, label: 'Step CLK' },
    eval: (_inputs, _state, params) => ({
      outputs: { out: params?.high ? 1 : 0 },
    }),
  },
  {
    type: 'BYTE_DISPLAY',
    category: 'display',
    name: '8-Bit Byte Display',
    nameI18n: { en: '8-Bit Byte Display', tr: '8-Bit Dijital Gösterge' },
    description: 'Displays 8-bit bus in DEC, HEX, or BIN mode',
    descriptionI18n: { en: 'Displays 8-bit bus in DEC, HEX, or BIN mode', tr: '8-bitlik veri yolunu DEC (0-255), HEX (0x00-0xFF) veya BIN modunda gösterir' },
    pins: [
      { id: 'in', dir: 'in', label: 'BUS', width: 8, description: '8-Bit Bus Input', descriptionI18n: { en: '8-Bit Bus Input', tr: '8-Bit Veri Yolu Girişi' } },
    ],
    defaultParams: { mode: 'HEX', label: 'Byte Disp' },
    eval: (inputs) => {
      const bus = normalizeToBus(inputs['in'], 8, 0);
      return { outputs: {}, state: { bus } };
    },
  },
  {
    type: 'LED_BAR_8',
    category: 'display',
    name: '8-Bit LED Bar',
    nameI18n: { en: '8-Bit LED Bar', tr: '8-Bit LED Çubuğu' },
    description: 'Displays 8 individual optical LED indicators for each bit',
    descriptionI18n: { en: 'Displays 8 individual optical LED indicators for each bit', tr: '8 bitlik veri yolunun her bir bitini ayrı ayrı yanan LED çubuğu şeklinde gösterir' },
    pins: [
      { id: 'in', dir: 'in', label: 'BUS', width: 8, description: '8-Bit Bus Input', descriptionI18n: { en: '8-Bit Bus Input', tr: '8-Bit Veri Yolu Girişi' } },
    ],
    defaultParams: { label: 'LED Bar 8', color: '#10b981' },
    eval: (inputs) => {
      const bus = normalizeToBus(inputs['in'], 8, 0);
      return { outputs: {}, state: { bus } };
    },
  },
  {
    type: 'BUS_PROBE',
    category: 'display',
    name: '8-Bit Bus Probe',
    nameI18n: { en: '8-Bit Bus Probe', tr: '8-Bit Veri Yolu Probu' },
    description: 'Compact probe displaying 8-bit bus values in HEX, DEC, or BIN for testing and logic analysis',
    descriptionI18n: {
      en: 'Compact probe displaying 8-bit bus values in HEX, DEC, or BIN for testing and logic analysis',
      tr: 'Test ve zaman analizleri için 8-bitlik veri yolu değerini HEX, DEC veya BIN modunda gösteren prob',
    },
    pins: [
      { id: 'in', dir: 'in', label: 'BUS', width: 8, description: '8-Bit Bus Input', descriptionI18n: { en: '8-Bit Bus Input', tr: '8-Bit Veri Yolu Girişi' } },
    ],
    defaultParams: { mode: 'HEX', label: 'PROBE-8' },
    eval: (inputs) => {
      const bus = normalizeToBus(inputs['in'], 8, 0);
      return { outputs: {}, state: { bus } };
    },
  },
  {
    type: 'LABEL',
    category: 'io',
    name: 'Text Annotation Label',
    nameI18n: { en: 'Text Annotation Label', tr: 'Metin Etiketi / Not' },
    description: 'Freeform text note on canvas to document signals, buses, and control blocks',
    descriptionI18n: {
      en: 'Freeform text note on canvas to document signals, buses, and control blocks',
      tr: 'Sinyalleri, veri yollarını ve kontrol bloklarını açıklamak için tuval üzerine metin notu ekler',
    },
    pins: [],
    defaultParams: { label: 'LABEL' },
    eval: () => ({ outputs: {} }),
  },
];

export const REGISTRY = new Map<string, ComponentDef>(
  COMPONENT_DEFINITIONS.map((def) => [def.type, def])
);

export function getComponentDef(type: string): ComponentDef | undefined {
  return REGISTRY.get(type);
}

/**
 * Resolves the effective pins for a component instance, supporting dynamic input counts (2..8) for logic gates.
 */
export function getComponentPins(
  def: ComponentDef,
  params?: Record<string, any>
): PinDef[] {
  const rawInputs = params?.inputs ?? def.defaultParams?.inputs;
  if (def.category === 'gate' && typeof rawInputs === 'number') {
    const numInputs = Math.max(2, Math.min(8, Math.round(rawInputs)));
    const inPins: PinDef[] = [];
    for (let i = 0; i < numInputs; i++) {
      const label = String.fromCharCode(65 + i); // A, B, C, D, E, F, G, H
      inPins.push({
        id: `in${i}`,
        dir: 'in',
        label,
        description: `Input ${label}`,
        descriptionI18n: { en: `Input ${label}`, tr: `${label} Girişi` },
      });
    }
    const outPins = def.pins.filter((p) => p.dir !== 'in');
    return [...inPins, ...outPins];
  }
  return def.pins;
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
