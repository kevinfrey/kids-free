import { RestaurantCard } from './components/RestaurantCard';
import { SearchForm } from './components/SearchForm';
import { SearchSummary } from './components/SearchSummary';
import { useRestaurantSearch } from './hooks/useRestaurantSearch';

function App() {
  const {
    zip,
    setZip,
    status,
    error,
    results,
    search,
    summary,
    isCatalogLoading,
    catalogError
  } = useRestaurantSearch();

  const activeError = error ?? catalogError;
  const isSearching = status === 'searching';

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="app-title">
        <div className="hero__content">
          <span className="hero__eyebrow">Tonight's family-friendly deals</span>
          <h1 id="app-title">Kids Eat Free Finder</h1>
          <p className="hero__lead">
            Discover Louisville-area restaurants that offer free kids meals. Drop in a ZIP code and
            we will surface verified promotions within 50 miles, complete with day, timing, and
            proof links.
          </p>
          <SearchForm
            zip={zip}
            onZipChange={setZip}
            onSubmit={search}
            isSearching={isSearching}
            isDataLoading={isCatalogLoading}
          />
          <ul className="hero__features">
            <li>Coverage across Jefferson County & nearby suburbs</li>
            <li>Sorted by offer day and distance from your ZIP</li>
            <li>Includes age limits, hours, and verification dates</li>
          </ul>
        </div>
        <aside className="hero__card" aria-hidden="true">
          <div className="hero__badge">50 mile radius</div>
          <p className="hero__card-title">Plan your week at a glance</p>
          <ul className="hero__schedule">
            <li>
              <span>Mon</span>
              <span>Mellow Mushroom</span>
            </li>
            <li>
              <span>Tue</span>
              <span>Texas Roadhouse</span>
            </li>
            <li>
              <span>Wed</span>
              <span>Skyline Chili</span>
            </li>
            <li>
              <span>Thu</span>
              <span>Kerbey Lane Cafe</span>
            </li>
            <li>
              <span>Sun</span>
              <span>Giordano&apos;s</span>
            </li>
          </ul>
        </aside>
      </section>

      <section className="content">
        {activeError && <div className="alert alert--error">{activeError}</div>}

        <SearchSummary zip={zip} offerCounts={summary} total={results.length} />

        {isCatalogLoading && <p className="loading-state">Loading restaurant data…</p>}

        {status === 'idle' && !isCatalogLoading && (
          <div className="empty-state">
            <h2>Start with your ZIP code</h2>
            <p>
              Enter a Louisville or Southern Indiana ZIP to see which restaurants are running
              kids-eat-free deals this week.
            </p>
          </div>
        )}

        {isSearching && !isCatalogLoading && (
          <p className="loading-state">Searching nearby locations…</p>
        )}

        {status === 'success' && results.length === 0 && !isCatalogLoading && (
          <div className="empty-state">
            <h2>No offers yet</h2>
            <p>
              We could not find any promotions within 50 miles of that ZIP. Try another nearby ZIP
              code or check back soon as we add more restaurants.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <section className="results" aria-live="polite">
            {results.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
