/**
 * Primitives Loader
 * Loads and parses YAML primitive files for use in EAF Builder
 * Provides type-safe access to rates, calculations, authorities, and compliance rules
 */

// Note: In a browser environment without a YAML parser bundled,
// these would need to be pre-compiled to JSON at build time.
// For now, we export the primitives as TypeScript objects.

export interface RatePrimitive {
    description: string;
    rate: number | [number, number]; // single rate or range
    unit: 'hour' | 'day' | 'week' | 'month';
    source: string;
    triggers: string[];
}

export interface CalculationFormula {
    pattern: string;
    examples: {
        description: string;
        calculation: string;
        breakdown: Record<string, number>;
    }[];
}

export interface ApprovalThreshold {
    max_amount: number | null;
    title: string;
    requires: string[];
    can_approve: string[];
    cannot_approve: string[];
}

export interface BannedTerm {
    term: string;
    safe_alternative: string;
    reason: string;
    severity: 'danger' | 'warning' | 'info';
}

// Primitive lookup function
export function findRateByTrigger(
    input: string,
    rates: Record<string, Record<string, RatePrimitive>>
): RatePrimitive | null {
    const normalizedInput = input.toLowerCase();

    for (const category of Object.values(rates)) {
        for (const rate of Object.values(category)) {
            if (rate.triggers?.some(trigger =>
                normalizedInput.includes(trigger.toLowerCase())
            )) {
                return rate;
            }
        }
    }
    return null;
}

// Compliance checker
export function checkCompliance(
    text: string,
    bannedTerms: BannedTerm[]
): { passed: boolean; violations: BannedTerm[] } {
    const normalizedText = text.toLowerCase();
    const violations: BannedTerm[] = [];

    for (const term of bannedTerms) {
        if (normalizedText.includes(term.term.toLowerCase())) {
            violations.push(term);
        }
    }

    return {
        passed: violations.length === 0,
        violations
    };
}

// Approval level determiner
export function getRequiredApprovalLevel(
    amount: number,
    thresholds: Record<string, ApprovalThreshold>
): string {
    if (amount <= (thresholds.eoc_director?.max_amount ?? 0)) {
        return 'EOC Director';
    }
    if (amount <= (thresholds.preoc_director?.max_amount ?? 0)) {
        return 'PREOC Director';
    }
    return 'Provincial Coordinator';
}

// Calculate total from formula
export function calculateFromBreakdown(
    formula: 'equipment_rental' | 'staffing' | 'livestock_feed' | 'supplies',
    values: Record<string, number>
): number {
    switch (formula) {
        case 'equipment_rental':
            return (values.quantity || 1) * values.rate * values.duration;
        case 'staffing':
            return values.workers * values.rate * values.hours_per_day * values.days;
        case 'livestock_feed':
            return values.head_count * values.daily_rate * values.days;
        case 'supplies':
            return values.quantity * values.unit_cost;
        default:
            return 0;
    }
}

// Generate math breakdown string
export function generateMathBreakdown(
    formula: 'equipment_rental' | 'staffing' | 'livestock_feed',
    values: Record<string, number>
): string {
    const total = calculateFromBreakdown(formula, values);

    switch (formula) {
        case 'equipment_rental':
            return `${values.quantity || 1} x $${values.rate}/hr x ${values.duration} hours = $${total.toLocaleString()}`;
        case 'staffing':
            return `${values.workers} x $${values.rate}/hr x ${values.hours_per_day} hours x ${values.days} days = $${total.toLocaleString()}`;
        case 'livestock_feed':
            return `${values.head_count} head x $${values.daily_rate}/day x ${values.days} days = $${total.toLocaleString()}`;
        default:
            return '';
    }
}
