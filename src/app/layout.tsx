import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { ReactNode } from "react";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";


export const metadata = {
  title: "Reseapp 🌍",
  description: "Visa länder, väder och bilder med Next.js och Tailwind CSS",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
        {/* ✅ Lägg hela appen inuti QueryClientProvider */}
        <ReactQueryClientProvider>
          {/* 🔝 Global header */}
          <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-xl font-bold">🌍 Reseapp</h1>
            <ThemeToggle />
          </header>

          {/* 🧭 Sidinnehåll */}
          <main className="p-6 max-w-6xl mx-auto">{children}</main>

          {/* 👣 Footer */}
          <footer className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 py-4">
            <p>
              © {new Date().getFullYear()} Reseapp – byggd med Next.js och Tailwind CSS
            </p>
          </footer>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
