"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useCircuitStore } from "../store/circuitStore";
import { confirmDialog, alertDialog } from "../store/dialogStore";
import { TEMPLATES } from "../templates/circuits";
import { BrandIcon } from "../components/ui/BrandLogo";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  TableProperties,
  Download,
  Upload,
  Undo2,
  Redo2,
  Trash2,
  Gauge,
  Sparkles,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeft,
  PanelRightClose,
  PanelRight,
  Save,
  Check,
  ChevronLeft,
  Pencil,
  MoreVertical,
  Sliders,
  Map,
  Globe,
} from "lucide-react";
import { useTranslation } from "../i18n";

interface ToolbarProps {
  onOpenTruthTable: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onOpenTruthTable,
  isSidebarOpen,
  onToggleSidebar,
  isInspectorOpen,
  onToggleInspector,
}) => {
  const { t, locale, setLocale } = useTranslation();
  const {
    isRunning,
    togglePlay,
    step,
    resetSimulation,
    tickRateHz,
    setTickRate,
    clearCircuit,
    exportJSON,
    importJSON,
    undo,
    redo,
    historyPast,
    historyFuture,
    stepCount,
    currentProjectName,
    setProjectName,
    isSaved,
    saveCurrentProject,
    showMinimap,
    toggleMinimap,
  } = useCircuitStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentProjectName);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempName(currentProjectName);
  }, [currentProjectName]);

  // Sync fullscreen state with document events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Close more menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isMoreMenuOpen]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error("Fullscreen toggle failed:", err);
    }
  };

  const handleSave = () => {
    saveCurrentProject();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProjectName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "gate-lab-circuit"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsMoreMenuOpen(false);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importJSON(content);
        if (!ok) {
          await alertDialog({
            title: t("importErrorTitle"),
            message: t("importErrorMsg"),
            type: "error",
          });
        } else {
          const cleanName = file.name.replace(/\.json$/i, "").replace(/[-_]/g, " ");
          setProjectName(cleanName);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
    setIsMoreMenuOpen(false);
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setProjectName(tempName.trim());
    } else {
      setTempName(currentProjectName);
    }
    setIsEditingName(false);
  };

  return (
    <header className="h-10 sm:h-12 bg-slate-900/95 border-b border-slate-800 px-3.5 flex items-center justify-between select-none z-20 backdrop-blur-md shadow-lg gap-2 relative">
      {/* 1. LEFT SECTION: Navigation, Sidebar Toggle & Project Name */}
      <div className="flex items-center gap-1.5 shrink-0 z-10">
        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1 pr-2 pl-1 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
          title={t("backToDashboard")}
        >
          <ChevronLeft className="w-4 h-4" />
          <BrandIcon className="w-6 h-6 shrink-0" />
        </Link>

        {/* Toggle Left Sidebar */}
        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
            isSidebarOpen
              ? "bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700"
              : "bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
          title={isSidebarOpen ? t("hideSidebar") : t("showSidebar")}
        >
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>

        {/* Editable Project Name (Fixed width & height to prevent any button shift) */}
        <div className="w-36 sm:w-48 shrink-0">
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSubmit();
                if (e.key === "Escape") {
                  setTempName(currentProjectName);
                  setIsEditingName(false);
                }
              }}
              autoFocus
              className="w-full h-7 px-2 rounded-lg bg-slate-950 border border-emerald-500 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 shadow-inner"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="w-full h-7 px-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-between group cursor-pointer text-left"
              title={t("renameTooltip")}
            >
              <span className="truncate">{currentProjectName}</span>
              <Pencil className="w-2.5 h-2.5 text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
            </button>
          )}
        </div>

        {/* CONDITIONAL RENDER: Save button only rendered when unsaved or just saved */}
        {(!isSaved || justSaved) && (
          <button
            onClick={handleSave}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 animate-in fade-in duration-150 ${
              justSaved
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800/80"
                : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-600/30"
            }`}
            title={justSaved ? t("saved") : t("save")}
          >
            {justSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("saved")}</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("save")}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 2. CENTER SECTION: Simulation Core Controls (Clean & Focused) */}
      <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex items-center gap-1.5 shrink-0 z-10">
        {/* Play/Pause Button - Primary Action */}
        <button
          onClick={togglePlay}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
            isRunning
              ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30"
              : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-600/30 ring-2 ring-emerald-500/20"
          }`}
          title={isRunning ? t("pauseSimulation") : t("startSimulation")}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>{t("pause")}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t("run")}</span>
            </>
          )}
        </button>

        {/* CONDITIONAL RENDER: Step button only when PAUSED */}
        {!isRunning && (
          <button
            onClick={step}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer animate-in fade-in duration-150"
            title={t("stepTooltip")}
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t("step")}</span>
          </button>
        )}

        {/* CONDITIONAL RENDER: Reset button only when stepCount > 0 */}
        {stepCount > 0 && (
          <button
            onClick={resetSimulation}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-colors cursor-pointer animate-in fade-in duration-150"
            title={t("resetSimulation")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* CONDITIONAL RENDER: Active tick counter only when running or non-zero */}
        {stepCount > 0 && (
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline px-1">#{stepCount}</span>
        )}
      </div>

      {/* 3. RIGHT SECTION: Truth Table, Inspector Toggle & Overflow "..." Menu */}
      <div className="flex items-center gap-1.5 shrink-0 z-10">
        {/* CONDITIONAL RENDER: Undo button ONLY when past history exists */}
        {historyPast.length > 0 && (
          <button
            onClick={undo}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer animate-in fade-in duration-150"
            title={t("undo")}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* CONDITIONAL RENDER: Redo button ONLY when future history exists */}
        {historyFuture.length > 0 && (
          <button
            onClick={redo}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer animate-in fade-in duration-150"
            title={t("redo")}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Truth Table Launcher */}
        <button
          onClick={onOpenTruthTable}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
          title={t("truthTableTooltip")}
        >
          <TableProperties className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t("truthTable")}</span>
        </button>

        {/* Right Inspector Panel Toggle */}
        <button
          onClick={onToggleInspector}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isInspectorOpen
              ? "bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700"
              : "bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
          title={isInspectorOpen ? t("closeInspector") : t("openInspector")}
        >
          {isInspectorOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer hidden sm:block"
          title={isFullscreen ? t("exitFullscreen") : t("enterFullscreen")}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Hidden File Input for JSON Import */}
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} className="hidden" />

        {/* Overflow "..." More Menu (Keeps Toolbar clean and uncrowded!) */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => setIsMoreMenuOpen((prev) => !prev)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isMoreMenuOpen
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
            title={t("moreOptions")}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMoreMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900/95 py-2 shadow-2xl backdrop-blur-xl z-50 text-xs text-slate-300 animate-in fade-in zoom-in-95 duration-100">
              {/* Language Switcher Section in 3-dots Menu */}
              <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t("language")}</span>
                </span>
                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setLocale("en")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                      locale === "en"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLocale("tr")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                      locale === "tr"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    TR
                  </button>
                </div>
              </div>

              {/* Simulation Frequency in More Menu */}
              <div className="px-3 py-1.5 border-b border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3 h-3" /> {t("simulationSpeed")}
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{tickRateHz} Hz</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 5, 10, 20].map((hz) => (
                    <button
                      key={hz}
                      onClick={() => setTickRate(hz)}
                      className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-colors ${
                        tickRateHz === hz
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {hz}
                    </button>
                  ))}
                </div>
              </div>

              {/* MiniMap Toggle Setting */}
              <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-slate-300">
                  <Map className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t("minimap")}</span>
                </span>
                <button
                  onClick={toggleMinimap}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                    showMinimap
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {showMinimap ? t("on") : t("off")}
                </button>
              </div>

              {/* File Export / Import */}
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors text-left cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>{t("exportJSON")}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors text-left cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t("importJSON")}</span>
              </button>

              <div className="my-1 border-t border-slate-800" />

              <button
                onClick={async () => {
                  setIsMoreMenuOpen(false);
                  const ok = await confirmDialog({
                    title: t("clearCanvasTitle"),
                    message: t("clearCanvasMsg"),
                    confirmText: t("clearAll"),
                    cancelText: t("giveUp"),
                    type: "danger",
                  });
                  if (ok) {
                    clearCircuit();
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-950/50 text-rose-400 hover:text-rose-300 transition-colors text-left cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t("clearCanvas")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
