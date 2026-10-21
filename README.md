# GateLab — Logic Circuit Playground ⚡

Modern, hızlı ve React Flow tabanlı etkileşimli mantıksal devre simülatörü.

![GateLab Preview](https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg)

## 🌟 Özellikler

- **Saf TypeScript Simülasyon Motoru (`src/engine/`)**: UI'dan tamamen bağımsız, test edilebilir ve deterministik.
- **4-Değerli Mantık (`Signal`)**:
  - `0`: LOW (Toprak / 0V)
  - `1`: HIGH (5V / Güç)
  - `'Z'`: Yüksek Empedans (Tri-state açık hat)
  - `'X'`: Bilinmeyen / Çakışma (Bus contention)
- **Canlı Kablo Renklendirmesi (`SignalEdge`)**:
  - HIGH: Parlak neon zümrüt yeşili (`#10b981`) + hareketli sinyal akış animasyonu
  - LOW: Koyu arduvaz (`#475569`)
  - CONFLICT (X): Hata kırmızısı (`#ef4444`)
  - FLOATING (Z): Kehribar sarısı (`#f59e0b`)
- **Hazır Şablonlar (Templates)**:
  - **Full Adder (1-bit Tam Toplayıcı - 2x XOR, 2x AND, 1x OR)** (Varsayılan devre)
  - **Half Adder (Yarım Toplayıcı)**
  - **SR Latch (Geri beslemeli NOR hafıza hücresi)**
  - **Clock & D Flip-Flop (Sayaç / Frekans Bölücü)**
- **Otomatik Doğruluk Tablosu (Truth Table Generator)**: Devredeki giriş ve çıkışları tarayarak tüm $2^N$ kombinasyonu saniyeler içinde simüle eden analiz aracı.
- **Kapsamlı Parça Kütüphanesi**:
  - Kapılar: AND, OR, NOT, XOR, NAND, NOR, XNOR, BUFFER, TRI-STATE
  - Girişler: Toggle Switch, Push Button, Clock Jeneratörü, +5V (VCC), 0V (GND)
  - Çıkışlar: Çok renkli Neon LED, Dijital Prob, 7-Segment Display
  - Bloklar: Half Adder, Full Adder IC, D Flip-Flop, SR Latch
- **Geri Al / İleri Al (Undo / Redo)** ve **JSON Dışa / İçe Aktar**.

## 🚀 Başlangıç

```bash
# Bağımlılıkları yükleyin
pnpm install

# Testleri çalıştırın
pnpm test

# Geliştirme sunucusunu başlatın
pnpm dev

# Üretim derlemesi
pnpm build
```

## 📐 Mimari

```
src/
  engine/                # Saf TypeScript motoru (React yok!)
    signal.ts            # 4-değerli mantık ve sinyal çözümleme
    types.ts             # Devre ve bileşen tipleri
    netlist.ts           # Union-Find tabanlı elektriksel düğüm çıkarıcı
    simulator.ts         # Settle döngüsü ve geri besleme koruması
    simulator.test.ts    # Vitest motor testleri (Full Adder 8 durum testi dahil)
  components-lib/
    registry.ts          # Tüm parça tanımları ve eval fonksiyonları
  editor/
    Canvas.tsx           # React Flow tuvali ve etkileşim
    Palette.tsx          # Sol parça seçim paneli
    Toolbar.tsx          # Oynat/Duraklat, Hız, Şablonlar, JSON İçe/Dışa Aktar
    Inspector.tsx        # Seçili parça ayarları (etiket, LED rengi, frekans)
    nodes/               # Kapı ve eleman görselleri (ANSI/IEEE SVG'ler)
    edges/               # Canlı sinyal kablosu (SignalEdge)
  panels/
    TruthTableModal.tsx  # Otomatik doğruluk tablosu
  templates/
    circuits.ts          # Hazır devre şablonları
  store/
    circuitStore.ts      # Zustand devre durumu ve geçmiş yönetimi
```
