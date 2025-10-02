# Kids Eat Free Finder

A Vite + React web app that lets families discover restaurants within 50 miles of a ZIP code that offer free kids meals, including the day of the week the promotion runs.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the app at http://localhost:5173 and enter a 5-digit ZIP code to search.

### Tech Stack
- React 18 with TypeScript
- Vite build tooling
- [`zipcodes`](https://www.npmjs.com/package/zipcodes) package for fast ZIP → latitude/longitude lookups

## Data Model

Restaurants live in `src/data/restaurants.ts` and use the shape below:

```ts
interface KidsMealOffer {
  day: 'Sunday' | 'Monday' | ...;
  details: string;
  timeWindow?: string;
  ageLimit?: string;
  verifiedAt?: string; // ISO date string for recency
  sourceUrl?: string;  // reference to proof when available
}

interface Restaurant {
  id: string;          // slug, stable identifier
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  cuisine?: string;
  phone?: string;
  kidsMealOffers: KidsMealOffer[];
  notes?: string;
}
```

Each search finds the ZIP's coordinates via `zipcodes.lookup()`, calculates the Haversine distance to every restaurant, and filters those within 50 miles. Results are sorted by promotion day and distance and rendered with detail cards.

## Building a Richer Database

Seed data is currently hand-curated sample records. For a production dataset consider a layered approach:

1. **Curated master table** – Use Airtable, Google Sheets, Supabase, or a lightweight Postgres instance exposed via REST. Fields should match the `Restaurant` interface, with additional workflow columns such as `status`, `last_verified_by`, and `notes`.
2. **Sourcing strategy**
   - Crowdsource submissions via a Typeform or in-app form that feeds into the table for moderation.
   - Partner with local parenting groups or coupon communities for regional coverage.
   - Monitor brands that routinely run kids-night promotions (e.g., IHOP, Applebee’s) and script reminders to re-verify monthly.
   - Optional web monitoring using services like VisualPing for restaurants' promo pages; flag changes for review instead of scraping content directly.
3. **Verification workflow**
   - Track a `verified_at` timestamp and reviewer ID.
   - Set automated reminders to reconfirm offers older than 90 days.
   - Store `source_url` to keep proof of the offer (menu page, Facebook event, etc.).

### Syncing Data Into the App

- Export the master table as JSON and drop it into `src/data/restaurants.ts` (can be automated via script).
- Alternatively, expose a read-only REST endpoint and fetch in `useRestaurantSearch`, caching responses and falling back to static data when offline.
- If the data grows large, move distance filtering server-side (Supabase `earthdistance`, PostgreSQL `postgis`, or Planetscale geospatial indexes).

## Next Steps

- Add a simple admin UI to submit new restaurants and push them into the backing store.
- Integrate geocoding for user-submitted addresses (e.g., Google Geocoding, Mapbox, or OpenCage) when moderating data.
- Layer in filters (cuisine, day of week, dine-in vs. takeout) and a map visualization.
- Implement automated `npm test` coverage once business logic expands (e.g., unit tests for the distance calculator and filtering rules).

## Project Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – type-check and create a production build
- `npm run preview` – preview the production build locally

> **Note:** Dependency installation requires network access. If you are working in a restricted environment, copy the project files first, then run `npm install` where outbound network is permitted.
