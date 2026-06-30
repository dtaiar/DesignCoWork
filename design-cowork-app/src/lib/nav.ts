import type { LucideIcon } from "lucide-react";
import { MessageSquare } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Add a new area here as it ships — the bottom nav picks it up automatically,
// splitting items evenly on either side of the center "new topic" action.
export const navItems: NavItem[] = [{ href: "/", label: "Topics", icon: MessageSquare }];
