import React from 'react';
import { ComponentDef } from '../../engine/types';
import { GateSvg } from './GateSvg';
import { ComponentIcon } from '../icons/ComponentIcon';

interface NodeDragPreviewProps {
  def: ComponentDef;
}

export const NodeDragPreview: React.FC<NodeDragPreviewProps> = ({ def }) => {
  const isGate = def.category === 'gate';
  const inPins = def.pins.filter((p) => p.dir === 'in');
  const outPins = def.pins.filter((p) => p.dir === 'out');

  return (
    <div
      id={`drag-preview-${def.type}`}
      className="w-[135px] rounded-xl border border-sky-400 ring-2 ring-sky-500/30 bg-slate-900/95 px-3 py-2.5 shadow-2xl backdrop-blur-md relative pointer-events-none select-none"
      style={{
        boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.4), 0 0 15px rgba(56, 189, 248, 0.25)',
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-1 border-b border-slate-800 pb-1 mb-2">
        <span className="text-[11px] font-mono font-bold tracking-wide text-slate-200 truncate">
          {def.name.replace(/ Gate$/i, '')}
        </span>
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700/80">
          {def.type}
        </span>
      </div>

      {/* Center Gate Visual */}
      <div className="flex items-center justify-center py-1">
        {isGate ? (
          <GateSvg type={def.type} className="w-12 h-10 drop-shadow-md" />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center">
            <ComponentIcon type={def.type} className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Left Input Port Dots */}
      <div className="absolute left-0 top-[38px] bottom-2 flex flex-col justify-around">
        {inPins.map((pin) => (
          <div key={pin.id} className="relative flex items-center -left-[5px]">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-900 bg-amber-500 shadow-sm" />
            <span className="text-[8px] font-mono text-slate-400 ml-1.5">{pin.label || pin.id}</span>
          </div>
        ))}
      </div>

      {/* Right Output Port Dots */}
      <div className="absolute right-0 top-[38px] bottom-2 flex flex-col justify-around">
        {outPins.map((pin) => (
          <div key={pin.id} className="relative flex items-center justify-end -right-[5px]">
            <span className="text-[8px] font-mono text-slate-400 mr-1.5">{pin.label || pin.id}</span>
            <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-900 bg-slate-500 shadow-sm" />
          </div>
        ))}
      </div>
    </div>
  );
};
