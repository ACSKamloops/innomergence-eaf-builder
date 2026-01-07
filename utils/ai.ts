
import { GoogleGenAI, Type } from "@google/genai";
import { EAFFormDetails } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FAST = 'gemini-3-flash-preview';

// --- System Instructions ---

const BASE_SYSTEM_INSTRUCTION = `You are an expert Emergency Operations Centre (EOC) Logistics and Finance specialist. 
Your goal is to ensure Expenditure Authorization Forms (EAFs) are compliant with provincial emergency management guidelines.

CORE RULES FOR SUCCESSFUL APPROVAL (BASED ON 2022-2024 HISTORICAL DATA):

1. **Financial Breakdown (CRITICAL)**: You MUST include an explicit mathematical breakdown of costs in the text. This is the #1 pattern in approved forms.
   - Format: "Rate x Quantity x Duration = Total"
   - APPROVED EXAMPLES:
     * "SEP is requesting monies to cover the wages for 6 x $35 x 8 hours X 2 days = $3,360"
     * "Estimated hourly rate - $45/hour (includes benefits) with an estimate of 14 hours preparation time per EOC and Reception Centre activation: 140 hours x $45 = $6,300"
     * "2 Logistics personnel for 8 hours per day for the next 6 days. SEP is requesting monies to cover the wages for 2 x $35/hour x 8 hours X 6 days = $3,360"
     * "$90/day for 7 days = $630"
     * "$3,500/day x 2 cars x 5 days = $35,000"

2. **Imminent Threat Language**: Always link the cost to "Imminent Threat" or active emergency conditions.
   - APPROVED PHRASES: "Lake levels have reached a level at which...", "continues to threaten...", "is expected to increase along with the risk...", "before damage can occur"
   
3. **Operational Context**: Explicitly state WHO, WHERE, WHY, and WHY IT CANNOT WAIT.
   - Include: Lake levels, projected conditions, forecasted rain, current status
   - Reference: Task Number, Evacuation Order status, affected areas

4. **Terminology - BANNED vs SAFE**:
   ❌ NEVER USE: "Upgrade", "Improvement", "Capital", "Future prevention", "Training", "Standby"
   ✅ ALWAYS USE: "Restore", "Repair", "Incremental cost", "Imminent response", "Just-in-time briefing", "Active patrol"

5. **Rate References**: Reference standard rates:
   - Equipment: "Blue Book Equipment Rental Rate Guide"
   - Livestock: "EMCR Policy 2.01 rates"
   - Personnel: "Provincial Group 1/2 Travel Rates"
   
6. **Approval Triggers** (language that gets approved):
   - "SEP is requesting monies to cover..."
   - "This will require X personnel at Y hours per day for Z days"
   - "Above the normal amount and therefore could not be anticipated"
   - "Incremental costs associated with..."
   - "Response operations require..."

Your output should be a single, cohesive paragraph (or two) that matches the style of approved government forms.`;

// --- API Functions ---

export const generateSmartDraft = async (
  userInput: string,
  formContext: Partial<EAFFormDetails>,
  category?: string,
  policyContext?: string[],
  policyTips?: string[],
  ineligibleContext?: string[],
  referenceText?: string,
  bcemsGoals?: string[],
  categoryPrimer?: string
): Promise<string> => {
  if (!userInput) return "";

  const categoryInstruction = category ? `Context: This is a request for "${category}".` : "";
  const primerInstruction = categoryPrimer ? `\n\nCATEGORY PRIMER (CRITICAL): ${categoryPrimer}\nFollow this strategy closely.` : "";
  const policyInstruction = policyContext ? `\nStrictly adhere to these specific policy rules:\n- ${policyContext.join("\n- ")}` : "";
  const tipsInstruction = policyTips ? `\nConsider these best practices:\n- ${policyTips.join("\n- ")}` : "";

  // Strengthened reference instruction
  const refInstruction = referenceText ? `\n\nGOLD STANDARD EXAMPLE (Follow this tone, structure, and MATH format exactly):\n${referenceText}` : "";

  const goalsInstruction = bcemsGoals && bcemsGoals.length > 0
    ? `\n\nJUSTIFICATION STRATEGY (PRIORITY): The user has explicitly identified that this request supports the following BCEMS Goals:
- ${bcemsGoals.join("\n- ")}
You MUST explicitly weave these goals into the narrative justification. Do not just list them. Example: "This resource is required to [Goal] by [Action]."`
    : "";

  const contextStr = `
    Form Metadata:
    Event: ${formContext.event || "Unspecified"}
    Task #: ${formContext.taskNumber || "N/A"}
    Date: ${formContext.date}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION + "\n" + categoryInstruction + primerInstruction + policyInstruction + tipsInstruction + refInstruction + goalsInstruction,
        temperature: 0.2, // Lower temperature for more consistent, factual output
      },
      contents: `Transform the following rough notes into a formal, professional EAF description paragraph. Ensure you include the Math/Calculations if numbers are present in the notes:\n\n"${userInput}"\n\n${contextStr}`
    });

    return response.text?.trim() || userInput;
  } catch (error) {
    console.error("AI Draft Error:", error);
    return userInput;
  }
};

export interface AuditResult {
  score: number;
  status: 'Compliant' | 'Warning' | 'High Risk';
  issues: Array<{
    severity: 'high' | 'medium' | 'low';
    message: string;
    suggestion: string;
  }>;
}

export const runAiAudit = async (
  description: string,
  category?: string,
  policyContext?: string[],
  policyTips?: string[],
  ineligibleContext?: string[],
  referenceText?: string
): Promise<AuditResult> => {
  if (!description || description.length < 10) return { score: 0, status: 'Warning', issues: [] };

  const categoryInstruction = category ? `The category is "${category}".` : "";
  const policyInstruction = policyContext ? `\nCheck against these specific rules:\n- ${policyContext.join("\n- ")}` : "";
  const ineligibleInstruction = ineligibleContext ? `\nCRITICAL: Flag any of the following strictly ineligible items:\n- ${ineligibleContext.join("\n- ")}` : "";
  const refInstruction = referenceText ? `\n\nCompare against this compliant example:\n${referenceText}` : "";

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION + "\nYou are an Auditor. Verify that the text includes:\n1. A math breakdown of costs (Rate x Quantity).\n2. Specific dates or durations.\n3. A clear link to the event." + categoryInstruction + policyInstruction + ineligibleInstruction + refInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "0 to 100 compliance score. <60 is High Risk." },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  message: { type: Type.STRING },
                  suggestion: { type: Type.STRING }
                }
              }
            }
          }
        }
      },
      contents: `Audit this description for eligibility, clarity, and policy compliance:\n\n"${description}"`
    });

    const result = JSON.parse(response.text || "{}");

    // Calculate status based on score
    let status: AuditResult['status'] = 'Compliant';
    if (result.score < 60) status = 'High Risk';
    else if (result.score < 85) status = 'Warning';

    return {
      score: result.score || 0,
      status,
      issues: result.issues || []
    };

  } catch (error) {
    console.error("AI Audit Error:", error);
    return {
      score: 0,
      status: 'Warning',
      issues: [{ severity: 'medium', message: 'AI Service Unavailable', suggestion: 'Check connection' }]
    };
  }
};
