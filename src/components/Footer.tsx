import React from 'react';

interface FooterProps {
  onOpenSignature: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSignature }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 mt-16 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>Hesap Makinesi Ödevi</span>
          <span aria-hidden="true">·</span>
          <span>Switch-Case Karar Yapısı</span>
          <span aria-hidden="true">·</span>
          <span>Dört İşlem & Modülasyon</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Hazırlayan & İmza:</span>
          <button
            onClick={onOpenSignature}
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Enes Öztürk
          </button>
        </div>
      </div>
    </footer>
  );
};
