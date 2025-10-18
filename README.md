cat > README.md << 'EOF'
# 🌍 Reseapp

En Next.js-app som listar länder med sök, filter (region), paginering och detaljsida med väder, bilder (Unsplash) och Wikipedia-intro.  
Byggd med Tailwind CSS, TanStack Query (React Query) och REST-Countries-API.

## 🚀 Tech stack
- **Next.js 15** – App Router & Server Components  
- **Tailwind CSS** – styling och dark mode via `class`  
- **TanStack Query** – datacache & hämtning  
- **Zod** – validering av API-svar  
- **APIs:** REST Countries, Open-Meteo, Unsplash, Wikipedia

## 🔧 Kör lokalt
```bash
npm install
npm run dev
