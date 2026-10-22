export interface TutorialStep {
  stepNumber: number;
  titleI18n: { en: string; tr: string };
  descriptionI18n: { en: string; tr: string };
  diagramType: string;
  componentsAdded: string[];
  keyConnections: Array<{ from: string; to: string; label: string }>;
  tipsI18n?: { en: string; tr: string };
}

export interface Tutorial {
  id: string;
  titleI18n: { en: string; tr: string };
  descriptionI18n: { en: string; tr: string };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  circuitTemplateId: string;
  steps: TutorialStep[];
}

export const TUTORIALS: Tutorial[] = [
  {
    id: 'full-adder-tutorial',
    titleI18n: {
      en: 'Building a 1-Bit Full Adder from Scratch',
      tr: 'Sıfırdan 1-Bit Tam Toplayıcı (Full Adder) Tasarımı',
    },
    descriptionI18n: {
      en: 'Learn how computers perform addition at the hardware level using basic logic gates (XOR, AND, OR) with carry propagation.',
      tr: 'Bilgisayarların en temel toplama işlemini donanım seviyesinde XOR, AND ve OR kapılarıyla nasıl gerçekleştirdiğini adım adım öğrenin.',
    },
    difficulty: 'beginner',
    circuitTemplateId: 'full-adder',
    steps: [
      {
        stepNumber: 1,
        titleI18n: {
          en: 'Step 1: Place Input Switches (A, B, Cin)',
          tr: '1. Adım: Giriş Anahtarlarını (A, B, Cin) Yerleştirin',
        },
        descriptionI18n: {
          en: 'Add three SWITCH components on the left side of the canvas. These will represent the two operand bits (A, B) and the incoming carry bit (Cin).',
          tr: 'Tuvalin sol tarafına 3 adet SWITCH (Anahtar) ekleyin. Bunlar toplanacak iki biti (A, B) ve bir alt basamaktan gelen elde bitini (Cin) temsil eder.',
        },
        diagramType: 'fa-step-1',
        componentsAdded: ['SWITCH (Input A)', 'SWITCH (Input B)', 'SWITCH (Carry-In)'],
        keyConnections: [],
        tipsI18n: {
          en: 'You can rename each switch in the Properties panel on the right for clarity.',
          tr: 'Sağ taraftaki Özellikler (Properties) panelinden her anahtara özel etiket verebilirsiniz.',
        },
      },
      {
        stepNumber: 2,
        titleI18n: {
          en: 'Step 2: Half Adder Stage (XOR 1 & AND 1)',
          tr: '2. Adım: Yarım Toplama Aşaması (XOR 1 & AND 1)',
        },
        descriptionI18n: {
          en: 'Connect Input A and Input B to the first XOR gate to calculate (A ⊕ B). Connect the same inputs to the first AND gate to calculate the generate carry (A · B).',
          tr: 'Giriş A ve B anahtarlarını birinci XOR kapısına bağlayarak (A ⊕ B) ara toplamını, aynı zamanda birinci AND kapısına bağlayarak (A · B) ilk eldeyi hesaplayın.',
        },
        diagramType: 'fa-step-2',
        componentsAdded: ['XOR Gate (A ⊕ B)', 'AND Gate (A · B)'],
        keyConnections: [
          { from: 'Input A', to: 'XOR 1 [in0]', label: 'A hattı' },
          { from: 'Input B', to: 'XOR 1 [in1]', label: 'B hattı' },
          { from: 'Input A', to: 'AND 1 [in0]', label: 'A hattı' },
          { from: 'Input B', to: 'AND 1 [in1]', label: 'B hattı' },
        ],
      },
      {
        stepNumber: 3,
        titleI18n: {
          en: 'Step 3: Carry-In Addition & Final Output Stage',
          tr: '3. Adım: Cin Girişini Ekleme ve Çıkışları Bağlama',
        },
        descriptionI18n: {
          en: 'Feed the output of XOR 1 and Cin into XOR 2 to produce the final Sum (Σ). Combine intermediate carries using an OR gate to produce Carry-Out (Cout).',
          tr: 'XOR 1 çıkışını ve Cin anahtarını XOR 2 kapısına bağlayarak nihai Toplamı (Sum / Σ) elde edin. İki eldeyi OR kapısıyla birleştirip Carry-Out (Cout) çıkışını LED lere bağlayın.',
        },
        diagramType: 'fa-step-3',
        componentsAdded: ['XOR Gate 2 (Sum)', 'AND Gate 2', 'OR Gate (Cout)', 'LED (Sum)', 'LED (Cout)'],
        keyConnections: [
          { from: 'XOR 1 [out]', to: 'XOR 2 [in0]', label: 'Ara Toplam' },
          { from: 'Cin [out]', to: 'XOR 2 [in1]', label: 'Elde Girişi' },
          { from: 'XOR 2 [out]', to: 'LED Sum [in]', label: 'Toplam Çıkışı (Σ)' },
          { from: 'OR [out]', to: 'LED Cout [in]', label: 'Elde Çıkışı (Cout)' },
        ],
        tipsI18n: {
          en: '1 + 1 + 0 produces Sum=0, Cout=1 (Binary 10 = Decimal 2). Verify all 8 input states!',
          tr: 'A=1, B=1, Cin=0 iken Sum=0, Cout=1 olur (İkili 10 = Ondalık 2). Tüm 8 durumu test edin!',
        },
      },
    ],
  },
  {
    id: 'bcd-7seg-tutorial',
    titleI18n: {
      en: 'Driving a 7-Segment Display with BCD Decoder',
      tr: 'BCD Çözücü ile 7-Segment Gösterge Sürüşü',
    },
    descriptionI18n: {
      en: 'Master numerical displays: input 4-bit binary values and decode them into 7 optical segments (a–g) to display decimal digits.',
      tr: 'Sayısal ekran sürücüsü mantığı: 4-bit ikili girişi 7 optik segmente (a-g) dönüştürerek 0-9 arası rakamları görüntüleyin.',
    },
    difficulty: 'intermediate',
    circuitTemplateId: 'bcd-7segment',
    steps: [
      {
        stepNumber: 1,
        titleI18n: {
          en: 'Step 1: Set up 4-Bit Input Generator',
          tr: '1. Adım: 4-Bit Sayısal Giriş Bloğunu Ekleyin',
        },
        descriptionI18n: {
          en: 'Add a DECIMAL_INPUT or DIP_SWITCH_4 block. This provides 4 independent binary outputs (B3, B2, B1, B0) representing values 0 to 15.',
          tr: 'Tuvale bir DECIMAL_INPUT veya DIP_SWITCH_4 ekleyin. Bu eleman 0 ile 15 arasındaki değerleri 4 bit olarak (B3..B0) çıkışa verir.',
        },
        diagramType: 'bcd-step-1',
        componentsAdded: ['DECIMAL_INPUT (0-15)'],
        keyConnections: [],
      },
      {
        stepNumber: 2,
        titleI18n: {
          en: 'Step 2: Connect BCD to 7-Segment Decoder',
          tr: '2. Adım: BCD Çözücü Entegresini Bağlayın',
        },
        descriptionI18n: {
          en: 'Place a BCD_TO_7SEG decoder block. Wire in3..in0 from the input to the decoder inputs.',
          tr: 'BCD_TO_7SEG çözücü bloğunu tuvale yerleştirin ve girişin B3..B0 hatlarını çözücünün in3..in0 pinlerine bağlayın.',
        },
        diagramType: 'bcd-step-2',
        componentsAdded: ['BCD_TO_7SEG Decoder'],
        keyConnections: [
          { from: 'Input [out3]', to: 'Decoder [in3]', label: 'Bit 3 (MSB - 8)' },
          { from: 'Input [out2]', to: 'Decoder [in2]', label: 'Bit 2 (4)' },
          { from: 'Input [out1]', to: 'Decoder [in1]', label: 'Bit 1 (2)' },
          { from: 'Input [out0]', to: 'Decoder [in0]', label: 'Bit 0 (LSB - 1)' },
        ],
      },
      {
        stepNumber: 3,
        titleI18n: {
          en: 'Step 3: Connect 7-Segment Display (a through g)',
          tr: '3. Adım: 7-Segment Ekranı (a..g) Bağlayın',
        },
        descriptionI18n: {
          en: 'Place a SEVEN_SEGMENT display on the right. Wire all 7 segment lines (a, b, c, d, e, f, g) directly to the corresponding pins of the display.',
          tr: 'Sağa bir SEVEN_SEGMENT ekranı ekleyin. Çözücünün a, b, c, d, e, f, g çıkış hatlarını ekranın aynı isimli pinlerine bağlayın.',
        },
        diagramType: 'bcd-step-3',
        componentsAdded: ['SEVEN_SEGMENT Display'],
        keyConnections: [
          { from: 'Decoder [a..g]', to: 'Display [a..g]', label: '7 Segment Hatları' },
        ],
        tipsI18n: {
          en: 'Use the + / - buttons on the Decimal Input to step through numbers 0 to 9 in real time!',
          tr: 'Giriş kutusundaki + ve - butonlarına basarak rakamların anında ekranda nasıl değiştiğini izleyin!',
        },
      },
    ],
  },
  {
    id: 'tristate-bus-tutorial',
    titleI18n: {
      en: 'Shared Tri-State Bus & Register Sampling',
      tr: 'Paylaşımlı Tri-State Veri Yolu ve Hafıza Kaydı',
    },
    descriptionI18n: {
      en: 'Understand how real CPU buses work: multiple drivers sharing the same wire net via High-Impedance (Z) state without electrical short-circuits.',
      tr: 'Gerçek işlemci veri yollarının temeli: Birden fazla birimin tek bir ortak kabloyu Yüksek Empedans (Z) durumuyla çakışma (X) olmadan paylaşması.',
    },
    difficulty: 'intermediate',
    circuitTemplateId: 'tristate-bus',
    steps: [
      {
        stepNumber: 1,
        titleI18n: {
          en: 'Step 1: Setup Independent Data Sources & Tri-State Buffers',
          tr: '1. Adım: Bağımsız Veri Kaynakları ve Tri-State Tamponları',
        },
        descriptionI18n: {
          en: 'Place two data switches (Data A, Data B) and two enable switches (EN A, EN B). Connect each pair to a TRI_STATE buffer.',
          tr: 'İki adet veri anahtarı (Data A, Data B) ve iki adet yetkilendirme anahtarı (EN A, EN B) ekleyip iki ayrı TRI_STATE tamponuna bağlayın.',
        },
        diagramType: 'tri-step-1',
        componentsAdded: ['SWITCH (Data A)', 'SWITCH (EN A)', 'TRI_STATE A', 'SWITCH (Data B)', 'SWITCH (EN B)', 'TRI_STATE B'],
        keyConnections: [
          { from: 'Data A', to: 'TRI_STATE A [in]', label: 'Veri A' },
          { from: 'EN A', to: 'TRI_STATE A [en]', label: 'Yetkilendirme A' },
          { from: 'Data B', to: 'TRI_STATE B [in]', label: 'Veri B' },
          { from: 'EN B', to: 'TRI_STATE B [en]', label: 'Yetkilendirme B' },
        ],
      },
      {
        stepNumber: 2,
        titleI18n: {
          en: 'Step 2: Connect Both Outputs to Single Shared Wire',
          tr: '2. Adım: İki Çıkışı Tek Bir Ortak Kabloya Bağlayın',
        },
        descriptionI18n: {
          en: 'Connect the output of Buffer A and Buffer B to the same wire net. Notice that when EN A=1 and EN B=0, Buffer B is in high-impedance (Z) and does not conflict!',
          tr: 'Tampon A ve Tampon B nin çıkışlarını aynı kabloya bağlayın. EN A=1 ve EN B=0 iken Tampon B yüksek empedans (Z / Sarı) verir ve çakışma (Kırmızı X) oluşmaz.',
        },
        diagramType: 'tri-step-2',
        componentsAdded: ['Shared Net Wire'],
        keyConnections: [
          { from: 'Buffer A [out]', to: 'Shared Wire Net', label: 'Ortak Hat Bağlantısı' },
          { from: 'Buffer B [out]', to: 'Shared Wire Net', label: 'Ortak Hat Bağlantısı' },
        ],
      },
      {
        stepNumber: 3,
        titleI18n: {
          en: 'Step 3: Sample the Shared Bus into a D Flip-Flop',
          tr: '3. Adım: Ortak Hattaki Değeri D Flip-Flop Hafızasına Kaydedin',
        },
        descriptionI18n: {
          en: 'Connect the shared wire to the D input of a D_FLIP_FLOP. Add a MANUAL_CLOCK. When you click STEP CLK, the selected driver value is securely latched into Q!',
          tr: 'Ortak kabloyu D_FLIP_FLOP un D girişine bağlayın ve bir MANUAL_CLOCK ekleyin. Saat darbesi verdiğinizde seçilen tamponun verisi Q çıkışına kalıcı olarak kaydedilir.',
        },
        diagramType: 'tri-step-3',
        componentsAdded: ['D_FLIP_FLOP', 'MANUAL_CLOCK', 'LED (Q Output)'],
        keyConnections: [
          { from: 'Shared Net', to: 'D-FF [d]', label: 'Veri Örnekleme' },
          { from: 'MANUAL_CLOCK', to: 'D-FF [clk]', label: 'Saat Darbesi' },
          { from: 'D-FF [q]', to: 'LED [in]', label: 'Saklanan Çıkış' },
        ],
      },
    ],
  },
  {
    id: 'accumulator-tutorial',
    titleI18n: {
      en: '8-Bit CPU Accumulator Architecture (5 + 3 = 8)',
      tr: '8-Bit İşlemci Akümülatör Mimarisi (5 + 3 = 8)',
    },
    descriptionI18n: {
      en: 'The heart of a microprocessor ALU: combine an 8-bit bus MUX, 8-bit ripple adder, and synchronous 8-bit register in a feedback loop with live hex display and zero flag.',
      tr: 'Bir mikroişlemci ALU sunun kalbi: 8-bit veri yolu çoklayıcısı, 8-bit tam toplayıcı ve senkron kütüğü bir geri besleme döngüsünde birleştirerek 5 + 3 = 8 işlemini yapın.',
    },
    difficulty: 'advanced',
    circuitTemplateId: 'accumulator-8bit',
    steps: [
      {
        stepNumber: 1,
        titleI18n: {
          en: 'Step 1: Input & MUX Selection Stage',
          tr: '1. Adım: Veri Girişi ve MUX Seçim Katmanı',
        },
        descriptionI18n: {
          en: 'Place a BYTE_INPUT (value: 5) and a BUS_CONST (value: 0x00). Connect both 8-bit buses to a MUX_2x8. A SWITCH controls whether to inject data (SEL=1) or zero (SEL=0).',
          tr: 'Bir BYTE_INPUT (değer: 5) ve BUS_CONST (değer: 0x00) yerleştirin. İki veri yolunu MUX_2x8 e bağlayın. Seçici anahtar (SEL=1) ile dış veriyi hatta aktarın.',
        },
        diagramType: 'acc-step-1',
        componentsAdded: ['BYTE_INPUT (5)', 'BUS_CONST (0x00)', 'SWITCH (SEL)', 'MUX_2x8'],
        keyConnections: [
          { from: 'BYTE_INPUT [out]', to: 'MUX_2x8 [d1]', label: '8-Bit Veri Yolu [7:0]' },
          { from: 'BUS_CONST [out]', to: 'MUX_2x8 [d0]', label: '8-Bit Sabit 0x00 [7:0]' },
          { from: 'SWITCH [out]', to: 'MUX_2x8 [sel]', label: 'Seçici Sinyal' },
        ],
      },
      {
        stepNumber: 2,
        titleI18n: {
          en: 'Step 2: 8-Bit Arithmetic Adder Stage',
          tr: '2. Adım: 8-Bit Tam Toplayıcı Katmanı',
        },
        descriptionI18n: {
          en: 'Place an ADDER_8 block. Connect the 8-bit output of MUX_2x8 to input A of the adder. Input B will receive the accumulated value from the register in Step 4.',
          tr: 'Bir ADDER_8 (8-Bit Tam Toplayıcı) ekleyin. MUX çıkışındaki 8-bitlik veri yolunu toplayıcının A[7:0] girişine bağlayın. B girişi ise kütükten geri beslenecektir.',
        },
        diagramType: 'acc-step-2',
        componentsAdded: ['ADDER_8 (8-Bit Adder)'],
        keyConnections: [
          { from: 'MUX_2x8 [out]', to: 'ADDER_8 [a]', label: '8-Bit Toplama Girişi A' },
        ],
      },
      {
        stepNumber: 3,
        titleI18n: {
          en: 'Step 3: Synchronous 8-Bit Register & Controls',
          tr: '3. Adım: Senkron 8-Bit Kütük ve Kontrol Sinyalleri',
        },
        descriptionI18n: {
          en: 'Place a REGISTER_8 block. Connect ADDER_8 sum output (S[7:0]) to register data input (D[7:0]). Add a MANUAL_CLOCK, a LOAD switch (state: 1), and a CLR switch (state: 0).',
          tr: 'REGISTER_8 bloğu ekleyin. Toplayıcının S[7:0] toplam çıkışını kütüğün D[7:0] girişine bağlayın. MANUAL_CLOCK (saat), LOAD anahtarı (1) ve CLR anahtarı (0) bağlayın.',
        },
        diagramType: 'acc-step-3',
        componentsAdded: ['REGISTER_8', 'MANUAL_CLOCK', 'SWITCH (LOAD)', 'SWITCH (CLR)'],
        keyConnections: [
          { from: 'ADDER_8 [s]', to: 'REGISTER_8 [d]', label: '8-Bit Toplam Veri Yolu S' },
          { from: 'MANUAL_CLOCK [out]', to: 'REGISTER_8 [clk]', label: 'Saat Darbesi' },
          { from: 'LOAD Switch [out]', to: 'REGISTER_8 [load]', label: 'Yükleme Yetkilendirme' },
          { from: 'CLR Switch [out]', to: 'REGISTER_8 [clr]', label: 'Asenkron Sıfırlama' },
        ],
      },
      {
        stepNumber: 4,
        titleI18n: {
          en: 'Step 4: Feedback Loop, Byte Display & Zero Flag',
          tr: '4. Adım: Geri Besleme Döngüsü, Sayısal Ekran ve Sıfır Bayrağı',
        },
        descriptionI18n: {
          en: 'Connect Register Q[7:0] back to Adder B[7:0] to close the accumulation loop! Connect Q[7:0] to BYTE_DISPLAY, LED_BAR_8, and ZERO_DETECT_8.',
          tr: 'Kütüğün Q[7:0] çıkışını toplayıcının B[7:0] girişine geri bağlayarak akümülatör döngüsünü kapatın! Aynı çıkışı BYTE_DISPLAY, LED_BAR_8 ve ZERO_DETECT_8 e bağlayın.',
        },
        diagramType: 'acc-step-4',
        componentsAdded: ['BYTE_DISPLAY', 'LED_BAR_8', 'ZERO_DETECT_8', 'LED (Zero Flag)'],
        keyConnections: [
          { from: 'REGISTER_8 [q]', to: 'ADDER_8 [b]', label: 'Geri Besleme (Feedback Loop)' },
          { from: 'REGISTER_8 [q]', to: 'BYTE_DISPLAY [in]', label: '8-Bit Ekran Verisi' },
          { from: 'REGISTER_8 [q]', to: 'LED_BAR_8 [in]', label: '8-Bit Optik LED Çubuğu' },
          { from: 'REGISTER_8 [q]', to: 'ZERO_DETECT_8 [in]', label: 'Sıfır Algılama' },
          { from: 'ZERO_DETECT_8 [zero]', to: 'LED [in]', label: 'Zero Flag (Z)' },
        ],
        tipsI18n: {
          en: 'Click STEP CLK to accumulate: 0 -> 5 -> 10. Then change Byte Input to 3 and step again: 5 + 3 = 8 (0x08). Congratulations!',
          tr: 'STEP CLK butonuna basarak biriktirin: 0 -> 5 -> 10. Ardından girişi 3 yapıp adım atın: 5 + 3 = 8 (0x08). Akümülatörünüz hazır!',
        },
      },
    ],
  },
];
