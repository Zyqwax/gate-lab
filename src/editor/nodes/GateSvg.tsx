import React from 'react';

interface GateSvgProps {
  type: string;
  className?: string;
}

export const GateSvg: React.FC<GateSvgProps> = ({ type, className = 'w-10 h-10' }) => {
  switch (type) {
    case 'AND':
      return (
        <svg viewBox="0 0 50 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 10 5 L 25 5 A 15 15 0 0 1 25 35 L 10 35 Z" fill="rgba(59, 130, 246, 0.1)" stroke="#38bdf8" />
        </svg>
      );
    case 'NAND':
      return (
        <svg viewBox="0 0 55 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 8 5 L 22 5 A 15 15 0 0 1 22 35 L 8 35 Z" fill="rgba(239, 68, 68, 0.1)" stroke="#f43f5e" />
          <circle cx="41" cy="20" r="3.5" fill="none" stroke="#f43f5e" />
        </svg>
      );
    case 'OR':
      return (
        <svg viewBox="0 0 50 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 8 5 Q 22 20 8 35 Q 32 35 44 20 Q 32 5 8 5 Z" fill="rgba(168, 85, 247, 0.1)" stroke="#a855f7" />
        </svg>
      );
    case 'NOR':
      return (
        <svg viewBox="0 0 55 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 6 5 Q 18 20 6 35 Q 28 35 38 20 Q 28 5 6 5 Z" fill="rgba(236, 72, 153, 0.1)" stroke="#ec4899" />
          <circle cx="44" cy="20" r="3.5" fill="none" stroke="#ec4899" />
        </svg>
      );
    case 'XOR':
      return (
        <svg viewBox="0 0 50 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 6 5 Q 18 20 6 35" stroke="#10b981" />
          <path d="M 12 5 Q 24 20 12 35 Q 32 35 44 20 Q 32 5 12 5 Z" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" />
        </svg>
      );
    case 'XNOR':
      return (
        <svg viewBox="0 0 55 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 5 5 Q 16 20 5 35" stroke="#06b6d4" />
          <path d="M 10 5 Q 21 20 10 35 Q 28 35 38 20 Q 28 5 10 5 Z" fill="rgba(6, 182, 212, 0.1)" stroke="#06b6d4" />
          <circle cx="44" cy="20" r="3.5" fill="none" stroke="#06b6d4" />
        </svg>
      );
    case 'NOT':
      return (
        <svg viewBox="0 0 50 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 10 6 L 34 20 L 10 34 Z" fill="rgba(245, 158, 11, 0.1)" stroke="#f59e0b" />
          <circle cx="40" cy="20" r="3.5" fill="none" stroke="#f59e0b" />
        </svg>
      );
    case 'BUFFER':
    default:
      return (
        <svg viewBox="0 0 50 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 12 6 L 38 20 L 12 34 Z" fill="rgba(148, 163, 184, 0.1)" stroke="#94a3b8" />
        </svg>
      );
  }
};
