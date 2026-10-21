'use client';

import React from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { getComponentDef, getLocalizedComponentDef } from '../components-lib/registry';
import { useTranslation } from '../i18n';
import { Settings, Trash2, Tag, Palette as PaletteIcon, X, Sliders } from 'lucide-react';

interface InspectorProps {
  onClose?: () => void;
}

export const Inspector: React.FC<InspectorProps> = ({ onClose }) => {
  const { t, locale } = useTranslation();
  const selectedId = useCircuitStore((state) => state.selectedComponentId);
  const components = useCircuitStore((state) => state.components);
  const updateComponentParams = useCircuitStore((state) => state.updateComponentParams);
  const removeComponent = useCircuitStore((state) => state.removeComponent);

  const comp = selectedId ? components.find((c) => c.id === selectedId) : null;
  const rawDef = comp ? getComponentDef(comp.type) : null;
  const def = rawDef ? getLocalizedComponentDef(rawDef, locale) : null;
  const params = comp?.params || {};

  const ledColors = ['#10b981', '#ef4444', '#38bdf8', '#f59e0b', '#a855f7'];

  return (
    <div className="w-72 bg-slate-900/95 border-l border-slate-800 p-4 select-none flex flex-col h-full z-10 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('inspectorTitle')}</span>
          {comp && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-sky-400 border border-slate-700">
              {comp.type}
            </span>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('close')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {!comp ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
          <Settings className="w-10 h-10 stroke-1 text-slate-600 mb-3 opacity-40 animate-spin-slow" />
          <p className="font-semibold text-slate-400 mb-1">{t('inspectorTitle')}</p>
          <p className="text-[11px] text-slate-500">
            {t('inspectorEmpty')}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {/* Label Field */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1.5">
                <Tag className="w-3 h-3" /> {t('componentLabel')}
              </label>
              <input
                type="text"
                value={params.label ?? ''}
                onChange={(e) => updateComponentParams(selectedId!, { label: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder={def?.name}
              />
            </div>

            {/* Dynamic Inputs for Gates (2 to 8) */}
            {def?.category === 'gate' && params.inputs !== undefined && (
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1.5 block">
                  {t('inputCount')}: <span className="font-mono text-emerald-400 font-bold">{params.inputs || 2}</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={8}
                  step={1}
                  value={params.inputs || 2}
                  onChange={(e) => updateComponentParams(selectedId!, { inputs: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>2</span>
                  <span>8</span>
                </div>
              </div>
            )}

            {/* LED Color Picker */}
            {comp.type === 'LED' && (
              <div>
                <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-2">
                  <PaletteIcon className="w-3 h-3" /> {t('ledColor')}
                </label>
                <div className="flex items-center gap-2">
                  {ledColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateComponentParams(selectedId!, { color })}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        params.color === color ? 'scale-115 border-white shadow-lg' : 'border-transparent hover:scale-105'
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
                  {t('signalFrequency')} ({params.frequency ?? 1} Hz)
                </label>
                <select
                  value={params.frequency ?? 1}
                  onChange={(e) => updateComponentParams(selectedId!, { frequency: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value={0.5}>0.5 Hz</option>
                  <option value={1}>1 Hz</option>
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
              onClick={() => removeComponent(selectedId!)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('deleteComponent')}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
