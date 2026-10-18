import React from 'react';
import { X, Award, CheckCircle2, User, Calendar, BookOpen, PenTool } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 relative space-y-5"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with emblem */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Ödev Teslim & İmza Kartı
            </div>
            <h3 className="text-lg font-bold text-white">
              Geliştirici Künyesi
            </h3>
          </div>
        </div>

        {/* Detailed Metadata Fields */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Öğrenci / Geliştirici:
            </span>
            <span className="font-bold text-white text-sm">
              Enes Öztürk
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              Ödev Konusu:
            </span>
            <span className="font-medium text-slate-200">
              Switch-Case ile Hesap Makinesi
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Uygulama Mimarisi:
            </span>
            <span className="font-mono text-slate-300">
              React + TypeScript + Tailwind
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Durum:
            </span>
            <span className="font-semibold text-emerald-400">
              Tamamlandı / Teslime Hazır
            </span>
          </div>
        </div>

        {/* Visual Calligraphy Signature Display */}
        <div className="p-4 bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl border border-amber-500/30 flex flex-col items-center justify-center text-center space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-mono">
            <PenTool className="w-3 h-3" />
            <span>Dijital Onaylı İmza:</span>
          </div>
          <div className="font-serif italic text-2xl font-bold text-amber-300 tracking-wide select-none py-1">
            Enes Öztürk
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            ID: HESAP-MAK-ENES-OZTURK-2026
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};
