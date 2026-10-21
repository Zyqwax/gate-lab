import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCircuitStore } from '../../store/circuitStore';
import { getSignalColor } from '../../engine/signal';

export const IONode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const compType = (data?.type as string) || 'SWITCH';
  const params = (data?.params as any) || {};
  const label = params.label || compType;

  const toggleSwitch = useCircuitStore((state) => state.toggleSwitch);
  const setButtonPressed = useCircuitStore((state) => state.setButtonPressed);
  const pinValues = useCircuitStore((state) => state.simResult.pinValues);
  const removeComponent = useCircuitStore((state) => state.removeComponent);

  const outSignal = pinValues[`${id}:out`] ?? (compType === 'CONST_HIGH' ? 1 : 0);
  const isHigh = outSignal === 1;

  return (
    <div
      className={`relative min-w-[120px] rounded-xl border bg-slate-900/95 backdrop-blur-md px-3 py-2.5 shadow-xl transition-all duration-150 ${
        selected
          ? 'border-sky-400 ring-2 ring-sky-500/30 shadow-sky-500/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-mono font-semibold tracking-wide text-slate-300 truncate max-w-[85px]">
          {label}
        </span>
        <span
          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
            isHigh ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {outSignal}
        </span>
      </div>

      <div className="flex items-center justify-center my-1">
        {compType === 'SWITCH' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSwitch(id);
            }}
            className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 flex items-center shadow-inner cursor-pointer ${
              isHigh ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center text-[10px] font-bold ${
                isHigh ? 'translate-x-7 text-emerald-600' : 'translate-x-0 text-slate-600'
              }`}
            >
              {isHigh ? '1' : '0'}
            </div>
          </button>
        )}

        {compType === 'BUTTON' && (
          <button
            onMouseDown={() => setButtonPressed(id, true)}
            onMouseUp={() => setButtonPressed(id, false)}
            onMouseLeave={() => setButtonPressed(id, false)}
            className={`w-12 h-12 rounded-full border-2 font-mono font-bold text-sm shadow-lg transition-transform active:scale-95 flex items-center justify-center ${
              params.pressed
                ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-emerald-500/50'
                : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500'
            }`}
          >
            PUSH
          </button>
        )}

        {compType === 'CLOCK' && (
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60">
            <div
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                isHigh
                  ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_8px_#10b981]'
                  : 'bg-slate-700 border-slate-600'
              }`}
            />
            <span className="text-xs font-mono text-slate-300">
              {params.frequency ?? 1} Hz
            </span>
          </div>
        )}

        {compType === 'CONST_HIGH' && (
          <div className="px-3 py-1 rounded bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 font-mono text-xs font-bold">
            +5V (HIGH)
          </div>
        )}

        {compType === 'CONST_LOW' && (
          <div className="px-3 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-400 font-mono text-xs font-bold">
            0V (GND)
          </div>
        )}
      </div>

      {/* Output Handle */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -right-[7px]">
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          className="!w-3.5 !h-3.5 !rounded-full !border-2 !border-slate-900 hover:!scale-125 !transition-transform"
          style={{ backgroundColor: getSignalColor(outSignal) }}
        />
      </div>

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
