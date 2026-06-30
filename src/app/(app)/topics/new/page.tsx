import { createTopic } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewTopicPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New topic</h1>
        <p className="mt-1 text-sm text-muted">Open-ended is fine — refine it once you&apos;re in.</p>
      </div>
      <form action={createTopic} className="flex flex-col gap-3">
        <Input name="title" autoFocus placeholder='What are you exploring? e.g. "Checkout flow feels off"' />
        <Button type="submit" className="self-start">Start topic</Button>
      </form>
    </main>
  );
}
