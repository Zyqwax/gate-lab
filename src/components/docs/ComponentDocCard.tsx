'use client';

import React, { useState } from 'react';
import { ComponentDef } from '@/engine/types';
import { ComponentIcon } from '@/editor/icons/ComponentIcon';
import { Locale } from '@/i18n/translations';
import { ChevronDown, ChevronUp, Cpu, Binary, Layers } from 'lucide-react';

interface ComponentDocCardProps {
  def: ComponentDef;
  locale: Locale;
}

export const ComponentDocCard: React.FC<ComponentDocCardProps> = ({ def, locale }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const name = def.nameI18n ? def.nameI18n[locale] || def.nameI18n.en : def.name;
  const description = def.descriptionI18n
    ? def.descriptionI18n[locale] || def.descriptionI18n.en
    : def.description;

  const inPins = def.pins.filter((p) => p.dir === 'in');
  const outPins = def.pins.filter((p) => p.dir === 'out');

  // Category styles
  const categoryBadgeColors: Record<string, string> = {
    gate: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    io: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
    display: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    bus: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
    mux: 'bg-orange-950/80 text-orange-300 border-orange-800/60',
    arithmetic: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
    block: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
    sequential: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
  };

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-900/90 transition-all p-5 shadow-xl backdrop-blur-md flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:border-sky-500/40 shrink-0 shadow-inner">
              <ComponentIcon type={def.type} className="w-6 h-6 drop-shadow-md" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                {name}
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                {def.type}
              </span>
            </div>
          </div>

          <span
            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${
              categoryBadgeColors[def.category] || 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {def.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {description}
        </p>

        {/* Pins Breakdown */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/70">
          <div>
            <span className="text-slate-500 font-bold block mb-1">
              {locale === 'tr' ? 'Girişler' : 'Inputs'} ({inPins.length}):
            </span>
            <div className="flex flex-wrap gap-1">
              {inPins.length > 0 ? (
                inPins.map((p) => (
                  <span
                    key={p.id}
                    className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1"
                  >
                    <span>{p.label || p.id}</span>
                    {p.width && p.width > 1 && (
                      <span className="text-[8px] text-sky-400 font-bold">[{p.width - 1}:0]</span>
                    )}
                  </span>
                ))
              ) : (
                <span className="text-slate-600 text-[10px]">{locale === 'tr' ? 'Giriş yok' : 'None'}</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-bold block mb-1">
              {locale === 'tr' ? 'Çıkışlar' : 'Outputs'} ({outPins.length}):
            </span>
            <div className="flex flex-wrap gap-1">
              {outPins.length > 0 ? (
                outPins.map((p) => (
                  <span
                    key={p.id}
                    className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1"
                  >
                    <span>{p.label || p.id}</span>
                    {p.width && p.width > 1 && (
                      <span className="text-[8px] text-sky-400 font-bold">[{p.width - 1}:0]</span>
                    )}
                  </span>
                ))
              ) : (
                <span className="text-slate-600 text-[10px]">{locale === 'tr' ? 'Çıkış yok' : 'None'}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Specifications / Truth Table */}
      <div className="pt-2 border-t border-slate-800/60 mt-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
        >
          <span>{locale === 'tr' ? 'Pin Detayları & Özellikler' : 'Pin Specs & Details'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-2 text-[11px] text-slate-400 animate-in fade-in duration-150">
            <div className="space-y-1">
              {def.pins.map((p) => {
                const pinDesc = p.descriptionI18n
                  ? p.descriptionI18n[locale] || p.descriptionI18n.en
                  : p.description;
                return (
                  <div key={p.id} className="flex items-start gap-1.5 text-[10px]">
                    <span className="font-mono font-bold text-sky-400 shrink-0">
                      {p.label || p.id}{p.width && p.width > 1 ? `[${p.width - 1}:0]` : ''}:
                    </span>
                    <span className="text-slate-300">{pinDesc || (p.dir === 'in' ? 'Giriş hattı' : 'Çıkış hattı')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
