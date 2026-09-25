/**
 * Authentication + user profile service.
 *
 * Local-first implementation so the frontend works without a backend.
 * Every function mirrors a future REST endpoint:
 *
 *   signUp(input)        -> POST /api/auth/signup
 *   signIn(input)        -> POST /api/auth/login
 *   signOut()            -> POST /api/auth/logout
 *   getSession()         -> GET  /api/auth/session
 *   requestPasswordReset -> POST /api/auth/forgot-password
 *   getProfile()         -> GET  /api/users/me/profile
 *   saveProfile(profile) -> PUT  /api/users/me/profile
 */

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  mobile?: string;
  createdAt: string;
}

export type CertificateStatus =
  | "Have certificate"
  | "Applied"
  | "Don't have one"
  | "Prefer not to say";

export type AffordabilityPreference = "Free / Government-supported" | "Affordable" | "Any";

export type CarePreference = "Hospital / Clinic" | "Teleconsultation" | "Either";

export interface UserProfile {
  state?: string;
  district?: string;
  ageGroup?: string;
  certificateStatus?: CertificateStatus;
  interests: string[];
  affordability?: AffordabilityPreference;
  carePreference?: CarePreference;
  completedAt?: string;
}

export interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
  mobile?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

interface StoredAccount extends AuthUser {
  password: string;
  profile?: UserProfile;
}

const ACCOUNTS_KEY = "transcare.accounts";
const SESSION_KEY = "transcare.session";
const LATENCY = 420;

const wait = <T,>(payload: T, delay = LATENCY) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(payload), delay));

function browser() {
  return typeof window !== "undefined";
}

function readAccounts(): StoredAccount[] {
  if (!browser()) return [];
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "[]") as StoredAccount[];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  if (browser()) localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function publicUser(account: StoredAccount): AuthUser {
  const { id, fullName, email, mobile, createdAt } = account;
  return mobile ? { id, fullName, email, mobile, createdAt } : { id, fullName, email, createdAt };
}

export function firstName(user: AuthUser | null) {
  return user?.fullName?.trim().split(/\s+/)[0] ?? "";
}

export class AuthError extends Error {}

export async function signUp(input: SignUpInput): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((a) => a.email === email)) {
    await wait(null, 200);
    throw new AuthError("An account with this email already exists. Try logging in instead.");
  }
  const account: StoredAccount = {
    id: `user_${Date.now().toString(36)}`,
    fullName: input.fullName.trim(),
    email,
    createdAt: new Date().toISOString(),
    password: input.password,
    ...(input.mobile?.trim() ? { mobile: input.mobile.trim() } : {}),
  };
  writeAccounts([...accounts, account]);
  if (browser()) localStorage.setItem(SESSION_KEY, account.id);
  return wait(publicUser(account));
}

export async function signIn(input: SignInInput): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();
  const account = readAccounts().find((a) => a.email === email);
  if (!account || account.password !== input.password) {
    await wait(null, 300);
    throw new AuthError("Email or password is incorrect.");
  }
  if (browser()) localStorage.setItem(SESSION_KEY, account.id);
  return wait(publicUser(account));
}
export async function signInDemo(): Promise<AuthUser> {
  const accounts = readAccounts();
  const demoEmail = "demo@transcare.app";

  let account = accounts.find((a) => a.email === demoEmail);

  if (!account) {
    account = {
      id: "demo_user",
      fullName: "TransCare Demo User",
      email: demoEmail,
      createdAt: new Date().toISOString(),
      password: "",
    };

    writeAccounts([...accounts, account]);
  }

  if (browser()) {
    localStorage.setItem(SESSION_KEY, account.id);
  }

  return wait(publicUser(account));
}

export async function signOut(): Promise<void> {
  if (browser()) localStorage.removeItem(SESSION_KEY);
  return wait(undefined, 120);
}

export function getSession(): { user: AuthUser; profile: UserProfile | null } | null {
  if (!browser()) return null;
  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const account = readAccounts().find((a) => a.id === id);
  if (!account) return null;
  return { user: publicUser(account), profile: account.profile ?? null };
}

export async function requestPasswordReset(email: string): Promise<void> {
  await wait(undefined, 400);
  if (!email.trim()) throw new AuthError("Enter the email address for your account.");
}

export async function saveProfile(userId: string, profile: UserProfile): Promise<UserProfile> {
  const accounts = readAccounts();
  const next = accounts.map((a) =>
    a.id === userId ? { ...a, profile: { ...profile, completedAt: new Date().toISOString() } } : a,
  );
  writeAccounts(next);
  const saved = next.find((a) => a.id === userId)?.profile ?? profile;
  return wait(saved);
}

export const HEALTHCARE_INTERESTS = [
  "General Healthcare",
  "Mental Healthcare",
  "Hormone / HRT Care",
  "Gender-Affirming Care",
  "Sexual & Reproductive Healthcare",
  "Voice & Speech Therapy",
  "Other Support",
] as const;

export const AGE_GROUPS = ["Under 18", "18–24", "25–34", "35–44", "45–59", "60+"] as const;

export const CERTIFICATE_STATUSES: CertificateStatus[] = [
  "Have certificate",
  "Applied",
  "Don't have one",
  "Prefer not to say",
];

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
] as const;

/** Maps a profile interest to the service key used by the provider dataset. */
export const INTEREST_TO_SERVICE: Record<string, string> = {
  "General Healthcare": "Primary Care",
  "Mental Healthcare": "Counselling",
  "Hormone / HRT Care": "Hormone Care",
  "Gender-Affirming Care": "Gender-Affirming Care Information",
  "Sexual & Reproductive Healthcare": "Sexual Health",
  "Voice & Speech Therapy": "Voice & Speech",
  "Other Support": "Peer Support",
};
