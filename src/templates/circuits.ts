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
  {
    id: 'bcd-7segment',
    name: 'BCD to 7-Segment & Decimal Display',
    category: 'Displays & Converters',
    description: '4-bit BCD numeric input decoded into 7-segment display (a-g) and digital numeric readout.',
    nameI18n: {
      en: 'BCD to 7-Segment & Decimal Display',
      tr: 'BCD → 7-Segment Ekran & Sayısal Gösterge',
    },
    categoryI18n: {
      en: 'Displays & Converters',
      tr: 'Göstergeler & Dönüştürücüler',
    },
    descriptionI18n: {
      en: '4-bit BCD numeric input decoded into 7-segment display (a-g) and digital numeric readout.',
      tr: '4-bit BCD sayı girişi, BCD çözücü entegresi üzerinden 7-segment ekrana (a-g) ve sayısal göstergeye iletilir.',
    },
    circuit: {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'dec_in', type: 'DECIMAL_INPUT', x: 60, y: 180, params: { value: 7, label: 'Sayı Girişi' } },
        { id: 'bcd_dec', type: 'BCD_TO_7SEG', x: 380, y: 120, params: { label: 'BCD Çözücü' } },
        { id: 'disp_7seg', type: 'SEVEN_SEGMENT', x: 740, y: 80, params: { label: '7-Segment Ekran', color: '#ef4444' } },
        { id: 'disp_num', type: 'DECIMAL_DISPLAY', x: 740, y: 350, params: { label: 'Sayısal Ekran', color: '#10b981' } },
      ],
      wires: [
        // dec_in to bcd_dec
        { id: 'w_in_b3', from: { comp: 'dec_in', pin: 'out3' }, to: { comp: 'bcd_dec', pin: 'in3' } },
        { id: 'w_in_b2', from: { comp: 'dec_in', pin: 'out2' }, to: { comp: 'bcd_dec', pin: 'in2' } },
        { id: 'w_in_b1', from: { comp: 'dec_in', pin: 'out1' }, to: { comp: 'bcd_dec', pin: 'in1' } },
        { id: 'w_in_b0', from: { comp: 'dec_in', pin: 'out0' }, to: { comp: 'bcd_dec', pin: 'in0' } },
        // dec_in to disp_num
        { id: 'w_num_b3', from: { comp: 'dec_in', pin: 'out3' }, to: { comp: 'disp_num', pin: 'in3' } },
        { id: 'w_num_b2', from: { comp: 'dec_in', pin: 'out2' }, to: { comp: 'disp_num', pin: 'in2' } },
        { id: 'w_num_b1', from: { comp: 'dec_in', pin: 'out1' }, to: { comp: 'disp_num', pin: 'in1' } },
        { id: 'w_num_b0', from: { comp: 'dec_in', pin: 'out0' }, to: { comp: 'disp_num', pin: 'in0' } },
        // bcd_dec to disp_7seg
        { id: 'w_seg_a', from: { comp: 'bcd_dec', pin: 'a' }, to: { comp: 'disp_7seg', pin: 'a' } },
        { id: 'w_seg_b', from: { comp: 'bcd_dec', pin: 'b' }, to: { comp: 'disp_7seg', pin: 'b' } },
        { id: 'w_seg_c', from: { comp: 'bcd_dec', pin: 'c' }, to: { comp: 'disp_7seg', pin: 'c' } },
        { id: 'w_seg_d', from: { comp: 'bcd_dec', pin: 'd' }, to: { comp: 'disp_7seg', pin: 'd' } },
        { id: 'w_seg_e', from: { comp: 'bcd_dec', pin: 'e' }, to: { comp: 'disp_7seg', pin: 'e' } },
        { id: 'w_seg_f', from: { comp: 'bcd_dec', pin: 'f' }, to: { comp: 'disp_7seg', pin: 'f' } },
        { id: 'w_seg_g', from: { comp: 'bcd_dec', pin: 'g' }, to: { comp: 'disp_7seg', pin: 'g' } },
      ],
    },
  },
  {
    id: 'accumulator-8bit',
    name: '8-Bit Accumulator with Adder & Register',
    category: 'ALU & CPU Core',
    description: 'Complete 8-bit accumulator loop: Byte Input / Constant MUX -> 8-Bit Adder -> 8-Bit Register with feedback. Includes Manual Step Clock, Byte Display, LED Bar, and Zero Flag.',
    nameI18n: {
      en: '8-Bit Accumulator with Adder & Register',
      tr: '8-Bit Akümülatör (Toplayıcı & Kütük Döngüsü)',
    },
    categoryI18n: {
      en: 'ALU & CPU Core',
      tr: 'ALU & İşlemci Çekirdeği',
    },
    descriptionI18n: {
      en: 'Complete 8-bit accumulator loop: Byte Input / Constant MUX -> 8-Bit Adder -> 8-Bit Register with feedback. Includes Manual Step Clock, Byte Display, LED Bar, and Zero Flag.',
      tr: 'Tam 8-bitlik akümülatör mimarisi: Sayısal Giriş / Sabit MUX -> 8-Bit Tam Toplayıcı -> 8-Bit Kütük (Geri Besleme Döngüsü). Manuel Adım Saati, Sayısal Gösterge, LED Çubuğu ve Sıfır Bayrağı içerir.',
    },
    circuit: {
      version: 1,
      mode: 'sandbox',
      components: [
        // Inputs & MUX
        { id: 'in_val', type: 'BYTE_INPUT', x: 60, y: 120, params: { value: 5, label: 'Giriş Verisi (5)' } },
        { id: 'bus_zero', type: 'BUS_CONST', x: 60, y: 260, params: { value: 0, label: 'Sabit (0x00)' } },
        { id: 'sw_sel', type: 'SWITCH', x: 60, y: 380, params: { state: 1, label: 'MUX Seçici (1=Veri)' } },
        { id: 'mux', type: 'MUX_2x8', x: 320, y: 160, params: { label: 'Giriş MUX (2x8)' } },

        // Arithmetic & Sequential
        { id: 'adder', type: 'ADDER_8', x: 560, y: 180, params: { label: '8-Bit Toplayıcı' } },
        { id: 'reg', type: 'REGISTER_8', x: 840, y: 200, params: { label: 'Akümülatör Kütüğü (Q)' } },

        // Controls
        { id: 'clk_step', type: 'MANUAL_CLOCK', x: 560, y: 440, params: { label: 'Adım Saati (CLK)' } },
        { id: 'sw_load', type: 'SWITCH', x: 560, y: 550, params: { state: 1, label: 'Yükle (LOAD)' } },
        { id: 'sw_clr', type: 'SWITCH', x: 560, y: 660, params: { state: 0, label: 'Sıfırla (CLR)' } },

        // Displays & Flags
        { id: 'disp_out', type: 'BYTE_DISPLAY', x: 1120, y: 100, params: { label: 'Akümülatör Çıkışı', color: '#10b981' } },
        { id: 'led_bar', type: 'LED_BAR_8', x: 1120, y: 260, params: { label: 'LED Çubuğu (8-Bit)', color: '#38bdf8' } },
        { id: 'zero_det', type: 'ZERO_DETECT_8', x: 1120, y: 470, params: { label: 'Sıfır Algılayıcı' } },
        { id: 'led_zero', type: 'LED', x: 1320, y: 470, params: { label: 'Sıfır Bayrağı (Z)', color: '#f59e0b' } },
      ],
      wires: [
        // MUX inputs
        { id: 'w_zero_mux', from: { comp: 'bus_zero', pin: 'out' }, to: { comp: 'mux', pin: 'd0' } },
        { id: 'w_in_mux', from: { comp: 'in_val', pin: 'out' }, to: { comp: 'mux', pin: 'd1' } },
        { id: 'w_sel_mux', from: { comp: 'sw_sel', pin: 'out' }, to: { comp: 'mux', pin: 'sel' } },

        // MUX to Adder
        { id: 'w_mux_adder', from: { comp: 'mux', pin: 'out' }, to: { comp: 'adder', pin: 'a' } },

        // Adder to Register
        { id: 'w_adder_reg', from: { comp: 'adder', pin: 's' }, to: { comp: 'reg', pin: 'd' } },

        // Register Feedback Loop to Adder B input
        { id: 'w_reg_fb', from: { comp: 'reg', pin: 'q' }, to: { comp: 'adder', pin: 'b' } },

        // Controls to Register
        { id: 'w_clk_reg', from: { comp: 'clk_step', pin: 'out' }, to: { comp: 'reg', pin: 'clk' } },
        { id: 'w_load_reg', from: { comp: 'sw_load', pin: 'out' }, to: { comp: 'reg', pin: 'load' } },
        { id: 'w_clr_reg', from: { comp: 'sw_clr', pin: 'out' }, to: { comp: 'reg', pin: 'clr' } },

        // Outputs
        { id: 'w_reg_disp', from: { comp: 'reg', pin: 'q' }, to: { comp: 'disp_out', pin: 'in' } },
        { id: 'w_reg_bar', from: { comp: 'reg', pin: 'q' }, to: { comp: 'led_bar', pin: 'in' } },
        { id: 'w_reg_zdet', from: { comp: 'reg', pin: 'q' }, to: { comp: 'zero_det', pin: 'in' } },
        { id: 'w_zdet_led', from: { comp: 'zero_det', pin: 'zero' }, to: { comp: 'led_zero', pin: 'in' } },
      ],
    },
  },
  {
    id: 'mux-selector',
    name: '4:1 Multiplexer Signal Selector',
    category: 'Routing & Selectors',
    description: 'Routes 1 of 4 data inputs (D0..D3) to single output using 2 select control lines (S1, S0).',
    nameI18n: {
      en: '4:1 Multiplexer Signal Selector',
      tr: '4:1 Çoklayıcı Sinyal Seçici (MUX)',
    },
    categoryI18n: {
      en: 'Routing & Selectors',
      tr: 'Yönlendirme & Seçiciler',
    },
    descriptionI18n: {
      en: 'Routes 1 of 4 data inputs (D0..D3) to single output using 2 select control lines (S1, S0).',
      tr: '2 seçim hattı (S1, S0) ile 4 veri kaynağından (D0..D3) birini seçip tek çıkışa aktaran çoklayıcı devresi.',
    },
    circuit: {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'sw_d0', type: 'SWITCH', x: 60, y: 80, params: { state: 1, label: 'Data D0' } },
        { id: 'sw_d1', type: 'SWITCH', x: 60, y: 190, params: { state: 0, label: 'Data D1' } },
        { id: 'sw_d2', type: 'SWITCH', x: 60, y: 300, params: { state: 1, label: 'Data D2' } },
        { id: 'sw_d3', type: 'SWITCH', x: 60, y: 410, params: { state: 0, label: 'Data D3' } },
        { id: 'sw_s0', type: 'SWITCH', x: 260, y: 480, params: { state: 0, label: 'Select S0 (LSB)' } },
        { id: 'sw_s1', type: 'SWITCH', x: 100, y: 480, params: { state: 0, label: 'Select S1 (MSB)' } },
        { id: 'mux4', type: 'MUX_4', x: 420, y: 200, params: { label: '4:1 MUX' } },
        { id: 'led_out', type: 'LED', x: 680, y: 220, params: { label: 'Selected Output', color: '#f97316' } },
      ],
      wires: [
        { id: 'w_d0', from: { comp: 'sw_d0', pin: 'out' }, to: { comp: 'mux4', pin: 'd0' } },
        { id: 'w_d1', from: { comp: 'sw_d1', pin: 'out' }, to: { comp: 'mux4', pin: 'd1' } },
        { id: 'w_d2', from: { comp: 'sw_d2', pin: 'out' }, to: { comp: 'mux4', pin: 'd2' } },
        { id: 'w_d3', from: { comp: 'sw_d3', pin: 'out' }, to: { comp: 'mux4', pin: 'd3' } },
        { id: 'w_s0', from: { comp: 'sw_s0', pin: 'out' }, to: { comp: 'mux4', pin: 's0' } },
        { id: 'w_s1', from: { comp: 'sw_s1', pin: 'out' }, to: { comp: 'mux4', pin: 's1' } },
        { id: 'w_out', from: { comp: 'mux4', pin: 'out' }, to: { comp: 'led_out', pin: 'in' } },
      ],
    },
  },
  {
    id: 'tristate-bus',
    name: 'Shared Tri-State Bus & D-FF Register',
    category: 'Bus & Shared Lines',
    description: 'Demonstrates shared wire using High-Impedance (Z) tri-state buffers and clock sampling without signal contention.',
    nameI18n: {
      en: 'Shared Tri-State Bus & D-FF Register',
      tr: 'Paylaşımlı Tri-State Veri Yolu & D-FF',
    },
    categoryI18n: {
      en: 'Bus & Shared Lines',
      tr: 'Veri Yolu & Paylaşımlı Hatlar',
    },
    descriptionI18n: {
      en: 'Demonstrates shared wire using High-Impedance (Z) tri-state buffers and clock sampling without signal contention.',
      tr: 'Yüksek empedans (Z) durumundaki Tri-State tamponlar ile tek bir kabloyu çakışma olmadan paylaşıp D Flip-Flop hafızasına kaydetme devresi.',
    },
    circuit: {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'sw_data_a', type: 'SWITCH', x: 60, y: 100, params: { state: 1, label: 'Data A' } },
        { id: 'sw_en_a', type: 'SWITCH', x: 60, y: 200, params: { state: 1, label: 'Enable A (Sür)' } },
        { id: 'tri_a', type: 'TRI_STATE', x: 280, y: 120, params: { label: 'Tampon A' } },

        { id: 'sw_data_b', type: 'SWITCH', x: 60, y: 340, params: { state: 0, label: 'Data B' } },
        { id: 'sw_en_b', type: 'SWITCH', x: 60, y: 440, params: { state: 0, label: 'Enable B (Sür)' } },
        { id: 'tri_b', type: 'TRI_STATE', x: 280, y: 360, params: { label: 'Tampon B' } },

        { id: 'clk', type: 'MANUAL_CLOCK', x: 480, y: 380, params: { label: 'Kayıt Saati' } },
        { id: 'dff', type: 'D_FLIP_FLOP', x: 560, y: 220, params: { label: 'D-FF Hafıza' } },
        { id: 'led_q', type: 'LED', x: 780, y: 200, params: { label: 'Saklanan Değer Q', color: '#10b981' } },
      ],
      wires: [
        { id: 'w_da_in', from: { comp: 'sw_data_a', pin: 'out' }, to: { comp: 'tri_a', pin: 'in' } },
        { id: 'w_ea_en', from: { comp: 'sw_en_a', pin: 'out' }, to: { comp: 'tri_a', pin: 'en' } },

        { id: 'w_db_in', from: { comp: 'sw_data_b', pin: 'out' }, to: { comp: 'tri_b', pin: 'in' } },
        { id: 'w_eb_en', from: { comp: 'sw_en_b', pin: 'out' }, to: { comp: 'tri_b', pin: 'en' } },

        // Shared net to D-FF input
        { id: 'w_tria_d', from: { comp: 'tri_a', pin: 'out' }, to: { comp: 'dff', pin: 'd' } },
        { id: 'w_trib_d', from: { comp: 'tri_b', pin: 'out' }, to: { comp: 'dff', pin: 'd' } },

        { id: 'w_clk_dff', from: { comp: 'clk', pin: 'out' }, to: { comp: 'dff', pin: 'clk' } },
        { id: 'w_dff_led', from: { comp: 'dff', pin: 'q' }, to: { comp: 'led_q', pin: 'in' } },
      ],
    },
  },
  {
    id: 'bus-split-merge',
    name: '8-Bit Bus Split & Merge (Bit Routing)',
    category: 'Bus & Routing',
    description: 'Splits an 8-bit bus into 8 individual wires, inverts lower 4 bits, and merges back to display on LED Bar.',
    nameI18n: {
      en: '8-Bit Bus Split & Merge (Bit Routing)',
      tr: '8-Bit Veri Yolu Ayırıcı & Birleştirici',
    },
    categoryI18n: {
      en: 'Bus & Routing',
      tr: 'Veri Yolu & Yönlendirme',
    },
    descriptionI18n: {
      en: 'Splits an 8-bit bus into 8 individual wires, inverts lower 4 bits, and merges back to display on LED Bar.',
      tr: '8-bit veri yolunu 8 ayrı kabloya ayırıp alt 4 biti NOT kapısıyla tersleyerek tekrar tek bir veri yolunda birleştirme devresi.',
    },
    circuit: {
      version: 1,
      mode: 'sandbox',
      components: [
        { id: 'dip8', type: 'DIP_SWITCH_8', x: 60, y: 220, params: { bits: [1, 0, 1, 0, 1, 1, 0, 0], label: '8-Bit DIP Giriş' } },
        { id: 'split8', type: 'BUS_SPLIT', x: 380, y: 180, params: { label: 'Ayırıcı (Split)' } },

        // Inverters for lower 4 bits
        { id: 'not0', type: 'NOT', x: 580, y: 120, params: { label: 'NOT 0' } },
        { id: 'not1', type: 'NOT', x: 580, y: 190, params: { label: 'NOT 1' } },
        { id: 'not2', type: 'NOT', x: 580, y: 260, params: { label: 'NOT 2' } },
        { id: 'not3', type: 'NOT', x: 580, y: 330, params: { label: 'NOT 3' } },

        { id: 'merge8', type: 'BUS_MERGE', x: 780, y: 180, params: { label: 'Birleştirici (Merge)' } },
        { id: 'led_bar', type: 'LED_BAR_8', x: 1020, y: 200, params: { label: 'Sonuç LED Bar', color: '#10b981' } },
      ],
      wires: [
        { id: 'w_dip_split', from: { comp: 'dip8', pin: 'out' }, to: { comp: 'split8', pin: 'in' } },

        // Lower 4 bits through inverters
        { id: 'w_s0_not', from: { comp: 'split8', pin: 'out0' }, to: { comp: 'not0', pin: 'in' } },
        { id: 'w_not_m0', from: { comp: 'not0', pin: 'out' }, to: { comp: 'merge8', pin: 'in0' } },

        { id: 'w_s1_not', from: { comp: 'split8', pin: 'out1' }, to: { comp: 'not1', pin: 'in' } },
        { id: 'w_not_m1', from: { comp: 'not1', pin: 'out' }, to: { comp: 'merge8', pin: 'in1' } },

        { id: 'w_s2_not', from: { comp: 'split8', pin: 'out2' }, to: { comp: 'not2', pin: 'in' } },
        { id: 'w_not_m2', from: { comp: 'not2', pin: 'out' }, to: { comp: 'merge8', pin: 'in2' } },

        { id: 'w_s3_not', from: { comp: 'split8', pin: 'out3' }, to: { comp: 'not3', pin: 'in' } },
        { id: 'w_not_m3', from: { comp: 'not3', pin: 'out' }, to: { comp: 'merge8', pin: 'in3' } },

        // Upper 4 bits directly connected
        { id: 'w_s4_m4', from: { comp: 'split8', pin: 'out4' }, to: { comp: 'merge8', pin: 'in4' } },
        { id: 'w_s5_m5', from: { comp: 'split8', pin: 'out5' }, to: { comp: 'merge8', pin: 'in5' } },
        { id: 'w_s6_m6', from: { comp: 'split8', pin: 'out6' }, to: { comp: 'merge8', pin: 'in6' } },
        { id: 'w_s7_m7', from: { comp: 'split8', pin: 'out7' }, to: { comp: 'merge8', pin: 'in7' } },

        // Merged bus to LED bar
        { id: 'w_merge_bar', from: { comp: 'merge8', pin: 'out' }, to: { comp: 'led_bar', pin: 'in' } },
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
