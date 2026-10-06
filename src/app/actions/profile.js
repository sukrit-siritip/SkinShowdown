"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(prevState, formData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!name || !email) {
    return { error: "Display name and email are required." };
  }
  if (password) {
    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }
    if (password.length < 8) {
      return { error: "Password must be at least 8 characters." };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const authUpdates = {};
  if (email !== user.email) authUpdates.email = email;
  if (password) authUpdates.password = password;

  if (Object.keys(authUpdates).length > 0) {
    const { error } = await supabase.auth.updateUser(authUpdates);
    if (error) return { error: error.message };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ display_name: name })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  revalidatePath("/profile");
  return {
    success: true,
    message:
      authUpdates.email
        ? "Profile updated. Check your new email to confirm the change."
        : "Profile updated.",
  };
}
