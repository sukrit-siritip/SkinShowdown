import { cache } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const getAdminRole = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("admin_role")
    .eq("id", user.id)
    .single();
  return data?.admin_role ?? null;
});

export async function requireStaff() {
  const role = await getAdminRole();
  if (role !== "admin" && role !== "viewer") notFound();
  return role;
}

export async function assertAdmin() {
  const role = await getAdminRole();
  if (role !== "admin") return { error: "View-only access — changes are disabled." };
  return null;
}
