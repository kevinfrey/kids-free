interface SearchSummaryProps {
  zip: string;
  offerCounts: Record<string, number> | null;
  total: number;
}

export function SearchSummary({ zip, offerCounts, total }: SearchSummaryProps) {
  if (!offerCounts || total === 0) {
    return null;
  }

  return (
    <section className="search-summary">
      <h2>
        Found {total} restaurant{total === 1 ? '' : 's'} with kids-eat-free offers within 50 miles of
        {` ${zip}`}
      </h2>
      <ul>
        {Object.entries(offerCounts).map(([day, count]) => (
          <li key={day}>
            <span className="summary-day">{day}</span>
            <span className="summary-count">{count} location{count === 1 ? '' : 's'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
