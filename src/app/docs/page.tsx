'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { BrandLogo, BrandIcon } from '@/components/ui/BrandLogo';
import { COMPONENT_DEFINITIONS } from '@/components-lib/registry';
import { TUTORIALS } from '@/data/tutorials';
import { getLocalizedTemplates } from '@/templates/circuits';
import { ComponentDocCard } from '@/components/docs/ComponentDocCard';
import { StepDiagramSvg } from '@/components/docs/StepDiagramSvg';
import {
  BookOpen,
  Cpu,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  HelpCircle,
  Activity,
  ToggleLeft,
  Binary,
  Split,
  GitBranch,
  Calculator,
  Compass,
  Scissors,
  Play,
  RotateCcw,
  StepForward,
} from 'lucide-react';

export default function DocsPage() {
  const { t, locale, setLocale } = useTranslation();
  const [activeTab, setActiveTab] = useState<'basics' | 'components' | 'tutorials' | 'templates'>('tutorials');

  // Components tab state
  const [compSearch, setCompSearch] = useState('');
  const [selectedCompCategory, setSelectedCompCategory] = useState<string>('all');

  // Tutorials tab state
  const [activeTutorialId, setActiveTutorialId] = useState<string>('accumulator-tutorial');
  const [activeStepNumber, setActiveStepNumber] = useState<number>(1);

  const selectedTutorial = TUTORIALS.find((tut) => tut.id === activeTutorialId) || TUTORIALS[0];
  const activeStep =
    selectedTutorial.steps.find((s) => s.stepNumber === activeStepNumber) || selectedTutorial.steps[0];

  const templates = getLocalizedTemplates(locale);

  // Filter components
  const filteredComponents = COMPONENT_DEFINITIONS.filter((def) => {
    const matchesCategory = selectedCompCategory === 'all' || def.category === selectedCompCategory;
    const nameStr = (def.nameI18n ? def.nameI18n[locale] || def.name : def.name).toLowerCase();
    const matchesSearch =
      nameStr.includes(compSearch.toLowerCase()) ||
      def.type.toLowerCase().includes(compSearch.toLowerCase()) ||
      (def.description || '').toLowerCase().includes(compSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const compCategories = [
    { id: 'all', label: locale === 'tr' ? 'Tümü' : 'All', icon: Cpu },
    { id: 'gate', label: locale === 'tr' ? 'Kapılar' : 'Gates', icon: Zap },
    { id: 'io', label: locale === 'tr' ? 'Girişler' : 'Inputs', icon: ToggleLeft },
    { id: 'display', label: locale === 'tr' ? 'Çıkışlar' : 'Outputs', icon: Activity },
    { id: 'bus', label: locale === 'tr' ? 'Veri Yolu' : 'Bus', icon: GitBranch },
    { id: 'mux', label: locale === 'tr' ? 'Mux / Demux' : 'Mux', icon: Split },
    { id: 'arithmetic', label: locale === 'tr' ? 'Aritmetik' : 'Arithmetic', icon: Calculator },
    { id: 'block', label: locale === 'tr' ? 'Bloklar' : 'Blocks', icon: Binary },
    { id: 'sequential', label: locale === 'tr' ? 'Hafıza / Ardışıl' : 'Sequential', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <BrandLogo className="w-[120px] h-auto rounded-lg border border-slate-800/80" />
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{locale === 'tr' ? 'Rehber & Dokümantasyon' : 'Docs & Tutorials'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setLocale('en')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  locale === 'en'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale('tr')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  locale === 'tr'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                TR
              </button>
            </div>

            <Link
              href="/dashboard/new"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{locale === 'tr' ? 'Tuvale Git' : 'Open Canvas'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">
              {locale === 'tr' ? 'Dokümantasyon Menüsü' : 'Documentation Menu'}
            </h2>
            <nav className="space-y-1">
              {[
                {
                  id: 'tutorials',
                  label: locale === 'tr' ? 'Adım Adım Örnekler' : 'Step-by-Step Tutorials',
                  icon: Compass,
                  badge: TUTORIALS.length,
                },
                {
                  id: 'components',
                  label: locale === 'tr' ? 'Bileşen Kütüphanesi' : 'Components Library',
                  icon: Cpu,
                  badge: COMPONENT_DEFINITIONS.length,
                },
                {
                  id: 'templates',
                  label: locale === 'tr' ? 'Hazır Şablonlar' : 'Circuit Templates',
                  icon: Sparkles,
                  badge: templates.length,
                },
                {
                  id: 'basics',
                  label: locale === 'tr' ? 'Editör & Sinyal Mantığı' : 'Controls & 4-Valued Logic',
                  icon: HelpCircle,
                },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Help Card */}
          <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-rose-400" />
              <span>{locale === 'tr' ? 'Kısayol İpucu' : 'Shortcut Tip'}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {locale === 'tr'
                ? 'Kablo kesmek için klavyeden C tuşuna basıp kabloya tıklayın. Çıkmak için V veya Esc tuşuna basın.'
                : 'Press C to activate Cut Mode and touch/click wires to slice them. Press V or Esc to return to Movement.'}
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: ADIM ADIM ÖRNEKLER (STEP-BY-STEP TUTORIALS) */}
          {activeTab === 'tutorials' && (
            <div className="space-y-6">
              {/* Tutorial Picker Header */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                      {locale === 'tr' ? 'Görsel Rehber' : 'Interactive Guide'}
                    </span>
                    <h1 className="text-2xl font-extrabold text-white mt-1">
                      {selectedTutorial.titleI18n[locale] || selectedTutorial.titleI18n.en}
                    </h1>
                  </div>

                  <Link
                    href={`/dashboard/editor?template=${selectedTutorial.circuitTemplateId}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all self-start sm:self-auto shrink-0"
                  >
                    <span>{locale === 'tr' ? 'Bu Devreyi Editörde Aç' : 'Open Circuit in Editor'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                  {selectedTutorial.descriptionI18n[locale] || selectedTutorial.descriptionI18n.en}
                </p>

                {/* Tutorial Switcher Pills */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-none">
                  {TUTORIALS.map((tut) => {
                    const isTutActive = tut.id === selectedTutorial.id;
                    return (
                      <button
                        key={tut.id}
                        onClick={() => {
                          setActiveTutorialId(tut.id);
                          setActiveStepNumber(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          isTutActive
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                            : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        {tut.titleI18n[locale] || tut.titleI18n.en}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Navigation Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {selectedTutorial.steps.map((st) => {
                  const isStepActive = st.stepNumber === activeStepNumber;
                  return (
                    <button
                      key={st.stepNumber}
                      onClick={() => setActiveStepNumber(st.stepNumber)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isStepActive
                          ? 'bg-slate-900 border-sky-500/60 text-sky-300 shadow-md ring-1 ring-sky-500/30'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          isStepActive ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {st.stepNumber}
                      </span>
                      <span>{st.titleI18n[locale] || st.titleI18n.en}</span>
                    </button>
                  );
                })}
              </div>

              {/* Step Visual Diagram & Guide Body */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-2">
                    {activeStep.titleI18n[locale] || activeStep.titleI18n.en}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeStep.descriptionI18n[locale] || activeStep.descriptionI18n.en}
                  </p>
                </div>

                {/* High-Quality SVG Schematic Diagram */}
                <div className="rounded-xl border border-slate-800/90 overflow-hidden shadow-2xl bg-slate-950">
                  <StepDiagramSvg type={activeStep.diagramType} />
                </div>

                {/* Key Connections and Components Added */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs font-bold text-slate-300 block mb-2">
                      {locale === 'tr' ? 'Eklenen Bileşenler' : 'Components Added'}:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                      {activeStep.componentsAdded.map((c, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs font-bold text-slate-300 block mb-2">
                      {locale === 'tr' ? 'Önemli Hat Bağlantıları' : 'Key Net Connections'}:
                    </span>
                    {activeStep.keyConnections.length > 0 ? (
                      <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                        {activeStep.keyConnections.map((conn, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-sky-400 font-bold shrink-0">➔</span>
                            <span>
                              <strong className="text-slate-200">{conn.from}</strong> ➔{' '}
                              <strong className="text-slate-200">{conn.to}</strong> ({conn.label})
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">
                        {locale === 'tr' ? 'Giriş elemanları yerleştirildi.' : 'Input elements placed.'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Step Tips */}
                {activeStep.tipsI18n && (
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{activeStep.tipsI18n[locale] || activeStep.tipsI18n.en}</span>
                  </div>
                )}

                {/* Step Bottom Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <button
                    disabled={activeStepNumber <= 1}
                    onClick={() => setActiveStepNumber(activeStepNumber - 1)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    ← {locale === 'tr' ? 'Önceki Adım' : 'Previous Step'}
                  </button>

                  <span className="text-xs font-mono text-slate-500">
                    {activeStepNumber} / {selectedTutorial.steps.length}
                  </span>

                  {activeStepNumber < selectedTutorial.steps.length ? (
                    <button
                      onClick={() => setActiveStepNumber(activeStepNumber + 1)}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      {locale === 'tr' ? 'Sonraki Adım' : 'Next Step'} →
                    </button>
                  ) : (
                    <Link
                      href={`/dashboard/editor?template=${selectedTutorial.circuitTemplateId}`}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-slate-950 transition-colors shadow-lg"
                    >
                      {locale === 'tr' ? 'Şablonu Canlı Dene' : 'Try Live Template'} ➔
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BİLEŞENLER KÜTÜPHANESİ (COMPONENTS LIBRARY) */}
          {activeTab === 'components' && (
            <div className="space-y-6">
              {/* Search & Filter Header */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">
                    {locale === 'tr' ? 'Bileşen & Blok Ansiklopedisi' : 'Component & Block Reference'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    {locale === 'tr'
                      ? 'Simülatördeki 45 mantık kapısı, veri yolu modülü, kütük ve aritmetik bloğunun pin şemaları ve davranış detayları.'
                      : 'Pin layouts, behavioral descriptions, and specifications for all 45 gates, bus routers, and arithmetic blocks.'}
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={compSearch}
                    onChange={(e) => setCompSearch(e.target.value)}
                    placeholder={locale === 'tr' ? 'Bileşen ara (örn: AND, ADDER_8, REGISTER_8, MUX)...' : 'Search components (e.g. AND, ADDER_8, REGISTER_8)...'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {compCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isCatActive = selectedCompCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCompCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          isCatActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Components Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredComponents.map((def) => (
                  <ComponentDocCard key={def.type} def={def} locale={locale} />
                ))}
              </div>

              {filteredComponents.length === 0 && (
                <div className="text-center py-12 text-xs text-slate-500 font-mono">
                  {locale === 'tr' ? 'Aramanızla eşleşen bileşen bulunamadı.' : 'No components found matching your search.'}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HAZIR ŞABLONLAR GALERİSİ (TEMPLATES HUB) */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
                <h1 className="text-2xl font-extrabold text-white">
                  {locale === 'tr' ? 'Hazır Devre Şablonları Galerisi' : 'Circuit Templates Gallery'}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {locale === 'tr'
                    ? 'Tek tıkla editöre yükleyip hemen simüle edebileceğiniz tam teşekküllü devre mimarileri.'
                    : 'Pre-assembled, verified circuits ready to open and simulate with a single click.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="p-5 rounded-2xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-500/40 transition-all shadow-xl flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          {tpl.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {tpl.circuit.components.length} {locale === 'tr' ? 'eleman' : 'parts'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {tpl.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">
                        {tpl.circuit.wires.length} {locale === 'tr' ? 'kablo' : 'wires'}
                      </span>
                      <Link
                        href={`/dashboard/editor?template=${tpl.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-transform group-hover:scale-105"
                      >
                        <span>{locale === 'tr' ? 'Editörde Aç' : 'Open in Editor'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEMEL KAVRAMLAR & 4-STATE MOTOR */}
          {activeTab === 'basics' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
                <h1 className="text-2xl font-extrabold text-white">
                  {locale === 'tr' ? 'Editör Kontrolleri & 4-Durumlu Sinyal Motoru' : 'Editor Controls & 4-Valued Logic Engine'}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {locale === 'tr'
                    ? 'GateLab in endüstri standardı 4-seviyeli sinyal çözümleme motoru ve tuval kontrol rehberi.'
                    : 'GateLab 4-state reactive netlist solver, bus architecture, and editor navigation.'}
                </p>
              </div>

              {/* 4-State Signal Logic Table */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>{locale === 'tr' ? '4-Durumlu Sinyal Mantığı' : '4-Valued Signal Logic (0, 1, Z, X)'}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-600 border border-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-mono font-bold text-slate-300 text-xs">0 (LOW / Mantıksal Sıfır)</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {locale === 'tr' ? '0V Toprak (GND) potansiyelidir. Kapalı anahtarlar veya aktif olmayan hatlar bu değeri taşır.' : 'Ground (0V) potential. Inactive lines or low logic.'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/20 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-400 border border-emerald-200 shadow-[0_0_8px_#10b981] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-mono font-bold text-emerald-400 text-xs">1 (HIGH / Mantıksal Bir)</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {locale === 'tr' ? '+5V Pozitif gerilim (VCC). Akımı ve aktif lojik sinyali temsil eder.' : '+5V positive voltage. Active logic signal with neon glow.'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-900/60 bg-amber-950/20 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_8px_#f59e0b] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-mono font-bold text-amber-400 text-xs">Z (High-Impedance / Yüzer Hat)</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {locale === 'tr' ? 'Hattın hiçbir sürücü tarafından sürülmediği veya Tri-State tamponun kapalı olduğu yüksek empedans durumudur.' : 'High impedance. Wire is floating or disconnected.'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-rose-900/60 bg-rose-950/20 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-rose-500 border border-rose-200 shadow-[0_0_8px_#f43f5e] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-mono font-bold text-rose-400 text-xs">X (Contention / Sinyal Çakışması)</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {locale === 'tr' ? 'İki farklı çıkışın aynı kabloya biri 1, diğeri 0 vermesi durumunda oluşan kısa devre/çakışma hatasıdır.' : 'Electrical conflict: two outputs driving 1 and 0 onto same net.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editor Modes Guide */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-sky-400" />
                  <span>{locale === 'tr' ? 'Editör Kullanım İpuçları' : 'Editor Shortcuts & Modes'}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-sky-400 font-bold font-mono">
                      <span>C Tuşu</span>
                      <span className="text-slate-500">|</span>
                      <span>Kablo Kesme</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {locale === 'tr'
                        ? 'Makas modunu açar. Kesmek istediğiniz kabloya dokunmanız veya tıklamanız yeterlidir.'
                        : 'Enables wire slicing. Touch or click any wire to remove it instantly.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                      <span>V / Esc</span>
                      <span className="text-slate-500">|</span>
                      <span>Hareket Modu</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {locale === 'tr'
                        ? 'Normal seçim ve blok taşıma moduna geri döner.'
                        : 'Returns to standard component selection and movement mode.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-bold font-mono">
                      <span>Step Butonu</span>
                      <span className="text-slate-500">|</span>
                      <span>Tek Adım</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {locale === 'tr'
                        ? 'Simülasyon duraklatıldığında devreyi tek bir döngü ilerleterek adım adım hata ayıklamanızı sağlar.'
                        : 'Steps the circuit forward by a single tick for precise debugging.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 bg-slate-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BrandIcon className="w-5 h-5" />
            <span>GateLab — Logic Circuit Playground Documentation</span>
          </div>
          <div>React Flow · Next.js · TypeScript · Zustand</div>
        </div>
      </footer>
    </div>
  );
}
