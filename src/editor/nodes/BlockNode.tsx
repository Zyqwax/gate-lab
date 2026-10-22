import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCircuitStore } from '../../store/circuitStore';
import { getComponentDef } from '../../components-lib/registry';
import { getSignalColor } from '../../engine/signal';

export const BlockNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const compType = (data?.type as string) || 'HALF_ADDER';
  const label = (data?.params as any)?.label || compType;
  const def = getComponentDef(compType);
  const pinValues = useCircuitStore((state) => state.simResult.pinValues);
  const removeComponent = useCircuitStore((state) => state.removeComponent);

  if (!def) return null;

  const inPins = def.pins.filter((p) => p.dir === 'in');
  const outPins = def.pins.filter((p) => p.dir === 'out');

  return (
    <div
      className={`relative min-w-[140px] rounded-xl border bg-slate-900/95 backdrop-blur-md px-3.5 py-3 shadow-xl transition-all duration-150 ${
        selected
          ? 'border-indigo-400 ring-2 ring-indigo-500/30 shadow-indigo-500/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-3">
        <span className="text-[11px] font-mono font-bold tracking-wide text-indigo-300">
          {label}
        </span>
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
          {def.category}
        </span>
      </div>

      <div className="flex justify-between items-center min-h-[50px] gap-4">
        {/* Left Inputs */}
        <div className="flex flex-col gap-1.5">
          {inPins.map((pin) => {
            const pinVal = pinValues[`${id}:${pin.id}`] ?? 'Z';
            const pinColor = getSignalColor(pinVal);

            return (
              <div key={pin.id} className="relative flex items-center -left-[14px]">
                <Handle
                  type="target"
                  position={Position.Left}
                  id={pin.id}
                  className="!w-3 !h-3 !rounded-full !border-2 !border-slate-900 hover:!scale-125 !transition-transform"
                  style={{ backgroundColor: pinColor }}
                />
                <span className="text-[10px] font-mono font-medium text-slate-300 ml-2 select-none">
                  {pin.label || pin.id}
                </span>
              </div>
            );
          })}
        </div>

        {/* Center Conversion Badge / Indicator */}
        {compType === 'BCD_TO_7SEG' && (
          <div className="flex flex-col items-center justify-center px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center shadow-inner">
            <span className="text-[10px] font-mono font-bold text-sky-400">BCD (4b)</span>
            <span className="text-[9px] text-slate-500 font-bold my-0.5">➔</span>
            <span className="text-[10px] font-mono font-bold text-red-400">7-SEG</span>
          </div>
        )}
        {compType === 'BIN_TO_DEC' && (
          <div className="flex flex-col items-center justify-center px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center shadow-inner">
            <span className="text-[10px] font-mono font-bold text-sky-400">BIN (4b)</span>
            <span className="text-[9px] text-slate-500 font-bold my-0.5">➔</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400">DEC (0-9)</span>
          </div>
        )}
        {compType === 'DEC_TO_BIN' && (
          <div className="flex flex-col items-center justify-center px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center shadow-inner">
            <span className="text-[10px] font-mono font-bold text-emerald-400">DEC (0-9)</span>
            <span className="text-[9px] text-slate-500 font-bold my-0.5">➔</span>
            <span className="text-[10px] font-mono font-bold text-sky-400">BIN (4b)</span>
          </div>
        )}

        {/* Right Outputs */}
        <div className="flex flex-col gap-1.5">
          {outPins.map((pin) => {
            const pinVal = pinValues[`${id}:${pin.id}`] ?? 'Z';
            const pinColor = getSignalColor(pinVal);

            return (
              <div key={pin.id} className="relative flex items-center justify-end -right-[14px]">
                <span className="text-[10px] font-mono font-medium text-slate-300 mr-2 select-none">
                  {pin.label || pin.id}
                </span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={pin.id}
                  className="!w-3 !h-3 !rounded-full !border-2 !border-slate-900 hover:!scale-125 !transition-transform"
                  style={{ backgroundColor: pinColor }}
                />
              </div>
            );
          })}
        </div>
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
