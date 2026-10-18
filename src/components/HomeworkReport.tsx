import React, { useState } from 'react';
import { Copy, Check, FileCode, CheckCircle2, Award, Terminal, BookOpen } from 'lucide-react';
import { CSHARP_CODE_SAMPLE, JS_CODE_SAMPLE, JAVA_CODE_SAMPLE } from '../utils/calculatorLogic';

export const HomeworkReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'csharp' | 'javascript' | 'java'>('csharp');
  const [copied, setCopied] = useState<boolean>(false);

  const getCode = () => {
    switch (activeTab) {
      case 'csharp':
        return CSHARP_CODE_SAMPLE;
      case 'javascript':
        return JS_CODE_SAMPLE;
      case 'java':
        return JAVA_CODE_SAMPLE;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Homework Cover / Submission Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider">
                Ödev Teslim Belgesi
              </span>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-slate-400 text-xs font-mono">Ders: Algoritma ve Programlama</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Switch-Case ile Hesap Makinesi Geliştirme
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Bu ödev projesinde, video anlatımındaki hesap makinesi mimarisi temel alınarak
              tüm dört işlem, mod alma ve üs alma operasyonları <strong>switch-case</strong> karar
              yapısı kullanılarak kurgulanmış ve hata kontrolleri (sıfıra bölme, geçersiz operatör)
              tam olarak sağlanmıştır.
            </p>
          </div>

          {/* Signature Box (Enes Öztürk) */}
          <div className="shrink-0 p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2 min-w-[240px]">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Öğrenci & Geliştirici</span>
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              Enes Öztürk
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>İmza:</span>
              <span className="font-serif italic text-amber-300 font-semibold text-sm">
                Enes Öztürk
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ödev Gereksinimleri Karşılandı</span>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Details & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wide">
            <BookOpen className="w-4 h-4" />
            <span>01. Amaç & Kapsam</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Programlama dillerindeki çoklu seçim yapılarından biri olan <code>switch-case</code> deyiminin
            aritmetik hesaplamalarda nasıl etkin kullanılacağını uygulamalı olarak göstermek.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wide">
            <Terminal className="w-4 h-4" />
            <span>02. Karar Mekanizması</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kullanıcıdan alınan işlem sembolü (<code>+, -, *, /, %, ^</code>) switch ifadesine parametre olarak iletilir
            ve her işlem ilgili <code>case</code> etiketinde icra edilir.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4" />
            <span>03. Hata Yönetimi</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Matematiksel kural gereği sıfıra bölme ve tanımsız işlemler <code>default</code> ve
            koruma bloklarıyla yakalanarak programın çökmesi engellenir.
          </p>
        </div>
      </div>

      {/* Code Repository & Snippet Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">
              Kaynak Kodları (Ödev Teslim Metinleri)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('csharp')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'csharp'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                C# (.NET)
              </button>
              <button
                onClick={() => setActiveTab('javascript')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'javascript'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                JavaScript
              </button>
              <button
                onClick={() => setActiveTab('java')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'java'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Java
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed">
            {getCode()}
          </pre>
        </div>
      </div>
    </div>
  );
};
