import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ensureOrg } from "@/lib/org";
import { signOut } from "@/lib/auth-actions";
import { BottomNav } from "@/components/bottom-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth/sign-in");

  await ensureOrg(supabase, userData.user);

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <span className="text-sm font-semibold tracking-tight">DesignCoWork</span>
        </div>
        <form action={signOut}>
          <button className="text-xs text-muted hover:text-foreground">Sign out</button>
        </form>
      </header>

      <main className="scrollbar-thin flex-1 overflow-y-auto">{children}</main>

      <BottomNav />
    </div>
  );
}
