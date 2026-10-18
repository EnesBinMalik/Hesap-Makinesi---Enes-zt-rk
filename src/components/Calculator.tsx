import React, { useState, useEffect, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  History,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Delete,
  Terminal,
} from 'lucide-react';
import {
  calculateWithSwitchCase,
  formatDisplayNumber,
} from '../utils/calculatorLogic';
import { playKeySound, isSoundEnabled, toggleSound } from '../utils/sound';
import { CalculationHistoryItem, Operator } from '../types';

interface CalculatorProps {
  onCalculationPerformed: (item: CalculationHistoryItem) => void;
  recentCalculation: CalculationHistoryItem | null;
  history: CalculationHistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: CalculationHistoryItem) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  onCalculationPerformed,
  recentCalculation,
  history,
  onClearHistory,
  onSelectHistoryItem,
}) => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [currentOperator, setCurrentOperator] = useState<Operator | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [isScientific, setIsScientific] = useState<boolean>(false);
  const [expressionPreview, setExpressionPreview] = useState<string>('');
  const [activeCaseFlash, setActiveCaseFlash] = useState<string | null>(null);

  // Handle number input
  const inputDigit = useCallback(
    (digit: string) => {
      playKeySound('num');
      if (waitingForSecondOperand) {
        setDisplayValue(digit);
        setWaitingForSecondOperand(false);
      } else {
        setDisplayValue((prev) => (prev === '0' || prev === 'Hata' ? digit : prev + digit));
      }
    },
    [waitingForSecondOperand]
  );

  // Handle decimal dot
  const inputDot = useCallback(() => {
    playKeySound('num');
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue((prev) => prev + '.');
    }
  }, [displayValue, waitingForSecondOperand]);

  // Handle +/- sign toggle
  const toggleSign = useCallback(() => {
    playKeySound('action');
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      setDisplayValue((-val).toString());
    }
  }, [displayValue]);

  // Handle Backspace
  const handleBackspace = useCallback(() => {
    playKeySound('action');
    if (waitingForSecondOperand) return;
    if (displayValue.length > 1 && displayValue !== 'Hata') {
      setDisplayValue((prev) => prev.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  }, [displayValue, waitingForSecondOperand]);

  // Handle Clear / All Clear
  const handleClear = useCallback(() => {
    playKeySound('action');
    setDisplayValue('0');
    setPrevValue(null);
    setCurrentOperator(null);
    setWaitingForSecondOperand(false);
    setExpressionPreview('');
    setActiveCaseFlash(null);
  }, []);

  // Handle Binary Operator (+, -, *, /, %, ^)
  const handleOperator = useCallback(
    (nextOperator: Operator) => {
      playKeySound('op');
      const inputValue = parseFloat(displayValue);

      if (prevValue === null) {
        setPrevValue(inputValue);
        setExpressionPreview(`${formatDisplayNumber(inputValue)} ${nextOperator}`);
      } else if (currentOperator && !waitingForSecondOperand) {
        // Execute previous operation using switch-case first
        const calc = calculateWithSwitchCase(prevValue, currentOperator, inputValue);
        onCalculationPerformed({
          ...calc,
          id: Math.random().toString(36).substring(2, 9),
        });

        if (calc.success) {
          setPrevValue(calc.result);
          setDisplayValue(formatDisplayNumber(calc.result));
          setExpressionPreview(`${formatDisplayNumber(calc.result)} ${nextOperator}`);
          setActiveCaseFlash(`case '${currentOperator}'`);
        } else {
          setDisplayValue('Hata');
          setPrevValue(null);
          setCurrentOperator(null);
          setWaitingForSecondOperand(false);
          return;
        }
      } else {
        setExpressionPreview(`${formatDisplayNumber(prevValue)} ${nextOperator}`);
      }

      setWaitingForSecondOperand(true);
      setCurrentOperator(nextOperator);
    },
    [currentOperator, displayValue, onCalculationPerformed, prevValue, waitingForSecondOperand]
  );

  // Handle Square Root (Unary switch-case calculation)
  const handleSquareRoot = useCallback(() => {
    playKeySound('op');
    const inputValue = parseFloat(displayValue);
    const calc = calculateWithSwitchCase(inputValue, 'sqrt');
    onCalculationPerformed({
      ...calc,
      id: Math.random().toString(36).substring(2, 9),
    });

    if (calc.success) {
      setDisplayValue(formatDisplayNumber(calc.result));
      setExpressionPreview(`√(${inputValue})`);
      setWaitingForSecondOperand(true);
      setActiveCaseFlash("case 'sqrt'");
    } else {
      setDisplayValue('Hata');
      setExpressionPreview(`√(${inputValue})`);
    }
  }, [displayValue, onCalculationPerformed]);

  // Handle Percentage
  const handlePercentage = useCallback(() => {
    playKeySound('action');
    const inputValue = parseFloat(displayValue);
    if (prevValue !== null && currentOperator) {
      // Calculate percent of previous value
      const percentVal = (prevValue * inputValue) / 100;
      setDisplayValue(formatDisplayNumber(percentVal));
    } else {
      setDisplayValue(formatDisplayNumber(inputValue / 100));
    }
  }, [currentOperator, displayValue, prevValue]);

  // Handle Equals (=)
  const handleEquals = useCallback(() => {
    if (prevValue === null || !currentOperator) {
      playKeySound('action');
      return;
    }

    const inputValue = parseFloat(displayValue);
    const calc = calculateWithSwitchCase(prevValue, currentOperator, inputValue);

    onCalculationPerformed({
      ...calc,
      id: Math.random().toString(36).substring(2, 9),
    });

    if (calc.success) {
      playKeySound('equal');
      setDisplayValue(formatDisplayNumber(calc.result));
      setExpressionPreview(`${formatDisplayNumber(prevValue)} ${currentOperator} ${formatDisplayNumber(inputValue)} =`);
      setPrevValue(null);
      setCurrentOperator(null);
      setWaitingForSecondOperand(true);
      setActiveCaseFlash(`case '${currentOperator}'`);
    } else {
      playKeySound('error');
      setDisplayValue('Hata');
      setExpressionPreview(`${formatDisplayNumber(prevValue)} ${currentOperator} ${formatDisplayNumber(inputValue)} = Hata`);
      setPrevValue(null);
      setCurrentOperator(null);
      setWaitingForSecondOperand(false);
      setActiveCaseFlash('default: // Hata');
    }
  }, [currentOperator, displayValue, onCalculationPerformed, prevValue]);

  // Memory functions (MC, MR, M+, M-)
  const handleMemoryClear = () => {
    playKeySound('action');
    setMemoryValue(0);
  };
  const handleMemoryRecall = () => {
    playKeySound('action');
    setDisplayValue(memoryValue.toString());
    setWaitingForSecondOperand(false);
  };
  const handleMemoryAdd = () => {
    playKeySound('action');
    setMemoryValue((prev) => prev + parseFloat(displayValue || '0'));
  };
  const handleMemorySubtract = () => {
    playKeySound('action');
    setMemoryValue((prev) => prev - parseFloat(displayValue || '0'));
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sound toggle
  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        inputDot();
      } else if (e.key === '+' || e.key === '-') {
        handleOperator(e.key as Operator);
      } else if (e.key === '*') {
        handleOperator('*');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('/');
      } else if (e.key === '%' || e.key === '^') {
        handleOperator(e.key as Operator);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBackspace, handleClear, handleEquals, handleOperator, inputDigit, inputDot]);

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Main Calculator Body (lg:col-span-7) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 transition-all">
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-wide text-slate-300">
                HESAP MAKİNESİ
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-amber-400/90 font-mono text-[11px]">
                switch-case engine
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSoundToggle}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
              >
                {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsScientific(!isScientific)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  isScientific
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'hover:bg-slate-800 text-slate-400'
                }`}
                title="Gelişmiş Fonksiyonları Aç/Kapat"
              >
                {isScientific ? 'Standart' : 'Gelişmiş'}
              </button>

              <button
                onClick={() => setShowHistoryModal(!showHistoryModal)}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors relative"
                title="İşlem Geçmişi"
              >
                <History className="w-3.5 h-3.5" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Digital LCD Screen Display */}
          <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800/80 mb-5 relative group">
            {/* Expression line */}
            <div className="h-6 text-right font-mono text-sm text-slate-400 truncate tracking-wide">
              {expressionPreview || '\u00A0'}
            </div>

            {/* Main result number line */}
            <div className="flex items-baseline justify-between gap-2 mt-1">
              {/* Memory flag */}
              <div className="text-[11px] font-mono text-amber-500 font-bold shrink-0">
                {memoryValue !== 0 ? 'M' : ''}
              </div>

              {/* Number */}
              <div
                className="text-right font-mono tabular-nums font-bold tracking-tight text-white select-all overflow-x-auto overflow-y-hidden"
                style={{
                  fontSize:
                    displayValue.length > 14
                      ? '1.5rem'
                      : displayValue.length > 9
                      ? '2rem'
                      : '2.5rem',
                  lineHeight: 1.2,
                }}
              >
                {displayValue}
              </div>
            </div>

            {/* Floating Copy Button */}
            <button
              onClick={handleCopy}
              className="absolute top-2 left-2 p-1.5 rounded-md bg-slate-800/60 opacity-0 group-hover:opacity-100 hover:bg-slate-700 text-slate-300 transition-all text-xs flex items-center gap-1"
              title="Sonucu Kopyala"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span className="text-[10px]">{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>

          {/* Active Switch-Case Notification Ribbon */}
          <div className="mb-4 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-slate-400">Çalışan Karar Yapısı:</span>
              <span className="font-mono font-semibold text-amber-300">
                {activeCaseFlash || (currentOperator ? `switch ('${currentOperator}')` : 'switch (islem)')}
              </span>
            </div>
            {recentCalculation && (
              <span className="text-[11px] text-slate-400">
                {recentCalculation.success ? 'Hatasız' : 'Hata Yakalandı'}
              </span>
            )}
          </div>

          {/* Memory Row */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <button
              onClick={handleMemoryClear}
              className="py-1.5 text-xs font-semibold rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              MC
            </button>
            <button
              onClick={handleMemoryRecall}
              className="py-1.5 text-xs font-semibold rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              MR
            </button>
            <button
              onClick={handleMemoryAdd}
              className="py-1.5 text-xs font-semibold rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              M+
            </button>
            <button
              onClick={handleMemorySubtract}
              className="py-1.5 text-xs font-semibold rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              M-
            </button>
          </div>

          {/* Optional Scientific Row (Collapsible) */}
          {isScientific && (
            <div className="grid grid-cols-4 gap-2 mb-3 pt-2 border-t border-slate-800/60">
              <button
                onClick={handleSquareRoot}
                className="py-2.5 text-xs font-mono font-medium rounded-xl bg-slate-800/60 hover:bg-slate-800 text-amber-300 border border-slate-700/60 transition-all active:scale-95"
              >
                √x
              </button>
              <button
                onClick={() => handleOperator('^')}
                className="py-2.5 text-xs font-mono font-medium rounded-xl bg-slate-800/60 hover:bg-slate-800 text-amber-300 border border-slate-700/60 transition-all active:scale-95"
              >
                xʸ
              </button>
              <button
                onClick={() => {
                  playKeySound('action');
                  const val = parseFloat(displayValue);
                  if (val !== 0) setDisplayValue(formatDisplayNumber(1 / val));
                }}
                className="py-2.5 text-xs font-mono font-medium rounded-xl bg-slate-800/60 hover:bg-slate-800 text-amber-300 border border-slate-700/60 transition-all active:scale-95"
              >
                1/x
              </button>
              <button
                onClick={() => {
                  playKeySound('num');
                  setDisplayValue(Math.PI.toString());
                  setWaitingForSecondOperand(false);
                }}
                className="py-2.5 text-xs font-mono font-medium rounded-xl bg-slate-800/60 hover:bg-slate-800 text-amber-300 border border-slate-700/60 transition-all active:scale-95"
              >
                π
              </button>
            </div>
          )}

          {/* Main Keypad Grid (4 columns) */}
          <div className="grid grid-cols-4 gap-2.5">
            {/* Row 1: AC, Backspace, %, / */}
            <button
              onClick={handleClear}
              className="py-3.5 text-sm font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all active:scale-95"
            >
              AC
            </button>
            <button
              onClick={handleBackspace}
              className="py-3.5 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
              title="Sil (Backspace)"
            >
              <Delete className="w-4 h-4" />
            </button>
            <button
              onClick={handlePercentage}
              className="py-3.5 text-base font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            >
              %
            </button>
            <button
              onClick={() => handleOperator('/')}
              className={`py-3.5 text-lg font-bold rounded-xl transition-all active:scale-95 ${
                currentOperator === '/'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
              }`}
            >
              ÷
            </button>

            {/* Row 2: 7, 8, 9, * */}
            <button
              onClick={() => inputDigit('7')}
              className="py-3.5 text-lg font-medium rounded-xl bg-slate-800/70 hover:bg-slate-700 text-white transition-all active:scale-95"
            >
              7
            </button>
            <button
              onClick={() => inputDigit('8')}
              className="py-3.5 text-lg font-medium rounded-xl bg-slate-800/70 hover:bg-slate-700 text-white transition-all active:scale-95"
            >
              8
            </button>
            <button
              onClick={() => inputDigit('9')}
              className="py-3.5 text-lg font-medium rounded-xl bg-slate-800/70 hover:bg-slate-700 text-white transition-all active:scale-95"
            >
              9
            </button>
            <button
              onClick={() => handleOperator('*')}
              className={`py-3.5 text-lg font-bold rounded-xl transition-all active:scale-95 ${
                currentOperator === '*'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
              }`}
            >
              ×
            </button>

            {/* Row 3: 4, 5, 6, - */}
            <button
              onClick={() => inputDigit('4')}
              className="py-3.5 text-lg font-medium rounded-xl bg-slate-800/70 hover:bg-slate-700 text-white transition-all active:scale-95"
            >
              4
            </button>
            <button
              onClick={() => inputDigit('5')}
              className="py-3.5 text-lg font-medium rounded-xl bg-slate-800/70 hover:bg-slate-700 text-white transition-all active:scale-95"
            >
              5
            </button>
            <button
              onClick={() => inputDigit('6')}
              className="py-3.5 text-lg font-medium rounded-xl bg-slate-800/70 hover:bg-slate-700 text-white transition-all active:scale-95"
            >
              6
            </button>
            <button
              onClick={() => handleOperator('-')}
              className={`py-3.5 text-lg font-bold rounded-xl transition-all active:scale-95 ${
                currentOperator === '-'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
              }`}
            >
              −
            </button>

            {/* Row 4: 1, 2, 3, + */}
            <button
              onClick={() => inputDigit('1')}
              className="py-3.5 text-lg font-medium rounded-xl bg-slate-800/70 hover:bg-slate-700 text-white transition-all active:scale-95"
            >
              1
            </button>
            <button
              onClick={() => inputDigit('2')}
              className="py-3.5 text-lg font-medium rounded-xl bg-slate-800/70 hover:bg-slate-700 text-white transition-all active:scale-95"
            >
              2
            </button>
            <button
              onClick={() => inputDigit('3')}
              className="py-3.5 text-lg font-medium rounded-xl bg-slate-800/70 hover:bg-slate-700 text-white transition-all active:scale-95"
            >
              3
            </button>
            <button
              onClick={() => handleOperator('+')}
              className={`py-3.5 text-lg font-bold rounded-xl transition-all active:scale-95 ${
                currentOperator === '+'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
              }`}
            >
              +
            </button>

            {/* Row 5: ±, 0, ., = */}
            <button
              onClick={toggleSign}
              className="py-3.5 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            >
              ±
            </button>
            <button
              onClick={() => inputDigit('0')}
              className="py-3.5 text-lg font-medium rounded-xl bg-slate-800/70 hover:bg-slate-700 text-white transition-all active:scale-95"
            >
              0
            </button>
            <button
              onClick={inputDot}
              className="py-3.5 text-lg font-bold rounded-xl bg-slate-800/70 hover:bg-slate-700 text-white transition-all active:scale-95"
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="py-3.5 text-xl font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all active:scale-95 shadow-md"
            >
              =
            </button>
          </div>

          {/* Student Signature Footer In Card */}
          <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Hazırlayan: <strong className="text-slate-300 font-medium">Enes Öztürk</strong></span>
            <span>Ödev Teslim Projesi</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Switch-Case Execution & Trace Panel (lg:col-span-5) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Active Case Inspector Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">
                Canlı Switch-Case İzleyici
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              switch(islem)
            </span>
          </div>

          {recentCalculation ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
                <div className="text-slate-400 mb-1">// İcra edilen switch-case dalı:</div>
                <pre className="text-amber-300 leading-relaxed font-semibold overflow-x-auto whitespace-pre">
                  {recentCalculation.matchedCaseCode}
                </pre>
              </div>

              <div className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div className="font-semibold text-slate-200 mb-1">Açıklama:</div>
                <p className="text-slate-400 leading-relaxed">
                  {recentCalculation.explanation}
                </p>
              </div>

              {/* Execution Steps */}
              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-semibold text-slate-400">İşlem Adımları:</div>
                <div className="space-y-1 font-mono text-[11px] text-slate-400">
                  {recentCalculation.steps.map((st, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 shrink-0">›</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-slate-600" />
              <p>
                Hesap makinesinde bir işlem yapınız (+, -, ×, ÷, %, ^).
              </p>
              <p className="text-[11px] text-slate-600">
                Switch-case karar yapısının nasıl çalıştığı burada anlık olarak görüntülenecektir.
              </p>
            </div>
          )}
        </div>

        {/* History Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex-1">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-white">
                Hesaplama Geçmişi
              </h3>
            </div>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Temizle
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              Henüz kayıtlı bir işlem yok.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectHistoryItem(item)}
                  className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="font-mono text-xs">
                    <div className="text-slate-400 group-hover:text-slate-300">
                      {item.expression}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/80 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    case '{item.operator}'
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
