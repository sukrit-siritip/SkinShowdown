import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/profile-form";

export const metadata = { title: "Profile Settings" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="flex-1 max-w-[640px] mx-auto px-6 pt-9 pb-24 w-full">
      <div className="text-[11px] tracking-[0.2em] text-tan mb-1.5">ACCOUNT</div>
      <h1 className="font-bold text-4xl m-0 mb-7">Profile Settings</h1>

      <div className="border border-hairline bg-card p-6">
        <ProfileForm initialName={profile?.display_name ?? ""} initialEmail={user.email ?? ""} />
      </div>
    </main>
  );
}
