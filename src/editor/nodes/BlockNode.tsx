import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCircuitStore } from '../../store/circuitStore';
import { getComponentDef } from '../../components-lib/registry';
import { getSignalColor } from '../../engine/signal';

export const BlockNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const compType = (data?.type as string) || 'HALF_ADDER';
  const label = (data?.params as any)?.label || compType;
  const def = getComponentDef(compType);
  const updateComponentParams = useCircuitStore((state) => state.updateComponentParams);
  const compStates = useCircuitStore((state) => state.simResult.componentStates);
  const pinValues = useCircuitStore((state) => state.simResult.pinValues);
  const removeComponent = useCircuitStore((state) => state.removeComponent);

  if (!def) return null;

  const inPins = def.pins.filter((p) => p.dir === 'in');
  const outPins = def.pins.filter((p) => p.dir === 'out');

  // Register stored value display
  const regQ = compStates[id]?.q;
  const regHex = Array.isArray(regQ)
    ? regQ.reduce((acc, bit, i) => acc + (bit === 1 ? (1 << i) : 0), 0).toString(16).toUpperCase().padStart(2, '0')
    : '00';

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
            const isBus = pin.width === 8;

            return (
              <div key={pin.id} className="relative flex items-center -left-[14px]">
                <Handle
                  type="target"
                  position={Position.Left}
                  id={pin.id}
                  className={`${
                    isBus ? '!w-3.5 !h-3.5 !rounded-md' : '!w-3 !h-3 !rounded-full'
                  } !border-2 !border-slate-900 hover:!scale-125 !transition-transform`}
                  style={{ backgroundColor: pinColor }}
                />
                <span className="text-[10px] font-mono font-medium text-slate-300 ml-2 select-none flex items-center gap-1">
                  {pin.label || pin.id}
                  {isBus && <span className="text-[8px] text-sky-400 font-bold">[7:0]</span>}
                </span>
              </div>
            );
          })}
        </div>

        {/* Center Conversion Badge / Indicators */}
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

        {/* 8-Bit Arithmetic Center Badges */}
        {compType === 'ADDER_8' && (
          <div className="flex flex-col items-center justify-center px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center shadow-inner">
            <span className="text-[10px] font-mono font-black text-purple-400">A + B</span>
            <span className="text-[8px] font-mono text-slate-500 font-bold mt-0.5">8-BIT ADD</span>
          </div>
        )}
        {compType === 'ZERO_DETECT_8' && (
          <div className="flex flex-col items-center justify-center px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center shadow-inner">
            <span className="text-[11px] font-mono font-black text-emerald-400">== 0?</span>
            <span className="text-[8px] font-mono text-slate-500 mt-0.5">ZERO FLAG</span>
          </div>
        )}

        {/* 8-Bit Register Center Badge */}
        {compType === 'REGISTER_8' && (
          <div className="flex flex-col items-center justify-center px-2.5 py-1.5 rounded-lg bg-slate-950 border border-indigo-900/60 text-center shadow-inner">
            <span className="text-[8px] font-mono text-indigo-400 font-bold">STORED</span>
            <span className="text-[12px] font-mono font-black text-emerald-400">0x{regHex}</span>
          </div>
        )}

        {/* 2:1 Bus MUX Center Badge */}
        {compType === 'MUX_2x8' && (
          <div className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-slate-950 border border-orange-900/50 text-center shadow-inner">
            <span className="text-[9px] font-mono font-bold text-orange-400">MUX 2×8</span>
            <span className="text-[8px] font-mono text-slate-500">SEL=0:D0 | 1:D1</span>
          </div>
        )}

        {/* Bus Split & Merge Badges */}
        {compType === 'BUS_SPLIT' && (
          <div className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-slate-950 border border-sky-900/50 text-center shadow-inner">
            <span className="text-[9px] font-mono font-bold text-sky-400">8-BIT</span>
            <span className="text-[8px] text-slate-500">➔ 8×1b</span>
          </div>
        )}
        {compType === 'BUS_MERGE' && (
          <div className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-slate-950 border border-sky-900/50 text-center shadow-inner">
            <span className="text-[8px] text-slate-500">8×1b ➔</span>
            <span className="text-[9px] font-mono font-bold text-sky-400">8-BIT</span>
          </div>
        )}

        {/* Constant Bus Value Editor */}
        {compType === 'BUS_CONST' && (
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-[9px] font-mono text-slate-400 font-bold">VAL:</span>
            <input
              type="number"
              min="0"
              max="255"
              value={(data?.params as any)?.value ?? 0}
              onChange={(e) => {
                const val = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                updateComponentParams(id, { value: val });
              }}
              className="nodrag nopan w-12 px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-sky-400 font-mono text-xs font-bold text-center focus:outline-none focus:border-sky-500"
            />
          </div>
        )}

        {/* Right Outputs */}
        <div className="flex flex-col gap-1.5">
          {outPins.map((pin) => {
            const pinVal = pinValues[`${id}:${pin.id}`] ?? 'Z';
            const pinColor = getSignalColor(pinVal);
            const isBus = pin.width === 8;

            return (
              <div key={pin.id} className="relative flex items-center justify-end -right-[14px]">
                <span className="text-[10px] font-mono font-medium text-slate-300 mr-2 select-none flex items-center gap-1">
                  {isBus && <span className="text-[8px] text-sky-400 font-bold">[7:0]</span>}
                  {pin.label || pin.id}
                </span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={pin.id}
                  className={`${
                    isBus ? '!w-3.5 !h-3.5 !rounded-md' : '!w-3 !h-3 !rounded-full'
                  } !border-2 !border-slate-900 hover:!scale-125 !transition-transform`}
                  style={{ backgroundColor: pinColor }}
                />
              </div>
            );
          })}
        </div>
      </div>

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
