export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export interface KidsMealOffer {
  day: DayOfWeek;
  details: string;
  timeWindow?: string;
  ageLimit?: string;
  verifiedAt?: string;
  sourceUrl?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  phone?: string;
  cuisine?: string;
  kidsMealOffers: KidsMealOffer[];
  notes?: string;
}
