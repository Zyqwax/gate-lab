import React, { useEffect } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import { useCircuitStore } from '../../store/circuitStore';
import { getComponentDef, getComponentPins } from '../../components-lib/registry';
import { GateSvg } from './GateSvg';
import { getSignalColor } from '../../engine/signal';

export const GateNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const compType = (data?.type as string) || 'AND';
  const params = (data?.params as Record<string, any>) || {};
  const label = params.label || compType;
  const def = getComponentDef(compType);
  const pinValues = useCircuitStore((state) => state.simResult.pinValues);
  const removeComponent = useCircuitStore((state) => state.removeComponent);
  const updateNodeInternals = useUpdateNodeInternals();

  const pins = def ? getComponentPins(def, params) : [];
  const inPins = pins.filter((p) => p.dir === 'in');
  const outPins = pins.filter((p) => p.dir === 'out');

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, inPins.length, updateNodeInternals]);

  if (!def) return null;

  return (
    <div
      className={`relative min-w-[130px] rounded-xl border bg-slate-900/90 backdrop-blur-md px-3 py-2 shadow-xl transition-all duration-150 ${
        selected
          ? 'border-sky-400 ring-2 ring-sky-500/30 shadow-sky-500/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1 mb-2">
        <span className="text-[11px] font-mono font-semibold tracking-wide text-slate-300">
          {label}
        </span>
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
          {compType}
        </span>
      </div>

      {/* Center Gate Visual */}
      <div
        className="flex items-center justify-center py-1"
        style={{ minHeight: `${Math.max(48, inPins.length * 20)}px` }}
      >
        <GateSvg type={compType} className="w-12 h-10 drop-shadow-md" />
      </div>

      {/* Input Handles on the Left */}
      <div className="absolute left-0 top-[38px] bottom-2 flex flex-col justify-around">
        {inPins.map((pin, idx) => {
          const pinVal = pinValues[`${id}:${pin.id}`] ?? 'Z';
          const pinColor = getSignalColor(pinVal);

          return (
            <div key={pin.id} className="relative flex items-center -left-[7px]">
              <Handle
                type="target"
                position={Position.Left}
                id={pin.id}
                className="!w-3 !h-3 !rounded-full !border-2 !border-slate-900 hover:!scale-125 !transition-transform"
                style={{ backgroundColor: pinColor }}
              />
              <span className="text-[9px] font-mono text-slate-400 ml-2 select-none">
                {pin.label || `IN${idx}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Output Handles on the Right */}
      <div className="absolute right-0 top-[38px] bottom-2 flex flex-col justify-around">
        {outPins.map((pin) => {
          const pinVal = pinValues[`${id}:${pin.id}`] ?? 'Z';
          const pinColor = getSignalColor(pinVal);

          return (
            <div key={pin.id} className="relative flex items-center justify-end -right-[7px]">
              <span className="text-[9px] font-mono text-slate-400 mr-2 select-none">
                {pin.label || 'OUT'}
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

      {/* Selection Quick Delete */}
      {selected && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(id);
          }}
          className="nodrag nopan select-none touch-none absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-xs shadow-md cursor-pointer"
          title="Sil (Delete)"
        >
          ×
        </button>
      )}
    </div>
  );
};
