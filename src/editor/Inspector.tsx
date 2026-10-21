'use client';

import React from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { getComponentDef } from '../components-lib/registry';
import { Settings, Trash2, Tag, Palette as PaletteIcon } from 'lucide-react';

export const Inspector: React.FC = () => {
  const selectedId = useCircuitStore((state) => state.selectedComponentId);
  const components = useCircuitStore((state) => state.components);
  const updateComponentParams = useCircuitStore((state) => state.updateComponentParams);
  const removeComponent = useCircuitStore((state) => state.removeComponent);

  if (!selectedId) {
    return (
      <div className="w-64 bg-slate-900/80 border-l border-slate-800 p-4 select-none hidden lg:flex flex-col items-center justify-center text-center text-slate-500 text-xs">
        <Settings className="w-8 h-8 stroke-1 text-slate-600 mb-2 opacity-50" />
        <p>Düzenlemek için bir elemana tıklayın</p>
      </div>
    );
  }

  const comp = components.find((c) => c.id === selectedId);
  if (!comp) return null;

  const def = getComponentDef(comp.type);
  const params = comp.params || {};

  const ledColors = ['#10b981', '#ef4444', '#38bdf8', '#f59e0b', '#a855f7'];

  return (
    <div className="w-64 bg-slate-900/95 border-l border-slate-800 p-4 select-none flex flex-col h-full z-10 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Settings className="w-3.5 h-3.5 text-emerald-400" />
          <span>Özellikler</span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
          {comp.type}
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {/* Label Field */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1.5">
            <Tag className="w-3 h-3" /> Etiket (İsim)
          </label>
          <input
            type="text"
            value={params.label ?? ''}
            onChange={(e) => updateComponentParams(selectedId, { label: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            placeholder={def?.name}
          />
        </div>

        {/* Dynamic Inputs for Gates (2 to 8) */}
        {def?.category === 'gate' && params.inputs !== undefined && (
          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1.5 block">
              Giriş Sayısı ({params.inputs || 2})
            </label>
            <input
              type="range"
              min={2}
              max={8}
              step={1}
              value={params.inputs || 2}
              onChange={(e) => updateComponentParams(selectedId, { inputs: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        )}

        {/* LED Color Picker */}
        {comp.type === 'LED' && (
          <div>
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1.5">
              <PaletteIcon className="w-3 h-3" /> LED Rengi
            </label>
            <div className="flex items-center gap-2">
              {ledColors.map((color) => (
                <button
                  key={color}
                  onClick={() => updateComponentParams(selectedId, { color })}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    params.color === color ? 'scale-110 border-white shadow-md' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Clock Frequency */}
        {comp.type === 'CLOCK' && (
          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1.5 block">
              Saat Frekansı ({params.frequency ?? 1} Hz)
            </label>
            <select
              value={params.frequency ?? 1}
              onChange={(e) => updateComponentParams(selectedId, { frequency: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value={0.5}>0.5 Hz (Yavaş)</option>
              <option value={1}>1 Hz (Standart)</option>
              <option value={2}>2 Hz</option>
              <option value={5}>5 Hz</option>
              <option value={10}>10 Hz</option>
            </select>
          </div>
        )}
      </div>

      {/* Delete button */}
      <div className="pt-3 border-t border-slate-800">
        <button
          onClick={() => removeComponent(selectedId)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Elemanı Sil</span>
        </button>
      </div>
    </div>
  );
};
