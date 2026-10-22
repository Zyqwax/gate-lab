import React from 'react';
import { GateSvg } from '../nodes/GateSvg';

interface ComponentIconProps {
  type: string;
  className?: string;
}

export const ComponentIcon: React.FC<ComponentIconProps> = ({ type, className = 'w-5 h-5' }) => {
  // Gates
  if (
    type === 'AND' ||
    type === 'OR' ||
    type === 'NOT' ||
    type === 'XOR' ||
    type === 'NAND' ||
    type === 'NOR' ||
    type === 'XNOR' ||
    type === 'BUFFER'
  ) {
    return <GateSvg type={type} className={className} />;
  }

  // Tri-State Buffer
  if (type === 'TRI_STATE') {
    return (
      <svg viewBox="0 0 40 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="6,4 28,16 6,28" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" />
        <line x1="17" y1="2" x2="17" y2="10" stroke="#f59e0b" strokeWidth="2" />
        <line x1="28" y1="16" x2="36" y2="16" stroke="#f59e0b" strokeWidth="2" />
      </svg>
    );
  }

  // IO: Toggle Switch
  if (type === 'SWITCH') {
    return (
      <svg viewBox="0 0 36 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="32" height="16" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" />
        <circle cx="24" cy="12" r="5" fill="#10b981" />
      </svg>
    );
  }

  // IO: Push Button
  if (type === 'BUTTON') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="12" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" />
        <circle cx="16" cy="16" r="6" fill="#38bdf8" />
      </svg>
    );
  }

  // IO: Clock Generator
  if (type === 'CLOCK') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="13" stroke="#38bdf8" fill="rgba(56, 189, 248, 0.1)" />
        <path d="M 8 18 L 13 18 L 13 12 L 19 12 L 19 18 L 24 18" stroke="#38bdf8" strokeWidth="2.2" />
      </svg>
    );
  }

  // IO: Constant High (+5V / VCC)
  if (type === 'CONST_HIGH') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="24" height="20" rx="4" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" />
        <path d="M 16 10 L 16 22 M 10 16 L 22 16" stroke="#10b981" strokeWidth="2.5" />
      </svg>
    );
  }

  // IO: Constant Low (0V / GND)
  if (type === 'CONST_LOW') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16" y1="4" x2="16" y2="16" stroke="#94a3b8" strokeWidth="2" />
        <line x1="7" y1="16" x2="25" y2="16" stroke="#94a3b8" strokeWidth="2.5" />
        <line x1="10" y1="21" x2="22" y2="21" stroke="#94a3b8" strokeWidth="2" />
        <line x1="13" y1="26" x2="19" y2="26" stroke="#94a3b8" strokeWidth="2" />
      </svg>
    );
  }

  // Output: LED
  if (type === 'LED') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="10" fill="#10b981" fillOpacity="0.3" stroke="#10b981" />
        <circle cx="16" cy="16" r="5" fill="#10b981" />
        <path d="M 16 2 L 16 6 M 6 6 L 9 9 M 26 6 L 23 9" stroke="#10b981" strokeWidth="1.5" />
      </svg>
    );
  }

  // Output: Logic Probe
  if (type === 'PROBE') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="24" height="20" rx="5" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" />
        <text x="16" y="21" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          ?
        </text>
      </svg>
    );
  }

  // Output: 7-Segment Display
  if (type === 'SEVEN_SEGMENT') {
    return (
      <svg viewBox="0 0 24 32" className={className} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="28" rx="3" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" strokeWidth="1.5" />
        {/* '8' digit */}
        <line x1="7" y1="7" x2="17" y2="7" />
        <line x1="17" y1="7" x2="17" y2="15" />
        <line x1="7" y1="15" x2="17" y2="15" />
        <line x1="7" y1="7" x2="7" y2="15" />
        <line x1="7" y1="15" x2="7" y2="24" />
        <line x1="17" y1="15" x2="17" y2="24" />
        <line x1="7" y1="24" x2="17" y2="24" />
      </svg>
    );
  }

  // Combinational Blocks: Adder
  if (type === 'HALF_ADDER' || type === 'FULL_ADDER_BLOCK') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="30" height="24" rx="4" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" />
        <text x="18" y="21" fill="#a855f7" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
          Σ
        </text>
      </svg>
    );
  }

  // Sequential Circuits: Latches & Flip-Flops
  if (type === 'SR_LATCH' || type === 'D_FLIP_FLOP') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="30" height="24" rx="4" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" />
        <text x="18" y="20" fill="#6366f1" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          FF
        </text>
      </svg>
    );
  }

  // Input: 4-Bit DIP Switch
  if (type === 'DIP_SWITCH_4') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="28" height="20" rx="3" fill="#020617" stroke="#334155" />
        <rect x="5" y="9" width="4" height="6" rx="1" fill="#10b981" />
        <rect x="11" y="15" width="4" height="6" rx="1" fill="#475569" />
        <rect x="17" y="9" width="4" height="6" rx="1" fill="#10b981" />
        <rect x="23" y="9" width="4" height="6" rx="1" fill="#10b981" />
      </svg>
    );
  }

  // Input: Decimal Generator
  if (type === 'DECIMAL_INPUT') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="6" width="26" height="20" rx="4" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" />
        <text x="16" y="21" fill="#10b981" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          #9
        </text>
      </svg>
    );
  }

  // Output: Decimal Display
  if (type === 'DECIMAL_DISPLAY') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="28" height="24" rx="4" fill="#020617" stroke="#10b981" />
        <text x="16" y="22" fill="#10b981" fontSize="15" fontWeight="black" fontFamily="monospace" textAnchor="middle">
          88
        </text>
      </svg>
    );
  }

  // Combinational: BCD to 7-Segment Decoder
  if (type === 'BCD_TO_7SEG') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="32" height="24" rx="4" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" />
        <text x="18" y="15" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          BCD
        </text>
        <text x="18" y="24" fill="#ef4444" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          7SEG
        </text>
      </svg>
    );
  }

  // Combinational: Binary to Decimal Decoder
  if (type === 'BIN_TO_DEC') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="32" height="24" rx="4" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" />
        <text x="18" y="15" fill="#a855f7" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          BIN
        </text>
        <text x="18" y="24" fill="#10b981" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          DEC
        </text>
      </svg>
    );
  }

  // Combinational: Decimal to Binary Encoder
  if (type === 'DEC_TO_BIN') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="32" height="24" rx="4" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" />
        <text x="18" y="15" fill="#10b981" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          DEC
        </text>
        <text x="18" y="24" fill="#a855f7" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          BIN
        </text>
      </svg>
    );
  }

  // Bus: Splitter
  if (type === 'BUS_SPLIT') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="30" height="24" rx="4" fill="rgba(14, 165, 233, 0.15)" stroke="#0ea5e9" />
        <line x1="6" y1="16" x2="16" y2="16" stroke="#0ea5e9" strokeWidth="3" />
        <line x1="16" y1="16" x2="28" y2="10" stroke="#0ea5e9" />
        <line x1="16" y1="16" x2="28" y2="16" stroke="#0ea5e9" />
        <line x1="16" y1="16" x2="28" y2="22" stroke="#0ea5e9" />
      </svg>
    );
  }

  // Bus: Merger
  if (type === 'BUS_MERGE') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="30" height="24" rx="4" fill="rgba(14, 165, 233, 0.15)" stroke="#0ea5e9" />
        <line x1="8" y1="10" x2="20" y2="16" stroke="#0ea5e9" />
        <line x1="8" y1="16" x2="20" y2="16" stroke="#0ea5e9" />
        <line x1="8" y1="22" x2="20" y2="16" stroke="#0ea5e9" />
        <line x1="20" y1="16" x2="30" y2="16" stroke="#0ea5e9" strokeWidth="3" />
      </svg>
    );
  }

  // Bus: Constant Value
  if (type === 'BUS_CONST') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="30" height="24" rx="4" fill="rgba(14, 165, 233, 0.15)" stroke="#0ea5e9" />
        <text x="18" y="21" fill="#0ea5e9" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          0xFF
        </text>
      </svg>
    );
  }

  // Multiplexers: MUX 2:1 & MUX 2x8
  if (type === 'MUX_2' || type === 'MUX_2x8' || type === 'MUX_4' || type === 'MUX_8') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="6,4 28,10 28,22 6,28" fill="rgba(249, 115, 22, 0.15)" stroke="#f97316" />
        <text x="17" y="19" fill="#f97316" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          {type === 'MUX_2x8' ? '2x8' : type.replace('MUX_', '')}
        </text>
      </svg>
    );
  }

  // Demultiplexer: DEMUX 1:2
  if (type === 'DEMUX_1_2') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="6,10 28,4 28,28 6,22" fill="rgba(249, 115, 22, 0.15)" stroke="#f97316" />
        <text x="17" y="19" fill="#f97316" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          1:2
        </text>
      </svg>
    );
  }

  // Registers & D-FFs
  if (type === 'D_FF_RESET' || type === 'D_FF_ENABLE' || type === 'REGISTER_8') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="30" height="24" rx="4" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" />
        <text x="18" y="20" fill="#6366f1" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          {type === 'REGISTER_8' ? 'REG-8' : 'D-FF'}
        </text>
      </svg>
    );
  }

  // 8-Bit Arithmetic: Adder & Zero Detect
  if (type === 'ADDER_8') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="30" height="24" rx="4" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" />
        <text x="18" y="16" fill="#a855f7" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          +8
        </text>
        <text x="18" y="24" fill="#a855f7" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          ADD
        </text>
      </svg>
    );
  }

  if (type === 'ZERO_DETECT_8') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="30" height="24" rx="4" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" />
        <text x="18" y="20" fill="#a855f7" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          ==0?
        </text>
      </svg>
    );
  }

  // Input: 8-Bit DIP Switch
  if (type === 'DIP_SWITCH_8') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="32" height="20" rx="3" fill="#020617" stroke="#334155" />
        {[5, 8.5, 12, 15.5, 19, 22.5, 26, 29.5].map((x, i) => (
          <rect
            key={i}
            x={x}
            y={i % 2 === 0 ? 9 : 15}
            width="2.5"
            height="6"
            rx="0.5"
            fill={i % 2 === 0 ? '#10b981' : '#475569'}
          />
        ))}
      </svg>
    );
  }

  // Input: Byte Input
  if (type === 'BYTE_INPUT') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="30" height="24" rx="4" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" />
        <text x="18" y="20" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          [BYTE]
        </text>
      </svg>
    );
  }

  // Input: Manual Clock
  if (type === 'MANUAL_CLOCK') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="12" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" />
        <path d="M 12 18 L 16 12 L 20 18" stroke="#38bdf8" strokeWidth="2" />
        <line x1="16" y1="12" x2="16" y2="22" stroke="#38bdf8" strokeWidth="2" />
      </svg>
    );
  }

  // Output: Byte Display
  if (type === 'BYTE_DISPLAY') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="32" height="24" rx="4" fill="#020617" stroke="#10b981" />
        <text x="18" y="20" fill="#10b981" fontSize="12" fontWeight="black" fontFamily="monospace" textAnchor="middle">
          0x00
        </text>
      </svg>
    );
  }

  // Output: 8-Bit LED Bar
  if (type === 'LED_BAR_8') {
    return (
      <svg viewBox="0 0 36 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="32" height="24" rx="3" fill="#020617" stroke="#334155" />
        {[5, 8.5, 12, 15.5, 19, 22.5, 26, 29.5].map((x, i) => (
          <rect
            key={i}
            x={x}
            y={8}
            width="2.5"
            height="16"
            rx="0.5"
            fill={i < 4 ? '#10b981' : '#1e293b'}
          />
        ))}
      </svg>
    );
  }

  // Default fallback chip
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="6" width="20" height="20" rx="3" stroke="#94a3b8" />
    </svg>
  );
};
