import type { Article } from "./types";

/** General educational information only. Future source: `GET /api/articles`. */
export const articles: Article[] = [
  {
    id: "understanding-gender-affirming-healthcare",
    title: "Understanding gender-affirming healthcare",
    category: "Healthcare basics",
    summary:
      "What the term generally covers, the kinds of services involved and why care pathways differ from person to person.",
    readTime: "5 min read",
    body: [
      "Gender-affirming healthcare is a broad term for health services that support a person's gender identity. It can include primary healthcare, counselling, hormone-related care, voice and communication support, and in some cases surgical care.",
      "There is no single pathway. People choose different combinations of services at different times, and many people use only some of them. Decisions are made together with qualified healthcare professionals.",
      "TransCare provides general information and helps you discover providers. It does not diagnose conditions, prescribe treatment or recommend a pathway for any individual.",
    ],
  },
  {
    id: "understanding-hormone-therapy",
    title: "Understanding hormone-related care",
    category: "Healthcare basics",
    summary:
      "Why hormone-related care is always supervised, what consultations usually involve and what questions to ask a professional.",
    readTime: "6 min read",
    body: [
      "Hormone-related care is prescribed and monitored only by qualified healthcare professionals such as endocrinologists or trained physicians. Monitoring usually includes periodic consultations and laboratory tests.",
      "A first consultation commonly covers your health history, current medicines, and the tests a professional may want before discussing options.",
      "This page does not contain doses, medicine names or self-treatment guidance. Never start, stop or change hormone medicines without a qualified professional.",
    ],
  },
  {
    id: "finding-the-right-professional",
    title: "Finding the right healthcare professional",
    category: "Getting care",
    summary:
      "How to compare specialities, languages, distance and cost so that a first appointment feels comfortable.",
    readTime: "4 min read",
    body: [
      "Start from the service you need rather than a specific hospital. Explore lets you filter by service, provider type, distance and affordability.",
      "Practical factors matter: languages spoken, travel time, appointment timings and whether online consultations are offered.",
      "It is reasonable to ask a clinic, before booking, how their staff address patients and which documents you should bring.",
    ],
  },
  {
    id: "preparing-for-a-consultation",
    title: "Preparing for a healthcare consultation",
    category: "Getting care",
    summary: "A simple checklist for documents, questions and notes to carry to an appointment.",
    readTime: "4 min read",
    body: [
      "Carry a photo identity document, any previous prescriptions or reports, and a short list of current medicines.",
      "Write down two or three questions you want answered. It helps to note what you want from the visit — a review, a referral, or information.",
      "You can bring a friend or a community volunteer along. Many organisations offer companion support for first visits.",
    ],
  },
  {
    id: "understanding-healthcare-costs",
    title: "Understanding healthcare costs",
    category: "Affordability",
    summary:
      "What consultation, diagnostics and follow-up costs usually include, and how to ask for an estimate.",
    readTime: "5 min read",
    body: [
      "Costs typically fall into consultation fees, diagnostics, medicines and follow-up reviews. Government facilities are usually the lowest cost option.",
      "You can ask any provider for a written estimate before proceeding, including which tests are needed now versus later.",
      "Listed prices are indicative ranges. Always confirm current charges with the provider.",
    ],
  },
  {
    id: "finding-financial-assistance",
    title: "Finding financial assistance",
    category: "Affordability",
    summary:
      "Where assistance usually comes from — government schemes, hospital funds and organisations — and how to ask.",
    readTime: "5 min read",
    body: [
      "Assistance generally comes from three places: government schemes, hospital or trust assistance funds, and non-profit organisations.",
      "Hospitals often have a patient assistance or medical social work desk. Asking early, before treatment, gives you more options.",
      "Keep a folder with identity proof, address proof, prescriptions and estimates. Most applications ask for the same documents.",
    ],
  },
  {
    id: "understanding-government-benefits",
    title: "Understanding government healthcare benefits",
    category: "Government benefits",
    summary:
      "How to read a scheme summary: eligibility, benefits, documents and the application route.",
    readTime: "6 min read",
    body: [
      "Every scheme has four practical parts: who is eligible, what it covers, which documents are needed, and where to apply.",
      "Eligibility rules are set by the issuing authority and change over time. Always confirm on the official portal or at a government help desk.",
      "Scheme summaries here are simplified. Always check the official portal for the current rules.",
    ],
  },
];
