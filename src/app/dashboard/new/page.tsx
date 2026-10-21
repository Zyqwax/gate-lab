'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TEMPLATES } from '@/templates/circuits';
import {
  createBlankCircuit,
  createCircuitFromTemplate,
  createCircuitFromJSON,
} from '@/lib/circuitStorage';
import {
  ChevronLeft,
  PlusCircle,
  Sparkles,
  FileUp,
  ArrowRight,
  AlertCircle,
  Layers,
  Cpu,
} from 'lucide-react';

export default function NewCircuitPage() {
  const router = useRouter();
  const [blankName, setBlankName] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartBlank = (e: React.FormEvent) => {
    e.preventDefault();
    const newCircuit = createBlankCircuit(blankName);
    router.push(`/dashboard/editor?id=${newCircuit.id}`);
  };

  const handleSelectTemplate = (templateId: string) => {
    const newCircuit = createCircuitFromTemplate(templateId);
    router.push(`/dashboard/editor?id=${newCircuit.id}`);
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
          setImportError('Dosya içeriği boş.');
          return;
        }

        const cleanName = file.name.replace(/\.json$/i, '').replace(/[-_]/g, ' ');
        const newCircuit = createCircuitFromJSON(content, cleanName);

        if (newCircuit) {
          router.push(`/dashboard/editor?id=${newCircuit.id}`);
        } else {
          setImportError('Geçersiz devre JSON formatı. "components" veya "wires" eksik.');
        }
      } catch (err) {
        setImportError('Dosya okunurken bir hata oluştu.');
      }
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Dashboard'a Dön</span>
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-xs font-semibold text-slate-300">Yeni Devre Projesi</span>
          </div>
        </div>
      </header>

      {/* Main Form Page Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2.5">
            <Cpu className="w-8 h-8 text-emerald-400" />
            <span>Yeni Proje Başlat</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Devrenizi nasıl başlatmak istersiniz? Boş bir tuval açabilir, hazır devre şablonlarından birini temel alabilir veya bir JSON dosyası yükleyebilirsiniz.
          </p>
        </div>

        {importError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Blank Circuit */}
          <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-white mb-1">Boş Devre ile Başla</h2>
              <p className="text-xs text-slate-400 mb-6">
                Tertemiz bir çalışma alanı. Kapıları, anahtarları ve LED'leri kendi hayal gücünüzle yerleştirin.
              </p>

              <form onSubmit={handleStartBlank} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Proje Adı
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: 4-Bit ALU Tasarımı"
                    value={blankName}
                    onChange={(e) => setBlankName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <span>Boş Tuval Aç</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </form>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              * İstediğiniz an projeyi yerel olarak kaydedebilir veya JSON olarak dışa aktarabilirsiniz.
            </div>
          </div>

          {/* Card 2: Ready Templates */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Hazır Şablonlar ile Başla</h2>
                    <p className="text-xs text-slate-400">Doğrulanmış şablon devresini yeni bir proje olarak klonlayın.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
                      tpl.id === 'full-adder'
                        ? 'bg-slate-950/90 border-indigo-500/50 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-slate-100 group-hover:text-indigo-300">
                          {tpl.name}
                        </span>
                        {tpl.id === 'full-adder' && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                            Önerilen
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{tpl.category}</span>
                      <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-sans font-semibold">
                        <span>Bu Şablonu Aç</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Import JSON inside Templates Card */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 rounded-xl border border-dashed border-slate-700 hover:border-sky-500 bg-slate-950/40 hover:bg-sky-950/10 transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-sky-300">
                      Kendi JSON Devre Dosyanı Yükle (.json)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Daha önce indirdiğiniz bir devre şemasını yükleyip yeni proje olarak başlatın.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
                  <span>Dosya Seç</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
