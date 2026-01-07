
import { useState } from 'react';
import { generateSmartDraft, runAiAudit, AuditResult } from '../utils/ai';
import { getCategoryContext } from '../utils/contextGenerator';
import { POLICY_INFO } from '../constants';
import { EAFFormDetails } from '../types';

interface UseAiAssistantProps {
  manualDescription: string;
  selectedCategory: string;
  formDetails: Partial<EAFFormDetails>;
  selectedGoals?: string[];
  onUpdateDescription: (text: string) => void;
  onShowNotification: (msg: string, type: 'success' | 'info') => void;
}

export const useAiAssistant = ({
  manualDescription,
  selectedCategory,
  formDetails,
  selectedGoals,
  onUpdateDescription,
  onShowNotification
}: UseAiAssistantProps) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const clearAudit = () => setAuditResult(null);

  const handleSmartDraft = async () => {
    if (!manualDescription) return;
    setIsAiLoading(true);
    try {
      const policyRules = selectedCategory ? POLICY_INFO[selectedCategory]?.rules : [];
      const policyTips = selectedCategory ? POLICY_INFO[selectedCategory]?.tips : [];
      const ineligible = selectedCategory ? POLICY_INFO[selectedCategory]?.ineligible : [];
      const primer = selectedCategory ? POLICY_INFO[selectedCategory]?.primer : "";
      const referenceText = getCategoryContext(selectedCategory);
      
      const enhanced = await generateSmartDraft(
        manualDescription, 
        formDetails, 
        selectedCategory,
        policyRules,
        policyTips,
        ineligible,
        referenceText,
        selectedGoals,
        primer
      );
      
      onUpdateDescription(enhanced);
      onShowNotification("Description Enhanced by AI", "success");
    } catch (e) {
      onShowNotification("AI Generation Failed", "info");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiAudit = async () => {
    if (!manualDescription) return;
    setIsAiLoading(true);
    try {
      const policyRules = selectedCategory ? POLICY_INFO[selectedCategory]?.rules : [];
      const policyTips = selectedCategory ? POLICY_INFO[selectedCategory]?.tips : [];
      const ineligible = selectedCategory ? POLICY_INFO[selectedCategory]?.ineligible : [];
      const referenceText = getCategoryContext(selectedCategory);

      const result = await runAiAudit(
        manualDescription,
        selectedCategory,
        policyRules,
        policyTips,
        ineligible,
        referenceText
      );
      setAuditResult(result);
    } catch (e) {
      onShowNotification("AI Audit Failed", "info");
    } finally {
      setIsAiLoading(false);
    }
  };

  return {
    isAiLoading,
    auditResult,
    handleSmartDraft,
    handleAiAudit,
    clearAudit
  };
};
