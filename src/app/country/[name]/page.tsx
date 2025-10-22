import { fetchCountry, fetchWeather, fetchImages, fetchSummary } from "@/lib/api";

export default async function CountryPage(
  { params }: { params: Promise<{ name: string }> } 
) {
  const { name } = await params;                    
  const country = await fetchCountry(name);

  const [lat, lon] = country.capitalInfo?.latlng || country.latlng || [0, 0];

  const [weather, images, summary] = await Promise.all([
    fetchWeather(lat, lon),
    fetchImages(country.name.common),
    fetchSummary(country.name.common),
  ]);

  return (
    <article className="space-y-6">
      <a href="/" className="underline">← Tillbaka</a>

      <header className="flex gap-4 items-center">
        <img
          src={country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className="h-20 w-32 rounded"
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
          {images.results?.slice(0, 3).map((img: any) => (
            <img key={img.id} src={img.urls.small} alt={img.alt_description || country.name.common} className="rounded" />
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
