# GateLab — Logic Circuit Playground ⚡ (Next.js Edition)

Modern, hızlı ve React Flow tabanlı etkileşimli mantıksal devre simülatörü.

![GateLab Preview](https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NextJS-Dark.svg)

## 🌟 Özellikler

- **Next.js App Router (Son Sürüm: Next.js 16+, React 19)**: Yüksek performans, SEO ve gelecekteki galeri / devre paylaşım URL'leri (`/c/[id]`) için tam hazır altyapı.
- **Saf TypeScript Simülasyon Motoru (`src/engine/`)**: UI'dan ve çatıdan tamamen bağımsız, deterministik ve headless test edilebilir.
- **4-Değerli Mantık (`Signal`)**:
  - `0`: LOW (Toprak / 0V)
  - `1`: HIGH (5V / Güç)
  - `'Z'`: Yüksek Empedans (Tri-state açık hat)
  - `'X'`: Bilinmeyen / Çakışma (Bus contention)
- **Canlı Kablo Renklendirmesi (`SignalEdge`)**:
  - HIGH: Parlak neon zümrüt yeşili (`#10b981`) + parıldama (glow) + akan sinyal animasyonu
  - LOW: Koyu arduvaz (`#475569`)
  - CONFLICT (X): Hata kırmızısı (`#ef4444`)
  - FLOATING (Z): Kehribar sarısı (`#f59e0b`)
- **Hazır Şablonlar & Başlangıç Modalı**:
  - **Full Adder (1-bit Tam Toplayıcı - 2x XOR, 2x AND, 1x OR)** (Önerilen test devresi)
  - **Half Adder (Yarım Toplayıcı)**
  - **SR Latch (Geri beslemeli NOR hafıza hücresi)**
  - **Clock & D Flip-Flop (Sayaç / Frekans Bölücü)**
- **Otomatik Doğruluk Tablosu (Truth Table Generator)**: Devredeki giriş ve çıkışları tarayarak tüm $2^N$ kombinasyonu saniyeler içinde simüle eden analiz aracı.
- **JSON Dışa / İçe Aktar (Export / Import)**: Devrenizi JSON olarak indirme veya önceden kaydedilmiş devre dosyasını açma.
- **Gizlenebilir Sol Panel (Sidebar)** ve **Tam Ekran (Fullscreen)** modu.
- **Geri Al / İleri Al (Undo / Redo)** ve **Elle Başlatılan Simülasyon (Start/Pause/Step)**.

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

# Üretim sunucusunu çalıştırın
pnpm start
```

## 📐 Klasör Mimarisi

```
src/
  app/                   # Next.js App Router
    layout.tsx           # Global HTML, dark mode & metadata
    page.tsx             # Ana sayfa (Client dynamic import)
    globals.css          # Tailwind CSS & özel animasyonlar
  engine/                # Saf TypeScript simülasyon motoru (React yok!)
    signal.ts            # 4-değerli mantık ve sinyal çözümleme
    types.ts             # Devre ve bileşen tipleri
    netlist.ts           # Union-Find tabanlı elektriksel düğüm çıkarıcı
    simulator.ts         # Settle döngüsü ve geri besleme koruması
    simulator.test.ts    # Full Adder ve kapı testleri
    storage.test.ts      # JSON dışa/içe aktarım testleri
  components-lib/
    registry.ts          # Kapı ve parça tanımları
  editor/
    Canvas.tsx           # React Flow tuvali ve etkileşim
    Palette.tsx          # Açılır/kapanır parça seçim paneli
    Toolbar.tsx          # Simülasyon kontrolleri, tam ekran, şablonlar
    Inspector.tsx        # Seçili parça ayarları
    nodes/               # ANSI/IEEE kapı ve gösterge bileşenleri
    edges/               # Canlı sinyal kablosu (SignalEdge)
  panels/
    TruthTableModal.tsx  # Otomatik doğruluk tablosu
    WelcomeModal.tsx     # Başlangıç ve şablon seçim ekranı
  templates/
    circuits.ts          # Hazır devre şablonları
  store/
    circuitStore.ts      # Zustand durum yönetimi
```
