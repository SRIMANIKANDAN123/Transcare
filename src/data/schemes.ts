import type { Scheme } from "./types";

/**
 * DEMO CONTENT — simplified prototype summaries written for a student project.
 * Nothing here is an official rule. Future source: `GET /api/schemes`.
 */
export const schemes: Scheme[] = [
  {
    id: "ayushman-bharat-pmjay",
    name: "Ayushman Bharat PM-JAY",
    authority: "National Health Authority, Government of India",
    level: "Central",
    category: "Health insurance",
    overview:
      "A central government health insurance programme that covers hospitalisation costs for eligible families at empanelled hospitals. This is a simplified summary — always check the official portal.",
    eligibility: [
      "Eligibility is decided by official government criteria, not by TransCare",
      "Check your household status on the official portal or at a nearby empanelled hospital help desk",
      "Carry an identity document when you ask a help desk to check for you",
    ],
    benefits: [
      "Cashless treatment at empanelled hospitals for covered procedures",
      "Cover applies per family, per year as defined by the scheme",
      "Help desks at empanelled hospitals assist with verification",
    ],
    documents: [
      "Government-issued photo identity",
      "Ration card or family identifier, where requested",
      "Scheme card, if already issued",
    ],
    applicationSteps: [
      "Visit the official scheme portal or an empanelled hospital help desk",
      "Ask the help desk to verify your household eligibility",
      "Complete verification with your identity documents",
      "Collect your scheme card details and confirm covered procedures before treatment",
    ],
    officialSource: "https://pmjay.gov.in",
    lastUpdated: "Reviewed recently — confirm details on the official portal",
  },
  {
    id: "transgender-identity-card",
    name: "National Portal for Transgender Persons — identity certificate & card",
    authority: "Ministry of Social Justice & Empowerment",
    level: "Central",
    category: "Identity & welfare",
    overview:
      "An online application route for a transgender identity certificate and card, which many welfare and healthcare desks accept as proof of identity. Simplified summary — always check the official portal.",
    eligibility: [
      "Applicants apply on their own behalf through the official national portal",
      "Requirements and processing are defined by the issuing authority",
    ],
    benefits: [
      "A recognised identity document accepted at many service desks",
      "Often requested when applying for welfare or assistance programmes",
    ],
    documents: [
      "Proof of address",
      "Photograph as specified by the portal",
      "Any additional documents the portal requests during the application",
    ],
    applicationSteps: [
      "Register on the official national portal",
      "Complete the application form online",
      "Upload the documents the portal asks for",
      "Track the application status on the portal until the certificate and card are issued",
    ],
    officialSource: "https://transgender.dosje.gov.in",
    lastUpdated: "Reviewed recently — confirm details on the official portal",
  },
  {
    id: "state-health-insurance-demo",
    name: "State health insurance scheme",
    authority: "State health department",
    level: "State",
    category: "Health insurance",
    overview:
      "Most states run their own health insurance or assistance programme alongside central schemes. Check your state health department for the current programme and its terms.",
    eligibility: [
      "Residency and income conditions are set by the state department",
      "Confirm current conditions with the state health office or an empanelled hospital",
    ],
    benefits: [
      "Support towards hospitalisation and listed procedures",
      "Coverage lists differ between states",
    ],
    documents: [
      "State residence proof",
      "Government-issued photo identity",
      "Income or family documents, where requested",
    ],
    applicationSteps: [
      "Identify the scheme run by your state health department",
      "Visit the state scheme portal or a government hospital help desk",
      "Submit the documents listed by that scheme",
      "Confirm which hospitals accept the scheme before treatment",
    ],
    officialSource: "Refer to your state health department portal",
    lastUpdated: "Summary only — confirm details with the authority",
  },
  {
    id: "welfare-assistance-demo",
    name: "Welfare board assistance",
    authority: "State social welfare department (placeholder)",
    level: "State",
    category: "Financial assistance",
    overview:
      "Several states operate welfare boards that provide assistance, education support or livelihood support for transgender people. Check your state welfare board for the current terms.",
    eligibility: [
      "Conditions are set by the state welfare board",
      "An identity certificate or card is commonly requested",
    ],
    benefits: [
      "Assistance amounts and categories vary by state",
      "Some boards also help with healthcare-related expenses",
    ],
    documents: [
      "Transgender identity certificate or card, where applicable",
      "Address proof",
      "Bank account details",
    ],
    applicationSteps: [
      "Contact the state social welfare office or a community organisation",
      "Ask which assistance categories are currently open",
      "Submit the application with the requested documents",
      "Follow up with the office for status updates",
    ],
    officialSource: "Refer to your state social welfare department",
    lastUpdated: "Summary only — confirm details with the authority",
  },
  {
    id: "hospital-assistance-fund-demo",
    name: "Hospital patient assistance fund",
    authority: "Individual hospitals and charitable trusts (placeholder)",
    level: "State",
    category: "Financial assistance",
    overview:
      "Many hospitals and trusts run internal assistance funds or concession slabs. TransCare shows where to ask; amounts are always decided by the hospital.",
    eligibility: [
      "Decided case by case by the hospital or trust",
      "Usually assessed by a medical social worker",
    ],
    benefits: [
      "Partial concessions on consultation, diagnostics or procedures",
      "Instalment options at some hospitals",
    ],
    documents: [
      "Hospital registration or case number",
      "Identity proof",
      "Income documents, if the hospital asks",
    ],
    applicationSteps: [
      "Ask the hospital reception for the patient assistance or social work desk",
      "Explain your situation and request the concession process",
      "Submit documents to the assistance desk",
      "Get the approved concession in writing before treatment where possible",
    ],
    officialSource: "Ask the hospital's patient assistance desk directly",
    lastUpdated: "Summary only — confirm details with the authority",
  },
];
