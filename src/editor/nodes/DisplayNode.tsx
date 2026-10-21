import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCircuitStore } from '../../store/circuitStore';
import { getSignalColor } from '../../engine/signal';

export const DisplayNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const compType = (data?.type as string) || 'LED';
  const params = (data?.params as any) || {};
  const label = params.label || compType;
  const userColor = params.color || '#10b981';

  const pinValues = useCircuitStore((state) => state.simResult.pinValues);
  const compStates = useCircuitStore((state) => state.simResult.componentStates);
  const removeComponent = useCircuitStore((state) => state.removeComponent);

  const inSignal = pinValues[`${id}:in`] ?? 'Z';
  const isLit = inSignal === 1;

  return (
    <div
      className={`relative min-w-[110px] rounded-xl border bg-slate-900/95 backdrop-blur-md px-3 py-2.5 shadow-xl transition-all duration-150 ${
        selected
          ? 'border-sky-400 ring-2 ring-sky-500/30 shadow-sky-500/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-[11px] font-mono font-semibold tracking-wide text-slate-300 truncate max-w-[80px]">
          {label}
        </span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
          {compType}
        </span>
      </div>

      <div className="flex items-center justify-center my-1">
        {compType === 'LED' && (
          <div className="flex flex-col items-center gap-1.5">
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
          <div className="flex flex-col items-center">
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
          <SevenSegmentDisplay segments={compStates[id]?.segments} />
        )}
      </div>

      {/* Input Handle on the Left */}
      {compType !== 'SEVEN_SEGMENT' && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -left-[7px]">
          <Handle
            type="target"
            position={Position.Left}
            id="in"
            className="!w-3.5 !h-3.5 !rounded-full !border-2 !border-slate-900 hover:!scale-125 !transition-transform"
            style={{ backgroundColor: getSignalColor(inSignal) }}
          />
        </div>
      )}

      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(id);
          }}
          className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-xs shadow-md"
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
}

const SevenSegmentDisplay: React.FC<SevenSegProps> = ({ segments }) => {
  const s = segments || { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 };
  const litColor = '#ef4444';
  const offColor = '#1f1315';

  return (
    <svg viewBox="0 0 60 90" className="w-14 h-20 bg-slate-950 p-1 rounded-md border border-slate-800">
      {/* a */}
      <polygon points="12,10 18,5 42,5 48,10 42,15 18,15" fill={s.a ? litColor : offColor} />
      {/* b */}
      <polygon points="49,12 54,18 54,42 49,47 44,42 44,18" fill={s.b ? litColor : offColor} />
      {/* c */}
      <polygon points="49,49 54,54 54,78 49,84 44,78 44,54" fill={s.c ? litColor : offColor} />
      {/* d */}
      <polygon points="12,85 18,80 42,80 48,85 42,90 18,90" fill={s.d ? litColor : offColor} />
      {/* e */}
      <polygon points="11,49 16,54 16,78 11,84 6,78 6,54" fill={s.e ? litColor : offColor} />
      {/* f */}
      <polygon points="11,12 16,18 16,42 11,47 6,42 6,18" fill={s.f ? litColor : offColor} />
      {/* g */}
      <polygon points="12,47 18,42 42,42 48,47 42,52 18,52" fill={s.g ? litColor : offColor} />
    </svg>
  );
};
