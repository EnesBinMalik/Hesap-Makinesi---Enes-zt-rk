import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { calculateWithSwitchCase } from '../utils/calculatorLogic';
import { CalculationHistoryItem, Operator } from '../types';
import { playKeySound } from '../utils/sound';

interface SwitchCaseVisualizerProps {
  onCalculationPerformed: (item: CalculationHistoryItem) => void;
}

export const SwitchCaseVisualizer: React.FC<SwitchCaseVisualizerProps> = ({
  onCalculationPerformed,
}) => {
  const [num1, setNum1] = useState<string>('24');
  const [operator, setOperator] = useState<Operator>('+');
  const [num2, setNum2] = useState<string>('6');
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<CalculationHistoryItem | null>(null);

  const operators: { label: string; op: Operator; desc: string }[] = [
    { label: '+', op: '+', desc: 'Toplama (sayi1 + sayi2)' },
    { label: '−', op: '-', desc: 'Çıkarma (sayi1 - sayi2)' },
    { label: '×', op: '*', desc: 'Çarpma (sayi1 * sayi2)' },
    { label: '÷', op: '/', desc: 'Bölme (sayi1 / sayi2)' },
    { label: '%', op: '%', desc: 'Mod (Kalan) (sayi1 % sayi2)' },
    { label: '^', op: '^', desc: 'Üs Alma (Math.pow(sayi1, sayi2))' },
  ];

  const runSimulation = () => {
    playKeySound('action');
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || (isNaN(n2) && operator !== 'sqrt')) {
      alert('Lütfen geçerli sayılar giriniz.');
      return;
    }

    setIsRunning(true);
    setActiveStep(1); // switch statement entry

    // Step 1: Evaluate expression
    setTimeout(() => {
      setActiveStep(2); // Jump to matching case
      playKeySound('op');

      setTimeout(() => {
        setActiveStep(3); // Execute arithmetic calculation
        playKeySound('num');

        setTimeout(() => {
          setActiveStep(4); // break statement
          playKeySound('equal');

          const calc = calculateWithSwitchCase(n1, operator, n2);
          const historyItem: CalculationHistoryItem = {
            ...calc,
            id: Math.random().toString(36).substring(2, 9),
          };
          setLastResult(historyItem);
          onCalculationPerformed(historyItem);
          setIsRunning(false);
        }, 600);
      }, 600);
    }, 600);
  };

  const resetSimulation = () => {
    setActiveStep(-1);
    setLastResult(null);
    setIsRunning(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Introduction banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase">
                Ödev Konusu: Karar Yapıları
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 text-xs">Switch-Case Deyimi</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Switch-Case Kod Çalışma Simülatörü
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              İki sayı ve bir işlem operatörü seçerek programın switch-case mekanizmasında
              hangi dallardan geçtiğini ve break deyimiyle nasıl sonlandığını canlı olarak izleyin.
            </p>
          </div>

          <div className="shrink-0 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex flex-col gap-1">
            <span className="text-slate-500 font-mono">Hazırlayan:</span>
            <span className="font-semibold text-amber-300 text-sm">Enes Öztürk</span>
            <span className="text-slate-500 text-[11px]">Ödev Kodu: HESAP-01</span>
          </div>
        </div>
      </div>

      {/* Main 2-column interactive stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Form Controls (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>İşlem Parametreleri</span>
            <span className="text-xs font-mono text-amber-400">Girdi Alanı</span>
          </h3>

          {/* Sayı 1 Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>1. Sayı (sayi1):</span>
              <span className="text-slate-500 font-mono text-[11px]">double</span>
            </label>
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-base focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="Örn: 24"
            />
          </div>

          {/* İşlem Seçici (Operator Picker) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>İşlem Operatörü (islem):</span>
              <span className="text-slate-500 font-mono text-[11px]">char</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {operators.map((item) => (
                <button
                  key={item.op}
                  type="button"
                  onClick={() => {
                    playKeySound('op');
                    setOperator(item.op);
                  }}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-bold flex flex-col items-center justify-center transition-all ${
                    operator === item.op
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md scale-[1.02]'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
                  }`}
                >
                  <span className="text-base">{item.label}</span>
                  <span className={`text-[10px] font-normal ${operator === item.op ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                    case '{item.op}'
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sayı 2 Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>2. Sayı (sayi2):</span>
              <span className="text-slate-500 font-mono text-[11px]">double</span>
            </label>
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-base focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="Örn: 6"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                isRunning
                  ? 'bg-amber-500/50 text-slate-900 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-95'
              }`}
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isRunning ? 'Çalıştırılıyor...' : 'Switch-Case ile Çalıştır'}</span>
            </button>

            <button
              onClick={resetSimulation}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Result Box */}
          {lastResult && (
            <div
              className={`p-4 rounded-xl border transition-all ${
                lastResult.success
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 font-semibold text-xs">
                {lastResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>Hesaplama Sonucu:</span>
              </div>
              <div className="font-mono text-lg font-bold">
                {lastResult.expression}
              </div>
              <div className="text-xs mt-1 text-slate-400">
                {lastResult.explanation}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Interactive Code Stage (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                SwitchCaseHesaplayici.cs / js
              </span>
              <span className="text-xs text-slate-500">Canlı Yürütme Motoru</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Durum: {isRunning ? (
                <span className="text-amber-400 font-bold">Çalışıyor</span>
              ) : activeStep >= 4 ? (
                <span className="text-emerald-400 font-bold">Tamamlandı</span>
              ) : (
                <span className="text-slate-500">Beklemede</span>
              )}
            </div>
          </div>

          {/* Code Execution Viewer with Line Highlighting */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed select-none">
            {/* Line: switch (islem) */}
            <div
              className={`px-2 py-1 rounded transition-colors flex items-center gap-3 ${
                activeStep === 1
                  ? 'bg-amber-500/20 text-amber-200 font-bold border-l-2 border-amber-400'
                  : 'text-slate-400'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">01</span>
              <span>switch (islem) &#123;</span>
              {activeStep === 1 && (
                <span className="text-amber-400 text-[10px] ml-auto animate-pulse flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> Değer kontrol ediliyor ('{operator}')
                </span>
              )}
            </div>

            {/* Case '+' */}
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '+' && activeStep >= 2
                  ? 'bg-amber-500/25 text-amber-200 font-bold border-l-2 border-amber-400'
                  : operator === '+'
                  ? 'text-slate-300'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">02</span>
              <span className="pl-4">case '+':</span>
              {operator === '+' && activeStep === 2 && (
                <span className="text-amber-400 text-[10px] ml-auto">✓ Eşleşti</span>
              )}
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '+' && activeStep >= 3
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '+'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">03</span>
              <span className="pl-8">sonuc = sayi1 + sayi2;</span>
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '+' && activeStep >= 4
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '+'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">04</span>
              <span className="pl-8">break;</span>
            </div>

            {/* Case '-' */}
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '-' && activeStep >= 2
                  ? 'bg-amber-500/25 text-amber-200 font-bold border-l-2 border-amber-400'
                  : operator === '-'
                  ? 'text-slate-300'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">05</span>
              <span className="pl-4">case '-':</span>
              {operator === '-' && activeStep === 2 && (
                <span className="text-amber-400 text-[10px] ml-auto">✓ Eşleşti</span>
              )}
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '-' && activeStep >= 3
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '-'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">06</span>
              <span className="pl-8">sonuc = sayi1 - sayi2;</span>
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '-' && activeStep >= 4
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '-'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">07</span>
              <span className="pl-8">break;</span>
            </div>

            {/* Case '*' */}
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '*' && activeStep >= 2
                  ? 'bg-amber-500/25 text-amber-200 font-bold border-l-2 border-amber-400'
                  : operator === '*'
                  ? 'text-slate-300'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">08</span>
              <span className="pl-4">case '*':</span>
              {operator === '*' && activeStep === 2 && (
                <span className="text-amber-400 text-[10px] ml-auto">✓ Eşleşti</span>
              )}
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '*' && activeStep >= 3
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '*'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">09</span>
              <span className="pl-8">sonuc = sayi1 * sayi2;</span>
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '*' && activeStep >= 4
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '*'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">10</span>
              <span className="pl-8">break;</span>
            </div>

            {/* Case '/' */}
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '/' && activeStep >= 2
                  ? 'bg-amber-500/25 text-amber-200 font-bold border-l-2 border-amber-400'
                  : operator === '/'
                  ? 'text-slate-300'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">11</span>
              <span className="pl-4">case '/':</span>
              {operator === '/' && activeStep === 2 && (
                <span className="text-amber-400 text-[10px] ml-auto">✓ Eşleşti</span>
              )}
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '/' && activeStep >= 3
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '/'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">12</span>
              <span className="pl-8">if (sayi2 !== 0) sonuc = sayi1 / sayi2;</span>
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '/' && activeStep >= 4
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '/'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">13</span>
              <span className="pl-8">break;</span>
            </div>

            {/* Case '%' */}
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '%' && activeStep >= 2
                  ? 'bg-amber-500/25 text-amber-200 font-bold border-l-2 border-amber-400'
                  : operator === '%'
                  ? 'text-slate-300'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">14</span>
              <span className="pl-4">case '%':</span>
              {operator === '%' && activeStep === 2 && (
                <span className="text-amber-400 text-[10px] ml-auto">✓ Eşleşti</span>
              )}
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '%' && activeStep >= 3
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '%'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">15</span>
              <span className="pl-8">sonuc = sayi1 % sayi2;</span>
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '%' && activeStep >= 4
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '%'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">16</span>
              <span className="pl-8">break;</span>
            </div>

            {/* Case '^' */}
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '^' && activeStep >= 2
                  ? 'bg-amber-500/25 text-amber-200 font-bold border-l-2 border-amber-400'
                  : operator === '^'
                  ? 'text-slate-300'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">17</span>
              <span className="pl-4">case '^':</span>
              {operator === '^' && activeStep === 2 && (
                <span className="text-amber-400 text-[10px] ml-auto">✓ Eşleşti</span>
              )}
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '^' && activeStep >= 3
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '^'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">18</span>
              <span className="pl-8">sonuc = Math.pow(sayi1, sayi2);</span>
            </div>
            <div
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-3 ${
                operator === '^' && activeStep >= 4
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : operator === '^'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-slate-600 w-6 text-right select-none">19</span>
              <span className="pl-8">break;</span>
            </div>

            {/* Default */}
            <div className="px-2 py-0.5 text-slate-600 flex items-center gap-3">
              <span className="text-slate-600 w-6 text-right select-none">20</span>
              <span className="pl-4">default:</span>
            </div>
            <div className="px-2 py-0.5 text-slate-600 flex items-center gap-3">
              <span className="text-slate-600 w-6 text-right select-none">21</span>
              <span className="pl-8">throw new Error("Geçersiz işlem");</span>
            </div>

            {/* Closing brace */}
            <div className="px-2 py-1 text-slate-400 flex items-center gap-3">
              <span className="text-slate-600 w-6 text-right select-none">22</span>
              <span>&#125;</span>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Neden Switch-Case Kullanılır?</span>
            </div>
            <p className="leading-relaxed">
              Çoklu <code>if-else if</code> blokları yerine <code>switch-case</code> yapısı
              kullanmak, kodun okunabilirliğini artırır ve derleyicilerin "jump table"
              (atlama tablosu) optimizasyonu yapmasına olanak tanıyarak performansı iyileştirir.
              Her <code>case</code> bloğu sonundaki <code>break;</code> komutu ise diğer dallara
              düşmeyi (fall-through) önler.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
