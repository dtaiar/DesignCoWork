import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-accent-soft text-accent",
  exploring: "bg-amber-500/10 text-amber-400",
  resolved: "bg-emerald-500/10 text-emerald-400",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
        STATUS_STYLES[status] ?? "bg-surface-raised text-muted"
      )}
    >
      {status}
    </span>
  );
}
