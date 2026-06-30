"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { navItems, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();
  const mid = Math.ceil(navItems.length / 2);
  const left = navItems.slice(0, mid);
  const right = navItems.slice(mid);

  return (
    <nav className="flex-shrink-0 overflow-visible border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-3xl items-center overflow-visible px-2">
        <div className="flex flex-1 items-center justify-evenly">
          {left.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </div>

        <Link
          href="/topics/new"
          aria-label="New topic"
          className="-mt-5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={20} />
        </Link>

        <div className="flex flex-1 items-center justify-evenly">
          {right.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center gap-0.5 px-3 py-2.5 text-[11px] font-medium transition-colors",
        active ? "text-accent" : "text-muted hover:text-foreground",
      )}
    >
      <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
      {item.label}
    </Link>
  );
}
