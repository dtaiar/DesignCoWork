import Link from "next/link";
import { signIn } from "@/lib/auth-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; notice?: string }> }) {
  const { error, notice } = await searchParams;
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-base font-medium">Sign in</h1>
      {notice && <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">{notice}</p>}
      {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
      <form action={signIn} className="flex flex-col gap-3">
        <Input type="email" name="email" placeholder="you@studio.com" required autoFocus />
        <Input type="password" name="password" placeholder="Password" required />
        <Button type="submit" className="mt-1 w-full">Sign in</Button>
      </form>
      <p className="text-center text-sm text-muted">New here?{" "}<Link href="/auth/sign-up" className="text-foreground underline underline-offset-2">Create an account</Link></p>
    </div>
  );
}
