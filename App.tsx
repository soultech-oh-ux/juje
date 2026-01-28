
import React, { useState, useMemo, useCallback } from 'react';
import { STAGES, SearchIcon, CopyIcon, CheckIcon } from './constants';
import { PromptItem, Stage } from './types';

const PromptCard: React.FC<{ prompt: PromptItem }> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [prompt.text]);

  return (
    <div className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          {prompt.id}
        </span>
        <p className="flex-grow text-slate-700 leading-relaxed font-medium">
          {prompt.text}
        </p>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
          title="복사하기"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      {copied && (
        <span className="absolute bottom-2 right-12 text-[10px] text-green-600 font-bold uppercase tracking-wider animate-pulse">
          Copied!
        </span>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStageId, setActiveStageId] = useState<number | null>(null);

  const filteredStages = useMemo(() => {
    if (!searchTerm) {
        if (activeStageId !== null) {
            return STAGES.filter(s => s.id === activeStageId);
        }
        return STAGES;
    }
    
    return STAGES.map(stage => ({
      ...stage,
      prompts: stage.prompts.filter(p => p.text.toLowerCase().includes(searchTerm.toLowerCase()))
    })).filter(stage => stage.prompts.length > 0);
  }, [searchTerm, activeStageId]);

  const totalPrompts = useMemo(() => {
      return STAGES.reduce((acc, stage) => acc + stage.prompts.length, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-indigo-200 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">주제설교 프롬프트 상자</h1>
                <p className="text-sm text-slate-500">AI와 함께하는 10단계 100가지 설교 가이드</p>
              </div>
            </div>

            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="어떤 프롬프트를 찾으시나요? (검색어 입력)"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-1">
              <h2 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">단계별 바로가기</h2>
              <button
                onClick={() => { setActiveStageId(null); setSearchTerm(''); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeStageId === null && !searchTerm
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                전체 프롬프트 ({totalPrompts})
              </button>
              {STAGES.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => { setActiveStageId(stage.id); setSearchTerm(''); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeStageId === stage.id && !searchTerm
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm border-l-4 border-indigo-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {stage.title.split(':')[0]} <span className="block text-[10px] opacity-70">{stage.title.split(':')[1]}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Content Area */}
          <section className="flex-grow space-y-12">
            {filteredStages.length > 0 ? (
              filteredStages.map((stage) => (
                <div key={stage.id} className="scroll-mt-32">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{stage.title}</h3>
                    <p className="text-slate-500">{stage.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stage.prompts.map((prompt) => (
                      <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-slate-900">검색 결과가 없습니다</h4>
                <p className="text-slate-500">다른 검색어로 다시 시도해 보세요.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setActiveStageId(null);}}
                  className="mt-4 text-indigo-600 font-semibold hover:underline"
                >
                  필터 초기화
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-slate-900 font-bold mb-1">주제설교 프롬프트 상자 v1.0</p>
              <p className="text-sm text-slate-500">목회자의 설교 준비를 돕는 AI 보조 가이드입니다.</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">이용 약관</a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">문의하기</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
            © 2024 Preacher AI Tool. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
