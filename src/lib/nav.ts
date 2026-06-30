import type { LucideIcon } from "lucide-react";
import { MessageSquare } from "lucide-react";

export interface NavItem { href: string; label: string; icon: LucideIcon; }

// Add a new area here as it ships — bottom nav splits automatically around the center FAB.
export const navItems: NavItem[] = [{ href: "/", label: "Topics", icon: MessageSquare }];
