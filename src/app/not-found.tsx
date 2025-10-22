import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Sidan hittades inte</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Oj! Landet eller sidan du letar efter finns inte.
      </p>
      <Link
        href="/"
        className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800"
      >
        ← Tillbaka till startsidan
      </Link>
    </main>
  );
}
