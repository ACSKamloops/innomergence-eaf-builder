
import { TEMPLATES } from '../constants';
import { HISTORICAL_DATA } from '../data';
import { EAFRecord } from '../types';

/**
 * Generates a "Golden Reference" text for a given category.
 * Priority 1: A real historical approval from HISTORICAL_DATA.
 * Priority 2: A generated example using the Template's placeholders (ideal structure).
 */
export const getCategoryContext = (category: string): string => {
  if (!category) return "";

  // 1. Find all matching historical records
  const matches = HISTORICAL_DATA.filter(m => {
    if (m.category === category) return true;
    // Fuzzy/Partial match
    if (m.category && (m.category.includes(category) || category.includes(m.category))) return true;
    return false;
  });

  if (matches.length > 0) {
    // Select a random match to provide variety in the AI's Few-Shot examples
    const randomMatch = matches[Math.floor(Math.random() * matches.length)];
    const snippet = randomMatch.text_snippet ? `\n(Note the Math breakdown: ${randomMatch.text_snippet})` : "";
    
    return `REAL-WORLD APPROVED EXAMPLE (Use this style):\n"${randomMatch.description_preview}"${snippet}`;
  }

  // 2. Fallback: Generate from Template Placeholders
  const template = TEMPLATES.find(t => t.category === category);
  if (template) {
    const dummyData: Record<string, any> = {};
    template.fields.forEach(field => {
      dummyData[field.id] = field.placeholder || `[${field.label.toUpperCase()}]`;
      if (field.type === 'number') {
        dummyData[field.id] = field.placeholder || "1";
      }
    });
    
    return `STANDARD TEMPLATE EXAMPLE:\n"${template.baseText(dummyData)}"`;
  }

  return "";
};
