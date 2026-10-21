'use client';

import React from 'react';
import { ComponentDef } from '../../engine/types';
import { ComponentIcon } from '../icons/ComponentIcon';
import { X, Info, Zap, HelpCircle } from 'lucide-react';

interface ComponentInfoModalProps {
  def: ComponentDef | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ComponentInfoModal: React.FC<ComponentInfoModalProps> = ({
  def,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !def) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{def.name}</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-sky-400 border border-slate-700">
                  {def.type}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono capitalize">
                Kategori: {def.category}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Symbol Preview */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center gap-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Şematik Sembol
            </div>
            <div className="py-2">
              <ComponentIcon type={def.type} className="w-16 h-12 text-sky-400 drop-shadow-md" />
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Çalışma Prensibi</span>
            </h3>
            <p className="text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
              {def.description || 'Bu bileşen için özel bir açıklama tanımlanmamıştır.'}
            </p>
          </div>

          {/* Pin Definitions */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Giriş ve Çıkış Pinleri</span>
            </h3>
            <div className="rounded-lg border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Pin</th>
                    <th className="py-2 px-3">Yön</th>
                    <th className="py-2 px-3">Açıklama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {def.pins.map((pin) => (
                    <tr key={pin.id} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-bold text-slate-200">
                        {pin.label || pin.id}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            pin.dir === 'in'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                              : pin.dir === 'out'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                              : 'bg-indigo-950 text-indigo-400 border border-indigo-800/60'
                          }`}
                        >
                          {pin.dir === 'in' ? 'Giriş (IN)' : pin.dir === 'out' ? 'Çıkış (OUT)' : 'G/Ç (IO)'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-400 font-sans text-[11px]">
                        {pin.description || `${pin.label || pin.id} sinyali`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
