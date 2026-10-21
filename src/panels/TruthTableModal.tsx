import React, { useMemo } from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { defaultSimulator } from '../engine/simulator';
import { CircuitModel, Signal } from '../engine/types';
import { X, CheckCircle2, Table } from 'lucide-react';

interface TruthTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TruthTableModal: React.FC<TruthTableModalProps> = ({ isOpen, onClose }) => {
  const components = useCircuitStore((state) => state.components);
  const wires = useCircuitStore((state) => state.wires);

  const inputs = useMemo(
    () => components.filter((c) => c.type === 'SWITCH'),
    [components]
  );

  const outputs = useMemo(
    () => components.filter((c) => c.type === 'LED' || c.type === 'PROBE'),
    [components]
  );

  // Generate all 2^N input combinations and evaluate
  const rows = useMemo(() => {
    if (inputs.length === 0 || outputs.length === 0 || inputs.length > 8) {
      return [];
    }

    const n = inputs.length;
    const totalCombinations = 1 << n;
    const resultRows: { inputVals: number[]; outputVals: Record<string, Signal> }[] = [];

    for (let i = 0; i < totalCombinations; i++) {
      const inputVals: number[] = [];
      const testComponents = components.map((comp) => {
        const inputIdx = inputs.findIndex((inp) => inp.id === comp.id);
        if (inputIdx !== -1) {
          // bit value
          const bit = (i >> (n - 1 - inputIdx)) & 1;
          inputVals.push(bit);
          return {
            ...comp,
            params: { ...comp.params, state: bit },
          };
        }
        return comp;
      });

      const testModel: CircuitModel = {
        version: 1,
        mode: 'sandbox',
        components: testComponents,
        wires,
      };

      const simRes = defaultSimulator.evaluate(testModel);

      const outVals: Record<string, Signal> = {};
      for (const out of outputs) {
        outVals[out.id] = simRes.pinValues[`${out.id}:in`] ?? 'Z';
      }

      resultRows.push({ inputVals, outputVals: outVals });
    }

    return resultRows;
  }, [inputs, outputs, components, wires]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Otomatik Doğruluk Tablosu (Truth Table)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {inputs.length === 0 || outputs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              Tablo oluşturmak için devrenizde en az 1 Switch (giriş) ve 1 LED / Probe (çıkış) bulunmalıdır.
            </div>
          ) : inputs.length > 8 ? (
            <div className="text-center py-10 text-amber-500 text-xs">
              Çok fazla giriş var ({inputs.length}). Maksimum 8 giriş desteklenmektedir ($2^8 = 256$ durum).
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                    <th className="py-2.5 px-3 border-r border-slate-800 text-center w-12">#</th>
                    {inputs.map((inp) => (
                      <th key={inp.id} className="py-2.5 px-3 border-r border-slate-800 text-center text-sky-400">
                        {inp.params.label || inp.id}
                      </th>
                    ))}
                    {outputs.map((out) => (
                      <th key={out.id} className="py-2.5 px-3 text-center text-emerald-400 font-bold">
                        {out.params.label || out.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2 px-3 text-center text-slate-500 border-r border-slate-800/60">
                        {idx}
                      </td>
                      {row.inputVals.map((val, i) => (
                        <td
                          key={i}
                          className={`py-2 px-3 text-center border-r border-slate-800/60 font-bold ${
                            val === 1 ? 'text-sky-300 bg-sky-950/20' : 'text-slate-400'
                          }`}
                        >
                          {val}
                        </td>
                      ))}
                      {outputs.map((out) => {
                        const val = row.outputVals[out.id];
                        const isHigh = val === 1;
                        return (
                          <td
                            key={out.id}
                            className={`py-2 px-3 text-center font-bold ${
                              isHigh
                                ? 'text-emerald-400 bg-emerald-950/30'
                                : val === 0
                                ? 'text-slate-500'
                                : 'text-rose-400'
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{rows.length} durum başarıyla simüle edildi</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
