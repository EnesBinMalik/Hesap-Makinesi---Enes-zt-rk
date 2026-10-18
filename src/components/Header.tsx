import React from 'react';
import { ViewMode } from '../types';
import { Calculator as CalcIcon, Code2, FileCheck, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenSignatureModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  onOpenSignatureModal,
}) => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <CalcIcon className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              Hesap Makinesi
            </span>
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:inline">
              Switch-Case Ödevi
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (single-line, whitespace-nowrap) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectView('calculator')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'calculator'
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <CalcIcon className="w-3.5 h-3.5" />
            <span>Hesap Makinesi</span>
          </button>

          <button
            onClick={() => onSelectView('visualizer')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'visualizer'
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Switch-Case İzleyici</span>
          </button>

          <button
            onClick={() => onSelectView('code_report')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'code_report'
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Ödev</span> Raporu & Kod
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Enes Öztürk Signature Button) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSignatureModal}
            title="Ödevi Hazırlayan: Enes Öztürk"
            className="group px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
            <span>Enes Öztürk</span>
          </button>
        </div>
      </div>
    </header>
  );
};
