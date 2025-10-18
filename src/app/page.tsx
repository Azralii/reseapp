"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCountries, Country } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const { data, isLoading, isError } = useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  if (isLoading) return <p className="text-center">Laddar länder...</p>;
  if (isError) return <p className="text-center text-red-500">Kunde inte hämta data</p>;
  if (!data) return <p className="text-center">Ingen data hittades.</p>;

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
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🌍 Länder</h1>

      <input
        type="text"
        placeholder="Sök land..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
        className="border px-3 py-2 mb-4 w-full rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "Africa", "Americas", "Asia", "Europe", "Oceania"].map((r) => (
          <button
            key={r}
            onClick={() => {
              setRegion(r);
              setPage(1);
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

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {paginated.map((country) => (
          <li
            key={country.cca3 ?? country.cca2 ?? country.name.common}
            className="border rounded p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition"
          >
            <Link href={`/country/${encodeURIComponent(country.name.common)}`}>
              <img
                src={country.flags?.png}
                alt={country.flags?.alt || `Flag of ${country.name.common}`}
                className="h-24 w-full object-cover rounded"
              />
              <p className="font-semibold mt-2">{country.name.common}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{country.region}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {country.capital?.[0] || "Ingen huvudstad"}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
        >
          Föregående
        </button>
        <span>
          Sida {page} av {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
        >
          Nästa
        </button>
      </div>
    </main>
  );
}
