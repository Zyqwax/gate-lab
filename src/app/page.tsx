'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { getLocalizedTemplates } from '@/templates/circuits';
import { BrandLogo, BrandIcon } from '@/components/ui/BrandLogo';
import {
  Cpu,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  TableProperties,
  Share2,
  BookOpen,
} from 'lucide-react';

export default function LandingPage() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background Neon Grid Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandLogo className="w-[120px] h-auto rounded-lg border border-slate-800/80" />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
              v0.2
            </span>
          </Link>

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
              href="/docs"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>{locale === 'tr' ? 'Rehber' : 'Docs'}</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t('viewDashboard')}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <section className="pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('landingBadge')}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            {t('landingHeroTitle1')}{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              {t('landingHeroTitle2')}
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('landingHeroSub')}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard/new"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{t('createNewCircuit')}</span>
            </Link>

            <Link
              href="/docs"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-semibold text-sm transition-all hover:border-emerald-500/60 shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              <span>{locale === 'tr' ? 'Görsel Rehber & Dokümantasyon' : 'Docs & Tutorials'}</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition-all hover:border-slate-700"
            >
              <span>{t('myCircuits')}</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Interactive Hero Circuit Preview Card */}
          <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto overflow-hidden">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-6 flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{locale === 'tr' ? 'Full Adder (Tam Toplayıcı) Simülasyonu' : 'Full Adder (1-Bit) Simulation'}</span>
                </span>
                <span className="text-emerald-400 font-bold">{locale === 'tr' ? 'Canlı & Reaktif Sinyal Akışı' : 'Live & Reactive Signal Flow'}</span>
              </div>

              {/* Simplified Schematic Graphic */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full py-8 text-left">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs font-mono text-sky-400 mb-1">{locale === 'tr' ? 'GİRİŞLER (3-Bit)' : 'INPUTS (3-Bit)'}</div>
                  <div className="text-sm font-semibold text-white">A=1, B=1, Cin=0</div>
                  <div className="text-xs text-slate-400 mt-2">{locale === 'tr' ? 'Düğmelerle canlı değiştirilebilir giriş sinyalleri.' : 'Interactive toggleable input signals via switches.'}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs font-mono text-emerald-400 mb-1">{locale === 'tr' ? 'MANTIK KAPILARI' : 'LOGIC GATES'}</div>
                  <div className="text-sm font-semibold text-white">2x XOR + 2x AND + 1x OR</div>
                  <div className="text-xs text-slate-400 mt-2">{locale === 'tr' ? '1 tick gecikme & settle döngüsü ile hatasız hesaplama.' : '1 tick propagation delay & settle loop calculation.'}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs font-mono text-amber-400 mb-1">{locale === 'tr' ? 'SONUÇ (ÇIKIŞ)' : 'OUTPUT RESULT'}</div>
                  <div className="text-sm font-semibold text-white">Sum=0, Cout=1</div>
                  <div className="text-xs text-slate-400 mt-2">{locale === 'tr' ? 'Neon parıltılı LED ve lojik prob göstergesi.' : 'Neon glowing LED indicators & digital logic probes.'}</div>
                </div>
              </div>

              <Link
                href="/dashboard/new"
                className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
              >
                <span>{locale === 'tr' ? 'Bu devreyi tam ekran editörde aç' : 'Open this circuit in full editor'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 border-t border-slate-800/80 bg-slate-950/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                {locale === 'tr' ? 'Mühendisler ve Öğrenenler İçin Tasarlandı' : 'Engineered for Learners and Makers'}
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                {locale === 'tr' ? 'Basit bir oyuncaktan öte, gerçek lojik tasarım ilkelerine sadık profesyonel mimari.' : 'True to digital electronics engineering: 4-valued simulation, stable feedback loops, and automated netlists.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{t('feature1Title')}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('feature1Desc')}
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
                  <TableProperties className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{t('feature2Title')}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('feature2Desc')}
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{t('feature3Title')}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('feature3Desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Showcase */}
        <section id="templates" className="py-20 border-t border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  {t('templatesTitle')}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {t('templatesSub')}
                </p>
              </div>
              <Link
                href="/dashboard/new"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>{locale === 'tr' ? 'Tüm şablonları keşfet' : 'Explore all templates'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {getLocalizedTemplates(locale).map((tpl) => (
                <Link
                  key={tpl.id}
                  href={`/dashboard/editor?template=${tpl.id}`}
                  className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {tpl.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-3 group-hover:text-emerald-300 transition-colors">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tpl.description}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>{t('openEditor')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BrandIcon className="w-6 h-6" />
            <span>GateLab — Logic Circuit Playground</span>
          </div>
          <div>React Flow · Next.js · TypeScript · Zustand</div>
        </div>
      </footer>
    </div>
  );
}
