'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getCircuitById, getSavedCircuits, createBlankCircuit, createCircuitFromTemplate } from '@/lib/circuitStorage';
import { useCircuitStore } from '@/store/circuitStore';
import { useTranslation } from '@/i18n';
import { BrandIcon } from '@/components/ui/BrandLogo';

const CircuitEditorApp = dynamic(() => import('@/App'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
      <BrandIcon className="w-12 h-12 animate-pulse" />
      <div className="text-sm font-medium text-slate-300">Loading Circuit...</div>
      <div className="text-xs text-slate-500 font-mono">Connecting components and netlist</div>
    </div>
  ),
});

function EditorContent() {
  const searchParams = useSearchParams();
  const circuitId = searchParams.get('id');
  const templateId = searchParams.get('template');
  const setProject = useCircuitStore((state) => state.setProject);
  const { t, locale } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (circuitId) {
      const saved = getCircuitById(circuitId);
      if (saved) {
        setProject(saved.id, saved.name, saved.circuit);
        setReady(true);
        return;
      }
    }

    if (templateId) {
      const created = createCircuitFromTemplate(templateId, undefined, locale);
      setProject(created.id, created.name, created.circuit);
      setReady(true);
      return;
    }

    // Fallback: check if any circuit exists or create blank
    const all = getSavedCircuits();
    if (all.length > 0) {
      setProject(all[0].id, all[0].name, all[0].circuit);
    } else {
      const blank = createBlankCircuit(undefined, locale);
      setProject(blank.id, blank.name, blank.circuit);
    }
    setReady(true);
  }, [circuitId, setProject, locale]);

  if (!ready) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-xs">
        {t('loadingCircuit')}
      </div>
    );
  }

  return <CircuitEditorApp />;
}

export default function CircuitEditorPage() {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-xs">
          {t('loadingCircuit')}
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
