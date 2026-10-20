"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/admin";

function text(formData, key) {
  return formData.get(key)?.toString().trim() ?? "";
}

function revalidateEvents(id) {
  revalidatePath("/admin/events");
  revalidatePath("/");
  if (id) revalidatePath(`/admin/events?id=${id}`);
}

function parseEvent(formData) {
  const title = text(formData, "title");
  const tag = text(formData, "tag");
  const body = text(formData, "body");
  const ctaLabel = text(formData, "cta_label");
  const ctaLink = text(formData, "cta_link");
  const mediaUrl = text(formData, "media_url");
  const active = formData.get("active") === "true";

  if (!title || title.length > 80) return { error: "Title is required (80 characters max)." };
  if (!tag || tag.length > 60) return { error: "Tag is required (60 characters max)." };
  if (body.length > 600) return { error: "Body is 600 characters max." };
  if (!ctaLabel || ctaLabel.length > 40) return { error: "CTA label is required (40 characters max)." };
  if (!ctaLink) return { error: "CTA link is required." };
  if (mediaUrl.length > 500) return { error: "Media URL is 500 characters max." };

  return {
    row: {
      title,
      tag,
      body: body || null,
      cta_label: ctaLabel,
      cta_link: ctaLink,
      media_url: mediaUrl || null,
      type: "Main Event",
      active,
    },
  };
}

export async function saveEvent(prevState, formData) {
  const denied = await assertAdmin();
  if (denied) return denied;

  const parsed = parseEvent(formData);
  if (parsed.error) return parsed;

  const supabase = await createClient();
  const id = text(formData, "id");

  if (id) {
    const { error } = await supabase.from("events").update(parsed.row).eq("id", id);
    if (error) return { error: error.message };
    revalidateEvents(id);
    return { success: true, savedAt: Date.now() };
  }

  const { data: maxRow } = await supabase
    .from("events")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("events")
    .insert({ ...parsed.row, sort_order: sortOrder })
    .select("id")
    .single();
  if (error) return { error: error.message };

  revalidateEvents(data.id);
  redirect(`/admin/events?id=${data.id}&saved=1`);
}

export async function deleteEvent(id) {
  const denied = await assertAdmin();
  if (denied) return denied;

  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateEvents();
  redirect("/admin/events");
}
