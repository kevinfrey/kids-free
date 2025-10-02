import { RestaurantResult } from '../hooks/useRestaurantSearch';

interface RestaurantCardProps {
  restaurant: RestaurantResult;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <article className="restaurant-card">
      <header>
        <h3>{restaurant.name}</h3>
        <p className="restaurant-distance">{restaurant.distanceMiles} miles away</p>
      </header>
      <p className="restaurant-address">
        {restaurant.address}, {restaurant.city}, {restaurant.state} {restaurant.zip}
      </p>
      {restaurant.phone && <p className="restaurant-phone">{restaurant.phone}</p>}
      {restaurant.cuisine && <p className="restaurant-cuisine">Cuisine: {restaurant.cuisine}</p>}
      <ul className="offer-list">
        {restaurant.matchingOffers.map((offer) => (
          <li key={`${restaurant.id}-${offer.day}`}>
            <span className="offer-day">{offer.day}</span>
            <span className="offer-details">{offer.details}</span>
            {offer.timeWindow && <span className="offer-time">Hours: {offer.timeWindow}</span>}
            {offer.ageLimit && <span className="offer-age">Ages: {offer.ageLimit}</span>}
            {offer.verifiedAt && (
              <span className="offer-verified">Last verified: {offer.verifiedAt}</span>
            )}
            {offer.sourceUrl && (
              <a
                className="offer-source"
                href={offer.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                More info
              </a>
            )}
          </li>
        ))}
      </ul>
      {restaurant.notes && <p className="restaurant-notes">{restaurant.notes}</p>}
    </article>
  );
}
