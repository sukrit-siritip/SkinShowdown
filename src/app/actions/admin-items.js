"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/admin";
import { ITEM_TYPE_BY_VALUE } from "@/lib/item-type-groups";
import { RENDER_BUCKET, isRenderPath } from "@/lib/renders";

const MAX_PRICE = 9999.99;

function text(formData, key) {
  return formData.get(key)?.toString().trim() ?? "";
}

async function parseItem(supabase, formData) {
  const name = text(formData, "name");
  const type = ITEM_TYPE_BY_VALUE[text(formData, "type")];
  const base = type?.fixedBase ?? text(formData, "base");
  const description = text(formData, "description");
  const published = formData.get("published") === "true";

  if (!name || name.length > 80) return { error: "Name is required (80 characters max)." };
  if (!type) return { error: "Pick a valid type." };
  if (!type.fixedBase) {
    const { data: known } = await supabase
      .from("item_bases")
      .select("id")
      .eq("type", type.value)
      .eq("name", base)
      .maybeSingle();
    if (!known) return { error: `Pick a ${type.weapon ? "weapon" : "base"} from the list.` };
  }
  if (description.length > 500) return { error: "Description is 500 characters max." };

  const price = Number(text(formData, "price"));
  if (!Number.isFinite(price) || price <= 0 || price > MAX_PRICE) {
    return { error: `Price must be between $0.01 and $${MAX_PRICE}.` };
  }

  const row = {
    name,
    type: type.value,
    slot: type.slot,
    base,
    weapon: type.weapon ? base : null,
    description: description || null,
    published,
    price: Math.round(price * 100) / 100,
  };

  const renderPath = text(formData, "render_path");
  const renderWidth = Number(text(formData, "render_width"));
  const renderHeight = Number(text(formData, "render_height"));
  if (renderPath) {
    const validSize =
      Number.isInteger(renderWidth) && Number.isInteger(renderHeight) && renderWidth > 0 && renderHeight > 0;
    if (!isRenderPath(renderPath) || !validSize) {
      return { error: "The render is invalid — upload it again." };
    }
  }
  Object.assign(row, {
    render_path: renderPath || null,
    render_width: renderPath ? renderWidth : null,
    render_height: renderPath ? renderHeight : null,
  });

  return { row };
}

function friendlyError(error) {
  if (error.code === "23505") return "That battle pass level is already taken.";
  if (error.code === "42501") return "You don't have permission to change items.";
  return error.message;
}

async function removeRender(supabase, path) {
  if (path) await supabase.storage.from(RENDER_BUCKET).remove([path]);
}

function revalidateCatalog(id) {
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  revalidatePath("/items");
  if (id) revalidatePath(`/items/${id}`);
}

export async function saveItem(prevState, formData) {
  const denied = await assertAdmin();
  if (denied) return denied;

  const supabase = await createClient();
  const parsed = await parseItem(supabase, formData);
  if (parsed.error) return parsed;

  const id = text(formData, "id");
  if (id) {
    const { data: before } = await supabase
      .from("items")
      .select("render_path")
      .eq("id", id)
      .maybeSingle();
    if (!before) return { error: "That skin no longer exists." };

    const { error } = await supabase.from("items").update(parsed.row).eq("id", id);
    if (error) return { error: friendlyError(error) };

    if (before.render_path !== parsed.row.render_path) await removeRender(supabase, before.render_path);
    revalidateCatalog(id);
    return { success: true, savedAt: Date.now() };
  }

  const { data, error } = await supabase.from("items").insert(parsed.row).select("id").single();
  if (error) return { error: friendlyError(error) };
  revalidateCatalog(data.id);
  redirect(`/admin/items?id=${data.id}`);
}

export async function addItemBase(type, name) {
  const denied = await assertAdmin();
  if (denied) return denied;

  const info = ITEM_TYPE_BY_VALUE[type];
  const clean = name?.toString().trim().replace(/\s+/g, " ") ?? "";
  if (!info || info.fixedBase) return { error: "This type doesn't use a base list." };
  if (!clean || clean.length > 60) return { error: "Name is required (60 characters max)." };

  const supabase = await createClient();
  const { data: names } = await supabase.from("item_bases").select("name").eq("type", type);
  const existing = names?.find((row) => row.name.toLowerCase() === clean.toLowerCase());
  if (existing) return { name: existing.name };

  const { data, error } = await supabase
    .from("item_bases")
    .insert({ type, name: clean })
    .select("name")
    .single();
  if (error) return { error: friendlyError(error) };

  revalidatePath("/admin/items");
  return { name: data.name };
}

export async function deleteItem(id) {
  const denied = await assertAdmin();
  if (denied) return denied;

  const supabase = await createClient();
  const { data: before } = await supabase
    .from("items")
    .select("render_path")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.rpc("admin_delete_item", { p_item_id: id });
  if (error) {
    if (error.message === "ITEM_SOLD") {
      return { error: "This skin has been sold, so it can't be deleted. Unpublish it instead." };
    }
    if (error.message === "ITEM_NOT_FOUND") return { error: "That skin no longer exists." };
    return { error: friendlyError(error) };
  }

  await removeRender(supabase, before?.render_path);
  revalidateCatalog(id);
  redirect("/admin/items");
}
