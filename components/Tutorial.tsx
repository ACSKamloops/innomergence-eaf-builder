import React, { useEffect, useState } from 'react';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TourStep {
  targetId: string;
  title: string;
  content: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

interface Props {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
}

export const Tutorial: React.FC<Props> = ({ steps, isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (isOpen) {
      const updatePosition = () => {
        const element = document.getElementById(currentStep.targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          // Short timeout to allow layout to settle after scroll
          setTimeout(() => {
            if (element) {
                setRect(element.getBoundingClientRect());
            }
          }, 350);
        } else {
            setRect(null);
        }
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      // Capture true to handle all scroll events
      window.addEventListener('scroll', updatePosition, true);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen, currentStepIndex, currentStep.targetId]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onClose();
      setTimeout(() => setCurrentStepIndex(0), 300); // Reset for next time
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Calculate position based on preference or fallback
  const getTooltipPosition = () => {
    if (!rect) return { top: 0, left: 0 };
    
    // SAFETY CONSTANTS
    const TOOLTIP_WIDTH = 380;
    // We assume a larger height to force the clamp to kick in earlier, preventing bottom cutoff.
    const TOOLTIP_HEIGHT = 450; 
    const GAP = 20;

    let targetPos = currentStep.position;
    
    // Auto-detect if no position specified
    if (!targetPos) {
       // Prefer bottom, unless it overflows viewport height
       if (rect.bottom + TOOLTIP_HEIGHT + GAP > window.innerHeight) {
           targetPos = 'top';
       } else {
           targetPos = 'bottom';
       }
    }

    let top = 0;
    let left = 0;

    switch (targetPos) {
        case 'right':
            left = rect.right + GAP;
            // Align top edges initially
            top = rect.top;
            break;
        case 'left':
            left = rect.left - TOOLTIP_WIDTH - GAP;
            top = rect.top;
            break;
        case 'top':
            left = rect.left; // Align left edges
            top = rect.top - TOOLTIP_HEIGHT - GAP;
            break;
        case 'bottom':
        default:
            left = rect.left; // Align left edges
            top = rect.bottom + GAP;
            break;
    }

    // --- Safety Clamping ---
    
    // 1. Horizontal Clamp
    // If it goes off the right edge
    if (left + TOOLTIP_WIDTH > window.innerWidth - GAP) {
        left = window.innerWidth - TOOLTIP_WIDTH - GAP;
    }
    // If it goes off the left edge
    if (left < GAP) {
        left = GAP;
    }

    // 2. Vertical Clamp
    // If it goes off the bottom
    if (top + TOOLTIP_HEIGHT > window.innerHeight) {
        // Shift it up to fit in the viewport
        top = window.innerHeight - TOOLTIP_HEIGHT;
    }
    // If it goes off the top
    if (top < GAP) {
        top = GAP;
    }

    return { top, left };
  };

  if (!isOpen) return null;

  const tooltipPos = getTooltipPosition();

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* 
          SVG Mask Overlay 
          Creates a "hole" around the target element `rect`.
      */}
      {rect && (
        <>
            <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300 ease-out">
                <defs>
                    <mask id="tour-mask" x="0" y="0" width="100%" height="100%">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <rect 
                            x={rect.left - 5} 
                            y={rect.top - 5} 
                            width={rect.width + 10} 
                            height={rect.height + 10} 
                            rx="12" 
                            fill="black" 
                        />
                    </mask>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="rgba(11,20,55,0.7)" mask="url(#tour-mask)" />
            </svg>
            
            {/* Highlight Border Animation */}
            <motion.div 
                className="absolute border-2 border-brand-500 rounded-[18px] shadow-[0_0_30px_rgba(67,24,255,0.5)] pointer-events-none"
                initial={false}
                animate={{
                    top: rect.top - 5,
                    left: rect.left - 5,
                    width: rect.width + 10,
                    height: rect.height + 10
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {/* Tooltip Card */}
            <motion.div
                className="absolute bg-white p-6 rounded-[24px] shadow-2xl max-w-sm w-full flex flex-col gap-4 border border-white/50"
                // Ensure the card itself scrolls if it is taller than the viewport allows
                style={{ maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1,
                    top: tooltipPos.top,
                    left: tooltipPos.left
                }}
                transition={{ duration: 0.4, type: "spring" }}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand-50 p-2 rounded-xl text-brand-500">
                            <HelpCircle size={18} />
                        </div>
                        <h3 className="font-bold text-navy-700 text-sm tracking-wide uppercase">{currentStep.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-navy-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="text-sm text-gray-600 font-medium leading-relaxed">
                    {currentStep.content}
                </div>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        Step {currentStepIndex + 1} / {steps.length}
                    </span>
                    <div className="flex gap-3">
                        <button 
                            onClick={handlePrev}
                            disabled={currentStepIndex === 0}
                            className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 text-navy-700 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            onClick={handleNext}
                            className="px-5 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold hover:bg-brand-600 flex items-center gap-1 shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
                        >
                            {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                            {currentStepIndex !== steps.length - 1 && <ChevronRight size={14} />}
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
      )}
    </div>
  );
};