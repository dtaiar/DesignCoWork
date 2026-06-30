"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const FIGMA_URL_PATTERN = /https?:\/\/(www\.)?figma\.com\/\S+/i;

export async function createTopic(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const supabase = await createClient();
  const { data: orgMember } = await supabase.from("org_members").select("org_id").limit(1).single();
  if (!orgMember) throw new Error("No organization found for this user.");

  const { data: topic, error } = await supabase.from("topics").insert({ org_id: orgMember.org_id, title }).select("id").single();
  if (error) throw new Error(error.message);

  redirect(`/topics/${topic.id}`);
}

export async function addCapture(topicId: string, orgId: string, formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  const supabase = await createClient();
  const type = FIGMA_URL_PATTERN.test(content) ? "figma_link" : "text";

  const { error } = await supabase.from("captures").insert({ org_id: orgId, topic_id: topicId, type, content });
  if (error) throw new Error(error.message);

  if (type === "figma_link") {
    const figmaUrl = content.match(FIGMA_URL_PATTERN)?.[0];
    if (figmaUrl) await supabase.from("figma_refs").insert({ org_id: orgId, topic_id: topicId, figma_url: figmaUrl });
  }

  revalidatePath(`/topics/${topicId}`);
}
