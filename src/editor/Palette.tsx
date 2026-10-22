"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useReactFlow } from "@xyflow/react";
import { COMPONENT_DEFINITIONS, getLocalizedComponentDefinitions } from "../components-lib/registry";
import { TEMPLATES, getLocalizedTemplates } from "../templates/circuits";
import { useCircuitStore } from "../store/circuitStore";
import { confirmDialog } from "../store/dialogStore";
import { useTranslation } from "../i18n";
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
  const { t, locale } = useTranslation();
  const { screenToFlowPosition } = useReactFlow();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const addComponent = useCircuitStore((state) => state.addComponent);
  const loadTemplate = useCircuitStore((state) => state.loadTemplate);

  // Places the component in the center of the currently visible canvas viewport
  const addComponentToViewportCenter = useCallback(
    (compType: string) => {
      const canvasEl = document.querySelector(".react-flow");
      if (canvasEl) {
        const rect = canvasEl.getBoundingClientRect();
        const centerScreen = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        const flowPos = screenToFlowPosition(centerScreen);
        // Add subtle random jitter (-15px..+15px) so multiple consecutive clicks don't stack directly on top
        const jitterX = (Math.random() - 0.5) * 30;
        const jitterY = (Math.random() - 0.5) * 30;
        addComponent(compType, {
          x: Math.round((flowPos.x + jitterX) / 10) * 10,
          y: Math.round((flowPos.y + jitterY) / 10) * 10,
        });
      } else {
        addComponent(compType, { x: 350, y: 220 });
      }
    },
    [addComponent, screenToFlowPosition]
  );

  // Touch drag state & tracking for tablets/mobile
  interface TouchGhostState {
    type: string;
    name: string;
    x: number;
    y: number;
    isOverCanvas: boolean;
  }

  const [touchGhost, setTouchGhost] = useState<TouchGhostState | null>(null);
  const touchSessionRef = useRef<{
    startX: number;
    startY: number;
    compType: string;
    compName: string;
    isDragging: boolean;
    startTime: number;
  } | null>(null);
  const lastTouchDropTimeRef = useRef<number>(0);

  const handleTouchStart = (
    e: React.TouchEvent,
    compType: string,
    compName: string,
    fromGrip = false
  ) => {
    const touch = e.touches[0];
    if (!touch) return;

    touchSessionRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      compType,
      compName,
      isDragging: fromGrip,
      startTime: Date.now(),
    };

    if (fromGrip) {
      setTouchGhost({
        type: compType,
        name: compName,
        x: touch.clientX,
        y: touch.clientY,
        isOverCanvas: false,
      });
    }
  };

  useEffect(() => {
    const onWindowTouchMove = (e: TouchEvent) => {
      const session = touchSessionRef.current;
      if (!session) return;
      const touch = e.touches[0];
      if (!touch) return;

      const dx = touch.clientX - session.startX;
      const dy = touch.clientY - session.startY;

      // Start drag if user moved horizontally to the right or moved past threshold
      if (!session.isDragging) {
        if (dx > 20 || Math.hypot(dx, dy) > 25) {
          session.isDragging = true;
        }
      }

      if (session.isDragging) {
        if (e.cancelable) {
          e.preventDefault();
        }

        let isOverCanvas = false;
        const canvasEl = document.querySelector(".react-flow");
        if (canvasEl) {
          const rect = canvasEl.getBoundingClientRect();
          isOverCanvas =
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom;
        }

        setTouchGhost({
          type: session.compType,
          name: session.compName,
          x: touch.clientX,
          y: touch.clientY,
          isOverCanvas,
        });
      }
    };

    const onWindowTouchEnd = (e: TouchEvent) => {
      const session = touchSessionRef.current;
      if (!session) return;

      const touch = e.changedTouches[0];
      if (session.isDragging && touch) {
        lastTouchDropTimeRef.current = Date.now();
        const canvasEl = document.querySelector(".react-flow");
        if (canvasEl) {
          const rect = canvasEl.getBoundingClientRect();
          const isOverCanvas =
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom;

          if (isOverCanvas) {
            const flowPos = screenToFlowPosition({
              x: touch.clientX,
              y: touch.clientY,
            });
            addComponent(session.compType, {
              x: Math.round(flowPos.x / 10) * 10,
              y: Math.round(flowPos.y / 10) * 10,
            });
          }
        }
      }

      touchSessionRef.current = null;
      setTouchGhost(null);
    };

    const onWindowTouchCancel = () => {
      touchSessionRef.current = null;
      setTouchGhost(null);
    };

    window.addEventListener("touchmove", onWindowTouchMove, { passive: false });
    window.addEventListener("touchend", onWindowTouchEnd, { passive: false });
    window.addEventListener("touchcancel", onWindowTouchCancel);

    return () => {
      window.removeEventListener("touchmove", onWindowTouchMove);
      window.removeEventListener("touchend", onWindowTouchEnd);
      window.removeEventListener("touchcancel", onWindowTouchCancel);
    };
  }, [addComponent, screenToFlowPosition]);

  const categories = [
    { id: "all", label: t("catAll"), icon: Boxes },
    { id: "gate", label: t("catGates"), icon: Cpu },
    { id: "io", label: t("catInputs"), icon: ToggleLeft },
    { id: "display", label: t("catOutputs"), icon: Activity },
    { id: "block", label: t("catBlocks"), icon: Binary },
    { id: "templates", label: t("catTemplates"), icon: Sparkles },
  ];

  const localizedComponents = getLocalizedComponentDefinitions(locale);
  const localizedTemplates = getLocalizedTemplates(locale);

  // Group definitions
  const allGroups: ComponentGroup[] = [
    {
      id: "gate",
      name: t("grpGates"),
      icon: Zap,
      items: localizedComponents.filter((c) => c.category === "gate"),
    },
    {
      id: "io",
      name: t("grpInputs"),
      icon: Power,
      items: localizedComponents.filter((c) => c.category === "io"),
    },
    {
      id: "display",
      name: t("grpOutputs"),
      icon: Eye,
      items: localizedComponents.filter((c) => c.category === "display"),
    },
    {
      id: "block",
      name: t("grpBlocks"),
      icon: Binary,
      items: localizedComponents.filter((c) => c.category === "block"),
    },
    {
      id: "sequential",
      name: t("grpSequential"),
      icon: Layers,
      items: localizedComponents.filter((c) => c.category === "sequential"),
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

  const filteredTemplates = localizedTemplates.filter(
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
            placeholder={t("searchParts")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 p-0.5 text-slate-500 hover:text-slate-300 rounded cursor-pointer transition-colors"
              title={t("clearSearch")}
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
        {/* TEMPLATES SECTION - Only visible when templates category button is active */}
        {activeCategory === "templates" && (
          filteredTemplates.length > 0 ? (
            <div className="space-y-1.5">
              <div lang={locale} className="flex items-center gap-1.5 px-1 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800/60 pb-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{t("grpTemplates")}</span>
              </div>

              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={async () => {
                    const ok = await confirmDialog({
                      title: t("loadTemplateTitle"),
                      message: t("loadTemplateMsg", { name: tpl.name }),
                      confirmText: t("loadTemplateAction"),
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
                    <span>{t("partsCount", { count: tpl.circuit.components.length })}</span>
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center font-sans font-semibold">
                      {t("loadTemplateBtn")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              {searchTerm ? t("noSearchResults", { term: searchTerm }) : t("noCircuitsTitle")}
            </div>
          )
        )}

        {/* COMPONENT GROUPS */}
        {activeCategory !== "templates" &&
          filteredGroups.map((group) => {
            const GroupIcon = group.icon;

            return (
              <div key={group.id} className="space-y-1.5">
                {/* Group Name Header */}
                <div lang={locale} className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800/60 pb-1">
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
                      onTouchStart={(e) => handleTouchStart(e, comp.type, comp.name, false)}
                      onClick={() => {
                        if (Date.now() - lastTouchDropTimeRef.current < 450) return;
                        addComponentToViewportCenter(comp.type);
                      }}
                      className="group relative px-2.5 py-2.5 min-h-[46px] rounded-xl border border-slate-800/70 bg-slate-950/60 hover:bg-slate-800/70 hover:border-sky-500/50 cursor-grab active:cursor-grabbing transition-all flex items-center justify-between touch-manipulation"
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
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addComponentToViewportCenter(comp.type);
                          }}
                          className="w-5.5 h-5.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title={t("addToCanvas")}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <div
                          className="p-1 -m-1 cursor-grab touch-none"
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            handleTouchStart(e, comp.type, comp.name, true);
                          }}
                          title={t("addToCanvas")}
                        >
                          <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {/* Empty state for components */}
        {activeCategory !== "templates" && filteredGroups.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500">
            {searchTerm ? t("noSearchResults", { term: searchTerm }) : t("noCircuitsTitle")}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between"></div>

      {/* Hidden Off-Screen Drag Previews for Desktop HTML5 DND */}
      <div className="fixed top-0 left-[-9999px] pointer-events-none z-[-100] opacity-90" aria-hidden="true">
        {COMPONENT_DEFINITIONS.map((def) => (
          <NodeDragPreview key={def.type} def={def} />
        ))}
      </div>

      {/* Mobile / Tablet Touch Drag Floating Ghost Preview */}
      {touchGhost &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 shadow-2xl backdrop-blur-md transition-all duration-75 ${
              touchGhost.isOverCanvas
                ? "bg-slate-900/95 border-emerald-400 shadow-emerald-500/30 scale-105 ring-2 ring-emerald-500/30"
                : "bg-slate-900/90 border-slate-700 shadow-black/50 opacity-80"
            }`}
            style={{
              left: `${touchGhost.x}px`,
              top: `${touchGhost.y}px`,
            }}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                touchGhost.isOverCanvas
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              <ComponentIcon type={touchGhost.type} className="w-5 h-5 drop-shadow-sm" />
            </div>
            <div className="flex flex-col pr-1">
              <span className="text-xs font-bold text-white leading-tight">
                {touchGhost.name}
              </span>
              <span
                className={`text-[9px] font-mono leading-tight ${
                  touchGhost.isOverCanvas ? "text-emerald-400 font-semibold" : "text-slate-400"
                }`}
              >
                {touchGhost.isOverCanvas ? t("dropToCanvas") : touchGhost.type}
              </span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
