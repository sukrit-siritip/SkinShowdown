"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function removeCartItem(itemId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("item_id", itemId);

  if (error) return { error: error.message };

  revalidatePath("/cart");
  return { success: true };
}

async function findActivePromo(code) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("promo_codes")
    .select("code, discount_pct")
    .eq("code", code)
    .eq("active", true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .maybeSingle();
  return data;
}

export async function applyPromoCode(code) {
  const trimmed = code?.trim();
  if (!trimmed) return { error: "Enter a promo code first." };

  const promo = await findActivePromo(trimmed);
  if (!promo) return { error: "Invalid or expired promo code." };

  return { valid: true, discountPct: Number(promo.discount_pct) * 100 };
}

export async function checkout(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const paymentMethod = formData.get("payment_method")?.toString() || "card";
  const promoCode = formData.get("promo_code")?.toString().trim() || null;

  if (promoCode) {
    const promo = await findActivePromo(promoCode);
    if (!promo) return { error: "Invalid or expired promo code." };
  }

  const { data: orderId, error } = await supabase.rpc("place_order", {
    p_payment_method: paymentMethod,
    p_promo_code: promoCode,
  });

  if (error) return { error: error.message };

  revalidatePath("/cart");
  redirect(`/checkout/success?order=${orderId}`);
}
