import React from 'react';
import { EAFFormDetails } from '../types';
import { clsx } from 'clsx';

interface Props {
  data: Omit<EAFFormDetails, 'amount' | 'description'>;
  description: string;
  amount: number;
}

export const FormPreview: React.FC<Props> = ({ data, description, amount }) => {
  // Calculate Not to Exceed Amount (Requested + 10%)
  const notToExceedAmount = amount > 0 ? amount * 1.10 : 0;

  // Helper to parse markdown-like syntax for Bold and Italics
  const renderDescription = (text: string) => {
    if (!text) return null;
    
    // Split by markdown delimiters (bold **...** or italic *...*)
    const parts = text.split(/(\*\*.*?\*\*|\*[^*]+?\*)/g);
    
    return parts.map((part, i) => {
      // Check for bold
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      // Check for italics
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={i} className="italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="relative w-full flex justify-center p-4 md:p-8 pb-32">
      {/* 
         Container: 
         - A4 dimensions (min-h-[297mm]).
         - Flex column layout.
         - 'overflow-visible' ensures no clipping.
      */}
      <div className="bg-white eaf-form-preview w-full max-w-[210mm] min-h-[297mm] h-auto flex flex-col relative text-black shadow-2xl shadow-slate-300/60 border-2 border-black print:shadow-none overflow-visible">
        
        {/* --- TOP SECTION (Grows to fill space) --- */}
        <div className="flex flex-col flex-grow">
          
          {/* Title */}
          <div className="text-center font-bold text-xl py-3 border-b-2 border-black bg-slate-50/30">
            EOC EXPENDITURE AUTHORIZATION FORM
          </div>

          {/* Header Grid */}
          <div className="flex border-b border-black">
            <div className="w-[45%] border-r border-black p-2">
              <div className="label text-[0.7rem]">Event:</div>
              <div className="value text-sm">{data.event}</div>
            </div>
            <div className="w-[30%] border-r border-black p-2">
              <div className="label text-[0.7rem]">Date:</div>
              <div className="value text-sm">{data.date}</div>
            </div>
            <div className="w-[25%] p-2 bg-slate-50">
              <div className="label text-[0.7rem]">EAF #:</div>
              <div className="value font-mono text-red-600 font-bold text-sm">{data.taskNumber ? `${data.taskNumber}-001` : ''}</div>
            </div>
          </div>

          <div className="flex border-b border-black">
            <div className="w-[30%] border-r border-black p-2">
              <div className="label text-[0.7rem]">EMBC Task #:</div>
              <div className="value font-mono text-sm">{data.taskNumber}</div>
            </div>
            <div className="w-[30%] border-r border-black p-2">
               <div className="label text-[0.7rem]">Operational Period:</div>
               <div className="value font-mono text-sm">{data.operationalPeriod}</div>
            </div>
            <div className="w-[40%] p-2">
              <div className="label text-[0.7rem]">Time:</div>
              <div className="value text-sm">{data.time}</div>
            </div>
          </div>

          <div className="border-b border-black p-2">
            <div className="label text-[0.7rem]">Requesting Organization/Community:</div>
            <div className="value text-sm">{data.organization}</div>
          </div>

          <div className="flex border-b border-black">
            <div className="w-1/3 border-r border-black p-2 flex items-center gap-3">
              <div className="label text-[0.7rem]">Auth. Rep:</div>
              <div className="w-5 h-5 border border-black flex items-center justify-center text-sm font-bold">
                {data.authRepName ? '✓' : ''}
              </div>
              <span className="text-sm font-medium">Yes</span>
            </div>
            <div className="w-1/3 border-r border-black p-2">
              <div className="label text-[0.7rem]">Name:</div>
              <div className="value text-sm">{data.authRepName}</div>
            </div>
            <div className="w-1/3 p-2">
              <div className="label text-[0.7rem]">EOC Location:</div>
              <div className="value text-sm">{data.authRepLocation}</div>
            </div>
          </div>

          <div className="flex border-b border-black">
            <div className="w-1/3 border-r border-black p-2">
              <div className="label text-[0.7rem]">Telephone:</div>
              <div className="value text-sm">{data.phone}</div>
            </div>
            <div className="w-1/3 border-r border-black p-2">
              <div className="label text-[0.7rem]">Fax:</div>
              <div className="value text-sm">{data.fax}</div>
            </div>
            <div className="w-1/3 p-2">
              <div className="label text-[0.7rem]">Email:</div>
              <div className="value truncate text-sm">{data.email}</div>
            </div>
          </div>

          {/* Description Section - Grows to fill remaining top space */}
          <div className="flex flex-col flex-grow border-b border-black min-h-[250px]">
            <div className="p-2 bg-slate-50 border-b border-slate-200">
              <div className="label text-[0.7rem]">Description of Expenditure: (include nature of goods/services, outcome, location, date/time...)</div>
            </div>
            {/* Content Area with Markdown Parsing */}
            <div className="p-3 text-sm whitespace-pre-wrap font-mono leading-relaxed flex-grow text-slate-900">
              {renderDescription(description)}
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION (Sticks to bottom) --- */}
        <div className="flex-shrink-0 mt-auto">
          
          {/* Amounts */}
          <div className="flex border-b border-black min-h-[5rem]">
            <div className="w-1/2 border-r border-black p-3 flex flex-col justify-center">
              <div className="label text-[0.7rem]">Amount Requested:</div>
              <div className="text-2xl font-bold text-right pr-4">
                {amount > 0 ? `$${amount.toLocaleString(undefined, {minimumFractionDigits: 2})}` : ''}
              </div>
            </div>
            <div className="w-1/2 p-3 flex flex-col justify-center bg-slate-50">
              <div className="label text-[0.7rem]">Expenditure Not to Exceed (Requested + 10%):</div>
              <div className="text-2xl font-bold text-right pr-4 text-slate-900">
                {notToExceedAmount > 0 ? `$${notToExceedAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}` : ''}
              </div>
            </div>
          </div>

          {/* Approvals Section */}
          <div className="flex border-b border-black min-h-[7rem]">
            <div className="w-8 bg-slate-800 text-white flex items-center justify-center font-bold text-[0.7rem] writing-vertical-lr py-2 tracking-widest">
              <span className="-rotate-90 whitespace-nowrap">EOC APPROVALS</span>
            </div>
            <div className="flex-1 flex">
              <div className="w-1/2 border-r border-black p-2 flex flex-col justify-between">
                <div className="label text-[0.7rem]">Approved for Processing by:</div>
                <div className="label text-slate-400 mt-auto text-[0.7rem]">Position:</div>
                <div className="label text-slate-400 text-[0.7rem]">Date/Time:</div>
              </div>
              <div className="w-1/2 p-2 flex flex-col justify-between">
                <div className="label text-[0.7rem]">Expenditure Request Approved by:</div>
                <div className="label mt-auto text-[0.7rem]">Position: <span className="font-normal">EOC Director</span></div>
                <div className="label text-slate-400 text-[0.7rem]">Date/Time:</div>
              </div>
            </div>
          </div>

          {/* PREOC Approvals Section */}
          <div className="flex border-b border-black min-h-[7rem] break-inside-avoid">
            <div className="w-8 bg-slate-800 text-white flex items-center justify-center font-bold text-[0.7rem] writing-vertical-lr py-2 tracking-widest">
              <span className="-rotate-90 whitespace-nowrap">PREOC APPROVALS</span>
            </div>
            <div className="flex-1 flex">
              <div className="w-1/2 border-r border-black p-2 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="label text-[0.7rem]">Approved for Processing:</div>
                  <div className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-black"></div>
                      <span className="text-[0.7rem]">Not Appr.</span>
                  </div>
                </div>
                <div className="label text-slate-400 mt-auto text-[0.7rem]">Position: <span className="font-normal">Ops Chief</span></div>
                <div className="label text-slate-400 text-[0.7rem]">Date/Time:</div>
              </div>
              <div className="w-1/2 p-2 flex flex-col justify-between">
                <div className="label text-[0.7rem]">Expenditure Authorized by:</div>
                <div className="label mt-auto text-[0.7rem]">Position: <span className="font-normal">PREOC Director</span></div>
                <div className="label text-slate-400 text-[0.7rem]">Date/Time:</div>
              </div>
            </div>
          </div>

          {/* Distribution */}
          <div className="p-3 min-h-[6rem] text-[0.7rem] relative">
            <div className="font-bold mb-2">Distribution:</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              <div className="flex items-center gap-2"><div className="w-3 h-3 border border-black"></div> EOC Director</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 border border-black"></div> PREOC Director</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 border border-black"></div> EOC Finance</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 border border-black"></div> PREOC Finance</div>
            </div>
            <div className="absolute bottom-2 right-2 text-[0.7rem] font-bold text-slate-400">EOC 530 (2018)</div>
          </div>
        </div>

      </div>
      
      {/* Decorative effect to imply multiple pages or stack - hidden in print */}
      <div className="absolute top-2 left-3 w-[calc(100%-12px)] h-[calc(100%-12px)] bg-white border border-slate-200 -z-10 shadow-sm rotate-[0.5deg] print:hidden"></div>
    </div>
  );
};
