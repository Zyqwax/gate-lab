'use client';

import React, { useEffect, useRef } from 'react';
import { useDialogStore } from '../../store/dialogStore';
import {
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  X,
  Trash2,
} from 'lucide-react';

export const GlobalDialog: React.FC = () => {
  const { isOpen, options, closeDialog } = useDialogStore();
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus confirm button when dialog opens
    const timer = setTimeout(() => {
      confirmBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDialog(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeDialog]);

  if (!isOpen || !options) return null;

  const type = options.type || 'info';
  const isConfirm = options.isConfirm ?? false;

  const renderIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-950/40">
            <Trash2 className="w-5 h-5" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-950/40">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case 'error':
        return (
          <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-950/40">
            <XCircle className="w-5 h-5" />
          </div>
        );
      case 'success':
        return (
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-11 h-11 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 shadow-lg shadow-sky-950/40">
            <HelpCircle className="w-5 h-5" />
          </div>
        );
    }
  };

  const getConfirmButtonClasses = () => {
    switch (type) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold shadow-emerald-600/30';
      case 'info':
      case 'error':
      default:
        return 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold shadow-emerald-600/30';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeDialog(false);
        }
      }}
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Subtle Background Accent Gradient */}
        <div
          className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${
            type === 'danger'
              ? 'bg-rose-500'
              : type === 'warning'
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
        />

        {/* Close (X) button */}
        <button
          onClick={() => closeDialog(false)}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Body with Icon and Message */}
        <div className="flex items-start gap-4 mb-6">
          {renderIcon()}

          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
              {options.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
              {options.message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800/80">
          {isConfirm && (
            <button
              type="button"
              onClick={() => closeDialog(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-colors cursor-pointer"
            >
              {options.cancelText || 'İptal'}
            </button>
          )}

          <button
            ref={confirmBtnRef}
            type="button"
            onClick={() => closeDialog(true)}
            className={`px-4.5 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all cursor-pointer ${getConfirmButtonClasses()}`}
          >
            {options.confirmText || (isConfirm ? 'Onayla' : 'Tamam')}
          </button>
        </div>
      </div>
    </div>
  );
};
