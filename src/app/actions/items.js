"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addToCart(itemId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("cart_items")
    .select("qty")
    .eq("user_id", user.id)
    .eq("item_id", itemId)
    .maybeSingle();

  const { error } = existing
    ? await supabase
        .from("cart_items")
        .update({ qty: existing.qty + 1 })
        .eq("user_id", user.id)
        .eq("item_id", itemId)
    : await supabase.from("cart_items").insert({ user_id: user.id, item_id: itemId, qty: 1 });

  if (error) return { error: error.message };

  revalidatePath(`/items/${itemId}`);
  return { success: true };
}

export async function toggleFavorite(itemId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("favorites")
    .select("item_id")
    .eq("user_id", user.id)
    .eq("item_id", itemId)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("favorites").delete().eq("user_id", user.id).eq("item_id", itemId)
    : await supabase.from("favorites").insert({ user_id: user.id, item_id: itemId });

  if (error) return { error: error.message };

  revalidatePath(`/items/${itemId}`);
  revalidatePath("/favorites");
  return { success: true, favorited: !existing };
}

export async function submitReview(itemId, prevState, formData) {
  const rating = Number(formData.get("rating"));
  const text = formData.get("text")?.toString().trim();

  if (!rating || rating < 1 || rating > 5) {
    return { error: "Pick a rating from 1 to 5 stars." };
  }
  if (!text) {
    return { error: "Write something before posting." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: owned } = await supabase
    .from("order_items")
    .select("id, orders!inner(user_id)")
    .eq("item_id", itemId)
    .eq("orders.user_id", user.id)
    .limit(1);

  if (!owned || owned.length === 0) {
    return { error: "You must own this skin to leave a review." };
  }

  const { error } = await supabase
    .from("reviews")
    .upsert(
      { item_id: itemId, user_id: user.id, rating, text },
      { onConflict: "item_id,user_id" }
    );

  if (error) return { error: error.message };

  revalidatePath(`/items/${itemId}`);
  return { success: true };
}

export async function deleteReview(itemId, reviewId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/items/${itemId}`);
  return { success: true };
}
