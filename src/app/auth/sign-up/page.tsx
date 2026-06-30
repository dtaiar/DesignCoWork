import Link from "next/link";
import { signUp } from "@/lib/auth-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-base font-medium">Create your account</h1>
      {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
      <form action={signUp} className="flex flex-col gap-3">
        <Input type="email" name="email" placeholder="you@studio.com" required autoFocus />
        <Input type="password" name="password" placeholder="Password (min 6 characters)" minLength={6} required />
        <Button type="submit" className="mt-1 w-full">Create account</Button>
      </form>
      <p className="text-center text-sm text-muted">Already have an account?{" "}<Link href="/auth/sign-in" className="text-foreground underline underline-offset-2">Sign in</Link></p>
    </div>
  );
}
