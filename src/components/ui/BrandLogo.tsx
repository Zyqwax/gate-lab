import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light' | 'transparent' | 'mono-white' | 'mono-black';
  className?: string;
}

/**
 * Official Logic Gate / GateLab full lockup logo from logo-kit-v2.
 * Preserves exact geometry, colors, and IBM Plex Mono typography without distortion.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  className = 'h-9 w-auto',
}) => {
  if (variant === 'light') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 560 260"
        className={className}
        role="img"
        aria-label="GateLab Logo"
      >
        <rect width="560" height="260" fill="#F7F5F0" />
        <g transform="translate(22 30)">
          <path
            d="M34 150 H66 V52 Q66 46 72 46 H128 Q134 46 134 52 V150 H166"
            fill="none"
            stroke="#D98A00"
            strokeWidth="16"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
        <text
          x="222"
          y="152"
          fontFamily="'IBM Plex Mono', 'DejaVu Sans Mono', 'Menlo', monospace"
          fontSize="64"
          letterSpacing="-1"
        >
          <tspan fontWeight="600" fill="#1C1B19">Gate</tspan>
          <tspan fontWeight="400" fill="#D98A00">Lab</tspan>
        </text>
      </svg>
    );
  }

  if (variant === 'mono-white') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 560 260"
        className={className}
        role="img"
        aria-label="GateLab Logo"
      >
        <g transform="translate(22 30)">
          <path
            d="M34 150 H66 V52 Q66 46 72 46 H128 Q134 46 134 52 V150 H166"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="16"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
        <text
          x="222"
          y="152"
          fontFamily="'IBM Plex Mono', 'DejaVu Sans Mono', 'Menlo', monospace"
          fontSize="64"
          letterSpacing="-1"
          fill="#FFFFFF"
        >
          <tspan fontWeight="600">Gate</tspan>
          <tspan fontWeight="400">Lab</tspan>
        </text>
      </svg>
    );
  }

  // Default: dark variant (Carrier Black #15161A, Signal Amber #FFB000, Paper #F7F5F0)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 560 260"
      className={className}
      role="img"
      aria-label="GateLab Logo"
    >
      <rect width="560" height="260" fill="#15161A" />
      <g transform="translate(22 30)">
        <path
          d="M34 150 H66 V52 Q66 46 72 46 H128 Q134 46 134 52 V150 H166"
          fill="none"
          stroke="#FFB000"
          strokeWidth="16"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
      <text
        x="222"
        y="152"
        fontFamily="'IBM Plex Mono', 'DejaVu Sans Mono', 'Menlo', monospace"
        fontSize="64"
        letterSpacing="-1"
      >
        <tspan fontWeight="600" fill="#F7F5F0">Gate</tspan>
        <tspan fontWeight="400" fill="#FFB000">Lab</tspan>
      </text>
    </svg>
  );
};

interface BrandIconProps {
  variant?: 'dark' | 'light' | 'transparent' | 'favicon';
  className?: string;
}

/**
 * Official Logic Gate symbol icon (minimum 24px for icon, or favicon variant for smaller sizes).
 */
export const BrandIcon: React.FC<BrandIconProps> = ({
  variant = 'dark',
  className = 'w-8 h-8',
}) => {
  if (variant === 'favicon') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className={className}
        role="img"
        aria-label="Logic Gate Icon"
      >
        <rect width="200" height="200" rx="44" fill="#15161A" />
        <g transform="translate(16 16) scale(0.84)">
          <path
            d="M34 150 H66 V52 Q66 46 72 46 H128 Q134 46 134 52 V150 H166"
            fill="none"
            stroke="#FFB000"
            strokeWidth="22"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  if (variant === 'light') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className={className}
        role="img"
        aria-label="Logic Gate Icon"
      >
        <rect width="200" height="200" rx="36" fill="#F7F5F0" />
        <path
          d="M34 150 H66 V52 Q66 46 72 46 H128 Q134 46 134 52 V150 H166"
          fill="none"
          stroke="#D98A00"
          strokeWidth="18"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === 'transparent') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className={className}
        role="img"
        aria-label="Logic Gate Icon"
      >
        <path
          d="M34 150 H66 V52 Q66 46 72 46 H128 Q134 46 134 52 V150 H166"
          fill="none"
          stroke="#FFB000"
          strokeWidth="18"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Logic Gate Icon"
    >
      <rect width="200" height="200" rx="36" fill="#15161A" />
      <path
        d="M34 150 H66 V52 Q66 46 72 46 H128 Q134 46 134 52 V150 H166"
        fill="none"
        stroke="#FFB000"
        strokeWidth="18"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};
