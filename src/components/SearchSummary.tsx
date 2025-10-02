import { DayOfWeek } from '../types';

interface SearchSummaryProps {
  zip: string;
  offerCounts: Partial<Record<DayOfWeek, number>> | null;
  total: number;
  activeDay: DayOfWeek | null;
  onSelectDay: (day: DayOfWeek) => void;
  onClearFilter?: () => void;
}

const DAY_ORDER: DayOfWeek[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export function SearchSummary({
  zip,
  offerCounts,
  total,
  activeDay,
  onSelectDay,
  onClearFilter
}: SearchSummaryProps) {
  if (!offerCounts || total === 0) {
    return null;
  }

  return (
    <section className="search-summary">
      <div className="search-summary__header">
        <h2>
          Showing {total} restaurant{total === 1 ? '' : 's'} with kids-eat-free offers within 50 miles
          of {` ${zip}`}
        </h2>
        {activeDay && onClearFilter && (
          <button type="button" className="summary-clear" onClick={onClearFilter}>
            Clear filter
          </button>
        )}
      </div>
      <ul>
        {DAY_ORDER.filter((day) => offerCounts[day] !== undefined).map((day) => {
          const count = offerCounts[day] ?? 0;
          const isActive = activeDay === day;

          return (
            <li key={day}>
              <button
                type="button"
                className={`summary-chip${isActive ? ' summary-chip--active' : ''}`}
                onClick={() => onSelectDay(day)}
                aria-pressed={isActive}
              >
                <span className="summary-day">{day}</span>
                <span className="summary-count">{count} location{count === 1 ? '' : 's'}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
