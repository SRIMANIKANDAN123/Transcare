export type Affordability = "Low cost" | "Moderate" | "Premium";

export type ProviderType =
  | "Government Hospital"
  | "Private Hospital"
  | "Community Clinic"
  | "Clinic"
  | "Mental Healthcare Centre"
  | "Support Organisation";

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  sector: "Government" | "Private" | "NGO";
  location: string;
  city: string;
  services: string[];
  distanceKm: number;
  /** Prototype directory listing status — never a real-world verification claim. */
  listingStatus: "Directory listed" | "Community suggested";
  affordability: Affordability;
  consultationRange: string;
  assistanceAvailable: boolean;
  teleconsultation: boolean;
  accessibility: string[];
  languages: string[];
  professionals: { name: string; role: string }[];
  schemes: string[];
  contact: string;
  website: string;
  coordinates: { lat: number; lng: number };
  image: string;
  about: string;
  hours: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  providerId: string;
  city: string;
  languages: string[];
  experienceYears: number;
  focusAreas: string[];
  consultationRange: string;
  teleconsultation: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  group: "Gender-Affirming Care" | "Mental Healthcare" | "General Healthcare" | "Other Support";
  description: string;
  icon: string;
  searchKey: string;
}

export interface Scheme {
  id: string;
  name: string;
  authority: string;
  level: "Central" | "State";
  overview: string;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  applicationSteps: string[];
  officialSource: string;
  lastUpdated: string;
  category: "Health insurance" | "Identity & welfare" | "Financial assistance";
}

export interface Organisation {
  id: string;
  name: string;
  type:
    | "Mental Healthcare"
    | "NGO"
    | "Community Organisation"
    | "Financial Assistance"
    | "Legal Support"
    | "Crisis Support";
  city: string;
  services: string[];
  contact: string;
  website: string;
  note: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
  body: string[];
}
