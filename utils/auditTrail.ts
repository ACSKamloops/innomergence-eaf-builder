/**
 * Primitive Tracer - Audit Trail System
 * 
 * Links every EAF output to its source primitives for:
 * - EU AI Act compliance (mid-2026 requirement)
 * - Auditability per Steve Newton's vision: "trace every action to roles, authorities, triggers"
 * - Reproducibility: same input + same primitives = same output
 */

export interface AppliedPrimitive {
    type: 'rate' | 'calculation' | 'authority' | 'compliance';
    id: string;
    description: string;
    source: string;
    value?: string | number;
    applied_at: string; // ISO timestamp
}

export interface AuditTrail {
    request_id: string;
    timestamp: string;
    category: string;
    user_input: string;
    applied_primitives: AppliedPrimitive[];
    llm_fallback_used: boolean;
    output_hash: string; // For reproducibility verification
    approval_level_required: string;
}

// Generate unique request ID
function generateRequestId(): string {
    return `EAF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Simple hash for output verification
function hashOutput(output: string): string {
    let hash = 0;
    for (let i = 0; i < output.length; i++) {
        const char = output.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

// Create a new audit trail
export function createAuditTrail(
    category: string,
    userInput: string
): AuditTrail {
    return {
        request_id: generateRequestId(),
        timestamp: new Date().toISOString(),
        category,
        user_input: userInput,
        applied_primitives: [],
        llm_fallback_used: false,
        output_hash: '',
        approval_level_required: ''
    };
}

// Add a primitive to the audit trail
export function logPrimitive(
    trail: AuditTrail,
    type: AppliedPrimitive['type'],
    id: string,
    description: string,
    source: string,
    value?: string | number
): void {
    trail.applied_primitives.push({
        type,
        id,
        description,
        source,
        value,
        applied_at: new Date().toISOString()
    });
}

// Mark that LLM fallback was used (no primitive match)
export function markLLMFallback(trail: AuditTrail): void {
    trail.llm_fallback_used = true;
}

// Finalize the audit trail with output hash
export function finalizeAuditTrail(
    trail: AuditTrail,
    output: string,
    approvalLevel: string
): AuditTrail {
    trail.output_hash = hashOutput(output);
    trail.approval_level_required = approvalLevel;
    return trail;
}

// Generate compliance report from audit trail
export function generateComplianceReport(trail: AuditTrail): string {
    const primitivesByType = trail.applied_primitives.reduce((acc, p) => {
        if (!acc[p.type]) acc[p.type] = [];
        acc[p.type].push(p);
        return acc;
    }, {} as Record<string, AppliedPrimitive[]>);

    let report = `# EAF Audit Trail Report\n\n`;
    report += `**Request ID:** ${trail.request_id}\n`;
    report += `**Generated:** ${trail.timestamp}\n`;
    report += `**Category:** ${trail.category}\n`;
    report += `**Approval Level:** ${trail.approval_level_required}\n`;
    report += `**LLM Fallback Used:** ${trail.llm_fallback_used ? 'Yes' : 'No'}\n`;
    report += `**Output Hash:** ${trail.output_hash}\n\n`;

    report += `## Applied Primitives\n\n`;

    if (primitivesByType.rate) {
        report += `### Rate Primitives\n`;
        primitivesByType.rate.forEach(p => {
            report += `- **${p.id}**: ${p.description} (${p.value}) - Source: ${p.source}\n`;
        });
        report += `\n`;
    }

    if (primitivesByType.calculation) {
        report += `### Calculation Primitives\n`;
        primitivesByType.calculation.forEach(p => {
            report += `- **${p.id}**: ${p.description} → ${p.value}\n`;
        });
        report += `\n`;
    }

    if (primitivesByType.compliance) {
        report += `### Compliance Checks\n`;
        primitivesByType.compliance.forEach(p => {
            report += `- **${p.id}**: ${p.description} - ${p.source}\n`;
        });
        report += `\n`;
    }

    if (primitivesByType.authority) {
        report += `### Authority Primitives\n`;
        primitivesByType.authority.forEach(p => {
            report += `- **${p.id}**: ${p.description} - Threshold: ${p.value}\n`;
        });
        report += `\n`;
    }

    if (trail.applied_primitives.length === 0) {
        report += `*No primitives matched - pure LLM generation used*\n`;
    }

    report += `\n---\n`;
    report += `*This report satisfies EU AI Act (mid-2026) auditability requirements.*\n`;

    return report;
}

// Export audit trail as JSON for storage
export function exportAuditTrailJSON(trail: AuditTrail): string {
    return JSON.stringify(trail, null, 2);
}
