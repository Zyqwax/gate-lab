'use client';

import React from 'react';
import {
  Settings,
  Info,
  Copy,
  Unlink,
  Trash2,
  Activity,
  Plus,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import { Signal, getSignalColor } from '../../engine/signal';

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetType: 'node' | 'edge' | 'pane';
  targetId?: string;
  data?: any;
}

interface ContextMenuProps {
  menu: ContextMenuState;
  onClose: () => void;
  onSelectProperties: (nodeId: string) => void;
  onOpenInfo: (componentType: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onDisconnectNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onAddQuickComponent: (type: string) => void;
  onFitView: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  menu,
  onClose,
  onSelectProperties,
  onOpenInfo,
  onDuplicateNode,
  onDisconnectNode,
  onDeleteNode,
  onDeleteEdge,
  onAddQuickComponent,
  onFitView,
}) => {
  if (!menu.isOpen) return null;

  // Keep menu within screen boundaries
  const menuStyle: React.CSSProperties = {
    top: Math.min(menu.y, window.innerHeight - 280),
    left: Math.min(menu.x, window.innerWidth - 220),
  };

  return (
    <div
      style={menuStyle}
      onClick={(e) => e.stopPropagation()}
      className="fixed z-50 w-52 rounded-xl border border-slate-800 bg-slate-900/95 py-1.5 shadow-2xl backdrop-blur-xl select-none animate-in fade-in zoom-in-95 duration-100 text-xs text-slate-200"
    >
      {/* NODE CONTEXT MENU */}
      {menu.targetType === 'node' && menu.targetId && (
        <div className="flex flex-col">
          <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Eleman İşlemleri</span>
            <span className="text-sky-400 font-bold">{menu.data?.type}</span>
          </div>

          <button
            onClick={() => {
              onSelectProperties(menu.targetId!);
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
          >
            <Settings className="w-3.5 h-3.5 text-sky-400" />
            <span>Özellikler Paneli</span>
          </button>

          <button
            onClick={() => {
              onOpenInfo(menu.data?.type);
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
          >
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Hakkında & Pin Bilgisi</span>
          </button>

          <button
            onClick={() => {
              onDuplicateNode(menu.targetId!);
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-400" />
            <span>Klonla (Çoğalt)</span>
          </button>

          <button
            onClick={() => {
              onDisconnectNode(menu.targetId!);
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
          >
            <Unlink className="w-3.5 h-3.5 text-amber-400" />
            <span>Kabloları Sök</span>
          </button>

          <div className="my-1 border-t border-slate-800" />

          <button
            onClick={() => {
              onDeleteNode(menu.targetId!);
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-left"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Elemanı Sil</span>
          </button>
        </div>
      )}

      {/* EDGE CONTEXT MENU */}
      {menu.targetType === 'edge' && menu.targetId && (
        <div className="flex flex-col">
          <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Kablo Sinyali</span>
            <span
              className="font-bold px-1.5 py-0.2 rounded"
              style={{
                color: getSignalColor(menu.data?.signal as Signal),
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}
            >
              {menu.data?.signal ?? 'Z'}
            </span>
          </div>

          <div className="px-3 py-2 text-[11px] text-slate-400 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Durum: {menu.data?.signal === 1 ? 'HIGH (5V)' : menu.data?.signal === 0 ? 'LOW (0V)' : 'Floating (Z)'}
            </span>
          </div>

          <div className="my-1 border-t border-slate-800" />

          <button
            onClick={() => {
              onDeleteEdge(menu.targetId!);
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-left"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kabloyu Sil</span>
          </button>
        </div>
      )}

      {/* PANE (CANVAS) CONTEXT MENU */}
      {menu.targetType === 'pane' && (
        <div className="flex flex-col">
          <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Hızlı Parça Ekle
          </div>

          <div className="grid grid-cols-2 gap-1 p-1.5">
            {[
              { type: 'AND', label: 'AND' },
              { type: 'OR', label: 'OR' },
              { type: 'NOT', label: 'NOT' },
              { type: 'XOR', label: 'XOR' },
              { type: 'SWITCH', label: 'Switch' },
              { type: 'LED', label: 'LED' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  onAddQuickComponent(item.type);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
              >
                <Plus className="w-3 h-3 text-emerald-400" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="my-1 border-t border-slate-800" />

          <button
            onClick={() => {
              onFitView();
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
          >
            <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Görünümü Ortala</span>
          </button>
        </div>
      )}
    </div>
  );
};
