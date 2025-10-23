import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grant Database QA Dashboard",
  description: "Quality assurance dashboard for Norwegian grant database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      Grant Database QA
                    </h1>
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <NavLink href="/" label="Dashboard" icon="🏠" />
                  <NavLink href="/organizations" label="Organizations" icon="🏢" />
                  <NavLink href="/grants" label="Grants" icon="💰" />
                  <NavLink href="/duplicates" label="Duplicates" icon="🔍" />
                  <NavLink href="/search" label="Search" icon="🔎" />
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="group relative px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
    >
      <span className="flex items-center gap-1.5">
        <span className="text-base">{icon}</span>
        {label}
      </span>
    </Link>
  );
}
