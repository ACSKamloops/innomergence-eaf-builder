import React from 'react';
import { AuditResult } from '../utils/ai';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface Props {
  result: AuditResult | null;
  loading: boolean;
}

export const RiskAnalysis: React.FC<Props> = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-white/50 animate-pulse flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-2.5 bg-slate-300 rounded w-1/4"></div>
          <div className="h-2 bg-slate-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const isPass = result.score >= 85;
  const isFail = result.score < 60;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "mt-4 rounded-xl border overflow-hidden shadow-sm transition-colors",
        isPass ? "border-emerald-200 bg-emerald-50" : isFail ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"
      )}
    >
      <div className={clsx(
        "px-5 py-4 flex justify-between items-center border-b",
        isPass ? "border-emerald-100/50" : isFail ? "border-red-100/50" : "border-amber-100/50"
      )}>
        <div className="flex items-center gap-3">
          <div className={clsx("p-2 rounded-lg", 
            isPass ? "bg-emerald-100 text-emerald-700" : isFail ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
          )}>
            {isPass ? <ShieldCheck size={20} /> : isFail ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div>
            <span className={clsx("block text-xs font-bold uppercase tracking-wide", 
              isPass ? "text-emerald-600" : isFail ? "text-red-600" : "text-amber-600"
            )}>
              Policy Compliance
            </span>
            <span className={clsx("text-lg font-bold", 
              isPass ? "text-emerald-900" : isFail ? "text-red-900" : "text-amber-900"
            )}>
              Score: {result.score}/100
            </span>
          </div>
        </div>
        <span className={clsx("text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border",
            isPass ? "bg-emerald-100 border-emerald-200 text-emerald-800" : isFail ? "bg-red-100 border-red-200 text-red-800" : "bg-amber-100 border-amber-200 text-amber-800"
        )}>
          {result.status}
        </span>
      </div>

      <div className="p-5">
        {result.issues.length === 0 ? (
          <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
            <CheckCircle2 size={16} />
            <span>No risks detected. Description appears compliant.</span>
          </div>
        ) : (
          <ul className="space-y-3">
            {result.issues.map((issue, idx) => (
              <li key={idx} className="flex gap-3 text-sm group">
                <div className={clsx("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform",
                  issue.severity === 'high' ? "bg-red-500" : "bg-amber-500"
                )} />
                <div className="flex-1">
                  <p className="text-slate-900 font-medium">{issue.message}</p>
                  <div className="mt-1 flex gap-1.5 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px] mt-0.5">Fix:</span> 
                    <span className="text-slate-600">{issue.suggestion}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};