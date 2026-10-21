"use client";

import React, { useState } from "react";
import { COMPONENT_DEFINITIONS } from "../components-lib/registry";
import { TEMPLATES } from "../templates/circuits";
import { useCircuitStore } from "../store/circuitStore";
import { Search, Plus, Cpu, ToggleLeft, Activity, Boxes, GripVertical, Sparkles, ArrowRight } from "lucide-react";
import { ComponentIcon } from "./icons/ComponentIcon";
import { NodeDragPreview } from "./nodes/NodeDragPreview";

export const Palette: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const addComponent = useCircuitStore((state) => state.addComponent);
  const loadTemplate = useCircuitStore((state) => state.loadTemplate);

  const categories = [
    { id: "all", label: "Tümü", icon: Boxes },
    { id: "gate", label: "Kapılar", icon: Cpu },
    { id: "io", label: "Girişler", icon: ToggleLeft },
    { id: "display", label: "Çıkışlar", icon: Activity },
    { id: "block", label: "Bloklar", icon: Boxes },
    { id: "templates", label: "Şablonlar", icon: Sparkles },
  ];

  const filteredComponents = COMPONENT_DEFINITIONS.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "all" ||
      comp.category === activeCategory ||
      (activeCategory === "block" && comp.category === "sequential");

    return matchesSearch && matchesCategory;
  });

  const filteredTemplates = TEMPLATES.filter(
    (tpl) =>
      tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const onDragStart = (event: React.DragEvent, componentType: string) => {
    event.dataTransfer.setData("application/gate-lab-component", componentType);
    event.dataTransfer.effectAllowed = "move";

    // Use exact canvas node visual as the drag ghost image!
    const previewEl = document.getElementById(`drag-preview-${componentType}`);
    if (previewEl && event.dataTransfer.setDragImage) {
      event.dataTransfer.setDragImage(previewEl, 67, 40);
    }
  };

  return (
    <div className="w-72 bg-slate-900/95 border-r border-slate-800 flex flex-col h-full select-none z-10 shadow-2xl backdrop-blur-md">
      {/* Search Bar */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Parça veya şablon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-3 h-3" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {/* TEMPLATES CATEGORY */}
        {activeCategory === "templates" ? (
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase px-1 py-0.5">Hazır Devre Şablonları</div>
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => {
                  if (confirm(`"${tpl.name}" şablonu tuvale yüklensin mi?`)) {
                    loadTemplate(tpl.id);
                  }
                }}
                className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-850 hover:border-indigo-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">{tpl.name}</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
                    {tpl.category}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{tpl.description}</p>
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>
                    {tpl.circuit.components.length} parça · {tpl.circuit.wires.length} tel
                  </span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-sans font-semibold">
                    Yükle →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* STANDARD COMPONENTS LIST */
          filteredComponents.map((comp) => {
            return (
              <div
                key={comp.type}
                draggable
                onDragStart={(e) => onDragStart(e, comp.type)}
                onClick={() => {
                  addComponent(comp.type, { x: 350, y: 220 });
                }}
                className="group relative px-2.5 py-2 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/60 hover:border-sky-500/50 cursor-grab active:cursor-grabbing transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Visual Icon Container */}
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:border-sky-500/40 group-hover:bg-slate-850 transition-colors shrink-0">
                    <ComponentIcon type={comp.type} className="w-5 h-5 drop-shadow-sm" />
                  </div>

                  {/* Name Only (Clean) */}
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                      {comp.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 group-hover:text-sky-400 transition-colors">
                      {comp.type}
                    </div>
                  </div>
                </div>

                {/* Quick Add / Drag Icon */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    className="w-6 h-6 rounded-md bg-slate-800/80 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Tuvale Ekle"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
        {/* <span>Sürükle veya tıkla</span>
        <span className="font-mono">
          {activeCategory === 'templates'
            ? `${filteredTemplates.length} şablon`
            : `${filteredComponents.length} parça`}
        </span> */}
      </div>

      {/* Hidden Off-Screen Drag Previews (Used by setDragImage to render canvas-like ghost during drag) */}
      <div className="fixed top-0 left-[-9999px] pointer-events-none z-[-100] opacity-90" aria-hidden="true">
        {COMPONENT_DEFINITIONS.map((def) => (
          <NodeDragPreview key={def.type} def={def} />
        ))}
      </div>
    </div>
  );
};
