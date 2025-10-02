import { FormEvent } from 'react';

interface SearchFormProps {
  zip: string;
  onZipChange: (value: string) => void;
  onSubmit: () => void;
  isSearching: boolean;
  isDataLoading?: boolean;
}

export function SearchForm({ zip, onZipChange, onSubmit, isSearching, isDataLoading }: SearchFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="zip-input">Enter your ZIP code</label>
      <div className="search-input-group">
        <input
          id="zip-input"
          name="zip"
          inputMode="numeric"
          pattern="[0-9]{5}"
          placeholder="e.g. 78756"
          value={zip}
          onChange={(event) => onZipChange(event.target.value)}
          maxLength={5}
          required
        />
        <button type="submit" disabled={isSearching || isDataLoading}>
          {isDataLoading ? 'Loading data…' : isSearching ? 'Searching…' : 'Find Offers'}
        </button>
      </div>
    </form>
  );
}
