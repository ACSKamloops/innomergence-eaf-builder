
export interface EAFRecord {
  // Core Fields (Required for AI Tuning)
  description_preview: string; // The full narrative text of the approved request
  category: string;           // Must match one of the system categories (e.g., "Security", "Supplies")
  
  // Recommended Fields (For UI Display)
  request_number?: string;
  amount?: string;
  text_snippet?: string;      // A short summary of the math (e.g., "Rate $50 x 10 hours")
  filename?: string;          // Source file name if available

  // System Metadata (Optional)
  type?: string;
  raw_text_length?: number;
  matches?: any[]; // For Fuse.js results
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  placeholder?: string;
  options?: string[];
  prefix?: string;
  warning?: string;
}

export interface EAFTemplate {
  id: string;
  category: string;
  name: string;
  fields: TemplateField[];
  baseText: (data: Record<string, any>) => string;
}

export type ICSType = 'Director' | 'Section' | 'Branch' | 'Unit' | 'Division' | 'Group' | 'Strike Team' | 'Task Force';

export interface OrgNode {
  id: string;
  title: string;
  name: string;
  icsType?: ICSType;
  children: OrgNode[];
}

export interface AuditRule {
  trigger: string;
  suggestion: string;
  reason: string;
  severity: 'danger' | 'warning';
}

export interface EAFFormDetails {
  event: string;
  date: string;
  taskNumber: string;
  operationalPeriod: string;
  time: string;
  organization: string;
  authRepName: string;
  authRepLocation: string;
  phone: string;
  fax: string;
  email: string;
  description: string;
  amount: number;
}
