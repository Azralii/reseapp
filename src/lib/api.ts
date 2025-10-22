import { z } from "zod";


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


export async function fetchCountries() {
  try {
    const url =
      "https://restcountries.com/v3.1/all?fields=name,region,capital,flags,cca2,cca3,capitalInfo,latlng";
    const res = await fetch(url);

    if (!res.ok) {
      console.error("❌ REST Countries API-fel:", res.status, res.statusText);
      throw new Error("API-svar misslyckades");
    }

    const json = await res.json();

    // ✅ Validera varje land separat
    const validCountries = json
      .map((country: Record<string, unknown>) => {

        const result = CountryRC.safeParse(country);
        if (!result.success) {
          
         
          return null;
        }
        return result.data;
      })
      .filter(Boolean); 

    console.log(`✅ Länder hämtade: ${validCountries.length}`);
    return validCountries;
  } catch (err) {
    console.error("🚨 fetchCountries():", err);
    throw err;
  }
}


// ---- Hämta ett land ----
export async function fetchCountry(name: string) {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(
        name
      )}?fields=name,region,capital,flags,cca2,cca3,capitalInfo,latlng`
    );

    if (!res.ok) {
      throw new Error(`Fel vid hämtning av land: ${res.statusText}`);
    }

    const json = await res.json();
    const result = z.array(CountryRC).safeParse(json);

    if (!result.success) {
      console.warn(
        "⚠️ Zod valideringsfel (country):",
        result.error.issues.slice(0, 3)
      );
      return json[0];
    }

    return result.data[0];
  } catch (err) {
    console.error("🚨 fetchCountry():", err);
    throw err;
  }
}

// ---- Open-Meteo (väder) ----
export async function fetchWeather(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min`
    );
    if (!res.ok) throw new Error("Kunde inte hämta väderdata");
    return res.json();
  } catch (err) {
    console.error("🚨 fetchWeather():", err);
    throw err;
  }
}


export async function fetchSummary(countryName: string) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${countryName}`
    );
    if (!res.ok) throw new Error("Kunde inte hämta Wikipedia-text");
    return res.json();
  } catch (err) {
    console.error("🚨 fetchSummary():", err);
    throw err;
  }
}


export async function fetchImages(query: string) {
  const key = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
  if (!key) {
    console.warn("⚠️ Ingen Unsplash-nyckel hittades i .env.local");
    return { results: [] };
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=3&client_id=${key}`
    );
    if (!res.ok) throw new Error("Kunde inte hämta bilder");
    return res.json();
  } catch (err) {
    console.error("🚨 fetchImages():", err);
    throw err;
  }
}
