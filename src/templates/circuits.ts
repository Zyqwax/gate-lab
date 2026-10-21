import { CircuitModel } from '../engine/types';
import { Locale } from '../i18n/translations';

export interface LocalizedText {
  en: string;
  tr: string;
}

export interface CircuitTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  nameI18n?: LocalizedText;
  categoryI18n?: LocalizedText;
  descriptionI18n?: LocalizedText;
  circuit: CircuitModel;
}

export const TEMPLATES: CircuitTemplate[] = [
  {
    id: 'full-adder',
    name: 'Full Adder (1-Bit)',
    category: 'Arithmetic Circuits',
    description: '1-bit full adder built with 2 XOR, 2 AND, and 1 OR gates. Adds inputs A, B and Carry-In (Cin) to produce Sum (Σ) and Carry-Out (Cout).',
    nameI18n: {
      en: 'Full Adder (1-Bit)',
      tr: 'Full Adder (Tam Toplayıcı)',
    },
    categoryI18n: {
      en: 'Arithmetic Circuits',
      tr: 'Aritmetik Devreler',
    },
    descriptionI18n: {
      en: '1-bit full adder built with 2 XOR, 2 AND, and 1 OR gates. Adds inputs A, B and Carry-In (Cin) to produce Sum (Σ) and Carry-Out (Cout).',
      tr: '2 adet XOR, 2 adet AND ve 1 adet OR kapısı ile oluşturulmuş 1-bit tam toplayıcı devresi. A, B ve Elde Girişi (Cin) toplanarak Toplam (Σ) ve Elde Çıkışı (Cout) üretir.',
    },
    circuit: {
      version: 1,
      mode: 'sandbox',
      components: [
        // Inputs (Left)
        { id: 'sw_a', type: 'SWITCH', x: 60, y: 100, params: { state: 1, label: 'Input A' } },
        { id: 'sw_b', type: 'SWITCH', x: 60, y: 220, params: { state: 1, label: 'Input B' } },
        { id: 'sw_cin', type: 'SWITCH', x: 60, y: 340, params: { state: 0, label: 'Carry-In (Cin)' } },

        // Stage 1 Gates
        { id: 'xor_1', type: 'XOR', x: 300, y: 130, params: { label: 'XOR 1 (A ⊕ B)' } },
        { id: 'and_1', type: 'AND', x: 300, y: 270, params: { label: 'AND 1 (A · B)' } },

        // Stage 2 Gates
        { id: 'xor_2', type: 'XOR', x: 560, y: 180, params: { label: 'XOR 2 (Sum)' } },
        { id: 'and_2', type: 'AND', x: 560, y: 340, params: { label: 'AND 2 (Int Carry)' } },

        // Stage 3 Gate
        { id: 'or_1', type: 'OR', x: 780, y: 300, params: { label: 'OR (Carry-Out)' } },

        // Outputs (Right)
        { id: 'led_sum', type: 'LED', x: 800, y: 180, params: { label: 'Sum (Σ)', color: '#10b981' } },
        { id: 'led_cout', type: 'LED', x: 960, y: 300, params: { label: 'Carry-Out (Cout)', color: '#38bdf8' } },
      ],
      wires: [
        // A connections
        { id: 'w_a_xor1', from: { comp: 'sw_a', pin: 'out' }, to: { comp: 'xor_1', pin: 'in0' } },
        { id: 'w_a_and1', from: { comp: 'sw_a', pin: 'out' }, to: { comp: 'and_1', pin: 'in0' } },

        // B connections
        { id: 'w_b_xor1', from: { comp: 'sw_b', pin: 'out' }, to: { comp: 'xor_1', pin: 'in1' } },
        { id: 'w_b_and1', from: { comp: 'sw_b', pin: 'out' }, to: { comp: 'and_1', pin: 'in1' } },

        // XOR 1 output to XOR 2 and AND 2
        { id: 'w_xor1_xor2', from: { comp: 'xor_1', pin: 'out' }, to: { comp: 'xor_2', pin: 'in0' } },
        { id: 'w_xor1_and2', from: { comp: 'xor_1', pin: 'out' }, to: { comp: 'and_2', pin: 'in0' } },

        // Cin connections to XOR 2 and AND 2
        { id: 'w_cin_xor2', from: { comp: 'sw_cin', pin: 'out' }, to: { comp: 'xor_2', pin: 'in1' } },
        { id: 'w_cin_and2', from: { comp: 'sw_cin', pin: 'out' }, to: { comp: 'and_2', pin: 'in1' } },

        // Sum output
        { id: 'w_sum_led', from: { comp: 'xor_2', pin: 'out' }, to: { comp: 'led_sum', pin: 'in' } },

        // Cout logic (AND 1 and AND 2 into OR)
        { id: 'w_and1_or', from: { comp: 'and_1', pin: 'out' }, to: { comp: 'or_1', pin: 'in0' } },
        { id: 'w_and2_or', from: { comp: 'and_2', pin: 'out' }, to: { comp: 'or_1', pin: 'in1' } },

        // Cout output
        { id: 'w_cout_led', from: { comp: 'or_1', pin: 'out' }, to: { comp: 'led_cout', pin: 'in' } },
      ],
    },
  },
  {
    id: 'half-adder',
    name: 'Half Adder',
    category: 'Arithmetic Circuits',
    description: 'Basic binary adder that adds two single bits using 1 XOR gate (Sum) and 1 AND gate (Carry).',
    nameI18n: {
      en: 'Half Adder',
      tr: 'Half Adder (Yarım Toplayıcı)',
    },
    categoryI18n: {
      en: 'Arithmetic Circuits',
      tr: 'Aritmetik Devreler',
    },
    descriptionI18n: {
      en: 'Basic binary adder that adds two single bits using 1 XOR gate (Sum) and 1 AND gate (Carry).',
      tr: '1 adet XOR ve 1 adet AND kapısı ile iki biti toplayan temel toplayıcı devresi.',
    },
    circuit: {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'ha_sw_a', type: 'SWITCH', x: 80, y: 120, params: { state: 1, label: 'Input A' } },
        { id: 'ha_sw_b', type: 'SWITCH', x: 80, y: 240, params: { state: 0, label: 'Input B' } },
        { id: 'ha_xor', type: 'XOR', x: 300, y: 120, params: { label: 'XOR (Sum)' } },
        { id: 'ha_and', type: 'AND', x: 300, y: 240, params: { label: 'AND (Carry)' } },
        { id: 'ha_led_sum', type: 'LED', x: 500, y: 120, params: { label: 'Sum', color: '#10b981' } },
        { id: 'ha_led_carry', type: 'LED', x: 500, y: 240, params: { label: 'Carry', color: '#38bdf8' } },
      ],
      wires: [
        { id: 'hw_a_xor', from: { comp: 'ha_sw_a', pin: 'out' }, to: { comp: 'ha_xor', pin: 'in0' } },
        { id: 'hw_a_and', from: { comp: 'ha_sw_a', pin: 'out' }, to: { comp: 'ha_and', pin: 'in0' } },
        { id: 'hw_b_xor', from: { comp: 'ha_sw_b', pin: 'out' }, to: { comp: 'ha_xor', pin: 'in1' } },
        { id: 'hw_b_and', from: { comp: 'ha_sw_b', pin: 'out' }, to: { comp: 'ha_and', pin: 'in1' } },
        { id: 'hw_xor_sum', from: { comp: 'ha_xor', pin: 'out' }, to: { comp: 'ha_led_sum', pin: 'in' } },
        { id: 'hw_and_carry', from: { comp: 'ha_and', pin: 'out' }, to: { comp: 'ha_led_carry', pin: 'in' } },
      ],
    },
  },
  {
    id: 'sr-latch',
    name: 'SR Latch (Cross-Coupled NOR)',
    category: 'Sequential / Memory',
    description: '1-bit memory cell using cross-coupled NOR gates with Set, Reset, and Hold states. Demonstrates feedback loop simulation.',
    nameI18n: {
      en: 'SR Latch (Cross-Coupled NOR)',
      tr: 'SR Latch (Geri Beslemeli NOR Hafıza)',
    },
    categoryI18n: {
      en: 'Sequential / Memory',
      tr: 'Sıralı / Hafıza',
    },
    descriptionI18n: {
      en: '1-bit memory cell using cross-coupled NOR gates with Set, Reset, and Hold states. Demonstrates feedback loop simulation.',
      tr: 'İki adet çapraz bağlı NOR kapısı ile 1-bit veri saklama (Set, Reset, Hold). Geri beslemeli simülasyon testi.',
    },
    circuit: {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'sr_sw_r', type: 'SWITCH', x: 80, y: 100, params: { state: 0, label: 'Reset (R)' } },
        { id: 'sr_sw_s', type: 'SWITCH', x: 80, y: 260, params: { state: 1, label: 'Set (S)' } },
        { id: 'sr_nor1', type: 'NOR', x: 300, y: 120, params: { label: 'NOR 1' } },
        { id: 'sr_nor2', type: 'NOR', x: 300, y: 240, params: { label: 'NOR 2' } },
        { id: 'sr_led_q', type: 'LED', x: 520, y: 120, params: { label: 'Q Output', color: '#10b981' } },
        { id: 'sr_led_qbar', type: 'LED', x: 520, y: 240, params: { label: 'Q̄ (Inverted)', color: '#f59e0b' } },
      ],
      wires: [
        { id: 'w_r_nor1', from: { comp: 'sr_sw_r', pin: 'out' }, to: { comp: 'sr_nor1', pin: 'in0' } },
        { id: 'w_s_nor2', from: { comp: 'sr_sw_s', pin: 'out' }, to: { comp: 'sr_nor2', pin: 'in1' } },
        // Feedback loops
        { id: 'w_fb_nor1_nor2', from: { comp: 'sr_nor1', pin: 'out' }, to: { comp: 'sr_nor2', pin: 'in0' } },
        { id: 'w_fb_nor2_nor1', from: { comp: 'sr_nor2', pin: 'out' }, to: { comp: 'sr_nor1', pin: 'in1' } },
        // Outputs
        { id: 'w_out_q', from: { comp: 'sr_nor1', pin: 'out' }, to: { comp: 'sr_led_q', pin: 'in' } },
        { id: 'w_out_qbar', from: { comp: 'sr_nor2', pin: 'out' }, to: { comp: 'sr_led_qbar', pin: 'in' } },
      ],
    },
  },
  {
    id: 'clocked-counter',
    name: 'Clock & D Flip-Flop Toggle',
    category: 'Sequential / Memory',
    description: 'Periodic clock generator feeding a D Flip-Flop with inverted Q̄ feedback to divide frequency by 2 and toggle states.',
    nameI18n: {
      en: 'Clock & D Flip-Flop Toggle',
      tr: 'Saat & D Flip-Flop Bölücü',
    },
    categoryI18n: {
      en: 'Sequential / Memory',
      tr: 'Sıralı / Hafıza',
    },
    descriptionI18n: {
      en: 'Periodic clock generator feeding a D Flip-Flop with inverted Q̄ feedback to divide frequency by 2 and toggle states.',
      tr: 'Saat üreteci (Clock) ve ters çevrilmiş Q̄ çıkışını D girişine bağlayarak frekans bölücü / 1-bit sayaç.',
    },
    circuit: {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'clk_gen', type: 'CLOCK', x: 80, y: 180, params: { frequency: 1, high: false, label: 'Clock (1 Hz)' } },
        { id: 'dff', type: 'D_FLIP_FLOP', x: 300, y: 140, params: { label: 'D Flip-Flop' } },
        { id: 'led_clk', type: 'LED', x: 300, y: 280, params: { label: 'Clock LED', color: '#38bdf8' } },
        { id: 'led_q', type: 'LED', x: 520, y: 120, params: { label: 'Q (Divided Clock)', color: '#10b981' } },
        { id: 'led_qbar', type: 'LED', x: 520, y: 220, params: { label: 'Q̄', color: '#f59e0b' } },
      ],
      wires: [
        { id: 'w_clk_dff', from: { comp: 'clk_gen', pin: 'out' }, to: { comp: 'dff', pin: 'clk' } },
        { id: 'w_clk_led', from: { comp: 'clk_gen', pin: 'out' }, to: { comp: 'led_clk', pin: 'in' } },
        // Feedback: Qbar back to D (toggles every clock cycle)
        { id: 'w_qbar_d', from: { comp: 'dff', pin: 'qbar' }, to: { comp: 'dff', pin: 'd' } },
        // Outputs
        { id: 'w_q_led', from: { comp: 'dff', pin: 'q' }, to: { comp: 'led_q', pin: 'in' } },
        { id: 'w_qbar_led', from: { comp: 'dff', pin: 'qbar' }, to: { comp: 'led_qbar', pin: 'in' } },
      ],
    },
  },
];

/**
 * Returns a template with name, category and description localized to the selected locale
 */
export function getLocalizedTemplate(tpl: CircuitTemplate, locale: Locale): CircuitTemplate {
  return {
    ...tpl,
    name: tpl.nameI18n ? (tpl.nameI18n[locale] || tpl.nameI18n.en) : tpl.name,
    category: tpl.categoryI18n ? (tpl.categoryI18n[locale] || tpl.categoryI18n.en) : tpl.category,
    description: tpl.descriptionI18n ? (tpl.descriptionI18n[locale] || tpl.descriptionI18n.en) : tpl.description,
  };
}

/**
 * Returns all templates with localized fields
 */
export function getLocalizedTemplates(locale: Locale): CircuitTemplate[] {
  return TEMPLATES.map((t) => getLocalizedTemplate(t, locale));
}
