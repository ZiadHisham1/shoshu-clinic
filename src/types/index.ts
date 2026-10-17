import type { LucideIcon } from "lucide-react";

export type ServiceCategoryId = "slimming" | "physio" | "hijama";

export interface ServiceItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  /** Short marketing description shown in the featured panel */
  description: string;
  /** Full URL or /img/... path for the featured image */
  image: string;
  /** Tailwind gradient classes for the panel background */
  gradient: string;
}

export interface ServiceCategory {
  id: ServiceCategoryId;
  label: string;
  items: ServiceItem[];
}

export interface PhysioCondition {
  id: string;
  label: string;
  icon: LucideIcon;
}