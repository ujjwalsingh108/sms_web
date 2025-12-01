import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isCompanyAdmin } from "@/lib/helpers/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/admin-login");
  }

  const isAdmin = await isCompanyAdmin();
  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Nescomm</h1>
          <p className="text-sm text-gray-600">Admin Portal</p>
        </div>

        <nav className="px-4 space-y-2">
          <a
            href="/admin"
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Dashboard
          </a>
          <a
            href="/admin/schools"
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Schools
          </a>
          <a
            href="/admin/settings"
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Company Admin Panel
            </h2>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Sign Out
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
