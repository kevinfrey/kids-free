import { useMemo, useState } from 'react';
import zipcodes from 'zipcodes';
import { restaurants } from '../data/restaurants';
import { KidsMealOffer, Restaurant } from '../types';

const SEARCH_RADIUS_MILES = 50;

type SearchStatus = 'idle' | 'searching' | 'success' | 'error';

export interface RestaurantResult extends Restaurant {
  distanceMiles: number;
  matchingOffers: KidsMealOffer[];
}

function sanitizeZip(input: string): string {
  return input.replace(/[^0-9]/g, '').slice(0, 5);
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_MILES = 3958.8;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

function sortByOfferDay(offers: KidsMealOffer[]): number {
  const order: Record<KidsMealOffer['day'], number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };

  return offers.reduce((min, offer) => Math.min(min, order[offer.day]), 10);
}

export function useRestaurantSearch() {
  const [zip, setZip] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RestaurantResult[]>([]);

  const handleZipChange = (value: string) => {
    setZip(sanitizeZip(value));
  };

  const search = () => {
    setStatus('searching');
    setError(null);

    if (zip.length !== 5) {
      setStatus('error');
      setError('Please enter a valid 5-digit ZIP code.');
      setResults([]);
      return;
    }

    const lookup = zipcodes.lookup(zip);

    if (!lookup) {
      setStatus('error');
      setError('ZIP code was not found. Try another nearby ZIP.');
      setResults([]);
      return;
    }

    const originLat = Number(lookup.latitude);
    const originLon = Number(lookup.longitude);

    const withinRadius = restaurants
      .map((restaurant) => {
        const distance = haversineDistance(
          originLat,
          originLon,
          restaurant.latitude,
          restaurant.longitude
        );

        return {
          ...restaurant,
          distanceMiles: Number(distance.toFixed(1)),
          matchingOffers: restaurant.kidsMealOffers
        } satisfies RestaurantResult;
      })
      .filter((restaurant) => restaurant.distanceMiles <= SEARCH_RADIUS_MILES)
      .sort((a, b) => {
        const offerOrder = sortByOfferDay(a.matchingOffers) - sortByOfferDay(b.matchingOffers);
        if (offerOrder !== 0) {
          return offerOrder;
        }
        return a.distanceMiles - b.distanceMiles;
      });

    setResults(withinRadius);
    setStatus('success');
  };

  const summary = useMemo(() => {
    if (status !== 'success' || results.length === 0) {
      return null;
    }

    const offersByDay = results.reduce<Record<string, number>>((acc, restaurant) => {
      restaurant.matchingOffers.forEach((offer) => {
        acc[offer.day] = (acc[offer.day] ?? 0) + 1;
      });
      return acc;
    }, {});

    return offersByDay;
  }, [results, status]);

  return {
    zip,
    setZip: handleZipChange,
    status,
    error,
    results,
    search,
    summary
  };
}
