"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCountries, Country } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔍 Läs filter, sökning och sida från URL
  const queryParam = searchParams.get("q") ?? "";
  const regionParam = searchParams.get("region") ?? "All";
  const pageParam = parseInt(searchParams.get("page") ?? "1");

  const [query, setQuery] = useState(queryParam);
  const [region, setRegion] = useState(regionParam);
  const [page, setPage] = useState(pageParam);
  const pageSize = 20;

  // 🔁 Hämta länder via React Query (med fallback)
  const { data, isLoading, isError } = useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      try {
        const result = await fetchCountries();
        console.log("✅ Länder hämtade:", result.length);
        return result;
      } catch (err) {
        console.error("⚠️ Kunde inte hämta länder vid build:", err);
        return [];
      }
    },
  });

  function updateURL(newQuery: string, newRegion: string, newPage: number) {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newRegion !== "All") params.set("region", newRegion);
    if (newPage > 1) params.set("page", String(newPage));
    router.push(`/?${params.toString()}`);
  }

  if (isLoading) return <p className="text-center mt-10">Laddar länder...</p>;
  if (isError) return <p className="text-center text-red-500 mt-10">Kunde inte hämta data</p>;
  if (!data) return <p className="text-center mt-10">Ingen data hittades.</p>;

  const filtered = data.filter((c) => {
    const matchesRegion = region === "All" || c.region === region;
    const matchesSearch = c.name.common
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🌍 Länder i världen</h1>

      {/* 🔎 Sökfält */}
      <input
        type="text"
        placeholder="Sök land..."
        value={query}
        onChange={(e) => {
          const newQ = e.target.value;
          setQuery(newQ);
          setPage(1);
          updateURL(newQ, region, 1);
        }}
        className="border px-3 py-2 mb-4 w-full rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
      />

      {/* 🌍 Regionfilter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Africa", "Americas", "Asia", "Europe", "Oceania"].map((r) => (
          <button
            key={r}
            onClick={() => {
              setRegion(r);
              setPage(1);
              updateURL(query, r, 1);
            }}
            className={`border px-3 py-1 rounded transition ${
              region === r
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* 🏳️ Lista med länder */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {paginated.map((country) => (
          <li
            key={country.cca3 ?? country.cca2 ?? country.name.common}
            className="border rounded p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition"
          >
            <Link href={`/country/${country.cca3}`}>
              <Image
                src={country.flags?.png || "/fallback-image.png"}
                alt={country.flags?.alt || `Flag of ${country.name.common}`}
                width={400}
                height={250}
                className="h-24 w-full object-cover rounded"
                priority
              />
              <p className="font-semibold mt-2">{country.name.common}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {country.region}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {country.capital?.[0] || "Ingen huvudstad"}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {/* 📄 Sidnavigering */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => {
            const newPage = Math.max(page - 1, 1);
            setPage(newPage);
            updateURL(query, region, newPage);
          }}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
        >
          ← Föregående
        </button>

        <span className="mt-1">
          Sida {page} av {totalPages}
        </span>

        <button
          onClick={() => {
            const newPage = Math.min(page + 1, totalPages);
            setPage(newPage);
            updateURL(query, region, newPage);
          }}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
        >
          Nästa →
        </button>
      </div>
    </main>
  );
}
