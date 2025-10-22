import Link from "next/link";
import Image from "next/image";
import { fetchCountry, fetchWeather, fetchImages, fetchSummary } from "@/lib/api";

export default async function CountryPage({
  params,
}: {
  params: { name: string };
}) {
  const { name } = params; // ✅ INGEN await här
  const country = await fetchCountry(name);

  if (!country) {
    return <p>Landet kunde inte hämtas.</p>;
  }

  const [lat, lon] = country.capitalInfo?.latlng || country.latlng || [0, 0];

  const [weather, images, summary] = await Promise.all([
    fetchWeather(lat, lon),
    fetchImages(country.name.common),
    fetchSummary(country.name.common),
  ]);

  return (
    <article className="space-y-6">
      <Link href="/" className="underline">
        ← Tillbaka
      </Link>

      <header className="flex gap-4 items-center">
        {country.flags?.png ? (
          <Image
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            width={200}
            height={120}
            className="rounded"
          />
        ) : (
          <div className="w-32 h-20 bg-gray-300 flex items-center justify-center rounded">
            ❌ Ingen flagga
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">{country.name.common}</h1>
          <p>{country.region || "Ingen region"}</p>
        </div>
      </header>

      <section>
        <h2 className="text-lg font-medium mb-2">
          Väder i {country.capital?.[0] ?? country.name.common}
        </h2>
        {weather?.current_weather ? (
          <p>
            {weather.current_weather.temperature}°C, vind{" "}
            {weather.current_weather.windspeed} m/s
          </p>
        ) : (
          <p>Ingen väderdata</p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Bilder</h2>
        <div className="grid grid-cols-3 gap-2">
          {images.results?.length ? (
            images.results.slice(0, 3).map(
              (img: {
                id: string;
                urls: { small: string };
                alt_description?: string;
              }) => (
                <Image
                  key={img.id}
                  src={img.urls.small}
                  alt={img.alt_description || country.name.common}
                  width={200}
                  height={150}
                  className="rounded"
                />
              )
            )
          ) : (
            <p>Inga bilder hittades</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Om landet</h2>
        {summary?.extract_html ? (
          <div dangerouslySetInnerHTML={{ __html: summary.extract_html }} />
        ) : (
          <p>Ingen beskrivning tillgänglig</p>
        )}
        {summary?.content_urls?.desktop?.page && (
          <a
            href={summary.content_urls.desktop.page}
            target="_blank"
            className="underline text-sm"
          >
            Läs mer på Wikipedia
          </a>
        )}
      </section>
    </article>
  );
}
