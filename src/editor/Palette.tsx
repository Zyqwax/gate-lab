import React, { useState } from 'react';
import { COMPONENT_DEFINITIONS } from '../components-lib/registry';
import { useCircuitStore } from '../store/circuitStore';
import { Search, Plus, Cpu, ToggleLeft, Activity, Boxes } from 'lucide-react';
import { GateSvg } from './nodes/GateSvg';

export const Palette: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const addComponent = useCircuitStore((state) => state.addComponent);

  const categories = [
    { id: 'all', label: 'Tümü', icon: Boxes },
    { id: 'gate', label: 'Kapılar', icon: Cpu },
    { id: 'io', label: 'Girişler', icon: ToggleLeft },
    { id: 'display', label: 'Çıkışlar', icon: Activity },
    { id: 'block', label: 'Bloklar', icon: Boxes },
  ];

  const filteredComponents = COMPONENT_DEFINITIONS.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comp.description && comp.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      activeCategory === 'all' ||
      comp.category === activeCategory ||
      (activeCategory === 'block' && comp.category === 'sequential');

    return matchesSearch && matchesCategory;
  });

  const onDragStart = (event: React.DragEvent, componentType: string) => {
    event.dataTransfer.setData('application/gate-lab-component', componentType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-72 bg-slate-900/95 border-r border-slate-800 flex flex-col h-full select-none z-10 shadow-2xl backdrop-blur-md">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            ⚡
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              GateLab <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">v0.1</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">Logic Circuit Playground</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-slate-800/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Parça ara... (AND, LED, Switch)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-800/60 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3 h-3" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredComponents.map((comp) => {
          const isGate = comp.category === 'gate';

          return (
            <div
              key={comp.type}
              draggable
              onDragStart={(e) => onDragStart(e, comp.type)}
              onClick={() => {
                // Click to add to center
                addComponent(comp.type, { x: 350, y: 200 });
              }}
              className="group relative p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/40 hover:border-slate-700 cursor-grab active:cursor-grabbing transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                  {isGate ? (
                    <GateSvg type={comp.type} className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-mono font-bold">
                      {comp.type.slice(0, 3)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-200 group-hover:text-white">
                    {comp.name}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[130px]">
                    {comp.description}
                  </div>
                </div>
              </div>

              <button
                className="w-6 h-6 rounded bg-slate-800/80 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Tuvale Ekle"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
        <span>Sürükle veya tıkla</span>
        <span className="font-mono">{filteredComponents.length} parça</span>
      </div>
    </div>
  );
};
