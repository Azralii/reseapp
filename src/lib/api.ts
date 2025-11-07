import { z } from "zod";

// ✅ Zod-schema för att validera landdata
export const CountryRC = z.object({
  cca3: z.string().optional(), 
  cca2: z.string().optional(), 
  name: z.object({
    common: z.string(),
    official: z.string().optional(),
  }),
  region: z.string().optional(),
  capital: z.array(z.string()).optional(),
  flags: z
    .object({
      png: z.string().url(),
      alt: z.string().optional(),
    })
    .optional(),
  capitalInfo: z
    .object({
      latlng: z.array(z.number()).min(1).max(2).optional(),
    })
    .optional(),
  latlng: z.array(z.number()).min(1).max(2).optional(),
});

export type Country = z.infer<typeof CountryRC>;


export async function fetchCountries(): Promise<Country[]> {
  try {
    const url =
      "https://restcountries.com/v3.1/all?fields=name,region,capital,flags,cca2,cca3,capitalInfo,latlng";
    const res = await fetch(url);

    if (!res.ok) {
      console.error("❌ REST Countries API-fel:", res.status, res.statusText);
      throw new Error("API-svar misslyckades");
    }

    const json = await res.json();

    // ✅ Validera med Zod
    const validCountries = json
      .map((country: Record<string, unknown>) => {
        const result = CountryRC.safeParse(country);
        if (!result.success) {
          console.warn("⚠️ Zod-fel i landdata:", result.error.issues[0]);
          return null;
        }
        return result.data;
      })
      .filter(Boolean) as Country[];

    console.log(`✅ Länder hämtade: ${validCountries.length}`);
    return validCountries;
  } catch (err) {
    console.error("🚨 fetchCountries():", err);
    throw err;
  }
}


export async function fetchCountry(code: string): Promise<Country | null> {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${encodeURIComponent(
        code
      )}?fields=name,region,capital,flags,cca2,cca3,capitalInfo,latlng`
    );

    if (!res.ok) {
      console.error(`❌ Fel vid hämtning av land ${code}:`, res.statusText);
      return null;
    }

    const json = await res.json();

    //  API:t kan returnera ETT objekt eller en ARRAY
    const dataArray = Array.isArray(json) ? json : [json];

    const result = z.array(CountryRC).safeParse(dataArray);

    if (!result.success) {
      console.warn("⚠️ Zod valideringsfel (fetchCountry):", result.error.issues);
      return dataArray[0] ?? null;
    }

    return result.data[0];
  } catch (err) {
    console.error("🚨 fetchCountry():", err);
    return null;
  }
}


export async function fetchWeather(lat: number, lon: number) {
  try {
    if (!lat || !lon) {
      console.warn("⚠️ Ogiltig plats för väderhämtning");
      return null;
    }

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    if (!res.ok) throw new Error("Kunde inte hämta väderdata");
    return await res.json();
  } catch (err) {
    console.error("🚨 fetchWeather():", err);
    return null;
  }
}


export async function fetchSummary(countryName: string) {
  try {
    const encoded = encodeURIComponent(countryName);
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`
    );

    if (!res.ok) {
      console.warn(`⚠️ Ingen Wikipedia-text hittades för ${countryName}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("🚨 fetchSummary():", err);
    return null;
  }
}


export async function fetchImages(query: string) {
  const key = process.env.NEXT_PUBLIC_UNSPLASH_KEY;

  if (!key) {
    console.warn("⚠️ Ingen Unsplash-nyckel hittades i miljön — hoppar över bildhämtning.");
    return { results: [] }; // fallback så build inte kraschar
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=3&client_id=${key}`
    );

    if (!res.ok) {
      console.warn(`⚠️ Unsplash-förfrågan misslyckades (${res.status})`);
      return { results: [] };
    }

    return await res.json();
  } catch (err) {
    console.error("🚨 fetchImages():", err);
    return { results: [] }; // returnera tom array för säkerhets skull
  }
}

