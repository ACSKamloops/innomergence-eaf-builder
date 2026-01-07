
import { EAFRecord } from './types';

/**
 * HISTORICAL DATA TEMPLATE
 * ------------------------
 * This file serves as the "Gold Standard" database for the AI.
 * 
 * INSTRUCTIONS:
 * 1. Add new approved EAF records to the HISTORICAL_DATA array below.
 * 2. The 'category' must match the categories in the app (e.g., "Security", "Staffing/Personnel").
 * 3. The 'description_preview' should be the exact approved text.
 * 4. The 'text_snippet' should be a short summary of the calculation logic used.
 * 
 * The AI uses this data to:
 * - Tune the tone and structure of generated drafts (Few-Shot Prompting).
 * - Provide search results in the "Search Past Approvals" tab.
 */

export const HISTORICAL_DATA: EAFRecord[] = [
  // --- LIVESTOCK EXAMPLES ---
  {
    category: "Livestock Relocation",
    request_number: "24-1541",
    amount: "25,347.50",
    description_preview: "Evacuation Orders and Alerts have been in place since August 6 and the EOC Agriculture Branch Coordinator has been working with livestock producers to relocate and feed evacuated livestock. The EOC has been requested to submit a separate EAF for each producer.\u200b PRODUCER:\u200b Glorybound Holsteins\u200b Wilma Haambuckers\u200b BC Premise ID BC44ATJR9\u200b Total Transportation (include home trip) 13 trailer loads: $3,612.50\u200b Total Feed & Housing (14 days) 57 cows, 41 dry cows & yearlings: $21,735.00\u200b",
    text_snippet: "Math: $3,612.50 (Transport), $21,735.00 (Feed/Housing)",
    filename: "CSRD EAF 2024-19 Req 24-1541 Livestock Relocation_APPROVED.pdf"
  },
  {
    category: "Livestock Relocation",
    request_number: "24-1542",
    amount: "1,803.00",
    description_preview: "PRODUCER:\u200b Ravenwood Acres\u200b Shelley & Brent Work\u200b BC Premise ID BC44F3TGX\u200b Total Transportation (include home trip) 1 trailer load: $340.00\u200b Total Feed & Housing (14 days): $1,463.00\u200b",
    text_snippet: "Math: Transport $340.00 + Feed $1,463.00",
    filename: "CSRD EAF 2024-24 Req 24-1542 Livestock Relocation_APPROVED.pdf"
  },

  // --- SECURITY EXAMPLES ---
  {
    category: "Security",
    request_number: "24-1422",
    amount: "35,000.00",
    description_preview: "Amendment 2 August 11 2024\u200b Additional request from the RCMP has been received to have 1 patrol car for each of the Order locations.\u200b Commencing Aug 8 for a 5 day period \u2013 Patrol car with 2 guards for a 24 hour period is $3,500 per day. \u200b Require 2 patrol cars for 5 days = $35,000\u200b",
    text_snippet: "Math: $3,500/day x 2 cars x 5 days = $35,000",
    filename: "CSRD EAF 2024-20.2 SECOND AMENDED 24-1422 Contracted Security_APPROVED.pdf"
  },
  {
    category: "Security",
    request_number: "23-1645",
    amount: "16,100.00",
    description_preview: "Security team at site of Evacuation Order in Dorian Bay... with checkpoint and roving patrols for 5 days, 24 hours per day.\u200b SEP is requesting monies to cover cost of security. Please see the attached estimate",
    text_snippet: "Duration: 5 days, 24/7 coverage",
    filename: "EAF 2023-08 R23-1645 Security APPROVED.pdf"
  },

  // --- STAFFING EXAMPLES ---
  {
    category: "Staffing/Personnel",
    request_number: "24-1515",
    amount: "9,080.58",
    description_preview: "The Hullcar fire has increased in size and evacuation planning is complicated as planning must include 2 neighbouring jurisdictions... SEP is requesting funds to fill the Evacuation Branch Coordinator position in the Planning Section for a 5 day period starting August 12 and ending on the 17th\u200b. Daily all found rate for a 14 hour day is $1,650 (accommodation included).",
    text_snippet: "Rate: $1,650/day (14hr day, all found)",
    filename: "CSRD EAF 2024-22 Reg 24-1515 Evacuation Branch Coordinator_APPROVED.pdf"
  },
  {
    category: "Staffing/Personnel",
    request_number: "24-1556",
    amount: "4,525.00",
    description_preview: "The EOC requires a temporary contracted employee to provide clerical support... One clerical assistant $35/hr for 35 hours = $1,225.00\u200b One staff to produce the response reimbursement claim... $50/hr for 40 hours = $2,000.00\u200b In addition, the Finance Team anticipates 10 OT hours... $65/hr X 2 (OT) = $130/hr X 10 hours = $1,300",
    text_snippet: "Math: $35/hr x 35hrs; $50/hr x 40hrs; OT $130/hr x 10hrs",
    filename: "CSRD EAF2024-27 Req24-1556 EOC Finance_APPROVED.pdf"
  },
  {
    category: "Staffing/Personnel",
    request_number: "22-0545",
    amount: "3,360.00",
    description_preview: "SEP has 22 sand locations that require replenishment every three days... This will require 6 Logistics personnel at 8 hours per day for 2 days. \u200b SEP is requesting monies to cover the wages for 6 x $35 x 8 hours X 2 days = $3,360.",
    text_snippet: "Math: 6 staff x $35/hr x 8hrs x 2 days = $3,360",
    filename: "EAF 2022-14 R22-0545 SandDelivery APPROVED.pdf"
  },

  // --- SUPPLIES EXAMPLES ---
  {
    category: "Supplies",
    request_number: "24-1522",
    amount: "840.00",
    description_preview: "The EOC presently has 20 workstations operating in a 23ft x 46ft room and noise levels are very elevated. In order to reduce this noise, the EOC would like to outfit each station with a headset. \u200b 20 headsets X $40/ headset = $800, plus $40 delivery charge.\u200b",
    text_snippet: "Math: 20 units x $40 = $800 + $40 delivery",
    filename: "CSRD EAF 2024-23 Req 24-1522 Phone Head Sets APPROVED.pdf"
  },
  {
    category: "Supplies",
    request_number: "24-1476",
    amount: "520.00",
    description_preview: "As part of the wildfire response to secure the Evacuation Order area... security staff has been retained... As the security officers are working 12 hours shifts, they do not have access to toilet facilities... request a portable toilet for two of the checkpoint locations.\u200b The price quote from Trigs Septic is $200/week per unit = $400/week plus a weekly cleaning of $60 \u200b for each unit. TOTAL $520",
    text_snippet: "Math: $200/unit + $60 cleaning. Total $520",
    filename: "CSRD EAF0021 toilet facilities_APPROVED.pdf"
  },

  // --- EQUIPMENT & LOGISTICS EXAMPLES ---
  {
    category: "Logistics/Transport",
    request_number: "23-2295",
    amount: "56,000.00",
    description_preview: "The Anglemont-Squilax Road is completely closed... We require a barge to bring supplies (food, meals, fuel and people) over to the north shore... A quote for a day rate for use of the barge is attached. We anticipate one week at this time\u200b AMENDMENT:\u200b Anglemont remains closed, extension requested for one more week to Sept 8, 2023.\u200b Requested: $56,000",
    text_snippet: "Total: $56,000 for barge extension",
    filename: "EA F2023-51 R23-2295 Barge For Supplies APPROVED AMMEND1.pdf"
  },
  {
    category: "Equipment Rental",
    request_number: "23-2866",
    amount: "3,650.00",
    description_preview: "This funding request is for the costs of the additional maintenance on the Anglemont Water System generators... - All three generators required major maintenance servicing due to the excessive operating hours... - $2,541.00\u200b - The lake pumphouse overheated during the fire and required servicing... - $1,080",
    text_snippet: "Math: Maintenance $2,541 + Servicing $1,080",
    filename: "EAF 2023-96 R23-2866 Water Infrastructure APPROVED.pdf"
  },

  // --- EVACUATION CENTER EXAMPLES ---
  {
    category: "Evacuation Center",
    request_number: "24-1636",
    amount: "2,060.00",
    description_preview: "The CSRD EOC has been activated... SEP has designated the CSRD Boardroom as their main EOC location... In order to facilitate the 2024 EOC activation, the CSRD was required to move all meetings booked for this room... Incremental costs associated with moving these meetings include facility rental and advertising...",
    text_snippet: "Context: Displaced meetings due to EOC activation",
    filename: "CSRD EAF2024-28 Req24-1636 MeetingFacilityRental-02 APPROVED.pdf"
  },

  // --- PASTE NEW RECORDS BELOW ---

  // --- 2022 EXTRACTED EXAMPLES ---

  // Finance Staff - EMBC Reimbursement Claims Prep
  {
    category: "Staffing/Personnel",
    request_number: "Res-104850-225-012822",
    amount: "6,800.00",
    description_preview: "During 2021, the Shuswap EOC was activated for approximately 90 consecutive days responding to 7 major events in the Shuswap. Reception Centres were also activated in response to these events and at one point in July, the Shuswap Emergency Program had three Reception Centres operating at the same time in different locations within their coverage area. As staff work through the EMBC reimbursement claims process, it has become apparent that additional staff will be required. SEP is requesting monies to cover costs for staff/temporary contracted staff (regular, overtime or hours required outside of staff's regularly scheduled shift) for the preparation of financial reimbursement claims. Estimated hourly rate - $45/hour (includes benefits) with an estimate of 14 hours preparation time per EOC and Reception Centre activation: 140 hours x $45 = $6,300. Amount Requested: $6,300.00. Expenditure not to Exceed: $6,800.00",
    text_snippet: "Math: 140 hours x $45/hr = $6,300",
    filename: "EAF2022-01_Res-104850-225-012822_FinanceStaff_APPROVED.pdf"
  },

  // Geotechnical Engineer - Debris Flow Risk Assessment
  {
    category: "Other",
    request_number: "22-0509",
    amount: "5,000.00",
    description_preview: "A post wildfire hazard assessment was conducted by BGC Engineering on the Wiseman, Sicamous, and Hummingbird Creek watersheds on November 23, 2021. Findings: There is a significant amount of debris in the Wiseman Creek Watershed that has a 100% likelihood of developing into a debris flow in the next two years. The debris flow will most likely be triggered by a rainfall event. The spring freshet is the highest risk time for the debris flow. Directly in the flow path of the debris flow is Sicamous Creek Mobile Home Park with 27 units and Hwy 97A. SEP has received funding through FLNRORD to implement an early warning system. After three exceedances of the POSSIBLE rainfall thresholds and one exceedance of LIKELY, it has become necessary to get advice from BGC engineers on the interpretation of the scientific data. SEP is requesting funding approval to cover the costs of scientific interpretations of data provided from the early warning system to ensure the best possible decision making by emergency managers.",
    text_snippet: "Consulting: $5,000 for engineering advice on debris flow risk",
    filename: "EAF2022-04 R22-0509 Engineer APPROVED.pdf"
  },

  // Bridge Debris Removal - Critical Infrastructure Protection
  {
    category: "Equipment Rental",
    request_number: "22-0386",
    amount: "3,500.00",
    description_preview: "Recent snow melt and rain has caused the Eagle River to rise significantly and brought with it copious amounts of large woody debris (trees). The debris continues to pile up against the bridge supports and threatens to damage the structure. The Eagle River has not yet reached its peak level for this season so the force of debris and water is expected to increase along with the risk to the structure. The threatened bridge is a partially completed replacement bridge and asset of the District of Sicamous. Project engineers (ISL) reviewed the conditions and recommend mitigation measures: 1. Remove the existing debris from the upstream and downstream locations 2. Remove the existing debris from under the bridge 3. Keep equipment on site and provide daily inspections 4. Monitor water levels. SEP is requesting funds to cover the cost of renting the appropriate excavator with operator and low bed truck and trailer to remove the debris ASAP before damage can occur.",
    text_snippet: "Equipment: Excavator + operator + lowbed for debris removal",
    filename: "EAF2022-06_R22-0386_BridgeDebrisRemoval_APPROVED.pdf"
  },

  // Logistics Personnel - Sandbag Replenishment
  {
    category: "Staffing/Personnel",
    request_number: "22-0462",
    amount: "4,000.00",
    description_preview: "Lake levels for the Shuswap Lake are projected to reach over 349m which will result in localized flooding throughout the SEP coverage area. SEP is providing sand and sandbags to strategic areas around the Shuswap Lake. As residents continue to undertake measures to protect their properties, SEP will need to replenish sand and sandbags at each of the locations noted on the map. SEP has 20 sand locations that require sandbag replenishment once every three days. This will require 2 Logistics personnel for 8 hours per day for the next 6 days. SEP is requesting monies to cover the wages for 2 x $35/hour x 8 hours X 6 days = $3,360.",
    text_snippet: "Math: 2 staff x $35/hr x 8hrs x 6 days = $3,360",
    filename: "EAF2022-13 R22-0462 LogisticsPersonnel APPROVED.pdf"
  },

  // Pump Rental - Flood Response (Initially declined, then approved)
  {
    category: "Equipment Rental",
    request_number: "22-0707",
    amount: "900.00",
    description_preview: "Lake levels for the Shuswap Lake have reached a level at which the District of Sicamous has had to block the outflows of their storm water system to ensure that lake water does not backflow into their downtown core. This system drains the bulk of the downtown Sicamous core. The District has purchased three pumps which were being used to pump out any water that has been accumulating. However the Sicamous area received a significant amount of rainfall and one of three pumps has gone down. The two remaining pumps cannot keep up with the volume of water. The amount of precipitation the Sicamous area is receiving is above the normal amount and therefore the requirement of this pump could not be anticipated. SEP is requesting monies to cover the cost for the rental of a 3\" pump, including suction and discharge hose for a 1 week period - $90/day for 7 days = $630.",
    text_snippet: "Math: $90/day x 7 days = $630 (approved upon reconsideration - flood response eligible)",
    filename: "EAF2022-16 R22-0707 PumpRental APPROVED.pdf"
  },

  // Truck Rental
  {
    category: "Equipment Rental",
    request_number: "22-0397",
    amount: "3,500.00",
    description_preview: "SEP requires a truck rental for flood response logistics operations. The vehicle is needed to transport sandbags, supplies, and personnel to the 22 designated sand distribution locations throughout the Shuswap Lake coverage area during the freshet response.",
    text_snippet: "Truck rental for logistics transport",
    filename: "EAF2022-07_R22-0397_TruckRental_APPROVED.pdf"
  },

  // Forklift Rental
  {
    category: "Equipment Rental",
    request_number: "22-0526",
    amount: "1,200.00",
    description_preview: "SEP requires forklift rental to assist with the handling and loading of sandbags and flood response supplies at the central staging area. The forklift is needed to efficiently move pallets of pre-filled sandbags to distribution trucks.",
    text_snippet: "Forklift for sandbag handling",
    filename: "EAF2022-10 RR-0526 ForkliftRental APPROVED.pdf"
  },

  // Demob Contractors
  {
    category: "Staffing/Personnel",
    request_number: "22-0820",
    amount: "2,500.00",
    description_preview: "Following the conclusion of the freshet response, SEP requires contracted personnel to assist with the demobilization of response equipment and supplies. This includes collection and return of rental equipment, cleanup of sand distribution sites, and organization of response materials for storage.",
    text_snippet: "Demobilization staff costs",
    filename: "EAF019 R22-0820 DemobContractors APPROVED.pdf"
  },
];
