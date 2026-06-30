import { notFound } from "next/navigation";
import { Frame, MessageSquare, Mic, Send, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { addCapture } from "@/lib/actions";
import { StatusBadge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Capture, Topic } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPE_ICON = { text: MessageSquare, figma_link: Frame, voice: Mic };

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: topic } = await supabase.from("topics").select("*").eq("id", id).single<Topic>();
  if (!topic) notFound();

  const { data: captures } = await supabase
    .from("captures")
    .select("*")
    .eq("topic_id", id)
    .order("created_at", { ascending: true })
    .returns<Capture[]>();

  const boundAddCapture = addCapture.bind(null, topic.id, topic.org_id);

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <h1 className="truncate text-base font-medium">{topic.title}</h1>
        <StatusBadge status={topic.status} />
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-3 px-4 py-4">
        {(captures ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">Ask something, paste a Figma link, or drop a requirement below to get started.</p>
        )}
        {(captures ?? []).map((capture) => {
          const Icon = TYPE_ICON[capture.type];
          return (
            <div key={capture.id} className="rounded-2xl border border-border bg-surface px-4 py-3">
              <div className="mb-1.5 flex items-center gap-1.5 text-muted-foreground">
                <Icon size={13} />
                <span className="text-[11px] uppercase tracking-wide">{capture.type.replace("_", " ")}</span>
              </div>
              {capture.type === "figma_link" ? (
                <a href={capture.content} target="_blank" rel="noreferrer" className="break-all text-accent underline underline-offset-2">{capture.content}</a>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{capture.content}</p>
              )}
              {capture.enrichment && (
                <div className={cn("mt-3 flex items-start gap-2 border-t border-border pt-3 text-sm leading-relaxed text-muted")}>
                  <Sparkles size={13} className="mt-0.5 flex-shrink-0 text-accent" />
                  <span>{capture.enrichment}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <form action={boundAddCapture} className="sticky bottom-0 mx-auto flex w-full max-w-2xl items-end gap-2 border-t border-border bg-background p-4">
        <Textarea name="content" rows={2} placeholder="Ask something, paste a Figma link, or add a requirement..." />
        <Button type="submit" size="icon" aria-label="Send"><Send size={15} /></Button>
      </form>
    </div>
  );
}
