import { createClient } from "@/lib/supabase/server";
import HeaderShell from "@/components/header-shell";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = null;
  let cartCount = 0;
  if (user) {
    const [{ data: profile }, { data: cartItems }] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("id", user.id).single(),
      supabase.from("cart_items").select("qty").eq("user_id", user.id),
    ]);
    displayName = profile?.display_name || user.email;
    cartCount = cartItems?.reduce((sum, item) => sum + item.qty, 0) ?? 0;
  }

  return <HeaderShell user={user} displayName={displayName} cartCount={cartCount} />;
}
