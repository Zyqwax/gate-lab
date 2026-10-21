'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getCircuitById, getSavedCircuits, createBlankCircuit } from '@/lib/circuitStorage';
import { useCircuitStore } from '@/store/circuitStore';

const CircuitEditorApp = dynamic(() => import('@/App'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-[0_0_24px_rgba(16,185,129,0.3)] animate-pulse">
        ⚡
      </div>
      <div className="text-sm font-medium text-slate-300">Devre Yükleniyor...</div>
      <div className="text-xs text-slate-500 font-mono">Bileşenler ve kablolar bağlanıyor</div>
    </div>
  ),
});

function EditorContent() {
  const searchParams = useSearchParams();
  const circuitId = searchParams.get('id');
  const setProject = useCircuitStore((state) => state.setProject);
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

    // Fallback: check if any circuit exists or create blank
    const all = getSavedCircuits();
    if (all.length > 0) {
      setProject(all[0].id, all[0].name, all[0].circuit);
    } else {
      const blank = createBlankCircuit('Yeni Devre Projesi');
      setProject(blank.id, blank.name, blank.circuit);
    }
    setReady(true);
  }, [circuitId, setProject]);

  if (!ready) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-xs">
        Hazırlanıyor...
      </div>
    );
  }

  return <CircuitEditorApp />;
}

export default function CircuitEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-xs">
          Yükleniyor...
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
