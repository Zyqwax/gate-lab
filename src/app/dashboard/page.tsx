'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getSavedCircuits,
  deleteCircuit,
  SavedCircuit,
  createCircuitFromTemplate,
} from '@/lib/circuitStorage';
import { confirmDialog } from '@/store/dialogStore';
import { useTranslation } from '@/i18n';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  Plus,
  Layers,
  Clock,
  Trash2,
  Download,
  ArrowRight,
  ExternalLink,
  Cpu,
  Search,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { t, locale, setLocale } = useTranslation();
  const [circuits, setCircuits] = useState<SavedCircuit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshList = () => {
    setCircuits(getSavedCircuits());
  };

  useEffect(() => {
    refreshList();
    setIsLoaded(true);
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirmDialog({
      title: t('deleteCircuitTitle'),
      message: t('deleteCircuitMsg', { name }),
      confirmText: t('deleteCircuitAction'),
      cancelText: t('giveUp'),
      type: 'danger',
    });
    if (ok) {
      deleteCircuit(id);
      refreshList();
    }
  };

  const handleExport = (circuit: SavedCircuit) => {
    const json = JSON.stringify(circuit.circuit, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${circuit.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'circuit'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCircuits = circuits.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <BrandLogo className="w-[120px] h-auto rounded-lg border border-slate-800/80" />
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-xs font-semibold text-slate-300">{t('dashboard')}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setLocale("en")}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  locale === "en"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale("tr")}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  locale === "tr"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                TR
              </button>
            </div>

            <Link
              href="/dashboard/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t('createNewCircuit')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Header Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-emerald-400" />
              <span>{t('myCircuits')}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {t('myCircuitsSub')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('searchProjects')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Circuit Grid */}
        {!isLoaded ? (
          <div className="py-20 text-center text-slate-500 text-xs">...</div>
        ) : filteredCircuits.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 flex flex-col items-center justify-center">
            <Cpu className="w-12 h-12 text-slate-600 mb-3 stroke-1" />
            <h3 className="text-sm font-semibold text-slate-300">
              {searchTerm ? t('noSearchResults', { term: searchTerm }) : t('noCircuitsTitle')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {t('noCircuitsSub')}
            </p>
            <Link
              href="/dashboard/new"
              className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t('createFirstCircuit')}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCircuits.map((item) => {
              const compCount = item.circuit.components?.length || 0;
              const wireCount = item.circuit.wires?.length || 0;
              const dateStr = new Date(item.updatedAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 hover:bg-slate-900 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden shadow-lg group"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title={t('delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px] mb-4">
                      {item.description || (locale === 'tr' ? 'Açıklama belirtilmemiş.' : 'No description provided.')}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pb-3 border-b border-slate-800/60">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t('partsCount', { count: compCount })}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {wireCount} {locale === 'tr' ? 'kablo' : 'wires'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-3">
                      <Clock className="w-3 h-3" />
                      <span>{t('lastSaved', { date: dateStr })}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => handleExport(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                      title={t('exportJSON')}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="text-[11px]">JSON</span>
                    </button>

                    <Link
                      href={`/dashboard/editor?id=${item.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                    >
                      <span>{t('openEditor')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
