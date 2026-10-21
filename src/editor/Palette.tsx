"use client";

import React, { useState } from "react";
import { COMPONENT_DEFINITIONS } from "../components-lib/registry";
import { TEMPLATES } from "../templates/circuits";
import { useCircuitStore } from "../store/circuitStore";
import { confirmDialog } from "../store/dialogStore";
import {
  Search,
  Plus,
  Cpu,
  ToggleLeft,
  Activity,
  Boxes,
  GripVertical,
  Sparkles,
  Zap,
  Power,
  Eye,
  Binary,
  Layers,
  X,
} from "lucide-react";
import { ComponentIcon } from "./icons/ComponentIcon";
import { NodeDragPreview } from "./nodes/NodeDragPreview";
import { ComponentDef } from "../engine/types";

interface ComponentGroup {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: ComponentDef[];
}

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
    { id: "block", label: "Bloklar", icon: Binary },
    { id: "templates", label: "Şablonlar", icon: Sparkles },
  ];

  // Group definitions
  const allGroups: ComponentGroup[] = [
    {
      id: "gate",
      name: "Mantık Kapıları",
      icon: Zap,
      items: COMPONENT_DEFINITIONS.filter((c) => c.category === "gate"),
    },
    {
      id: "io",
      name: "Giriş & Güç",
      icon: Power,
      items: COMPONENT_DEFINITIONS.filter((c) => c.category === "io"),
    },
    {
      id: "display",
      name: "Çıkış & Göstergeler",
      icon: Eye,
      items: COMPONENT_DEFINITIONS.filter((c) => c.category === "display"),
    },
    {
      id: "block",
      name: "Kombinasyonel Bloklar",
      icon: Binary,
      items: COMPONENT_DEFINITIONS.filter((c) => c.category === "block"),
    },
    {
      id: "sequential",
      name: "Sıralı / Hafıza",
      icon: Layers,
      items: COMPONENT_DEFINITIONS.filter((c) => c.category === "sequential"),
    },
  ];

  // Filter groups according to activeCategory & searchTerm
  const filteredGroups = allGroups
    .map((group) => {
      // Category filter
      if (activeCategory !== "all") {
        if (activeCategory === "block") {
          if (group.id !== "block" && group.id !== "sequential") return null;
        } else if (group.id !== activeCategory) {
          return null;
        }
      }

      // Search filter
      const matchingItems = group.items.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.type.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      if (matchingItems.length === 0) return null;

      return {
        ...group,
        items: matchingItems,
      };
    })
    .filter(Boolean) as ComponentGroup[];

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
    <div className="w-56 bg-slate-900/95 border-r border-slate-800 flex flex-col h-full select-none z-10 shadow-2xl backdrop-blur-md">
      {/* Compact Search Bar */}
      <div className="p-2.5 border-b border-slate-800/80">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Parça ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 p-0.5 text-slate-500 hover:text-slate-300 rounded cursor-pointer transition-colors"
              title="Aramayı Temizle"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills (Compact) */}
      <div className="flex items-center gap-1 p-1.5 border-b border-slate-800/60 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-2.5 h-2.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grouped Components List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3.5">
        {/* TEMPLATES SECTION */}
        {(activeCategory === "all" || activeCategory === "templates") &&
          filteredTemplates.length > 0 &&
          (activeCategory === "templates" || !searchTerm) && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 px-1 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800/60 pb-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Hazır Şablonlar</span>
              </div>

              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={async () => {
                    const ok = await confirmDialog({
                      title: "Şablon Yükle",
                      message: `"${tpl.name}" şablonu tuvale yüklensin mi? Mevcut çizim alanı güncellenecektir.`,
                      confirmText: "Şablonu Yükle",
                      type: "info",
                    });
                    if (ok) {
                      loadTemplate(tpl.id);
                    }
                  }}
                  className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-850 hover:border-indigo-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 truncate">
                      {tpl.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2 pt-1.5 border-t border-slate-800/40">
                    <span>{tpl.circuit.components.length} parça</span>
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center font-sans font-semibold">
                      Yükle →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* COMPONENT GROUPS */}
        {activeCategory !== "templates" &&
          filteredGroups.map((group) => {
            const GroupIcon = group.icon;

            return (
              <div key={group.id} className="space-y-1.5">
                {/* Group Name Header */}
                <div className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800/60 pb-1">
                  <GroupIcon className="w-3 h-3 text-sky-400" />
                  <span>{group.name}</span>
                  <span className="text-[9px] text-slate-600 font-normal ml-auto">({group.items.length})</span>
                </div>

                {/* Items in this group - RESTORED FULL VERTICAL HEIGHT */}
                <div className="space-y-1.5 pt-0.5">
                  {group.items.map((comp) => (
                    <div
                      key={comp.type}
                      draggable
                      onDragStart={(e) => onDragStart(e, comp.type)}
                      onClick={() => {
                        addComponent(comp.type, { x: 350, y: 220 });
                      }}
                      className="group relative px-2.5 py-2.5 min-h-[46px] rounded-xl border border-slate-800/70 bg-slate-950/60 hover:bg-slate-800/70 hover:border-sky-500/50 cursor-grab active:cursor-grabbing transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Generous Visual Icon Container */}
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:border-sky-500/40 group-hover:bg-slate-850 transition-colors shrink-0">
                          <ComponentIcon type={comp.type} className="w-5 h-5 drop-shadow-sm" />
                        </div>

                        {/* Name Only (Clean, Legible & Well Spaced) */}
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
                          className="w-5.5 h-5.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Tuvale Ekle"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between"></div>

      {/* Hidden Off-Screen Drag Previews */}
      <div className="fixed top-0 left-[-9999px] pointer-events-none z-[-100] opacity-90" aria-hidden="true">
        {COMPONENT_DEFINITIONS.map((def) => (
          <NodeDragPreview key={def.type} def={def} />
        ))}
      </div>
    </div>
  );
};
