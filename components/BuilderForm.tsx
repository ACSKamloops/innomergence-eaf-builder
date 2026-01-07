import React, { useState, useEffect } from 'react';
import { EAFTemplate, AuditRule } from '../types';
import { EQUIPMENT_RATES, AUDIT_RULES } from '../constants';
import { AlertTriangle, Calculator, DollarSign, Info } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  template: EAFTemplate;
  onUpdate: (text: string) => void;
  onTotalChange: (total: number) => void;
}

export const BuilderForm: React.FC<Props> = ({ template, onUpdate, onTotalChange }) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [total, setTotal] = useState(0);
  const [warnings, setWarnings] = useState<AuditRule[]>([]);

  // Update text and calculate totals whenever values change
  useEffect(() => {
    // Generate text
    const text = template.baseText(values);
    onUpdate(text);
    checkAuditRules(text);

    // Calculate total
    const rate = parseFloat(values.rate) || 0;
    const days = parseFloat(values.days) || parseFloat(values.duration) || 1;
    const quantity = parseFloat(values.quantity) || parseFloat(values.units) || parseFloat(values.animalCount) || parseFloat(values.trips) || 1;
    
    // Simple logic for total calculation based on common field names
    let estimatedTotal = 0;
    if (values.cost) {
        estimatedTotal = parseFloat(values.cost) || 0;
    } else if (values.rate) {
        estimatedTotal = rate * quantity * (template.fields.some(f => f.id === 'days' || f.id === 'duration') ? days : 1);
    }
    
    setTotal(estimatedTotal);
    onTotalChange(estimatedTotal);
  }, [values, template]);

  const checkAuditRules = (text: string) => {
    const foundWarnings = AUDIT_RULES.filter(rule => 
      text.toLowerCase().includes(rule.trigger.toLowerCase())
    );
    setWarnings(foundWarnings);
  };

  const handleChange = (id: string, value: any) => {
    const newValues = { ...values, [id]: value };
    
    // Special handling for equipment selection to auto-fill rate
    if (id === 'equipment' && template.category === 'Equipment Rental') {
      const eq = EQUIPMENT_RATES.find(e => e.name === value);
      if (eq) {
        newValues.rate = eq.rate;
        newValues.unit = eq.unit;
      }
    }
    setValues(newValues);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 rounded-lg p-4">
        <Info className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
        <div>
          <h4 className="text-sm font-semibold text-blue-900 mb-1">Builder Mode: {template.name}</h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Complete the fields below to automatically generate a policy-compliant description.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {template.fields.map(field => (
          <div key={field.id} className="space-y-1.5 group">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide group-focus-within:text-blue-600 transition-colors">
              {field.label}
            </label>
            <div className="relative">
              {field.prefix && (
                <div className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium select-none pointer-events-none">
                  {field.prefix}
                </div>
              )}
              
              {field.id === 'equipment' && template.category === 'Equipment Rental' ? (
                <div className="relative">
                  <select 
                    className="input-base appearance-none"
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    value={values[field.id] || ''}
                  >
                    <option value="">Select Equipment...</option>
                    {EQUIPMENT_RATES.map(eq => (
                      <option key={eq.id} value={eq.name}>{eq.name} (${eq.rate}/{eq.unit})</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              ) : field.type === 'select' ? (
                <div className="relative">
                  <select
                    className="input-base appearance-none"
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    value={values[field.id] || ''}
                  >
                    <option value="">Select Option...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              ) : (
                <input
                  type={field.type}
                  className={clsx(
                    "input-base",
                    field.prefix ? "pl-7" : ""
                  )}
                  placeholder={field.placeholder}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  value={values[field.id] || ''}
                />
              )}
            </div>
            {field.warning && (
              <div className="flex items-center gap-1.5 mt-1 text-amber-600 bg-amber-50 w-fit px-2 py-0.5 rounded text-[10px] font-medium border border-amber-100">
                <AlertTriangle size={10} />
                <span>Check: {field.warning}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-6 mt-6">
        {total > 0 && (
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <Calculator size={20} />
              </div>
              <div>
                <span className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Estimated Claim Total</span>
                <span className="text-[10px] text-emerald-600">Calculated from rates & duration</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700 font-mono tracking-tight flex items-center">
              <span className="text-lg mr-0.5 opacity-70">$</span>
              {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl space-y-3 animate-pulse">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle size={14} />
              Audit Risk Detected
            </div>
            <div className="space-y-2">
              {warnings.map((w, idx) => (
                <div key={idx} className="text-xs text-red-700 flex gap-2 items-start bg-white/50 p-2 rounded border border-red-100">
                  <span className="mt-0.5">•</span>
                  <span>Found "<strong>{w.trigger}</strong>". Suggestion: <strong>{w.suggestion}</strong>. <span className="opacity-75">{w.reason}</span></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};