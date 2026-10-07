import AdminNav from "@/components/admin-nav";
import { requireStaff } from "@/lib/admin";

export const metadata = { title: { default: "Admin", template: "%s · Admin · Skin Showdown" } };

export default async function AdminLayout({ children }) {
  const role = await requireStaff();

  return (
    <main className="flex-1 w-full max-w-[1320px] mx-auto px-6 pt-8 pb-24 grid grid-cols-1 md:grid-cols-[210px_minmax(0,1fr)] gap-6 md:gap-7 items-start">
      <AdminNav role={role} />
      <div className="min-w-0">{children}</div>
    </main>
  );
}
