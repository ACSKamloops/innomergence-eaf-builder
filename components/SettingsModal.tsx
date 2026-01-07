import React from 'react';
import { Settings, X, Save, FileText } from 'lucide-react';
import { EAFFormDetails } from '../types';

interface Props {
  show: boolean;
  onClose: () => void;
  details: Omit<EAFFormDetails, 'amount' | 'description'>;
  onUpdate: (key: keyof Omit<EAFFormDetails, 'amount' | 'description'>, value: string) => void;
}

export const SettingsModal: React.FC<Props> = ({ show, onClose, details, onUpdate }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/50">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-navy-700 flex items-center gap-2.5">
              <div className="p-2 bg-brand-500 rounded-xl text-white shadow-lg shadow-brand-500/30">
                 <Settings size={20} />
              </div>
              Incident Configuration
            </h3>
            <p className="text-xs text-gray-500 ml-11 font-medium">Configure global header details for Form 530.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-700 transition-colors p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="col-span-2">
             <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">Event / Incident Name</label>
             <input 
                className="input-base w-full bg-gray-50 focus:bg-white" 
                value={details.event} 
                onChange={e => onUpdate('event', e.target.value)}
                placeholder="e.g. White Rock Lake Fire"
             />
          </div>
          <div>
             <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">Task Number</label>
             <input 
                className="input-base w-full font-mono text-brand-600 font-bold bg-gray-50 focus:bg-white" 
                value={details.taskNumber} 
                onChange={e => onUpdate('taskNumber', e.target.value)}
                placeholder="e.g. 24-5422"
             />
          </div>
           <div>
             <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">Operational Period</label>
             <input 
                className="input-base w-full bg-gray-50 focus:bg-white" 
                value={details.operationalPeriod} 
                onChange={e => onUpdate('operationalPeriod', e.target.value)}
                placeholder="e.g. 1"
             />
          </div>
          <div>
             <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">Date</label>
             <input 
                className="input-base w-full bg-gray-50 focus:bg-white" 
                type="date"
                value={details.date} 
                onChange={e => onUpdate('date', e.target.value)}
             />
          </div>
          <div>
             <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">Time</label>
             <input 
                className="input-base w-full bg-gray-50 focus:bg-white" 
                type="time"
                value={details.time} 
                onChange={e => onUpdate('time', e.target.value)}
             />
          </div>
          <div className="col-span-2 pt-2 border-t border-gray-100 mt-2">
             <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">Requesting Organization / Local Govt</label>
             <input 
                className="input-base w-full bg-gray-50 focus:bg-white" 
                value={details.organization} 
                onChange={e => onUpdate('organization', e.target.value)}
                placeholder="e.g. Regional District of Central Okanagan"
             />
          </div>
          <div>
             <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">Auth. Rep Name</label>
             <input 
                className="input-base w-full bg-gray-50 focus:bg-white" 
                value={details.authRepName} 
                onChange={e => onUpdate('authRepName', e.target.value)}
                placeholder="Name of person submitting"
             />
          </div>
          <div>
             <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">EOC Location</label>
             <input 
                className="input-base w-full bg-gray-50 focus:bg-white" 
                value={details.authRepLocation} 
                onChange={e => onUpdate('authRepLocation', e.target.value)}
                placeholder="e.g. Main EOC"
             />
          </div>
          <div>
             <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">Telephone</label>
             <input 
                className="input-base w-full bg-gray-50 focus:bg-white" 
                value={details.phone} 
                onChange={e => onUpdate('phone', e.target.value)}
             />
          </div>
          <div>
             <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">Email</label>
             <input 
                className="input-base w-full bg-gray-50 focus:bg-white" 
                value={details.email} 
                onChange={e => onUpdate('email', e.target.value)}
             />
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
           <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-200 transition-colors">
              Cancel
           </button>
          <button 
            onClick={onClose} 
            className="btn-primary"
          >
            <Save size={16} /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};