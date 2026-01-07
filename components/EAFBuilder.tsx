import React, { useState, useEffect } from 'react';
import { LayoutTemplate, PenTool, Wand2, ShieldCheck, Eye, Target, Check, Sparkles, History, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { CATEGORIES, TEMPLATES, CATEGORY_DETAILS, BCEMS_GOALS } from '../constants';
import { BuilderForm } from './BuilderForm';
import { RiskAnalysis } from './RiskAnalysis';
import { FormPreview } from './FormPreview';
import { HistoricalApprovals } from './HistoricalApprovals';
import { useAiAssistant } from '../hooks/useAiAssistant';
import { EAFFormDetails, EAFTemplate } from '../types';

interface Props {
  formDetails: Omit<EAFFormDetails, 'amount' | 'description'>;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onUpdateDescription: (desc: string) => void;
  onUpdateCost: (cost: number) => void;
  onShowNotification: (msg: string, type: 'success' | 'info') => void;
  manualDescription: string;
}

export const EAFBuilder: React.FC<Props> = ({ 
  formDetails, 
  selectedCategory, 
  setSelectedCategory,
  onUpdateDescription,
  onUpdateCost,
  onShowNotification,
  manualDescription
}) => {
  const [activeTemplate, setActiveTemplate] = useState<EAFTemplate | null>(null);
  const [inputMode, setInputMode] = useState<'template' | 'manual'>('template');
  const [editorTab, setEditorTab] = useState<'write' | 'history'>('write');
  const [historySearch, setHistorySearch] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  // Local estimated cost state
  const [localCost, setLocalCost] = useState(0);

  // Hook for AI Logic
  const { 
    isAiLoading, 
    auditResult, 
    handleSmartDraft, 
    handleAiAudit, 
    clearAudit 
  } = useAiAssistant({
    manualDescription,
    selectedCategory,
    formDetails,
    selectedGoals,
    onUpdateDescription,
    onShowNotification
  });

  // Auto-select template when category changes
  useEffect(() => {
    if (selectedCategory) {
      const tmpl = TEMPLATES.find(t => t.category === selectedCategory);
      if (tmpl) {
        setActiveTemplate(tmpl);
        setInputMode('template');
      } else {
        setActiveTemplate(null);
        setInputMode('manual');
      }
    }
    clearAudit(); // Clear AI results on category switch
    setEditorTab('write'); // Reset to write tab
  }, [selectedCategory]);

  const handleManualUpdate = (val: string) => {
    onUpdateDescription(val);
    if (auditResult) clearAudit();
  };

  const handleCostUpdate = (cost: number) => {
    setLocalCost(cost);
    onUpdateCost(cost);
  };

  const handleUseHistory = (text: string) => {
    onUpdateDescription(text);
    setEditorTab('write'); // Switch back to editor
    onShowNotification("Historical text copied to editor", "success");
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  return (
    <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 h-full">
      {/* Left Panel: Builder */}
      <section className="lg:col-span-6 flex flex-col h-full gap-6 overflow-y-auto custom-scrollbar pr-2">
          
          {/* Category Grid */}
          <div className="card-base p-6" id="tour-categories">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold shadow-lg shadow-brand-500/30">1</div>
              <h3 className="text-lg font-bold text-navy-700 tracking-tight">Select Expenditure Category</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={clsx(
                    "p-4 rounded-2xl transition-all duration-200 text-left flex flex-col items-start gap-2 group border-none",
                    selectedCategory === cat
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-[1.02]"
                      : "bg-gray-50 text-navy-700 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5"
                  )}
                >
                  <span className={clsx(
                    "text-xs font-bold transition-colors",
                    selectedCategory === cat ? "text-white" : "text-navy-700"
                  )}>
                    {cat}
                  </span>
                  <span className={clsx(
                    "text-[10px] font-medium leading-snug",
                    selectedCategory === cat ? "text-brand-100" : "text-gray-500"
                  )}>
                    {CATEGORY_DETAILS[cat] || "Standard request category."}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Area */}
          {selectedCategory ? (
            <div className="card-base p-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold shadow-lg shadow-brand-500/30">2</div>
                  <h3 className="text-lg font-bold text-navy-700 tracking-tight">Request Details</h3>
                </div>
                
                {/* Mode Toggle */}
                {activeTemplate && (
                  <div className="flex bg-gray-100 rounded-xl p-1.5 gap-1">
                    <button
                      onClick={() => setInputMode('template')}
                      className={clsx(
                        "px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                        inputMode === 'template' ? "bg-white shadow-sm text-brand-600" : "text-gray-500 hover:text-navy-700"
                      )}
                    >
                      <LayoutTemplate size={14} />
                      Builder
                    </button>
                    <button
                      onClick={() => setInputMode('manual')}
                      className={clsx(
                        "px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                        inputMode === 'manual' ? "bg-white shadow-sm text-brand-600" : "text-gray-500 hover:text-navy-700"
                      )}
                    >
                      <PenTool size={14} />
                      AI Assistant
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6" id="tour-input-area">
                {inputMode === 'template' && activeTemplate ? (
                  <BuilderForm 
                    template={activeTemplate} 
                    onUpdate={handleManualUpdate}
                    onTotalChange={handleCostUpdate}
                  />
                ) : (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                    
                    {/* Goals Section (Only show in Write mode) */}
                    {editorTab === 'write' && (
                        <div className="bg-brand-50/50 rounded-2xl p-5" id="tour-goals">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-brand-100 text-brand-600 rounded-lg">
                                    <Target size={16} />
                                </div>
                                <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wide">
                                    Justification Strategy <span className="text-brand-400 font-normal normal-case ml-1">(Select active goals)</span>
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {BCEMS_GOALS.map(goal => {
                                    const isSelected = selectedGoals.includes(goal);
                                    return (
                                        <button
                                            key={goal}
                                            onClick={() => toggleGoal(goal)}
                                            className={clsx(
                                                "text-[11px] font-bold px-3 py-2 rounded-xl border transition-all flex items-center gap-2 shadow-sm",
                                                isSelected 
                                                    ? "bg-brand-500 text-white border-brand-500 shadow-brand-500/30" 
                                                    : "bg-white text-gray-500 border-transparent hover:text-brand-600"
                                            )}
                                        >
                                            {isSelected && <Check size={12} strokeWidth={3} />}
                                            {goal}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Modern Editor Container */}
                    <div className="relative rounded-[20px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden group focus-within:ring-2 focus-within:ring-brand-500/20 transition-all min-h-[400px] flex flex-col">
                        
                        {/* Tab Switcher in Toolbar */}
                        <div className="flex items-center justify-between px-5 py-3 bg-gray-50/50 border-b border-gray-100">
                            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                                <button 
                                    onClick={() => setEditorTab('write')}
                                    className={clsx(
                                        "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-2",
                                        editorTab === 'write' ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "text-gray-400 hover:text-navy-700"
                                    )}
                                >
                                    <PenTool size={12} />
                                    Write
                                </button>
                                <button 
                                    onClick={() => setEditorTab('history')}
                                    className={clsx(
                                        "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-2",
                                        editorTab === 'history' ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "text-gray-400 hover:text-navy-700"
                                    )}
                                >
                                    <History size={12} />
                                    Search Past Approvals
                                </button>
                            </div>

                            {editorTab === 'write' && (
                                <button 
                                  onClick={handleSmartDraft} 
                                  disabled={isAiLoading || !manualDescription}
                                  className="px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                                  title="Convert rough notes into formal EOC language"
                                >
                                  {isAiLoading ? <Wand2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                  <span>{isAiLoading ? 'Drafting...' : 'Smart Draft'}</span>
                                </button>
                            )}
                        </div>

                        {/* Editor Content Area */}
                        {editorTab === 'write' ? (
                            <div className="flex-1 flex flex-col">
                                <textarea
                                    className="w-full flex-1 p-6 font-mono text-sm text-navy-700 placeholder:text-gray-300 leading-relaxed resize-none focus:outline-none bg-white"
                                    placeholder={`Enter rough notes here...\n\nExample:\n"Need 3 security guards at the checkpoint for 5 days. $40/hr."\n\nThen click 'Smart Draft' to let AI format it correctly.`}
                                    value={manualDescription}
                                    onChange={(e) => handleManualUpdate(e.target.value)}
                                    spellCheck={false}
                                />
                                {/* Bottom Status Bar */}
                                <div className="px-5 py-3 bg-white border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-medium">
                                    <span>{manualDescription.length} characters</span>
                                    {manualDescription.length > 20 && (
                                         <span className="flex items-center gap-1.5 text-emerald-500 font-bold animate-in fade-in">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                                            Ready for Review
                                         </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 bg-gray-50/30 p-4 flex flex-col">
                                <div className="relative mb-4">
                                    <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        className="w-full bg-white border-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-navy-700 shadow-sm focus:ring-2 focus:ring-brand-500/20"
                                        placeholder="Search by keywords (e.g. 'sandbag', 'security')..."
                                        value={historySearch}
                                        onChange={(e) => setHistorySearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                    <HistoricalApprovals 
                                        searchTerm={historySearch} 
                                        category={selectedCategory} 
                                        onUse={handleUseHistory} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Policy Check Section (Only visible in Write mode) */}
                    {editorTab === 'write' && (
                        <div className="pt-4" id="tour-audit">
                            <div className="flex justify-between items-center mb-3 px-1">
                              <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                  <ShieldCheck size={16} />
                                  Compliance Audit
                              </h4>
                              <button 
                                  onClick={handleAiAudit}
                                  disabled={isAiLoading || !manualDescription}
                                  className="text-xs font-bold text-gray-400 hover:text-brand-500 transition-colors"
                              >
                                  Run Manual Check
                              </button>
                            </div>
                            
                            <div className="min-h-[40px]">
                               <RiskAnalysis result={auditResult} loading={isAiLoading} />
                               {!auditResult && !isAiLoading && (
                                   <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-4 text-center">
                                       <span className="text-[11px] text-gray-400 font-bold">Results will appear here after running a check</span>
                                   </div>
                               )}
                            </div>
                        </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[30px] bg-white/50 text-gray-400 m-1">
              <div className="bg-white p-4 rounded-full shadow-lg shadow-gray-200/50 mb-4">
                 <LayoutTemplate size={32} className="text-brand-200" />
              </div>
              <p className="text-sm font-bold text-navy-700">No Category Selected</p>
              <p className="text-xs text-gray-400 mt-1">Select a tile above to begin</p>
            </div>
          )}
      </section>

      {/* Right Panel: Live Preview Only */}
      <section className="lg:col-span-6 bg-transparent flex flex-col h-full min-h-0" id="tour-preview">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
                 <div className="bg-white p-2 rounded-xl shadow-sm">
                    <Eye size={18} className="text-navy-700" />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-navy-700">Live Preview</h3>
                    <p className="text-[10px] text-gray-400 font-medium">Real-time PDF Output</p>
                 </div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar relative p-4 flex justify-center items-start rounded-[30px] border border-white/60 bg-white/30 backdrop-blur-xl shadow-[0_20px_27px_0_rgba(0,0,0,0.05)]">
           {/* Pass formDetails, description, and cost to Preview */}
           <FormPreview 
             data={formDetails}
             description={manualDescription}
             amount={localCost}
           />
        </div>
      </section>
    </div>
  );
};