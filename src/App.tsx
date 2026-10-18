import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Calculator } from './components/Calculator';
import { SwitchCaseVisualizer } from './components/SwitchCaseVisualizer';
import { HomeworkReport } from './components/HomeworkReport';
import { SignatureModal } from './components/SignatureModal';
import { Footer } from './components/Footer';
import { CalculationHistoryItem, ViewMode } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('calculator');
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calc_history_enes_ozturk');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [recentCalculation, setRecentCalculation] = useState<CalculationHistoryItem | null>(null);
  const [signatureModalOpen, setSignatureModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('calc_history_enes_ozturk', JSON.stringify(history.slice(0, 50)));
    } catch {
      // Ignore localStorage issues
    }
  }, [history]);

  const handleCalculationPerformed = (item: CalculationHistoryItem) => {
    setRecentCalculation(item);
    setHistory((prev) => [item, ...prev.filter((h) => h.id !== item.id)].slice(0, 50));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSelectHistoryItem = (item: CalculationHistoryItem) => {
    setRecentCalculation(item);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3-Zone Top Bar Navigation with Enes Öztürk Signature Action */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenSignatureModal={() => setSignatureModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentView === 'calculator' && (
          <Calculator
            onCalculationPerformed={handleCalculationPerformed}
            recentCalculation={recentCalculation}
            history={history}
            onClearHistory={handleClearHistory}
            onSelectHistoryItem={handleSelectHistoryItem}
          />
        )}

        {currentView === 'visualizer' && (
          <SwitchCaseVisualizer
            onCalculationPerformed={handleCalculationPerformed}
          />
        )}

        {currentView === 'code_report' && (
          <HomeworkReport />
        )}
      </main>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenSignature={() => setSignatureModalOpen(true)} />
    </div>
  );
}
