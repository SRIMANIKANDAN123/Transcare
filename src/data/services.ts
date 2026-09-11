import type { ServiceItem } from "./types";

/** Service catalogue. Future source: `GET /api/services`. */
export const services: ServiceItem[] = [
  {
    id: "hormone-care",
    title: "Hormone Care",
    group: "Gender-Affirming Care",
    description:
      "Find providers offering hormone-related consultations, monitoring and follow-up care.",
    icon: "Pill",
    searchKey: "Hormone Care",
  },
  {
    id: "gender-affirming-care",
    title: "Gender-Affirming Care Information",
    group: "Gender-Affirming Care",
    description:
      "General information about gender-affirming healthcare pathways and providers listing these services.",
    icon: "HeartHandshake",
    searchKey: "Gender-Affirming Care Information",
  },
  {
    id: "post-operative-support",
    title: "Post-operative Support",
    group: "Gender-Affirming Care",
    description: "Providers listing recovery reviews, wound care guidance and follow-up support.",
    icon: "BedDouble",
    searchKey: "Post-operative Support",
  },
  {
    id: "voice-speech",
    title: "Voice & Speech",
    group: "Gender-Affirming Care",
    description: "Voice and communication support from speech-language professionals.",
    icon: "AudioLines",
    searchKey: "Voice & Speech",
  },
  {
    id: "counselling",
    title: "Counselling",
    group: "Mental Healthcare",
    description: "One-to-one counselling for stress, family conversations and everyday wellbeing.",
    icon: "MessagesSquare",
    searchKey: "Counselling",
  },
  {
    id: "psychology",
    title: "Psychology",
    group: "Mental Healthcare",
    description: "Clinical psychology consultations and structured therapy programmes.",
    icon: "Brain",
    searchKey: "Psychology",
  },
  {
    id: "psychiatry",
    title: "Psychiatry",
    group: "Mental Healthcare",
    description: "Psychiatry outpatient services at hospitals and specialised centres.",
    icon: "Stethoscope",
    searchKey: "Psychiatry",
  },
  {
    id: "support-groups",
    title: "Support Groups",
    group: "Mental Healthcare",
    description: "Peer support groups hosted by clinics and community organisations.",
    icon: "Users",
    searchKey: "Support Groups",
  },
  {
    id: "primary-care",
    title: "Primary Care",
    group: "General Healthcare",
    description: "Everyday healthcare — consultations, check-ups and referrals.",
    icon: "Activity",
    searchKey: "Primary Care",
  },
  {
    id: "dental",
    title: "Dental",
    group: "General Healthcare",
    description: "Dental consultations and routine oral healthcare.",
    icon: "Smile",
    searchKey: "Dental",
  },
  {
    id: "dermatology",
    title: "Dermatology",
    group: "General Healthcare",
    description: "Skin, hair and general dermatology consultations.",
    icon: "Sparkles",
    searchKey: "Dermatology",
  },
  {
    id: "reproductive-healthcare",
    title: "Reproductive Healthcare",
    group: "General Healthcare",
    description: "Reproductive and sexual healthcare services and screenings.",
    icon: "HeartPulse",
    searchKey: "Reproductive Healthcare",
  },
  {
    id: "diagnostics",
    title: "Diagnostics",
    group: "General Healthcare",
    description: "Laboratory tests, imaging and monitoring services.",
    icon: "FlaskConical",
    searchKey: "Diagnostics",
  },
  {
    id: "telehealth",
    title: "Telehealth",
    group: "Other Support",
    description: "Providers offering online consultations and remote follow-up.",
    icon: "Video",
    searchKey: "Telehealth",
  },
  {
    id: "pharmacy-information",
    title: "Pharmacy Information",
    group: "Other Support",
    description: "Where to ask about prescriptions, availability and generic options.",
    icon: "Store",
    searchKey: "Pharmacy Information",
  },
  {
    id: "community-support",
    title: "Community Support",
    group: "Other Support",
    description: "Community organisations offering guidance, escorts and peer help.",
    icon: "Handshake",
    searchKey: "Community Support",
  },
];

export const serviceGroups = [
  "Gender-Affirming Care",
  "Mental Healthcare",
  "General Healthcare",
  "Other Support",
] as const;

/** Home page category cards mapped to Explore filters. */
export const homeCategories = [
  {
    title: "Hospitals & Clinics",
    description: "Find inclusive healthcare facilities.",
    icon: "Hospital",
    search: { type: "Hospitals" },
  },
  {
    title: "Doctors & Specialists",
    description: "Discover relevant healthcare professionals.",
    icon: "Stethoscope",
    search: { type: "Clinics" },
  },
  {
    title: "Hormone / HRT Care",
    description: "Find providers offering hormone-related care.",
    icon: "Pill",
    search: { service: "Hormone Care" },
  },
  {
    title: "Mental Healthcare",
    description: "Find counselling and mental healthcare resources.",
    icon: "Brain",
    search: { service: "Counselling" },
  },
  {
    title: "Gender-Affirming Care",
    description: "Explore information and relevant providers.",
    icon: "HeartHandshake",
    search: { service: "Gender-Affirming Care Information" },
  },
  {
    title: "Voice & Speech Therapy",
    description: "Find voice and communication support.",
    icon: "AudioLines",
    search: { service: "Voice & Speech" },
  },
] as const;
