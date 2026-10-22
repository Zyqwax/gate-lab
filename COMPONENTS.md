# GateLab Bileşen ve Parça Kütüphanesi (Component Reference)

GateLab simülatöründe yer alan tüm mantık kapıları, giriş/çıkış elemanları, kombinasyonel bloklar ve ardışıl hafıza bileşenlerinin detaylı referans dokümantasyonu.

---

## 1. Mantık Kapıları (Logic Gates)

Tüm çok girişli kapılar varsayılan olarak 2 girişlidir; bileşen özellikleri (Inspector) panelinden **2 ile 8 giriş arasında** dinamik olarak ayarlanabilir.

### 1.1. AND Kapısı (`AND`)
- **Kategori:** Mantık Kapısı (`gate`)
- **Açıklama:** Yalnızca tüm girişler `1` (HIGH) olduğunda çıkış `1` üretir. Girişlerden biri bile `0` ise çıkış `0` olur.
- **Giriş Pinleri:**
  - `in0` (`A`): Giriş A
  - `in1` (`B`): Giriş B
  - *(2–8 giriş desteği: `in0` .. `in7`)*
- **Çıkış Pinleri:**
  - `out` (`Y`): Çıkış ($Y = A \cdot B \cdot \dots$)
- **Doğruluk Tablosu (2 Girişli):**
  | A | B | Y |
  |---|---|---|
  | 0 | 0 | 0 |
  | 0 | 1 | 0 |
  | 1 | 0 | 0 |
  | 1 | 1 | 1 |

---

### 1.2. OR Kapısı (`OR`)
- **Kategori:** Mantık Kapısı (`gate`)
- **Açıklama:** Girişlerden en az biri `1` (HIGH) olduğunda çıkış `1` üretir. Yalnızca tüm girişler `0` iken çıkış `0` olur.
- **Giriş Pinleri:** `in0` .. `in7` (A .. H)
- **Çıkış Pinleri:** `out` (`Y`): Çıkış ($Y = A + B + \dots$)
- **Doğruluk Tablosu (2 Girişli):**
  | A | B | Y |
  |---|---|---|
  | 0 | 0 | 0 |
  | 0 | 1 | 1 |
  | 1 | 0 | 1 |
  | 1 | 1 | 1 |

---

### 1.3. NOT Kapısı / İnverter (`NOT`)
- **Kategori:** Mantık Kapısı (`gate`)
- **Açıklama:** Tek girişlidir. Giriş sinyalini tersine çevirir ($0 \rightarrow 1$, $1 \rightarrow 0$).
- **Giriş Pinleri:** `in` (`A`): Giriş
- **Çıkış Pinleri:** `out` (`Y`): Terslenmiş Çıkış ($Y = \overline{A}$)
- **Doğruluk Tablosu:**
  | A | Y |
  |---|---|
  | 0 | 1 |
  | 1 | 0 |

---

### 1.4. XOR Kapısı / Özel VEYA (`XOR`)
- **Kategori:** Mantık Kapısı (`gate`)
- **Açıklama:** Girişlerdeki `1` sayısı tek (odd) olduğunda çıkış `1` üretir. 2 girişli kullanımda girişler birbirinden farklıysa `1`, aynıysa `0` verir.
- **Giriş Pinleri:** `in0` .. `in7` (A .. H)
- **Çıkış Pinleri:** `out` (`Y`): Çıkış ($Y = A \oplus B$)
- **Doğruluk Tablosu (2 Girişli):**
  | A | B | Y |
  |---|---|---|
  | 0 | 0 | 0 |
  | 0 | 1 | 1 |
  | 1 | 0 | 1 |
  | 1 | 1 | 0 |

---

### 1.5. NAND Kapısı (`NAND`)
- **Kategori:** Mantık Kapısı (`gate`)
- **Açıklama:** VE DEĞİL kapısı. Yalnızca tüm girişler `1` olduğunda çıkış `0` olur; diğer tüm durumlarda `1` üretir.
- **Giriş Pinleri:** `in0` .. `in7` (A .. H)
- **Çıkış Pinleri:** `out` (`Y`): Çıkış ($Y = \overline{A \cdot B}$)
- **Doğruluk Tablosu (2 Girişli):**
  | A | B | Y |
  |---|---|---|
  | 0 | 0 | 1 |
  | 0 | 1 | 1 |
  | 1 | 0 | 1 |
  | 1 | 1 | 0 |

---

### 1.6. NOR Kapısı (`NOR`)
- **Kategori:** Mantık Kapısı (`gate`)
- **Açıklama:** VEYA DEĞİL kapısı. Yalnızca tüm girişler `0` olduğunda çıkış `1` olur; girişlerden biri bile `1` ise çıkış `0` olur.
- **Giriş Pinleri:** `in0` .. `in7` (A .. H)
- **Çıkış Pinleri:** `out` (`Y`): Çıkış ($Y = \overline{A + B}$)
- **Doğruluk Tablosu (2 Girişli):**
  | A | B | Y |
  |---|---|---|
  | 0 | 0 | 1 |
  | 0 | 1 | 0 |
  | 1 | 0 | 0 |
  | 1 | 1 | 0 |

---

### 1.7. XNOR Kapısı (`XNOR`)
- **Kategori:** Mantık Kapısı (`gate`)
- **Açıklama:** Eşitlik (Equivalence) kapısı. Girişlerdeki `1` sayısı çift (even) olduğunda çıkış `1` üretir. 2 girişli kullanımda girişler birbirinin aynısı ise `1` verir.
- **Giriş Pinleri:** `in0` .. `in7` (A .. H)
- **Çıkış Pinleri:** `out` (`Y`): Çıkış ($Y = \overline{A \oplus B}$)
- **Doğruluk Tablosu (2 Girişli):**
  | A | B | Y |
  |---|---|---|
  | 0 | 0 | 1 |
  | 0 | 1 | 0 |
  | 1 | 0 | 0 |
  | 1 | 1 | 1 |

---

### 1.8. Tampon / Buffer (`BUFFER`)
- **Kategori:** Mantık Kapısı (`gate`)
- **Açıklama:** Girişteki mantıksal sinyali değiştirmeden çıkışa aktarır. Sinyal izolasyonu ve gecikme modellemesi için kullanılır.
- **Giriş Pinleri:** `in` (`A`)
- **Çıkış Pinleri:** `out` (`Y`)
- **Doğruluk Tablosu:**
  | A | Y |
  |---|---|
  | 0 | 0 |
  | 1 | 1 |

---

### 1.9. Üç Durumlu Tampon / Tri-State Buffer (`TRI_STATE`)
- **Kategori:** Mantık Kapısı (`gate`)
- **Açıklama:** `EN` (Enable) sinyali `1` olduğunda veriyi geçirir; `EN = 0` olduğunda hattı yüksek empedans (`Z` / Yüzer) durumuna sokarak ortak veri yolundan (Bus) ayırır.
- **Giriş Pinleri:**
  - `in` (`IN`): Veri Girişi
  - `enable` (`EN`): Etkinleştirme Kontrolü
- **Çıkış Pinleri:**
  - `out` (`OUT`): Çıkış (`0`, `1` veya `Z`)
- **Doğruluk Tablosu:**
  | EN | IN | OUT |
  |:--:|:--:|:---:|
  | 0  | X  |  Z  |
  | 1  | 0  |  0  |
  | 1  | 1  |  1  |

---

## 2. Girişler ve Sinyal Kaynakları (Inputs & Sources)

### 2.1. İki Konumlu Anahtar / Toggle Switch (`SWITCH`)
- **Kategori:** Giriş / Kaynak (`io`)
- **Açıklama:** Üzerine tıklandığında `0` ve `1` durumları arasında kalıcı geçiş yapar.
- **Çıkış Pinleri:** `out` (`Q`)
- **Parametreler:** `state` (0 veya 1), `label`

---

### 2.2. Bas-Bırak Buton / Push Button (`BUTTON`)
- **Kategori:** Giriş / Kaynak (`io`)
- **Açıklama:** Basılı tutulduğunda `1`, bırakıldığında `0` üretir (Yaylı buton).
- **Çıkış Pinleri:** `out` (`Q`)
- **Parametreler:** `pressed` (boolean), `label`

---

### 2.3. Saat Darbesi Üreteci / Clock (`CLOCK`)
- **Kategori:** Giriş / Kaynak (`io`)
- **Açıklama:** Belirlenen frekansta periyodik kare dalga darbesi ($0 \rightarrow 1 \rightarrow 0$) üretir.
- **Çıkış Pinleri:** `out` (`CLK`)
- **Parametreler:** `frequency` (0.5 Hz, 1 Hz, 2 Hz, 5 Hz, 10 Hz), `high` (boolean)

---

### 2.4. Sabit 1 / VCC (`CONST_HIGH`)
- **Kategori:** Giriş / Kaynak (`io`)
- **Açıklama:** Sürekli olarak mantıksal `1` (HIGH / Güç Beslemesi) sinyali verir.
- **Çıkış Pinleri:** `out` (`VCC`)

---

### 2.5. Sabit 0 / GND (`CONST_LOW`)
- **Kategori:** Giriş / Kaynak (`io`)
- **Açıklama:** Sürekli olarak mantıksal `0` (LOW / Toprak Referansı) sinyali verir.
- **Çıkış Pinleri:** `out` (`GND`)

---

### 2.6. 4-Bit DIP Switch (`DIP_SWITCH_4`)
- **Kategori:** Giriş / Kaynak (`io`)
- **Açıklama:** Tek bir gövdede 4 bağımsız toggle anahtar barındırır. 4-bitlik ikili veri girişleri için kablo kalabalığını önler.
- **Çıkış Pinleri:**
  - `out0` (`B0`): 0. Bit (LSB)
  - `out1` (`B1`): 1. Bit
  - `out2` (`B2`): 2. Bit
  - `out3` (`B3`): 3. Bit (MSB)
- **Parametreler:** `bits` (`[0|1, 0|1, 0|1, 0|1]`)

---

### 2.7. Ondalık Sayı Girişi / Decimal Input (`DECIMAL_INPUT`)
- **Kategori:** Giriş / Kaynak (`io`)
- **Açıklama:** 0–15 arası ondalık bir sayı seçilmesini sağlar ve bu sayıyı doğrudan 4-bit ikili (binary/BCD) hatlara dönüştürerek çıkış verir.
- **Çıkış Pinleri:**
  - `out0` (`B0`): $2^0$ (1'ler basamağı)
  - `out1` (`B1`): $2^1$ (2'ler basamağı)
  - `out2` (`B2`): $2^2$ (4'ler basamağı)
  - `out3` (`B3`): $2^3$ (8'ler basamağı)
- **Parametreler:** `value` (0 - 15)

---

## 3. Çıkışlar ve Göstergeler (Outputs & Displays)

### 3.1. LED Gösterge (`LED`)
- **Kategori:** Gösterge (`display`)
- **Açıklama:** Giriş sinyali `1` olduğunda neon ışıma ile yanar. Inspector panelinden rengi seçilebilir.
- **Giriş Pinleri:** `in` (`IN`)
- **Parametreler:** `color` (Yeşil, Kırmızı, Mavi, Sarı, Mor), `label`

---

### 3.2. Lojik Prob / Logic Probe (`PROBE`)
- **Kategori:** Gösterge (`display`)
- **Açıklama:** Bağlı olduğu hattın anlık 4 durumlu sinyal değerini (`0`, `1`, `Z` - Yüzer, `X` - Çakışma) doğrudan dijital ekranında gösterir.
- **Giriş Pinleri:** `in` (`IN`)

---

### 3.3. 7-Segment Ekran (`SEVEN_SEGMENT`)
- **Kategori:** Gösterge (`display`)
- **Açıklama:** Klasik ortak katotlu 7-segment dijital gösterge. Her bir segment bağımsız bir giriş pini ile yakılır.
- **Giriş Pinleri:**
  - `a`, `b`, `c`, `d`, `e`, `f`, `g`: Segment kontrol girişleri

---

### 3.4. Sayısal Gösterge / Decimal Display (`DECIMAL_DISPLAY`)
- **Kategori:** Gösterge (`display`)
- **Açıklama:** 4-bitlik ikili girişi doğrudan okuyarak büyük ve net bir ondalık sayı (`0`–`15`) ve Hex karakteri (`0`–`F`) olarak ekranda gösterir.
- **Giriş Pinleri:**
  - `in0` (`B0`): LSB ($2^0$)
  - `in1` (`B1`): $2^1$
  - `in2` (`B2`): $2^2$
  - `in3` (`B3`): MSB ($2^3$)

---

## 4. Kombinasyonel ve Aritmetik Bloklar (Combinational Blocks)

### 4.1. Yarım Toplayıcı / Half Adder (`HALF_ADDER`)
- **Kategori:** Blok (`block`)
- **Açıklama:** İki tek bitlik sayıyı ($A$ ve $B$) toplar; Toplam ($\Sigma$) ve Elde ($C$) çıkışı üretir.
- **Giriş Pinleri:** `a` (`A`), `b` (`B`)
- **Çıkış Pinleri:**
  - `sum` ($\Sigma$): Toplam ($A \oplus B$)
  - `carry` ($C$): Elde ($A \cdot B$)
- **Doğruluk Tablosu:**
  | A | B | $\Sigma$ (Sum) | C (Carry) |
  |:-:|:-:|:--------------:|:---------:|
  | 0 | 0 |       0        |     0     |
  | 0 | 1 |       1        |     0     |
  | 1 | 0 |       1        |     0     |
  | 1 | 1 |       0        |     1     |

---

### 4.2. Tam Toplayıcı Entegre Bloğu / Full Adder (`FULL_ADDER_BLOCK`)
- **Kategori:** Blok (`block`)
- **Açıklama:** İki bit ($A, B$) ve önceki basamaktan gelen Elde Girişini ($C_{in}$) toplayarak Toplam ($\Sigma$) ve yeni Elde Çıkışı ($C_{out}$) üretir. Çok bitli toplayıcı zincirleri (Ripple Carry Adder) kurmak için kullanılır.
- **Giriş Pinleri:**
  - `a` (`A`): Giriş A
  - `b` (`B`): Giriş B
  - `cin` (`Cin`): Elde Girişi
- **Çıkış Pinleri:**
  - `sum` ($\Sigma$): Toplam ($A \oplus B \oplus Cin$)
  - `cout` (`Cout`): Elde Çıkışı ($A \cdot B + Cin \cdot (A \oplus B)$)
- **Doğruluk Tablosu:**
  | A | B | Cin | $\Sigma$ (Sum) | Cout |
  |:-:|:-:|:---:|:--------------:|:----:|
  | 0 | 0 |  0  |       0        |  0   |
  | 0 | 0 |  1  |       1        |  0   |
  | 0 | 1 |  0  |       1        |  0   |
  | 0 | 1 |  1  |       0        |  1   |
  | 1 | 0 |  0  |       1        |  0   |
  | 1 | 0 |  1  |       0        |  1   |
  | 1 | 1 |  0  |       0        |  1   |
  | 1 | 1 |  1  |       1        |  1   |

---

### 4.3. BCD $\rightarrow$ 7-Segment Çözücü (`BCD_TO_7SEG`)
- **Kategori:** Blok (`block`)
- **Açıklama:** 4-bitlik ikili/BCD girişini standart 7-segment ekran çizgilerine (`a`–`g`) çözer.
- **Giriş Pinleri:** `in0` (`B0`), `in1` (`B1`), `in2` (`B2`), `in3` (`B3`)
- **Çıkış Pinleri:** `a`, `b`, `c`, `d`, `e`, `f`, `g`

---

### 4.4. 4-to-16 Hat Çözücü / Binary to Decimal Decoder (`BIN_TO_DEC`)
- **Kategori:** Blok (`block`)
- **Açıklama:** 4-bitlik ikili adresi çözer ve karşılık gelen 16 çıkış hattından (`out0`–`out15`) yalnızca birini `1` yapar (Adres çözümleme / Demultiplexing).
- **Giriş Pinleri:** `in0` .. `in3`
- **Çıkış Pinleri:** `out0` .. `out15`

---

### 4.5. 16-to-4 Öncelikli Kodlayıcı / Decimal to Binary Encoder (`DEC_TO_BIN`)
- **Kategori:** Blok (`block`)
- **Açıklama:** 16 aktif giriş hattından en yüksek değerli olanını 4-bitlik ikili koda dönüştürür.
- **Giriş Pinleri:** `in0` .. `in15`
- **Çıkış Pinleri:** `out0` .. `out3` (4-bit binary)

---

## 5. Ardışıl ve Hafıza Elemanları (Sequential & Memory)

### 5.1. D Flip-Flop (`D_FLIP_FLOP`)
- **Kategori:** Ardışıl / Hafıza (`sequential`)
- **Açıklama:** Saat darbesinin **yükselen kenarında ($0 \rightarrow 1$)** D girişindeki veriyi örnekler ve dahili hafızasında saklar. Çift aşamalı (two-phase) senkron örnekleme motoru ile gecikmeli toplayıcı hatlarında dahi glitch yaşamadan güvenle çalışır.
- **Giriş Pinleri:**
  - `d` (`D`): Veri Girişi
  - `clk` (`CLK`): Saat Girişi (Yükselen Kenar Tetiklemeli)
- **Çıkış Pinleri:**
  - `q` (`Q`): Saklanan Durum Çıkışı
  - `qbar` (`Q̄`): Terslenmiş Durum Çıkışı
- **Davranış Tablosu:**
  | CLK Durumu | D | $Q_{next}$ | $\overline{Q}_{next}$ | İşlem |
  |:----------:|:-:|:----------:|:---------------------:|:------|
  | $\uparrow$ ($0 \rightarrow 1$) | 0 | 0 | 1 | Sıfırla (Reset) |
  | $\uparrow$ ($0 \rightarrow 1$) | 1 | 1 | 0 | Bir Yap (Set) |
  | $0$, $1$ veya $\downarrow$ | X | Q | $\overline{Q}$ | Hafızada Tut (Hold) |

---

### 5.2. SR Latch (`SR_LATCH`)
- **Kategori:** Ardışıl / Hafıza (`sequential`)
- **Açıklama:** Temel 1-bit asenkron bellek hücresi. `S` (Set) girişi ile çıkış `1` yapılır, `R` (Reset) girişi ile çıkış `0` yapılır. İkisi de `0` iken eski durum korunur.
- **Giriş Pinleri:**
  - `s` (`S`): Set Girişi ($Q = 1$)
  - `r` (`R`): Reset Girişi ($Q = 0$)
- **Çıkış Pinleri:**
  - `q` (`Q`): Hafıza Çıkışı
  - `qbar` (`Q̄`): Terslenmiş Hafıza Çıkışı
- **Davranış Tablosu:**
  | S | R | $Q_{next}$ | $\overline{Q}_{next}$ | Açıklama |
  |:-:|:-:|:----------:|:---------------------:|:---------|
  | 0 | 0 | Q | $\overline{Q}$ | Durumu Koru (Hold) |
  | 1 | 0 | 1 | 0 | Set ($Q=1$) |
  | 0 | 1 | 0 | 1 | Reset ($Q=0$) |
  | 1 | 1 | X | X | Geçersiz / Yasak Durum (Contention) |

---

## 6. Sinyal Mantığı Motoru (4-Valued Signal Engine)

GateLab simülatörü gerçek dünya dijital elektronik standartlarına uygun **4 durumlu (4-valued logic)** bir motor ile çalışır:

| Sinyal Değeri | Renk | Anlamı ve Tanımı |
|:---:|:---:|:---|
| **`0`** | Gri / Slate (`#475569`) | **LOW (Mantıksal Sıfır):** Toprak referansı (GND). |
| **`1`** | Neon Zümrüt (`#10b981`) | **HIGH (Mantıksal Bir):** Pozitif gerilim (VCC). |
| **`Z`** | Amber Sarı (`#f59e0b`) | **High-Impedance (Yüksek Empedans / Yüzer):** Hat sürülmüyor veya Tri-State tampon kapalı. |
| **`X`** | Neon Kırmızı (`#ef4444`) | **Contention / Conflict (Çakışma):** İki farklı çıkışın aynı kabloya biri `1`, diğeri `0` vermesi sonucu oluşan kısa devre/hata durumu. |

---

## 7. Veri Yolu (Bus) Bileşenleri

GateLab, çok bitli veri yollarını (8-Bit bus) birinci sınıf vatandaş (first-class citizen) olarak destekler. Veri yolu kabloları kalın çizilir ve üzerinde anlık hexadecimal değer rozeti (örn. `0x08`) gösterilir.

### 7.1. 8-Bit Veri Yolu Ayırıcı (`BUS_SPLIT`)
- **Kategori:** Veri Yolu (`bus`)
- **Açıklama:** 8-bitlik bir veri yolunu 8 bağımsız tek-bit çıkışına ayırır (`out0` = LSB, `out7` = MSB).
- **Giriş:** `in` (8-Bit Bus)
- **Çıkışlar:** `out0`, `out1`, `out2`, `out3`, `out4`, `out5`, `out6`, `out7` (1-Bit)

### 7.2. 8-Bit Veri Yolu Birleştirici (`BUS_MERGE`)
- **Kategori:** Veri Yolu (`bus`)
- **Açıklama:** 8 adet tek-bit giriş hattını (`in0` = LSB, `in7` = MSB) tek bir 8-bitlik veri yolunda birleştirir.
- **Girişler:** `in0` .. `in7` (1-Bit)
- **Çıkış:** `out` (8-Bit Bus)

### 7.3. Sabit 8-Bit Veri Değeri (`BUS_CONST`)
- **Kategori:** Veri Yolu (`bus`)
- **Açıklama:** Belirlenen sabit 8-bitlik değeri (0–255 / 0x00–0xFF) sürekli olarak veri yoluna basar.
- **Parametreler:** `value` (0–255)
- **Çıkış:** `out` (8-Bit Bus)

---

## 8. Çoklayıcı ve Dağıtıcılar (Multiplexers & Demultiplexers)

### 8.1. 2:1 Çoklayıcı (`MUX_2`)
- **Kategori:** Çoklayıcı (`mux`)
- **Açıklama:** `SEL=0` iken `D0`, `SEL=1` iken `D1` girişini `Y` çıkışına aktarır.
- **Girişler:** `d0`, `d1`, `sel`
- **Çıkış:** `out` (`Y`)

### 8.2. 2:1 8-Bit Veri Yolu Çoklayıcısı (`MUX_2x8`)
- **Kategori:** Çoklayıcı (`mux`)
- **Açıklama:** İki 8-bitlik veri yolu arasında seçim yapar (`SEL=0` $\rightarrow$ `D0[7:0]`, `SEL=1` $\rightarrow$ `D1[7:0]`). Akümülatör mimarisinde sıfırlama veya yeni veri yükleme seçimi için idealdir.
- **Girişler:** `d0` (8-Bit Bus), `d1` (8-Bit Bus), `sel` (1-Bit)
- **Çıkış:** `out` (`Y`, 8-Bit Bus)

### 8.3. 4:1 Çoklayıcı (`MUX_4`)
- **Kategori:** Çoklayıcı (`mux`)
- **Açıklama:** 2-bitlik seçim hattı (`S1`, `S0`) ile 4 veri girişinden (`D0`–`D3`) birini seçer.
- **Girişler:** `d0`, `d1`, `d2`, `d3`, `s0`, `s1`
- **Çıkış:** `out` (`Y`)

### 8.4. 8:1 Çoklayıcı (`MUX_8`)
- **Kategori:** Çoklayıcı (`mux`)
- **Açıklama:** 3-bitlik seçim hattı (`S2`, `S1`, `S0`) ile 8 veri girişinden (`D0`–`D7`) birini seçer.
- **Girişler:** `d0` .. `d7`, `s0`, `s1`, `s2`
- **Çıkış:** `out` (`Y`)

### 8.5. 1:2 Dağıtıcı (`DEMUX_1_2`)
- **Kategori:** Dağıtıcı (`mux`)
- **Açıklama:** Tek bir girişi `SEL=0` iken `Y0` çıkışına, `SEL=1` iken `Y1` çıkışına yönlendirir. Aktif olmayan çıkış `0` olur.
- **Girişler:** `in`, `sel`
- **Çıkışlar:** `out0` (`Y0`), `out1` (`Y1`)

---

## 9. Gelişmiş Ardışıl Devreler ve Kütükler (Registers & Flip-Flops)

### 9.1. Asenkron Sıfırlamalı D Flip-Flop (`D_FF_RESET`)
- **Kategori:** Ardışıl / Hafıza (`sequential`)
- **Açıklama:** Asenkron `CLR` girişine sahip D-FF. `CLR=1` olduğunda saat darbesinden bağımsız anında `Q=0` olur. `CLR=0` iken saat yükselen kenarında `D` saklanır.
- **Girişler:** `d`, `clk`, `clr`
- **Çıkışlar:** `q`, `qbar`

### 9.2. Yetkilendirmeli (Enable) D Flip-Flop (`D_FF_ENABLE`)
- **Kategori:** Ardışıl / Hafıza (`sequential`)
- **Açıklama:** Yalnızca `EN=1` iken saat darbesinde `D` girişini saklayan D-FF. `EN=0` iken saat darbesi gelse dahi eski değer korunur.
- **Girişler:** `d`, `clk`, `en`
- **Çıkışlar:** `q`, `qbar`

### 9.3. 8-Bit Yüklemeli ve Asenkron Sıfırlamalı Kütük (`REGISTER_8`)
- **Kategori:** Ardışıl / Hafıza (`sequential`)
- **Açıklama:** Asenkron sıfırlamalı ve senkron yüklemeli 8-bit saklama kütüğü (Accumulator Register).
  - `CLR=1`: Asenkron anında sıfırlama ($Q \leftarrow 0\text{x}00$) — saat darbesinden bağımsızdır.
  - `LOAD=1`: Saat darbesinin yükselen kenarında ($0 \rightarrow 1$) ve `CLR=0` iken $D[7:0]$ verisi $Q[7:0]$'a aktarılır.
  - `LOAD=0`: Saat darbesinde dahi eski değer korunur.
- **Girişler:** `d` (8-Bit Bus), `clk`, `load`, `clr`
- **Çıkış:** `q` (8-Bit Bus)

---

## 10. 8-Bit Aritmetik ve Mantık

### 10.1. 8-Bit Tam Toplayıcı (`ADDER_8`)
- **Kategori:** Aritmetik (`arithmetic`)
- **Açıklama:** İki 8-bitlik sayıyı ve elde girişini toplayarak 8-bit toplam ve bayraklar üretir:
  $$S[7:0] = A[7:0] + B[7:0] + CIN$$
- **Girişler:** `a` (8-Bit Bus), `b` (8-Bit Bus), `cin` (1-Bit Elde Girişi)
- **Çıkışlar:**
  - `s` (8-Bit Toplam Veri Yolu, $S$)
  - `cout` (8-Bit Elde Çıkışı, Carry Flag)
  - `ovf` (2'ye tümleyen işaretli taşma bayrağı: $OVF = C_6 \oplus C_7$)

### 10.2. 8-Bit Sıfır Algılayıcı (`ZERO_DETECT_8`)
- **Kategori:** Aritmetik (`arithmetic`)
- **Açıklama:** Girişindeki 8-bitlik veri yolunun tüm bitleri `0` ise çıkışında `1` (Zero Flag) üretir ($Z = \overline{IN_0 \lor \dots \lor IN_7}$). ALU durum bayrağı olarak kullanılır.
- **Giriş:** `in` (8-Bit Bus)
- **Çıkış:** `zero` (`Z`, 1-Bit)

---

## 11. 8-Bit Giriş ve Çıkış Elemanları

### 11.1. 8-Bit DIP Anahtar (`DIP_SWITCH_8`)
- **Kategori:** Giriş (`io`)
- **Açıklama:** 8 bağımsız mikro anahtar ile tuval üzerinde doğrudan 8-bitlik veri yolu üretir. Hexadecimal ve ondalık değer önizlemesi sunar.
- **Çıkış:** `out` (8-Bit Bus)

### 11.2. 8-Bit Sayısal Giriş Üreteci (`BYTE_INPUT`)
- **Kategori:** Giriş (`io`)
- **Açıklama:** -10, -1, +1, +10 butonları veya doğrudan giriş ile 0–255 (0x00–0xFF) arasında değer üreten 8-bit veri kaynağı.
- **Çıkış:** `out` (8-Bit Bus)

### 11.3. Manuel Adım Saati Butonu (`MANUAL_CLOCK`)
- **Kategori:** Giriş (`io`)
- **Açıklama:** Her tıklamada tek ve temiz bir saat darbesi ($0 \rightarrow 1 \rightarrow 0$) üretir. Akümülatör ve işlemci devrelerini adım adım (single-step) hata ayıklamak için kullanılır.
- **Çıkış:** `out` (`CLK`, 1-Bit)

### 11.4. 8-Bit Sayısal Gösterge (`BYTE_DISPLAY`)
- **Kategori:** Gösterge (`display`)
- **Açıklama:** 8-bit veri yolunu büyük dijital yazı ile HEX (`0x00`–`0xFF`), DEC (`0`–`255`) veya BIN modunda gösterir.
- **Giriş:** `in` (8-Bit Bus)

### 11.5. 8-Bit Optik LED Çubuğu (`LED_BAR_8`)
- **Kategori:** Gösterge (`display`)
- **Açıklama:** 8-bitlik veri yolunun her bir bitini ayrı ayrı yanan 8 adet optik LED sütunu olarak görselleştirir.
- **Giriş:** `in` (8-Bit Bus)

### 11.6. 8-Bit Veri Yolu Probu (`BUS_PROBE`)
- **Kategori:** Gösterge (`display`)
- **Açıklama:** Test ve analiz amaçlı kompakt 8-bit veri yolu göstergesi. Değerleri HEX, DEC veya BIN modunda gösterir. Lojik Analizöre tek tıkla bağlanabilir.
- **Giriş:** `in` (8-Bit Bus)

### 11.7. Metin Etiketi / Not (`LABEL`)
- **Kategori:** Giriş & Açıklama (`io`)
- **Açıklama:** Sinyalleri, veri yollarını (`ACC_BUS`, `DATA_IN`) ve kontrol bloklarını adlandırmak için tuval üzerine metin notu ekler. Giriş/çıkış pini yoktur.

---

## 12. Test, Ölçüm ve Zamanlama Araçları (Analysis & Waveform Tools)

### 12.1. Lojik Analizör ve Dalga Formu Motoru (`Logic Analyzer`)
- **Açıklama:** Tuvalin altında açılabilen sanal osiloskop / lojik analizör paneli. Akümülatör ve ardışıl mantık devrelerindeki sinyal geçişlerini zaman ekseninde görselleştirir.
- **Önemli Özellikler:**
  - **Ayrık Simülasyon Zamanı (`steadyStateTick`):** Örnekleme yalnızca devre kararlı duruma ulaştığında (steady state) yapılır; ara netlist adımlarındaki geçici glitch'ler filtrelenir.
  - **3-Mask Generic Değer Temsili:** `{ value, xMask, zMask }` yapısıyla 1-bit veya çok bitli veri yollarında kısmi belirsizlikler (`0x0X`, `0xX5`, `0xZZ`) tam doğrulukla saklanır ve çizilir.
  - **VCD Değer Değişimi & `baseSample`:** Yalnızca değer değiştiğinde geçiş kaydedilir. Sabit kapasiteli (256 geçiş) tampon dolup eski kayıtlar silindiğinde son değer `baseSample` alanında korunarak pencere başında veri kaybı önlenir.
  - **GTKWave / ModelSim Tarzı Çizim:** 1-bit hatlar için kare dalga, çok bitli hatlar için heksagonal veri yolu zarfları (`< 0x05 >`) ve fare zaman imleci (`t = X`).

