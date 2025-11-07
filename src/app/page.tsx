import HomeClient from "@/components/HomeClient";

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* ✅ Klientkomponenten innehåller all logik med useSearchParams */}
      <HomeClient />
    </main>
  );
}
