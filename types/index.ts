export const EVENT_CATEGORIES = [
  "hackathon",
  "workshop",
  "training",
  "exchange",
  "internship",
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  hackathon: "Hackathon",
  workshop: "Workshop",
  training: "Training",
  exchange: "Exchange program",
  internship: "Internship",
};

export const UNIVERSITIES = [
  "TSU",
  "GTU",
  "Ilia State University",
  "BTU",
  "Free University",
  "Caucasus University",
  "SDASU",
  "KIU",
  "Other",
] as const;
export type University = (typeof UNIVERSITIES)[number];

export type SourceType = "facebook" | "google_form" | "website" | "other";

export interface EventItem {
  id: string;
  title: string;
  summary: string;
  category: EventCategory;
  university: University;
  startsAt: string;
  endsAt?: string;
  location?: string;
  tags: string[];
  sourceUrl: string;
  sourceType: SourceType;
  createdAt: string;
}

export const SKILLS = [
  "React", "Next.js", "TypeScript", "Python", "Node.js", "UI/UX",
  "Figma", "Data Science", "ML/AI", "Mobile", "Marketing", "Pitching",
  "Business", "DevOps",
] as const;
export type Skill = (typeof SKILLS)[number];

export type ContactType = "telegram" | "linkedin" | "email";

export interface TeammatePost {
  id: string;
  authorName: string;
  university: University;
  title: string;
  description: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  eventId?: string;
  eventTitle?: string;
  contactType: ContactType;
  contactHandle: string;
  createdAt: string;
}

export interface EventFilters {
  query: string;
  category: EventCategory | "all";
  university: University | "all";
  from?: string;
  to?: string;
}

export interface TeammateFilters {
  query: string;
  skills: Skill[];
  university: University | "all";
}