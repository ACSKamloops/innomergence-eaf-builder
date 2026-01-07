
import React from 'react';
import { LayoutTemplate, Users, Search, FileText, AlertTriangle, CheckCircle, Settings, Lightbulb, Activity, HelpCircle, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { POLICY_INFO } from '../constants';

interface Props {
  activeTab: 'eaf' | 'org';
  setActiveTab: (tab: 'eaf' | 'org') => void;
  taskNumber: string;
  onEditHeader: () => void;
  onTaskNumberChange: (val: string) => void;
  selectedCategory: string;
  onStartTutorial?: () => void;
}

export const Sidebar: React.FC<Props> = ({ 
  activeTab, 
  setActiveTab, 
  taskNumber, 
  onEditHeader,
  onTaskNumberChange,
  selectedCategory,
  onStartTutorial
}) => {
  
  const policy = selectedCategory ? POLICY_INFO[selectedCategory] : null;

  return (
    <aside className="w-72 bg-white flex-shrink-0 flex flex-col z-20 m-4 rounded-[20px] shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] border border-white/50 h-[calc(100vh-32px)]">
      {/* Brand Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex flex-col text-navy-700 font-extrabold tracking-tight select-none cursor-default">
            <div className="flex items-center text-3xl">
                <span>Inn</span>
                <Globe size={24} strokeWidth={2.5} className="text-emerald-500 mx-0.5" />
                <span>mergence</span>
            </div>
            <span className="text-base font-medium text-navy-500 tracking-wide ml-0.5">Solutions</span>
        </div>

        <div className="flex items-center gap-2 mt-6 mb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/50 border border-emerald-100 w-fit backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">System Operational</p>
          </div>
          {onStartTutorial && (
            <button 
              onClick={onStartTutorial}
              className="ml-auto text-xs font-bold text-brand-500 hover:text-brand-700 flex items-center gap-1 bg-brand-50 px-2.5 py-1 rounded-lg hover:bg-brand-100 transition-colors"
            >
              <HelpCircle size={14} />
              App Tour
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-2" id="tour-header-settings">
        <div className="flex justify-between items-center mb-2">
           <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Task ID</label>
           <button onClick={onEditHeader} className="text-gray-400 hover:text-brand-500 transition-colors p-1" title="Edit Form Details">
              <Settings size={14} />
           </button>
        </div>
        <div className="relative group">
          <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
          <input 
            type="text" 
            className="input-base pl-10 font-mono text-navy-700 bg-gray-50 focus:bg-white text-xs tracking-wide border-none"
            placeholder="e.g. 24-5422"
            value={taskNumber}
            onChange={(e) => onTaskNumberChange(e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 py-2">
          <div className="h-px bg-gray-100 w-full my-2"></div>
      </div>

      <nav className="px-4 space-y-1" id="tour-navigation">
        <button 
          onClick={() => setActiveTab('eaf')}
          className={clsx("sidebar-link", activeTab === 'eaf' ? "sidebar-link-active" : "sidebar-link-inactive")}
        >
          <LayoutTemplate size={20} />
          EAF Builder
        </button>
        <button 
          onClick={() => setActiveTab('org')}
          className={clsx("sidebar-link", activeTab === 'org' ? "sidebar-link-active" : "sidebar-link-inactive")}
        >
          <Users size={20} />
          Org Chart Tool
        </button>
      </nav>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0" id="tour-sidebar-policy">
        {activeTab === 'eaf' && policy && (
          <div className="mx-4 mt-6 flex-1 flex flex-col rounded-2xl overflow-hidden bg-gradient-to-b from-white to-gray-50 border border-gray-100/50 shadow-sm animate-in fade-in zoom-in duration-300 min-h-0">
            <div className="px-5 py-4 flex items-center gap-2 border-b border-gray-100">
              <div className="p-1.5 bg-orange-100/50 rounded-lg text-orange-600">
                <AlertTriangle size={14} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold text-navy-700 uppercase tracking-wide">Policy Guardrails</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Eligible</span>
                </div>
                <ul className="space-y-2.5">
                  {policy.rules.map((rule, i) => (
                    <li key={i} className="text-[11px] text-gray-600 font-medium leading-relaxed pl-3 border-l-[3px] border-emerald-100">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Lightbulb size={14} className="text-brand-500" />
                  <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">Helpful Hints</span>
                </div>
                <ul className="space-y-2.5">
                  {policy.tips.map((tip, i) => (
                    <li key={i} className="text-[11px] text-gray-600 font-medium leading-relaxed pl-3 border-l-[3px] border-brand-100">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <AlertTriangle size={14} className="text-red-500" />
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Ineligible</span>
                </div>
                <ul className="space-y-2.5">
                  {policy.ineligible.map((rule, i) => (
                    <li key={i} className="text-[11px] text-gray-600 font-medium leading-relaxed pl-3 border-l-[3px] border-red-100">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 mt-auto">
        <div className="flex flex-col items-center justify-center text-[10px] text-gray-400 font-medium bg-gray-50 rounded-xl p-3 border border-gray-100 text-center leading-relaxed">
            <span className="font-bold text-navy-700 block mb-0.5">Alpha for Innomergence</span>
            <span className="text-gray-400">by Astra Computer Services</span>
        </div>
      </div>
    </aside>
  );
};
