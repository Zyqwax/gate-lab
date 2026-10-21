'use client';

import React, { useRef, useState } from 'react';
import { CircuitTemplate, getLocalizedTemplates } from '../templates/circuits';
import { useCircuitStore } from '../store/circuitStore';
import { useTranslation } from '../i18n';
import { PlusCircle, Sparkles, FileUp, X, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { t, locale } = useTranslation();
  const loadTemplate = useCircuitStore((state) => state.loadTemplate);
  const clearCircuit = useCircuitStore((state) => state.clearCircuit);
  const importJSON = useCircuitStore((state) => state.importJSON);

  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const templates = getLocalizedTemplates(locale);

  const handleStartBlank = () => {
    clearCircuit();
    onClose();
  };

  const handleSelectTemplate = (template: CircuitTemplate) => {
    loadTemplate(template.id);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (!content) {
          setImportError(t('fileEmptyError'));
          return;
        }

        const success = importJSON(content);
        if (success) {
          onClose();
        } else {
          setImportError(t('invalidFormatError'));
        }
      } catch (err) {
        setImportError(t('fileReadError'));
      }
    };

    reader.onerror = () => {
      setImportError(t('fileReadError'));
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-[0_0_16px_rgba(16,185,129,0.25)]">
              ⚡
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {t('welcomeTitle')}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('welcomeSub')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {importError && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Section 1: Blank Canvas */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {t('welcomeCleanStart')}
            </h3>
            <button
              onClick={handleStartBlank}
              className="w-full text-left p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-850 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-950/30 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300">
                    {t('welcomeBlankTitle')}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {t('welcomeBlankDesc')}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Section 2: Built-in Templates */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('welcomeTemplatesTitle')}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
                    tpl.id === 'full-adder'
                      ? 'bg-slate-950/80 border-indigo-500/40 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-950/40'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-indigo-300">
                        {tpl.name}
                      </span>
                      {tpl.id === 'full-adder' && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                          {t('welcomeRecommendedTag')}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{tpl.category}</span>
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      {t('loadTemplateBtn')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Import JSON */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileUp className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('welcomeImportTitle')}</span>
            </h3>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-left p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-850 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-950/30 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-sky-950/40 border border-sky-800/60 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 flex items-center gap-2">
                    <span>{t('welcomeImportButton')}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> {t('welcomeActiveTag')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {t('welcomeImportDesc')}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>{t('welcomeSimNotice')}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
          >
            {t('welcomeSkip')}
          </button>
        </div>
      </div>
    </div>
  );
};
