"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/admin";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I

function randomCode() {
  const group = () =>
    Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
  return `HUNT-${group()}-${group()}`;
}

function revalidateStock(itemId) {
  revalidatePath("/admin/stock");
  revalidatePath(`/admin/items?id=${itemId}`);
}

export async function generateCodes(itemId, count = 10) {
  const denied = await assertAdmin();
  if (denied) return denied;
  if (!itemId) return { error: "Pick a skin first." };

  const supabase = await createClient();
  const rows = Array.from({ length: count }, () => ({
    item_id: itemId,
    code: randomCode(),
    status: "available",
  }));
  const { error } = await supabase.from("item_codes").insert(rows);
  if (error) return { error: "Couldn't generate codes — try again." };

  revalidateStock(itemId);
  return { success: true, added: count };
}

export async function addPastedCodes(itemId, text) {
  const denied = await assertAdmin();
  if (denied) return denied;
  if (!itemId) return { error: "Pick a skin first." };

  const codes = [...new Set((text ?? "").split("\n").map((l) => l.trim()).filter(Boolean))];
  if (codes.length === 0) return { error: "Paste at least one code." };
  if (codes.some((c) => c.length > 40)) return { error: "A code is too long (40 characters max)." };

  const supabase = await createClient();
  const rows = codes.map((code) => ({ item_id: itemId, code, status: "available" }));
  const { error, count } = await supabase.from("item_codes").insert(rows, { count: "exact" });
  if (error) {
    if (error.code === "23505") return { error: "One or more of those codes already exist." };
    return { error: "Couldn't add codes — try again." };
  }

  revalidateStock(itemId);
  return { success: true, added: count ?? codes.length };
}

export async function removeCodes(itemId, codeIds) {
  const denied = await assertAdmin();
  if (denied) return denied;
  if (!codeIds?.length) return { error: "Pick at least one code to remove." };

  const supabase = await createClient();
  const { error, count } = await supabase
    .from("item_codes")
    .delete({ count: "exact" })
    .in("id", codeIds)
    .eq("status", "available");
  if (error) return { error: "Couldn't remove those codes." };
  if (!count) return { error: "Those codes are already sold and can't be removed." };

  revalidateStock(itemId);
  const skipped = codeIds.length - count;
  return { success: true, removed: count, skipped };
}
