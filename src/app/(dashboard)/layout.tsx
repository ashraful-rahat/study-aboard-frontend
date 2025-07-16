export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold">Dashboard Menu</h2>
        <nav className="mt-4 space-y-2">
          <a href="/dashboard" className="block">
            Home
          </a>
          <a href="/dashboard/country" className="block">
            Country
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
