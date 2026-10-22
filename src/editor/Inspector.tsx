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
            {def?.category === 'gate' && (params.inputs !== undefined || rawDef?.defaultParams?.inputs !== undefined) && (
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1.5 block">
                  {t('inputCount')}: <span className="font-mono text-emerald-400 font-bold">{params.inputs ?? rawDef?.defaultParams?.inputs ?? 2}</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={8}
                  step={1}
                  value={params.inputs ?? rawDef?.defaultParams?.inputs ?? 2}
                  onChange={(e) => updateComponentParams(selectedId!, { inputs: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>2</span>
                  <span>8</span>
                </div>
              </div>
            )}

            {/* Color Picker for LED, 7-Segment, Decimal Display, and LED Bar */}
            {(comp.type === 'LED' || comp.type === 'SEVEN_SEGMENT' || comp.type === 'DECIMAL_DISPLAY' || comp.type === 'LED_BAR_8') && (
              <div>
                <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-2">
                  <PaletteIcon className="w-3 h-3" /> {comp.type === 'LED' ? t('ledColor') : comp.type === 'LED_BAR_8' ? t('ledBarColor') : t('displayColor')}
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

            {/* Decimal Input Value Selector */}
            {comp.type === 'DECIMAL_INPUT' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-medium text-slate-400">
                    {t('decimalValue')} (0 - 15)
                  </label>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {params.value ?? 0}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={params.value ?? 0}
                  onChange={(e) =>
                    updateComponentParams(selectedId!, { value: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>0 (0000)</span>
                  <span>15 (1111)</span>
                </div>
              </div>
            )}

            {/* 8-Bit Byte Input & Bus Constant Value Selector */}
            {(comp.type === 'BYTE_INPUT' || comp.type === 'BUS_CONST') && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-medium text-slate-400">
                    {comp.type === 'BYTE_INPUT' ? t('byteValue') : t('busConstant')}
                  </label>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    0x{(Number(params.value) || 0).toString(16).toUpperCase().padStart(2, '0')} ({params.value ?? 0})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={params.value ?? 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const update: Record<string, any> = { value: val };
                    if (comp.type === 'BUS_CONST') {
                      update.label = `0x${val.toString(16).toUpperCase().padStart(2, '0')}`;
                    }
                    updateComponentParams(selectedId!, update);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>0x00 (0)</span>
                  <span>0xFF (255)</span>
                </div>
              </div>
            )}

            {/* 8-Bit Byte Display Mode Selector */}
            {comp.type === 'BYTE_DISPLAY' && (
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1.5 block">
                  {t('displayMode')}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['HEX', 'DEC', 'BIN'] as const).map((m) => {
                    const active = (params.mode || 'HEX') === m;
                    const modeLabel = m === 'HEX' ? t('modeHex') : m === 'DEC' ? t('modeDec') : t('modeBin');
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => updateComponentParams(selectedId!, { mode: m })}
                        className={`py-1.5 px-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer text-center ${
                          active
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {modeLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Clock Frequency */}
            {comp.type === 'CLOCK' && (
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>{t('signalFrequency')}</span>
                  <span className="font-mono text-emerald-400 font-bold">{params.frequency ?? 1} Hz</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0.1}
                    max={50}
                    step={0.5}
                    value={params.frequency ?? 1}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      updateComponentParams(selectedId!, {
                        frequency: isNaN(val) ? 1 : Math.max(0.1, Math.min(50, val)),
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="1"
                  />
                  <span className="text-xs font-mono text-slate-400 font-bold">Hz</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[0.5, 1, 2, 5, 10, 20].map((quickHz) => (
                    <button
                      key={quickHz}
                      type="button"
                      onClick={() => updateComponentParams(selectedId!, { frequency: quickHz })}
                      className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                        params.frequency === quickHz
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {quickHz}
                    </button>
                  ))}
                </div>
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
