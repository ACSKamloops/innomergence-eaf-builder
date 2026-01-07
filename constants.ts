import { EAFTemplate, AuditRule } from './types';

export const BCEMS_GOALS = [
  "Provide for the safety and health of all responders",
  "Save lives",
  "Reduce suffering",
  "Protect public health",
  "Protect government infrastructure",
  "Protect property",
  "Protect the environment",
  "Reduce economic and social losses"
];

export const CATEGORIES = [
  "Livestock Relocation",
  "Security",
  "Evacuation Center",
  "Logistics/Transport",
  "Equipment Rental",
  "Staffing/Personnel",
  "Supplies",
  "Other"
];

export const CATEGORY_DETAILS: Record<string, string> = {
  "Livestock Relocation": "Transport, feed, and housing for evacuated commercial livestock.",
  "Security": "Contracted patrols for evacuated zones or critical infrastructure protection.",
  "Evacuation Center": "Group lodging facilities, janitorial services, and basic evacuee support.",
  "Logistics/Transport": "Movement of resources, equipment, or evacuees via commercial carriers.",
  "Equipment Rental": "Heavy machinery or specialized tools required for response operations.",
  "Staffing/Personnel": "Overtime, backfill, or specialized roles (not regular wages).",
  "Supplies": "Consumables like sandbags, food/water for EOC, or safety gear.",
  "Other": "Unique requests directly mitigating imminent threats not covered above."
};

export const EQUIPMENT_RATES = [
  {id:"exc-mini",name:"Mini Excavator (< 10,000 lbs)",rate:105,unit:"Hour"},
  {id:"exc-150",name:"Excavator (120-160 size)",rate:145,unit:"Hour"},
  {id:"exc-200",name:"Excavator (200 size)",rate:165,unit:"Hour"},
  {id:"doz-d6",name:"Dozer (D6 / Cat 6 equivalent)",rate:185,unit:"Hour"},
  {id:"trk-pu",name:"Pickup Truck (4x4)",rate:120,unit:"Day"},
  {id:"trk-water",name:"Water Tender (2000-3000 Gal)",rate:140,unit:"Hour"},
  {id:"gen-20kw",name:"Generator (20kW Towable)",rate:250,unit:"Week"},
  {id:"toilet",name:"Portable Toilet (Standard)",rate:150,unit:"Month"}
];

export const TEMPLATES: EAFTemplate[] = [
  {
    id: "livestock-reloc",
    category: "Livestock Relocation",
    name: "Livestock Relocation & Feed",
    fields: [
      { id: "producer", label: "Producer Name", type: "text", placeholder: "Glorybound Holsteins" },
      { id: "animalCount", label: "Number of Animals", type: "number", placeholder: "50" },
      { id: "animalType", label: "Type of Livestock", type: "select", options: ["Cattle", "Dairy Cows", "Horses", "Sheep", "Goats", "Poultry", "Swine"] },
      { id: "days", label: "Duration (Days)", type: "number", placeholder: "14" },
      { id: "location", label: "Evacuation From", type: "text", placeholder: "Hullcar Mountain area" },
      { id: "rate", label: "Daily Feed Rate", type: "number", prefix: "$", warning: "Check Policy 2.01 Rates" }
    ],
    baseText: (t) => `The EOC is activated in response to the ${t.location || "[LOCATION]"} fire. 
Evacuation Orders and Alerts have been in place. 
The EOC Agriculture Branch Coordinator has been working with livestock producer ${t.producer || "[PRODUCER]"} to relocate and feed evacuated livestock.

Details:
- ${t.animalCount || "[#]"} ${t.animalType || "[ANIMALS]"}
- Duration: ${t.days || "[#]"} days
- Feed/Housing Rate: $${t.rate || "0.00"}/day

Total estimated cost for feed and housing is calculated based on EMCR Policy 2.01 rates.`
  },
  {
    id: "security-patrol",
    category: "Security",
    name: "Security Patrol Services",
    fields: [
      { id: "vendor", label: "Security Company", type: "text", placeholder: "Vadium Security" },
      { id: "location", label: "Patrol Area", type: "text", placeholder: "Evacuated Zone A" },
      { id: "units", label: "Number of Patrol Units", type: "number", placeholder: "2" },
      { id: "requestor", label: "Requested By", type: "select", options: ["RCMP", "EOC Director", "Operations Chief"] },
      { id: "reason", label: "Primary Objective", type: "text", placeholder: "protect critical infrastructure and prevent looting" },
      { id: "rate", label: "Hourly/Daily Rate", type: "number", prefix: "$" },
      { id: "days", label: "Duration (Days)", type: "number", placeholder: "5" }
    ],
    baseText: (t) => `Contracted security services required from ${t.vendor || "[VENDOR]"} to provide ${t.units || "[#]"} patrol units for ${t.location || "[AREA]"}.
This resource was explicitly requested by ${t.requestor || "[AUTHORITY]"} to ${t.reason || "[OBJECTIVE]"} while the area remains under Evacuation Order.

Costs include vehicle and personnel rates consistent with provincial standards.`
  },
  {
    id: "evac-center",
    category: "Evacuation Center",
    name: "ESS Group Lodging/Facility",
    fields: [
      { id: "facility", label: "Facility Name", type: "text", placeholder: "Community Hall" },
      { id: "capacity", label: "Capacity (People)", type: "number", placeholder: "100" },
      { id: "services", label: "Services Provided", type: "text", placeholder: "Cot setup, food services, registration" },
      { id: "cost", label: "Facility Rental Cost", type: "number", prefix: "$" },
      { id: "janitorial", label: "Janitorial/Cleaning", type: "number", prefix: "$" }
    ],
    baseText: (t) => `Activation of ${t.facility || "[FACILITY]"} to serve as a Group Lodging facility for approximately ${t.capacity || "[#]"} evacuees.
Services required include: ${t.services || "[SERVICES]"}.

Costs cover:
- Facility rental for active ESS operations
- Additional janitorial services to maintain hygiene standards during high-volume usage ($${t.janitorial || "0.00"})`
  },
  {
    id: "logistics",
    category: "Logistics/Transport",
    name: "Transport & Hauling",
    fields: [
      { id: "type", label: "Transport Type", type: "select", options: ["Busing for Evacuees", "Equipment Hauling", "Water Hauling", "Fuel Delivery"] },
      { id: "vendor", label: "Vendor", type: "text", placeholder: "ABC Transport" },
      { id: "route", label: "Route / Location", type: "text", placeholder: "From Sector 4 to Reception Center" },
      { id: "trips", label: "Est. Number of Trips", type: "number", placeholder: "1" },
      { id: "rate", label: "Cost per Trip/Hour", type: "number", prefix: "$" }
    ],
    baseText: (t) => `Requesting ${t.type || "[TYPE]"} services from ${t.vendor || "[VENDOR]"}.
Objective: Transport required ${t.route ? `along route: ${t.route}` : "to support operations"}.

Estimated Volume: ${t.trips || "[#]"} trips/loads.
Rate: $${t.rate || "0.00"} per unit.
Essential for ensuring timely movement of resources/evacuees out of the hazard zone.`
  },
  {
    id: "equipment-rental",
    category: "Equipment Rental",
    name: "Heavy Equipment Rental",
    fields: [
      { id: "equipment", label: "Equipment Type", type: "text", placeholder: "Excavator (20 ton)" },
      { id: "task", label: "Task/Objective", type: "text", placeholder: "construct fire guards" },
      { id: "rate", label: "Hourly/Daily Rate", type: "number", prefix: "$", warning: "Must match Blue Book rate" },
      { id: "unit", label: "Rate Unit", type: "select", options: ["Hour", "Day", "Week"] },
      { id: "duration", label: "Estimated Duration", type: "number" }
    ],
    baseText: (t) => `Rental of ${t.equipment || "[EQUIPMENT]"} required to ${t.task || "[TASK]"} in support of response operations.
Rate: $${t.rate || "0.00"} per ${t.unit || "Hour"}.
Duration: ${t.duration || "[#]"} ${t.unit || "Hour"}s.

Rate has been verified against the Blue Book Equipment Rental Rate Guide.`
  },
  {
    id: "staffing",
    category: "Staffing/Personnel",
    name: "Staffing & Overtime",
    fields: [
      { id: "role", label: "Role / Position", type: "text", placeholder: "Clerical Support" },
      { id: "section", label: "EOC Section", type: "select", options: ["Finance", "Logistics", "Operations", "Planning", "Command"] },
      { id: "reason", label: "Reason for Hire", type: "text", placeholder: "Backfill for regular staff or Overtime surge" },
      { id: "rate", label: "Hourly Rate", type: "number", prefix: "$", warning: "Base wages ineligible. Overtime/Backfill only." },
      { id: "hours", label: "Total Hours", type: "number", placeholder: "40" }
    ],
    baseText: (t) => `Request to cover costs for ${t.role || "[ROLE]"} to assist the ${t.section || "[SECTION]"} Section.
Justification: ${t.reason || "[REASON]"}.
Details:
- Rate: $${t.rate || "0.00"}/hr
- Total Estimated Hours: ${t.hours || "[#]"}

Note: This request applies only to eligible incremental costs (overtime/backfill) as per EMCR guidelines.`
  },
  {
    id: "supplies",
    category: "Supplies",
    name: "EOC Supplies & Materials",
    fields: [
      { id: "item", label: "Item Description", type: "text", placeholder: "Sandbags / Office Supplies" },
      { id: "quantity", label: "Quantity", type: "number", placeholder: "1000" },
      { id: "purpose", label: "Usage", type: "text", placeholder: "Flood mitigation" },
      { id: "cost", label: "Total Cost", type: "number", prefix: "$", warning: "Assets >$100 require pre-approval" }
    ],
    baseText: (t) => `Purchase of ${t.quantity || "[#]"} x ${t.item || "[ITEM]"} required for ${t.purpose || "[PURPOSE]"}.
These supplies are essential for immediate response operations and public safety.
Inventory will be tracked and managed by the Logistics Section.`
  }
];

export const AUDIT_RULES: AuditRule[] = [
  { trigger: "upgrade", suggestion: "restore", reason: "Betterment is not eligible. Use \"restore\" or \"repair\".", severity: "danger" },
  { trigger: "improve", suggestion: "repair", reason: "Improvements are considered capital upgrades. Focus on returning to pre-disaster condition.", severity: "warning" },
  { trigger: "future", suggestion: "imminent", reason: "Prevention of future events is generally not eligible. Focus on the current imminent threat.", severity: "danger" },
  { trigger: "training", suggestion: "just-in-time briefing", reason: "General training is not eligible during response. Only specific safety briefings.", severity: "warning" },
  { trigger: "standby", suggestion: "active patrol", reason: "Paying for assets to sit idle is often rejected. Ensure they are \"active\" or \"staged for immediate use\".", severity: "warning" },
  { trigger: "purchase", suggestion: "rental", reason: "Capital purchases >$100 require strict pre-approval. Rentals are preferred.", severity: "warning" },
  { trigger: "landscaping", suggestion: "debris removal", reason: "Landscaping is not eligible unless essential to public welfare.", severity: "warning" },
  { trigger: "renovation", suggestion: "restoration", reason: "Renovations imply betterment. Use restoration to pre-disaster condition.", severity: "warning" }
];

export const POLICY_INFO: Record<string, { rules: string[], tips: string[], ineligible: string[], primer: string }> = {
  "Livestock Relocation": {
    rules: [
      "Eligible: Evacuation, shelter, and feed for commercial livestock (cattle, horses, sheep, goats, etc.) and poultry.",
      "Eligible: Restoration of facilities used for livestock sheltering.",
      "Must define 'Livestock' per BC Range Act definitions.",
      "Requires defining producer name and specific animal counts."
    ],
    tips: [
      "Track all transport hours and feed receipts.",
      "Submit separate EAFs for different producers if requested by PREOC.",
      "Reference specific Evacuation Order numbers.",
      "Rates must align with EMCR Policy 2.01."
    ],
    ineligible: [
      "Rescue, relocation, or evacuation of pets (dogs, cats, etc).",
      "Backyard or hobby animals not defined as commercial livestock.",
      "Loss of animals (compensation is separate from response/EAF).",
      "Veterinary costs for pre-existing conditions."
    ],
    primer: "Drafting strategy: Frame this as an animal welfare necessity to prevent loss of commercial livestock assets. Explicitly state that this is for commercial animals (cattle, horses, sheep, etc.) and NOT pets. If asking for feed, specify it is for the evacuation period only. Reference 'Policy 2.01'."
  },
  "Security": {
    rules: [
      "Eligible: Contract security to patrol evacuated neighborhoods or zones.",
      "Eligible: Implementation of special security measures to protect public safety.",
      "Eligible: Security for EOC or response facilities.",
      "Eligible: Mutual aid from other municipal police forces (incremental costs only)."
    ],
    tips: [
      "Specify the exact area/zone being patrolled.",
      "Explicitly link security to public safety or property protection in evacuated areas.",
      "Clarify if requested by RCMP or EOC Director.",
      "Rate must be consistent with provincial standards."
    ],
    ineligible: [
      "Security for private facilities (unless protecting public safety).",
      "RCMP costs managed through provincial contract (claim via Police Services Division).",
      "Normal police operations.",
      "Protection of private assets not related to public safety."
    ],
    primer: "Drafting strategy: You must link this request to 'Public Safety' and 'Order Enforcement'. State that security is required to man checkpoints or patrol evacuated zones to prevent unauthorized entry and looting. Mention if this was requested by the RCMP or EOC Director. Avoid implying protection of specific private commercial assets unless critical infrastructure."
  },
  "Evacuation Center": {
    rules: [
      "Eligible: Facility rental for group lodging (if not owned by local authority).",
      "Eligible: Incremental janitorial services and utilities for duration of use.",
      "Eligible: Materials/supplies required to operate reception centres.",
      "Eligible: Food, clothing, and shelter for evacuees (ESS)."
    ],
    tips: [
      "Document pre-existing damage before occupancy.",
      "Track number of evacuees daily.",
      "If using own facility, claim incremental costs only (no rental fee).",
      "Reference ESS Referrals process."
    ],
    ineligible: [
      "Rental of own community hall/facility (loss of revenue/use not eligible).",
      "Permanent upgrades to community centers.",
      "Regular scheduled maintenance.",
      "Capital assets >$100 without prior PREOC approval."
    ],
    primer: "Drafting strategy: Focus on 'Life Safety' and 'Humanitarian Support'. Describe the facility as essential for housing displaced residents (ESS). Emphasize that costs are for 'Incremental' usage (janitorial, utilities) above normal operating costs. Mention 'Group Lodging' capacity."
  },
  "Logistics/Transport": {
    rules: [
      "Eligible: Transporting evacuees out of risk areas.",
      "Eligible: Hauling equipment or supplies to staging areas.",
      "Eligible: Removal of hazardous materials/assets from immediate risk.",
      "Eligible: Emergency health arrangements and transport of casualties."
    ],
    tips: [
      "Keep logs of start/stop times, locations, and mileage.",
      "Ensure commercial vehicle safety standards.",
      "Justify 'Essential' nature of transport (e.g. 'removal from immediate risk')."
    ],
    ineligible: [
      "Transport for non-essential personnel.",
      "Commuting costs for regular staff.",
      "Vehicle repairs (unless insurance deductible applies & damage occurred during response).",
      "Normal operating costs of government vehicles."
    ],
    primer: "Drafting strategy: Focus on the movement of essential resources or vulnerable populations to safety. Use terms like 'Emergency Transport' and 'Immediate Removal'. Ensure the start and end points imply moving away from a hazard."
  },
  "Equipment Rental": {
    rules: [
      "Eligible: Rented equipment needed for response objectives.",
      "Rates must not exceed the 'Blue Book' (Equipment Rental Rate Guide).",
      "Eligible: Fuel/oil for local authority owned equipment consumed during event."
    ],
    tips: [
      "Check Blue Book rates before contracting.",
      "Justify 'Wet' vs 'Dry' rental rates.",
      "If rate exceeds Blue Book, provide strong justification or expect cap.",
      "Attach 'Goods and Services Received' stamp to invoices."
    ],
    ineligible: [
      "Usage charges for own (local authority) equipment.",
      "Purchase of special equipment (unless cheaper than rental & pre-approved).",
      "Normal operating costs of government equipment.",
      "Standby time (unless critical and pre-approved)."
    ],
    primer: "Drafting strategy: Use the phrase 'Constructing Emergency Protective Works' or 'Fire Guard Creation'. State that rates align with the 'Blue Book'. The justification must be to mitigate an 'Imminent Threat' to property or infrastructure."
  },
  "Staffing/Personnel": {
    rules: [
      "Eligible: Paid overtime costs for regular staff (incremental only).",
      "Eligible: Costs for backfilling regular positions assigned to EOC.",
      "Eligible: Travel and food for staff (per employment agreement/policy Group 1 or 2 rates).",
      "Eligible: Temporary hires for response work."
    ],
    tips: [
      "Submit timesheets verifying dates/hours vs regular hours.",
      "Must specify 'Overtime' or 'Backfill' clearly.",
      "Union agreements apply for rates.",
      "Reference PEP Task Number on all timesheets."
    ],
    ineligible: [
      "Base salaries or regular wages of permanent employees.",
      "Banked overtime (CTO) unless paid out.",
      "Excessive overtime rates beyond agreements.",
      "Staffing for normal operations."
    ],
    primer: "Drafting strategy: Clearly distinguish that this is for 'Overtime' or 'Backfill' and not regular wages. State the specific EOC role and that the work is directly related to the response event. Mention 'Surge Capacity' necessity."
  },
  "Supplies": {
    rules: [
      "Eligible: Consumables (sandbags, food/water for EOC, office supplies).",
      "Eligible: Items essential for preserving public safety.",
      "Eligible: Protective health and sanitation supplies."
    ],
    tips: [
      "Capital assets >$100 require pre-approval (EAF).",
      "Keep inventory records for stock replenishment claims.",
      "Justify 'Safety' or 'EOC Operations' relevance.",
      "Verify 'Goods and Services Received' on invoices."
    ],
    ineligible: [
      "Stockpiling for future events.",
      "Items for normal operations.",
      "Clothing/personal items (unless safety gear or volunteer reimbursement).",
      "Alcohol."
    ],
    primer: "Drafting strategy: Justify these as 'Consumables' required for the immediate operation of the EOC or safety of responders. If food/water, specify it is for 'EOC Staff' or 'Responders' unable to leave their posts."
  },
  "Other": {
    rules: [
      "Must be directly related to 'Imminent Threat' or 'Response'.",
      "Must be incremental to regular operations.",
      "Response: Actions to determine area/extent of disaster.",
      "Response: Containment (protective works)."
    ],
    tips: [
      "When in doubt, provide extreme detail on 'Why' this is needed now.",
      "Consult PREOC for unusual requests.",
      "Use EAF to confirm eligibility before spending.",
      "Do not lump multiple disparate items in one EAF if possible."
    ],
    ineligible: [
      "Capital projects/betterment.",
      "Budget shortfalls from other departments.",
      "Business interruption losses.",
      "Loss of tax base.",
      "Preventative measures for future events."
    ],
    primer: "Drafting strategy: This is a catch-all. You must work harder to justify 'Imminent Threat'. Explain exactly HOW this expense saves lives, reduces suffering, or protects critical infrastructure. If it's a unique purchase, explain why renting was not an option."
  }
};