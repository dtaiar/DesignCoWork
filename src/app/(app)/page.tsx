import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ensureOrg } from "@/lib/org";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Topic } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const orgId = await ensureOrg(supabase, userData.user!);

  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .eq("org_id", orgId)
    .order("updated_at", { ascending: false })
    .returns<Topic[]>();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Topics</h1>
        <p className="mt-1 text-sm text-muted">Exploration, execution, and the decisions that hold it together.</p>
      </header>

      {(topics ?? []).length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-strong py-16 text-center">
          <p className="text-sm text-muted">Nothing here yet. Start with whatever you&apos;re thinking about right now.</p>
          <Button asChild variant="secondary" size="sm">
            <Link href="/topics/new"><Plus size={14} />Start a topic</Link>
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {topics!.map((topic) => (
            <li key={topic.id}>
              <Link href={`/topics/${topic.id}`} className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-4 py-3.5 transition-colors hover:border-border-strong hover:bg-surface-raised">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{topic.title}</span>
                  <StatusBadge status={topic.status} />
                </div>
                <ArrowRight size={15} className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
