# 🌍 Reseapp

En Next.js-app som visar länder med sök, filter (region), paginering och detaljsida med väder, bilder (Unsplash) och Wikipedia-intro.  
Byggd med **Next.js**, **Tailwind CSS**, **TanStack Query** och **REST Countries API**.

---

## 🚀 Tech stack

- **Next.js 15** – App Router & Server Components  
- **Tailwind CSS** – styling och dark mode  
- **TanStack Query (React Query)** – datacache & hämtning  
- **Zod** – validering av API-svar  
- **APIs:**  
  - [REST Countries](https://restcountries.com)  
  - [Open-Meteo](https://open-meteo.com)  
  - [Unsplash](https://unsplash.com/developers)  
  - [Wikipedia Summary API](https://en.wikipedia.org/api/rest_v1)

---

## 💾 Funktioner

### ✅ Grundläggande (G)
- Lista alla länder med flagga, region och huvudstad  
- Sök efter land via textfält  
- Filtrera länder per region  
- Paginerad lista (20 länder per sida)  
- Detaljsida per land med:
  - Aktuellt väder (Open-Meteo)
  - Bilder från Unsplash
  - Kort sammanfattning från Wikipedia
- Typvalidering av API-data med **Zod**
- Mörkt läge (toggle-knapp)

---

## 🔧 Kör lokalt

```bash
# 1. Installera beroenden
npm install

# 2. Lägg till API-nyckel för Unsplash
# Skapa .env.local och lägg in din Unsplash-nyckel:
NEXT_PUBLIC_UNSPLASH_KEY=din_unsplash_api_nyckel

# 3. Starta utvecklingsserver
npm run dev
Appen körs på http://localhost:3000

🧠 Datakällor
Källa	Används till
REST Countries	Landinfo (flagga, region, huvudstad)
Open-Meteo	Aktuellt väder
Unsplash	Bilder på landet
Wikipedia	Kort text om landet

🧱 Struktur
css
Kopiera kod
src/
 ├─ app/
 │   ├─ country/[name]/page.tsx
 │   ├─ layout.tsx
 │   └─ page.tsx
 ├─ components/
 │   ├─ ThemeToggle.tsx
 │   └─ ReactQueryClientProvider.tsx
 ├─ lib/
 │   └─ api.ts
 └─ styles/
     └─ globals.css