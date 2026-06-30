export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-1 text-center">
          <span className="text-lg font-semibold tracking-tight">DesignCoWork</span>
          <span className="text-sm text-muted">Your design co-pilot, always in context.</span>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/20">
          {children}
        </div>
      </div>
    </div>
  );
}
