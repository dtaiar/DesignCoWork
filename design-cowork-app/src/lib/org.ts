import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

/** Returns the user's org_id, creating a personal workspace org on first visit. */
export async function ensureOrg(supabase: SupabaseClient, user: User): Promise<string> {
  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .limit(1)
    .maybeSingle();

  if (membership) return membership.org_id;

  const workspaceName = `${user.email?.split("@")[0] ?? "My"}'s workspace`;

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({ name: workspaceName })
    .select("id")
    .single();

  if (orgError) throw new Error(orgError.message);

  const { error: memberError } = await supabase
    .from("org_members")
    .insert({ org_id: org.id, user_id: user.id, role: "owner" });

  if (memberError) throw new Error(memberError.message);

  return org.id;
}
