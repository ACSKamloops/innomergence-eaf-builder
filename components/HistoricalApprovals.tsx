
import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { EAFRecord } from '../types';
import { HISTORICAL_DATA } from '../data';
import { Copy, Check, DollarSign, Search, History } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  searchTerm: string;
  onUse: (text: string) => void;
  category: string;
}

const EAFCard: React.FC<{ item: EAFRecord; onUse: (t: string) => void }> = ({ item, onUse }) => {
  const [copied, setCopied] = useState(false);

  const handleUse = () => {
    onUse(item.description_preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="bg-white rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] p-5 group hover:shadow-[0_10px_25px_0_rgba(0,0,0,0.08)] transition-all border border-gray-50"
    >
      <div className="mb-3">
        <div className="flex justify-between items-start mb-2">
           <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Check size={10} className="mr-1 stroke-[3px]" />
              APPROVED
            </span>
            <span className="text-[10px] text-gray-400 font-mono tracking-tighter bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
              {item.request_number || "REF"}
            </span>
          </div>
          {item.amount && (
            <div className="flex items-center text-xs font-bold text-navy-700 bg-brand-50/50 px-2 py-1 rounded-lg">
              <DollarSign size={12} className="text-brand-500 mr-0.5" />
              {item.amount}
            </div>
          )}
        </div>
        {item.filename && (
            <div className="text-[10px] text-gray-400 font-medium truncate" title={item.filename}>
            {item.filename}
            </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-xs text-navy-600 font-medium leading-relaxed bg-gray-50/80 p-3 rounded-xl border border-gray-100 italic">
          "{item.description_preview.length > 200 ? item.description_preview.substring(0, 200) + "..." : item.description_preview}"
        </p>
        {item.text_snippet && (
            <div className="mt-2 text-[10px] text-gray-500 font-mono bg-white border border-gray-100 rounded px-2 py-1 flex items-center gap-2">
                <span className="text-brand-500 font-bold">Calculation:</span> {item.text_snippet}
            </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleUse}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200",
            copied ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-brand-50 text-brand-600 hover:bg-brand-100 hover:text-brand-700"
          )}
        >
          {copied ? (
            <><Check size={14} strokeWidth={3} /> Copied to Editor</>
          ) : (
            <><Copy size={14} /> Use Phrasing</>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export const HistoricalApprovals: React.FC<Props> = ({ searchTerm, onUse, category }) => {
  const fuse = useMemo(() => {
    return new Fuse(HISTORICAL_DATA, {
      keys: ['description_preview', 'text_snippet', 'amount', 'filename', 'category'],
      threshold: 0.4,
      includeMatches: true,
      minMatchCharLength: 3,
      ignoreLocation: true
    });
  }, []);

  const results = useMemo(() => {
    // If no search term but category is selected, use the explicit 'category' field in the new data
    if (!searchTerm) {
       // Filter by the strict category field if it exists, matching start of string to allow partials like "Staffing" vs "Staffing/Personnel"
       const filtered = HISTORICAL_DATA.filter(e => 
         e.category && category && (e.category.toLowerCase().includes(category.split('/')[0].toLowerCase()) || category.toLowerCase().includes(e.category.toLowerCase()))
       );
       
       if (filtered.length > 0) return filtered.slice(0, 5);
       
       // Fallback for older data or broader matches
       const catKeywords: Record<string, string[]> = {
         "Livestock Relocation": ["livestock", "cow", "horse", "feed"],
         "Security": ["security", "patrol", "guard"],
         "Equipment Rental": ["rental", "excavator", "truck"],
         "Staffing/Personnel": ["staff", "overtime", "wages"],
         "Supplies": ["supplies", "sandbags", "food"]
       };
       
       const keywords = catKeywords[category] || [];
       if (keywords.length > 0) {
         return HISTORICAL_DATA.filter(e => keywords.some(k => e.description_preview.toLowerCase().includes(k))).slice(0, 5);
       }
       return HISTORICAL_DATA.slice(0, 5);
    }
    return fuse.search(searchTerm).slice(0, 8).map(r => r.item);
  }, [searchTerm, fuse, category]);

  if (results.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-8 text-gray-400">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <History size={24} className="text-gray-300" />
        </div>
        <h4 className="text-sm font-bold text-navy-700 mb-1">No Historical Matches</h4>
        <p className="text-xs text-gray-400 max-w-[200px]">
          We couldn't find any approved forms matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-2 mb-2 px-1">
         <Search size={12} className="text-gray-400" />
         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Found {results.length} similar approved records
         </span>
      </div>
      <AnimatePresence>
        {results.map((item, idx) => (
          <EAFCard key={`${item.filename}-${idx}`} item={item} onUse={onUse} />
        ))}
      </AnimatePresence>
    </div>
  );
};
