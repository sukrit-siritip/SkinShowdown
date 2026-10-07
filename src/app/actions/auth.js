"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/demo";

async function siteOrigin() {
  const headersList = await headers();
  return headersList.get("origin") ?? `https://${headersList.get("host")}`;
}

export async function login(prevState, formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

async function restoreDemoCredentials() {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) return false;
  const demo = data.users.find((u) => u.email === DEMO_EMAIL || u.new_email === DEMO_EMAIL);
  if (!demo) return false;
  const { error: updateError } = await admin.auth.admin.updateUserById(demo.id, {
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
  });
  return !updateError;
}

export async function loginDemo() {
  const supabase = await createClient();
  const credentials = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
  let { error } = await supabase.auth.signInWithPassword(credentials);

  if (error && (await restoreDemoCredentials())) {
    ({ error } = await supabase.auth.signInWithPassword(credentials));
  }

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function register(prevState, formData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!formData.get("agree")) {
    return { error: "You must agree to the terms to continue." };
  }

  const supabase = await createClient();
  const origin = await siteOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Email confirmation is disabled for this project, so signUp() already
  // returns an active session — no need to wait for a confirmation email.
  if (data.session) {
    redirect("/");
  }

  return {
    success: true,
    message: `Check ${email} for a link to confirm your account.`,
  };
}

export async function forgotPassword(prevState, formData) {
  const email = formData.get("email")?.toString().trim();

  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createClient();
  const origin = await siteOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, email };
}

export async function resetPassword(prevState, formData) {
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/login");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
