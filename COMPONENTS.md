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
