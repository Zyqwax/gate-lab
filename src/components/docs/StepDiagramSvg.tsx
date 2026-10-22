import React from 'react';

interface StepDiagramSvgProps {
  type: string;
  className?: string;
}

export const StepDiagramSvg: React.FC<StepDiagramSvgProps> = ({ type, className = 'w-full h-auto' }) => {
  // Full Adder Steps
  if (type === 'fa-step-1') {
    return (
      <svg viewBox="0 0 600 220" className={className} fill="none">
        <rect width="600" height="220" rx="12" fill="#020617" stroke="#1e293b" />
        <g transform="translate(40, 30)">
          <rect width="100" height="40" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <text x="50" y="24" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Giriş A (1)</text>
          <circle cx="100" cy="20" r="4" fill="#10b981" />
        </g>
        <g transform="translate(40, 90)">
          <rect width="100" height="40" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <text x="50" y="24" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Giriş B (1)</text>
          <circle cx="100" cy="20" r="4" fill="#10b981" />
        </g>
        <g transform="translate(40, 150)">
          <rect width="100" height="40" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <text x="50" y="24" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Cin (0)</text>
          <circle cx="100" cy="20" r="4" fill="#475569" />
        </g>
        <text x="350" y="115" fill="#64748b" fontSize="13" fontStyle="italic" fontFamily="sans-serif" textAnchor="middle">
          3 giriş anahtarı yerleştirildi (Sinyal akışı için hazır)
        </text>
      </svg>
    );
  }

  if (type === 'fa-step-2') {
    return (
      <svg viewBox="0 0 600 220" className={className} fill="none">
        <rect width="600" height="220" rx="12" fill="#020617" stroke="#1e293b" />
        {/* Inputs */}
        <g transform="translate(30, 40)">
          <rect width="80" height="35" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="40" y="22" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A = 1</text>
        </g>
        <g transform="translate(30, 100)">
          <rect width="80" height="35" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="40" y="22" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">B = 1</text>
        </g>
        {/* XOR 1 */}
        <path d="M 110 57 L 220 57" stroke="#10b981" strokeWidth="2.5" />
        <path d="M 110 117 L 160 117 L 160 77 L 220 77" stroke="#10b981" strokeWidth="2.5" />
        <g transform="translate(220, 40)">
          <rect width="90" height="50" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
          <text x="45" y="30" fill="#a5b4fc" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">XOR 1</text>
        </g>
        {/* AND 1 */}
        <path d="M 140 57 L 140 145 L 220 145" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
        <path d="M 160 117 L 160 165 L 220 165" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
        <g transform="translate(220, 130)">
          <rect width="90" height="50" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
          <text x="45" y="30" fill="#6ee7b7" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">AND 1</text>
        </g>
        {/* Partial outputs */}
        <path d="M 310 65 L 420 65" stroke="#475569" strokeWidth="2.5" />
        <text x="430" y="69" fill="#94a3b8" fontSize="11" fontFamily="monospace">A ⊕ B = 0</text>
        <path d="M 310 155 L 420 155" stroke="#10b981" strokeWidth="2.5" />
        <text x="430" y="159" fill="#10b981" fontSize="11" fontFamily="monospace">A · B = 1 (Elde)</text>
      </svg>
    );
  }

  if (type === 'fa-step-3') {
    return (
      <svg viewBox="0 0 600 220" className={className} fill="none">
        <rect width="600" height="220" rx="12" fill="#020617" stroke="#1e293b" />
        {/* Full Adder Schematic summary */}
        <g transform="translate(20, 20)">
          <rect width="60" height="28" rx="4" fill="#0f172a" stroke="#334155" />
          <text x="30" y="18" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A (1)</text>
        </g>
        <g transform="translate(20, 60)">
          <rect width="60" height="28" rx="4" fill="#0f172a" stroke="#334155" />
          <text x="30" y="18" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">B (1)</text>
        </g>
        <g transform="translate(20, 150)">
          <rect width="60" height="28" rx="4" fill="#0f172a" stroke="#334155" />
          <text x="30" y="18" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Cin (0)</text>
        </g>

        {/* Stage 1 */}
        <g transform="translate(140, 35)">
          <rect width="70" height="40" rx="6" fill="#1e1b4b" stroke="#6366f1" />
          <text x="35" y="24" fill="#c7d2fe" fontSize="11" fontWeight="bold" textAnchor="middle">XOR 1</text>
        </g>
        <g transform="translate(140, 95)">
          <rect width="70" height="40" rx="6" fill="#064e3b" stroke="#10b981" />
          <text x="35" y="24" fill="#a7f3d0" fontSize="11" fontWeight="bold" textAnchor="middle">AND 1</text>
        </g>

        {/* Stage 2 */}
        <g transform="translate(300, 45)">
          <rect width="70" height="40" rx="6" fill="#1e1b4b" stroke="#6366f1" />
          <text x="35" y="24" fill="#c7d2fe" fontSize="11" fontWeight="bold" textAnchor="middle">XOR 2</text>
        </g>
        <g transform="translate(300, 130)">
          <rect width="70" height="40" rx="6" fill="#064e3b" stroke="#10b981" />
          <text x="35" y="24" fill="#a7f3d0" fontSize="11" fontWeight="bold" textAnchor="middle">AND 2</text>
        </g>

        {/* Stage 3 (OR) */}
        <g transform="translate(420, 110)">
          <rect width="60" height="40" rx="6" fill="#312e81" stroke="#818cf8" />
          <text x="30" y="24" fill="#e0e7ff" fontSize="11" fontWeight="bold" textAnchor="middle">OR</text>
        </g>

        {/* Outputs */}
        <g transform="translate(510, 40)">
          <circle cx="20" cy="25" r="16" fill="#0f172a" stroke="#475569" strokeWidth="2" />
          <text x="20" y="29" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Σ = 0</text>
        </g>
        <g transform="translate(510, 115)">
          <circle cx="20" cy="25" r="16" fill="#10b981" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 0 8px #10b981)" />
          <text x="20" y="29" fill="#020617" fontSize="10" fontWeight="black" fontFamily="monospace" textAnchor="middle">C = 1</text>
        </g>

        {/* Connecting Lines */}
        <line x1="80" y1="34" x2="140" y2="45" stroke="#10b981" strokeWidth="2" />
        <line x1="80" y1="74" x2="140" y2="65" stroke="#10b981" strokeWidth="2" />
        <line x1="210" y1="55" x2="300" y2="55" stroke="#475569" strokeWidth="2" />
        <line x1="80" y1="164" x2="300" y2="75" stroke="#475569" strokeWidth="2" />
        <line x1="370" y1="65" x2="510" y2="65" stroke="#475569" strokeWidth="2" />
        <line x1="210" y1="115" x2="420" y2="120" stroke="#10b981" strokeWidth="2" />
        <line x1="370" y1="150" x2="420" y2="140" stroke="#475569" strokeWidth="2" />
        <line x1="480" y1="130" x2="510" y2="140" stroke="#10b981" strokeWidth="2.5" />
      </svg>
    );
  }

  // BCD to 7-Segment Steps
  if (type === 'bcd-step-1') {
    return (
      <svg viewBox="0 0 600 200" className={className} fill="none">
        <rect width="600" height="200" rx="12" fill="#020617" stroke="#1e293b" />
        <g transform="translate(60, 45)">
          <rect width="180" height="110" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
          <text x="90" y="30" fill="#10b981" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">DECIMAL INPUT</text>
          <rect x="50" y="45" width="80" height="40" rx="6" fill="#020617" stroke="#334155" />
          <text x="90" y="72" fill="#38bdf8" fontSize="22" fontWeight="black" fontFamily="monospace" textAnchor="middle">7</text>
          <text x="90" y="100" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">BIN: 0111 (B3..B0)</text>
        </g>
        <text x="400" y="105" fill="#94a3b8" fontSize="13" fontFamily="sans-serif" textAnchor="middle">
          4-bit ikili veri kaynağı hazır (B3=0, B2=1, B1=1, B0=1)
        </text>
      </svg>
    );
  }

  if (type === 'bcd-step-2') {
    return (
      <svg viewBox="0 0 600 200" className={className} fill="none">
        <rect width="600" height="200" rx="12" fill="#020617" stroke="#1e293b" />
        <g transform="translate(40, 50)">
          <rect width="130" height="90" rx="8" fill="#0f172a" stroke="#334155" />
          <text x="65" y="30" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">DECIMAL IN</text>
          <text x="65" y="60" fill="#10b981" fontSize="20" fontWeight="black" textAnchor="middle">7</text>
        </g>
        {/* 4 Lines */}
        <line x1="170" y1="65" x2="260" y2="65" stroke="#475569" strokeWidth="2" />
        <line x1="170" y1="80" x2="260" y2="80" stroke="#10b981" strokeWidth="2" />
        <line x1="170" y1="95" x2="260" y2="95" stroke="#10b981" strokeWidth="2" />
        <line x1="170" y1="110" x2="260" y2="110" stroke="#10b981" strokeWidth="2" />
        <g transform="translate(260, 40)">
          <rect width="140" height="110" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
          <text x="70" y="45" fill="#c7d2fe" fontSize="13" fontWeight="bold" textAnchor="middle">BCD_TO_7SEG</text>
          <text x="70" y="75" fill="#a5b4fc" fontSize="10" textAnchor="middle">4 Bit ➔ 7 Çıkış</text>
        </g>
        <text x="490" y="100" fill="#64748b" fontSize="11" textAnchor="middle">a, b, c, d, e, f, g çıkışları</text>
      </svg>
    );
  }

  if (type === 'bcd-step-3') {
    return (
      <svg viewBox="0 0 600 200" className={className} fill="none">
        <rect width="600" height="200" rx="12" fill="#020617" stroke="#1e293b" />
        <g transform="translate(30, 50)">
          <rect width="110" height="90" rx="8" fill="#0f172a" stroke="#334155" />
          <text x="55" y="30" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Sayı: 7</text>
          <text x="55" y="65" fill="#10b981" fontSize="22" fontWeight="black" textAnchor="middle">0111</text>
        </g>
        <line x1="140" y1="95" x2="220" y2="95" stroke="#38bdf8" strokeWidth="3" />
        <g transform="translate(220, 45)">
          <rect width="120" height="100" rx="8" fill="#1e1b4b" stroke="#6366f1" />
          <text x="60" y="45" fill="#c7d2fe" fontSize="11" fontWeight="bold" textAnchor="middle">BCD ÇÖZÜCÜ</text>
          <text x="60" y="70" fill="#818cf8" fontSize="9" textAnchor="middle">a, b, c aktifleştir</text>
        </g>
        <line x1="340" y1="95" x2="430" y2="95" stroke="#ef4444" strokeWidth="3" />
        {/* 7 Segment visual */}
        <g transform="translate(430, 30)">
          <rect width="100" height="135" rx="8" fill="#000000" stroke="#ef4444" strokeWidth="2" filter="drop-shadow(0 0 10px rgba(239,68,68,0.3))" />
          {/* Lit a, b, c for '7' */}
          <line x1="30" y1="25" x2="70" y2="25" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
          <line x1="72" y1="28" x2="72" y2="65" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
          <line x1="72" y1="75" x2="72" y2="110" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
          <text x="50" y="80" fill="#ffffff" fontSize="26" fontWeight="black" fontFamily="monospace" textAnchor="middle">7</text>
        </g>
      </svg>
    );
  }

  // Accumulator Steps
  if (type === 'acc-step-1') {
    return (
      <svg viewBox="0 0 600 220" className={className} fill="none">
        <rect width="600" height="220" rx="12" fill="#020617" stroke="#1e293b" />
        <g transform="translate(30, 30)">
          <rect width="130" height="50" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
          <text x="65" y="25" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">BYTE_INPUT (5)</text>
          <text x="65" y="42" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">BUS: 0x05 [7:0]</text>
        </g>
        <g transform="translate(30, 95)">
          <rect width="130" height="50" rx="8" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
          <text x="65" y="25" fill="#0ea5e9" fontSize="11" fontWeight="bold" textAnchor="middle">BUS_CONST (0)</text>
          <text x="65" y="42" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">BUS: 0x00 [7:0]</text>
        </g>
        <g transform="translate(30, 160)">
          <rect width="130" height="35" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="65" y="22" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">SEL = 1 (Veri Seç)</text>
        </g>

        {/* Bus wires to MUX */}
        <line x1="160" y1="55" x2="300" y2="70" stroke="#10b981" strokeWidth="4" />
        <line x1="160" y1="120" x2="300" y2="105" stroke="#475569" strokeWidth="4" />
        <line x1="160" y1="177" x2="330" y2="177" stroke="#f59e0b" strokeWidth="2" />

        <g transform="translate(300, 50)">
          <polygon points="10,0 80,20 80,80 10,100" fill="#1e1b4b" stroke="#f97316" strokeWidth="2" />
          <text x="45" y="55" fill="#fdba74" fontSize="12" fontWeight="black" fontFamily="monospace" textAnchor="middle">MUX 2x8</text>
        </g>

        <line x1="380" y1="100" x2="480" y2="100" stroke="#10b981" strokeWidth="4" />
        <rect x="410" y="88" width="40" height="18" rx="4" fill="#020617" stroke="#38bdf8" />
        <text x="430" y="101" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">0x05</text>
      </svg>
    );
  }

  if (type === 'acc-step-2') {
    return (
      <svg viewBox="0 0 600 220" className={className} fill="none">
        <rect width="600" height="220" rx="12" fill="#020617" stroke="#1e293b" />
        <g transform="translate(30, 60)">
          <rect width="120" height="60" rx="8" fill="#1e1b4b" stroke="#f97316" />
          <text x="60" y="35" fill="#fdba74" fontSize="12" fontWeight="bold" textAnchor="middle">Giriş MUX</text>
        </g>
        <line x1="150" y1="90" x2="260" y2="90" stroke="#10b981" strokeWidth="4" />
        <text x="205" y="80" fill="#38bdf8" fontSize="10" fontFamily="monospace">A[7:0] = 5</text>

        <g transform="translate(260, 45)">
          <rect width="140" height="120" rx="10" fill="#3b0764" stroke="#a855f7" strokeWidth="2" />
          <text x="70" y="40" fill="#e9d5ff" fontSize="14" fontWeight="black" textAnchor="middle">ADDER_8</text>
          <text x="70" y="65" fill="#c084fc" fontSize="11" textAnchor="middle">S = A + B + Cin</text>
          <rect x="30" y="80" width="80" height="25" rx="5" fill="#020617" stroke="#a855f7" />
          <text x="70" y="97" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Σ = 5 + 0 = 5</text>
        </g>

        <line x1="400" y1="105" x2="510" y2="105" stroke="#10b981" strokeWidth="4" />
        <text x="450" y="95" fill="#38bdf8" fontSize="10" fontFamily="monospace">S[7:0] = 5</text>
        <text x="330" y="195" fill="#94a3b8" fontSize="11" fontStyle="italic" textAnchor="middle">B girişi 4. adımda kütükten geri beslenecek</text>
      </svg>
    );
  }

  if (type === 'acc-step-3') {
    return (
      <svg viewBox="0 0 600 220" className={className} fill="none">
        <rect width="600" height="220" rx="12" fill="#020617" stroke="#1e293b" />
        {/* Adder */}
        <g transform="translate(30, 50)">
          <rect width="100" height="80" rx="8" fill="#3b0764" stroke="#a855f7" />
          <text x="50" y="45" fill="#e9d5ff" fontSize="11" fontWeight="bold" textAnchor="middle">ADDER_8</text>
        </g>
        <line x1="130" y1="90" x2="230" y2="90" stroke="#10b981" strokeWidth="4" />
        <text x="180" y="80" fill="#38bdf8" fontSize="9" fontFamily="monospace">S[7:0]</text>

        {/* Register 8 */}
        <g transform="translate(230, 30)">
          <rect width="150" height="120" rx="10" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
          <text x="75" y="35" fill="#c7d2fe" fontSize="13" fontWeight="black" textAnchor="middle">REGISTER_8</text>
          <text x="75" y="55" fill="#818cf8" fontSize="9" textAnchor="middle">Akümülatör Kütüğü</text>
          <rect x="35" y="70" width="80" height="30" rx="6" fill="#020617" stroke="#6366f1" />
          <text x="75" y="90" fill="#10b981" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Q: 0x05</text>
        </g>

        {/* Controls */}
        <g transform="translate(100, 160)">
          <rect width="100" height="30" rx="6" fill="#0f172a" stroke="#38bdf8" />
          <text x="50" y="20" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">STEP CLK ⤊</text>
        </g>
        <line x1="200" y1="175" x2="250" y2="135" stroke="#38bdf8" strokeWidth="2" />

        <g transform="translate(230, 160)">
          <rect width="80" height="30" rx="6" fill="#0f172a" stroke="#10b981" />
          <text x="40" y="20" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">LOAD = 1</text>
        </g>
        <line x1="270" y1="160" x2="270" y2="150" stroke="#10b981" strokeWidth="2" />

        {/* Output */}
        <line x1="380" y1="90" x2="480" y2="90" stroke="#10b981" strokeWidth="4" />
        <text x="430" y="80" fill="#38bdf8" fontSize="9" fontFamily="monospace">Q[7:0]</text>
      </svg>
    );
  }

  if (type === 'acc-step-4') {
    return (
      <svg viewBox="0 0 600 240" className={className} fill="none">
        <rect width="600" height="240" rx="12" fill="#020617" stroke="#1e293b" />
        {/* MUX */}
        <g transform="translate(20, 60)">
          <rect width="70" height="60" rx="6" fill="#1e1b4b" stroke="#f97316" />
          <text x="35" y="35" fill="#fdba74" fontSize="10" fontWeight="bold" textAnchor="middle">MUX</text>
        </g>
        <line x1="90" y1="90" x2="160" y2="90" stroke="#10b981" strokeWidth="4" />

        {/* Adder */}
        <g transform="translate(160, 50)">
          <rect width="100" height="80" rx="8" fill="#3b0764" stroke="#a855f7" strokeWidth="1.5" />
          <text x="50" y="40" fill="#e9d5ff" fontSize="11" fontWeight="bold" textAnchor="middle">ADDER_8</text>
          <text x="50" y="60" fill="#c084fc" fontSize="9" textAnchor="middle">A + B = 8</text>
        </g>
        <line x1="260" y1="90" x2="330" y2="90" stroke="#10b981" strokeWidth="4" />

        {/* Register */}
        <g transform="translate(330, 45)">
          <rect width="110" height="90" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
          <text x="55" y="35" fill="#c7d2fe" fontSize="11" fontWeight="bold" textAnchor="middle">REGISTER_8</text>
          <rect x="20" y="48" width="70" height="25" rx="4" fill="#020617" stroke="#10b981" />
          <text x="55" y="65" fill="#10b981" fontSize="12" fontWeight="black" fontFamily="monospace" textAnchor="middle">0x08</text>
        </g>

        {/* FEEDBACK LOOP LINE: Reg Q -> Adder B */}
        <path d="M 440 90 L 460 90 L 460 180 L 210 180 L 210 130" stroke="#38bdf8" strokeWidth="3.5" fill="none" strokeDasharray="6,4" />
        <rect x="290" y="168" width="130" height="22" rx="4" fill="#020617" stroke="#38bdf8" />
        <text x="355" y="183" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">FEEDBACK Q[7:0] ➔ B</text>

        {/* Output Displays */}
        <g transform="translate(480, 45)">
          <rect width="100" height="50" rx="6" fill="#020617" stroke="#10b981" strokeWidth="1.5" />
          <text x="50" y="24" fill="#10b981" fontSize="14" fontWeight="black" fontFamily="monospace" textAnchor="middle">0x08</text>
          <text x="50" y="40" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">DEC: 8</text>
        </g>
        <g transform="translate(480, 110)">
          <rect width="100" height="40" rx="6" fill="#020617" stroke="#a855f7" />
          <text x="50" y="24" fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle">ZERO? = 0</text>
        </g>
      </svg>
    );
  }

  // Fallback
  return (
    <div className="w-full h-40 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 font-mono text-xs">
      Şema hazırlanıyor: {type}
    </div>
  );
};
