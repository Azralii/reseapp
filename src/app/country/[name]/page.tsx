import Link from "next/link";
import Image from "next/image";
import { fetchCountry, fetchWeather, fetchImages, fetchSummary } from "@/lib/api";

export default async function CountryPage(
  { params }: { params: { name: string } }
) {
  const { name } = params; // ✅ params är inte en Promise längre
  const country = await fetchCountry(name);

  const [lat, lon] = country.capitalInfo?.latlng || country.latlng || [0, 0];

  const [weather, images, summary] = await Promise.all([
    fetchWeather(lat, lon),
    fetchImages(country.name.common),
    fetchSummary(country.name.common),
  ]);

  return (
    <article className="space-y-6">
      <Link href="/" className="underline">← Tillbaka</Link>

      <header className="flex gap-4 items-center">
        <Image
          src={country.flags.png}
          alt={`Flag of ${country.name.common}`}
          width={200}
          height={120}
          className="rounded"
        />
        <div>
          <h1 className="text-2xl font-semibold">{country.name.common}</h1>
          <p>{country.region}</p>
        </div>
      </header>

      <section>
        <h2 className="text-lg font-medium mb-2">
          Väder i {country.capital?.[0] ?? country.name.common}
        </h2>
        {weather?.current_weather ? (
          <p>
            {weather.current_weather.temperature}°C, vind {weather.current_weather.windspeed} m/s
          </p>
        ) : (
          <p>Ingen väderdata</p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Bilder</h2>
        <div className="grid grid-cols-3 gap-2">
          {images.results?.slice(0, 3).map((img: { id: string; urls: { small: string }; alt_description?: string }) => (

            <Image
              key={img.id}
              src={img.urls.small}
              alt={img.alt_description || country.name.common}
              width={200}
              height={150}
              className="rounded"
            />
          )) || <p>Inga bilder</p>}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Om landet</h2>
        <div dangerouslySetInnerHTML={{ __html: summary.extract_html }} />
        <a href={summary.content_urls.desktop.page} target="_blank" className="underline text-sm">
          Läs mer på Wikipedia
        </a>
      </section>
    </article>
  );
}
