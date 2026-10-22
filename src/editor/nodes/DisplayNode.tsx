import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCircuitStore } from '../../store/circuitStore';
import { getSignalColor, isBusSignal, normalizeToBus, busToNumber, busToString } from '../../engine/signal';

function decodeSevenSeg(s: { a: number; b: number; c: number; d: number; e: number; f: number; g: number }): string | null {
  const code =
    (s.a ? 1 : 0) |
    ((s.b ? 1 : 0) << 1) |
    ((s.c ? 1 : 0) << 2) |
    ((s.d ? 1 : 0) << 3) |
    ((s.e ? 1 : 0) << 4) |
    ((s.f ? 1 : 0) << 5) |
    ((s.g ? 1 : 0) << 6);

  const map: Record<number, string> = {
    63: '0',
    6: '1',
    91: '2',
    79: '3',
    102: '4',
    109: '5',
    125: '6',
    7: '7',
    127: '8',
    111: '9',
    119: 'A',
    124: 'b',
    57: 'C',
    94: 'd',
    121: 'E',
    113: 'F',
  };
  return map[code] ?? null;
}

export const DisplayNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const compType = (data?.type as string) || 'LED';
  const params = (data?.params as any) || {};
  const label = params.label || compType;
  const userColor = params.color || (compType === 'SEVEN_SEGMENT' ? '#ef4444' : '#10b981');

  const pinValues = useCircuitStore((state) => state.simResult.pinValues);
  const compStates = useCircuitStore((state) => state.simResult.componentStates);
  const removeComponent = useCircuitStore((state) => state.removeComponent);

  const inSignal = pinValues[`${id}:in`] ?? 'Z';
  const isLit = inSignal === 1;

  // 7-Segment state
  const segState = {
    a: pinValues[`${id}:a`] === 1 ? 1 : (compStates[id]?.segments?.a ? 1 : 0),
    b: pinValues[`${id}:b`] === 1 ? 1 : (compStates[id]?.segments?.b ? 1 : 0),
    c: pinValues[`${id}:c`] === 1 ? 1 : (compStates[id]?.segments?.c ? 1 : 0),
    d: pinValues[`${id}:d`] === 1 ? 1 : (compStates[id]?.segments?.d ? 1 : 0),
    e: pinValues[`${id}:e`] === 1 ? 1 : (compStates[id]?.segments?.e ? 1 : 0),
    f: pinValues[`${id}:f`] === 1 ? 1 : (compStates[id]?.segments?.f ? 1 : 0),
    g: pinValues[`${id}:g`] === 1 ? 1 : (compStates[id]?.segments?.g ? 1 : 0),
  };
  const detectedChar = decodeSevenSeg(segState);

  // Decimal Display state (4-bit inputs: in3=8, in2=4, in1=2, in0=1)
  const b3 = pinValues[`${id}:in3`] === 1 ? 1 : 0;
  const b2 = pinValues[`${id}:in2`] === 1 ? 1 : 0;
  const b1 = pinValues[`${id}:in1`] === 1 ? 1 : 0;
  const b0 = pinValues[`${id}:in0`] === 1 ? 1 : 0;
  const decimalValue = b3 * 8 + b2 * 4 + b1 * 2 + b0;
  const hexValue = decimalValue.toString(16).toUpperCase();
  const binStr = `${b3}${b2}${b1}${b0}`;

  // 8-Bit Bus Display state (BYTE_DISPLAY, LED_BAR_8, and BUS_PROBE)
  const isBusInput = compType === 'BYTE_DISPLAY' || compType === 'LED_BAR_8' || compType === 'BUS_PROBE';
  const busVal = normalizeToBus(inSignal, 8, 0);
  const byteNumber = busToNumber(busVal);
  const byteHexStr = byteNumber !== null ? byteNumber.toString(16).toUpperCase().padStart(2, '0') : '??';
  const byteDecStr = byteNumber !== null ? byteNumber.toString(10) : '??';
  const byteBinStr = busToString(busVal, 'bin');

  return (
    <div
      className={`relative rounded-xl border bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl transition-all duration-150 ${
        compType === 'SEVEN_SEGMENT'
          ? 'min-w-[170px]'
          : compType === 'DECIMAL_DISPLAY' || compType === 'BYTE_DISPLAY'
          ? 'min-w-[190px]'
          : compType === 'LED_BAR_8'
          ? 'min-w-[220px]'
          : compType === 'BUS_PROBE'
          ? 'min-w-[140px]'
          : 'min-w-[110px]'
      } ${
        selected
          ? 'border-sky-400 ring-2 ring-sky-500/30 shadow-sky-500/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between gap-1 mb-2 border-b border-slate-800/80 pb-1">
        <span className="text-[11px] font-mono font-semibold tracking-wide text-slate-300 truncate max-w-[110px]">
          {label}
        </span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
          {compType}
        </span>
      </div>

      <div className="flex items-center justify-center my-1">
        {compType === 'LED' && (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <div
              className="w-10 h-10 rounded-full border-2 transition-all duration-150 flex items-center justify-center"
              style={{
                backgroundColor: isLit ? userColor : '#1e293b',
                borderColor: isLit ? '#ffffff' : '#334155',
                boxShadow: isLit
                  ? `0 0 20px ${userColor}, 0 0 35px ${userColor}88, inset 0 0 10px #ffffff88`
                  : 'none',
              }}
            >
              <div
                className="w-3 h-3 rounded-full opacity-60"
                style={{ backgroundColor: isLit ? '#ffffff' : '#0f172a' }}
              />
            </div>
            <span
              className="text-[10px] font-mono font-bold tracking-wider"
              style={{ color: isLit ? userColor : '#64748b' }}
            >
              {isLit ? 'HIGH (1)' : 'LOW (0)'}
            </span>
          </div>
        )}

        {compType === 'PROBE' && (
          <div className="flex flex-col items-center py-1">
            <div
              className="w-14 h-9 rounded-lg border flex items-center justify-center font-mono text-lg font-extrabold shadow-inner"
              style={{
                backgroundColor: '#020617',
                borderColor: getSignalColor(inSignal),
                color: getSignalColor(inSignal),
                boxShadow: inSignal === 1 ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
              }}
            >
              {inSignal}
            </div>
          </div>
        )}

        {compType === 'SEVEN_SEGMENT' && (
          <div className="flex items-center justify-between gap-4 w-full py-1">
            {/* Left Handles for a..g */}
            <div className="flex flex-col gap-1 -ml-3.5">
              {(['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const).map((seg) => {
                const pinVal = pinValues[`${id}:${seg}`] ?? 'Z';
                const isHigh = pinVal === 1;
                return (
                  <div key={seg} className="relative flex items-center">
                    <Handle
                      type="target"
                      position={Position.Left}
                      id={seg}
                      className="!w-3 !h-3 !rounded-full !border-2 !border-slate-900 hover:!scale-125 !transition-transform"
                      style={{ backgroundColor: getSignalColor(pinVal) }}
                    />
                    <span
                      className={`text-[9px] font-mono font-bold ml-2 select-none ${
                        isHigh ? 'text-red-400 font-extrabold' : 'text-slate-500'
                      }`}
                    >
                      {seg}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Display Graphic and detected digit */}
            <div className="flex flex-col items-center gap-1.5 flex-1 pr-1">
              <SevenSegmentDisplay segments={segState} color={userColor} />
              {detectedChar !== null ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200 shadow-sm">
                  = {detectedChar}
                </span>
              ) : (
                <span className="text-[10px] font-mono text-slate-600 px-2 py-0.5">
                  -
                </span>
              )}
            </div>
          </div>
        )}

        {compType === 'DECIMAL_DISPLAY' && (
          <div className="flex items-center justify-between gap-4 w-full py-1">
            {/* Left Handles for 4 bits: in3 (MSB), in2, in1, in0 (LSB) */}
            <div className="flex flex-col gap-2 -ml-3.5">
              {[
                { id: 'in3', label: 'B3', weight: '8' },
                { id: 'in2', label: 'B2', weight: '4' },
                { id: 'in1', label: 'B1', weight: '2' },
                { id: 'in0', label: 'B0', weight: '1' },
              ].map((pin) => {
                const pinVal = pinValues[`${id}:${pin.id}`] ?? 'Z';
                const isHigh = pinVal === 1;
                return (
                  <div key={pin.id} className="relative flex items-center">
                    <Handle
                      type="target"
                      position={Position.Left}
                      id={pin.id}
                      className="!w-3 !h-3 !rounded-full !border-2 !border-slate-900 hover:!scale-125 !transition-transform"
                      style={{ backgroundColor: getSignalColor(pinVal) }}
                    />
                    <span
                      className={`text-[9px] font-mono font-bold ml-2 select-none ${
                        isHigh ? 'text-emerald-400 font-extrabold' : 'text-slate-500'
                      }`}
                    >
                      {pin.label} <span className="text-[8px] text-slate-500 font-normal">({pin.weight})</span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Numeric readout */}
            <div className="flex flex-col items-center justify-center bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800 shadow-inner min-w-[95px] flex-1">
              <span
                className="font-mono text-3xl font-black tracking-wider"
                style={{
                  color: userColor,
                  textShadow: `0 0 15px ${userColor}88`,
                }}
              >
                {decimalValue}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[9px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  0x{hexValue}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  {binStr}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 8-Bit Byte Display (DEC, HEX, BIN) */}
        {compType === 'BYTE_DISPLAY' && (
          <div className="flex flex-col items-center justify-center bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 shadow-inner w-full">
            <span
              className="font-mono text-3xl font-black tracking-wider"
              style={{
                color: userColor,
                textShadow: `0 0 15px ${userColor}88`,
              }}
            >
              {byteNumber !== null ? (params.mode === 'DEC' ? byteDecStr : `0x${byteHexStr}`) : '??'}
            </span>
            <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                DEC: {byteDecStr}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                BIN: {byteBinStr}
              </span>
            </div>
          </div>
        )}

        {/* 8-Bit Bus Probe (Compact readout for testing & Logic Analyzer) */}
        {compType === 'BUS_PROBE' && (
          <div className="flex flex-col items-center justify-center py-0.5">
            <span
              className="font-mono text-2xl font-black tracking-wider text-sky-400"
              style={{ textShadow: '0 0 12px rgba(56, 189, 248, 0.4)' }}
            >
              {byteNumber !== null ? (params.mode === 'DEC' ? byteDecStr : params.mode === 'BIN' ? byteBinStr : `0x${byteHexStr}`) : '??'}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[9px] font-mono text-slate-400">
              <span className="px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800">
                {params.mode === 'DEC' ? `0x${byteHexStr}` : `DEC: ${byteDecStr}`}
              </span>
            </div>
          </div>
        )}

        {/* 8-Bit LED Optical Bar */}
        {compType === 'LED_BAR_8' && (
          <div className="flex flex-col gap-1.5 w-full py-1">
            <div className="flex items-center justify-between gap-1 bg-slate-950 p-2 rounded-lg border border-slate-800 shadow-inner">
              {[7, 6, 5, 4, 3, 2, 1, 0].map((bitIdx) => {
                const bitVal = busVal[bitIdx];
                const isBitHigh = bitVal === 1;
                return (
                  <div key={bitIdx} className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-mono font-bold text-slate-500">
                      {bitIdx}
                    </span>
                    <div
                      className="w-4 h-9 rounded-sm border transition-all duration-150 flex items-center justify-center"
                      style={{
                        backgroundColor: isBitHigh ? userColor : '#0f172a',
                        borderColor: isBitHigh ? '#ffffff' : '#334155',
                        boxShadow: isBitHigh
                          ? `0 0 12px ${userColor}, 0 0 20px ${userColor}88, inset 0 0 6px #ffffff88`
                          : 'none',
                      }}
                    >
                      <div
                        className="w-1.5 h-3 rounded-xs opacity-60"
                        style={{ backgroundColor: isBitHigh ? '#ffffff' : '#1e293b' }}
                      />
                    </div>
                    <span
                      className="text-[8px] font-mono font-bold"
                      style={{ color: isBitHigh ? userColor : '#475569' }}
                    >
                      {bitVal === 1 ? '1' : bitVal === 0 ? '0' : String(bitVal)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between px-1 text-[9px] font-mono text-slate-400">
              <span>0x{byteHexStr}</span>
              <span className="text-emerald-400 font-bold">= {byteDecStr}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Handle on the Left for single-input displays (LED, PROBE, BYTE_DISPLAY, LED_BAR_8) */}
      {compType !== 'SEVEN_SEGMENT' && compType !== 'DECIMAL_DISPLAY' && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -left-[7px] flex items-center">
          <Handle
            type="target"
            position={Position.Left}
            id="in"
            className={`${
              isBusInput ? '!w-4 !h-4 !rounded-md' : '!w-3.5 !h-3.5 !rounded-full'
            } !border-2 !border-slate-900 hover:!scale-125 !transition-transform`}
            style={{ backgroundColor: getSignalColor(inSignal) }}
          />
          {isBusInput && (
            <span className="text-[8px] font-mono font-bold text-sky-400 ml-2.5 select-none pointer-events-none">
              [7:0]
            </span>
          )}
        </div>
      )}

      {selected && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(id);
          }}
          className="nodrag nopan select-none touch-none absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-xs shadow-md cursor-pointer"
          title="Sil"
        >
          ×
        </button>
      )}
    </div>
  );
};

interface SevenSegProps {
  segments?: { a: number; b: number; c: number; d: number; e: number; f: number; g: number };
  color?: string;
}

const SevenSegmentDisplay: React.FC<SevenSegProps> = ({ segments, color = '#ef4444' }) => {
  const s = segments || { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 };
  const litColor = color;
  const offColor = '#1e1b1e';
  const glow = `drop-shadow(0 0 6px ${litColor})`;

  return (
    <svg
      viewBox="0 0 60 90"
      className="w-16 h-24 bg-slate-950 p-1.5 rounded-lg border border-slate-800 shadow-inner"
    >
      {/* a */}
      <polygon
        points="12,10 18,5 42,5 48,10 42,15 18,15"
        fill={s.a ? litColor : offColor}
        style={{ filter: s.a ? glow : undefined }}
      />
      {/* b */}
      <polygon
        points="49,12 54,18 54,42 49,47 44,42 44,18"
        fill={s.b ? litColor : offColor}
        style={{ filter: s.b ? glow : undefined }}
      />
      {/* c */}
      <polygon
        points="49,49 54,54 54,78 49,84 44,78 44,54"
        fill={s.c ? litColor : offColor}
        style={{ filter: s.c ? glow : undefined }}
      />
      {/* d */}
      <polygon
        points="12,85 18,80 42,80 48,85 42,90 18,90"
        fill={s.d ? litColor : offColor}
        style={{ filter: s.d ? glow : undefined }}
      />
      {/* e */}
      <polygon
        points="11,49 16,54 16,78 11,84 6,78 6,54"
        fill={s.e ? litColor : offColor}
        style={{ filter: s.e ? glow : undefined }}
      />
      {/* f */}
      <polygon
        points="11,12 16,18 16,42 11,47 6,42 6,18"
        fill={s.f ? litColor : offColor}
        style={{ filter: s.f ? glow : undefined }}
      />
      {/* g */}
      <polygon
        points="12,47 18,42 42,42 48,47 42,52 18,52"
        fill={s.g ? litColor : offColor}
        style={{ filter: s.g ? glow : undefined }}
      />
    </svg>
  );
};
