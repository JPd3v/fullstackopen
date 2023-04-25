import Country from "./Country";
import CountryDetails from "./CountryDetails";

export default function Countries({ countries, handleCountrySelection }) {
  if (countries.length === 1) return <CountryDetails country={countries[0]} />;
  return (
    <div>
      {countries.length >= 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        countries.map((country) => (
          <Country
            key={country.name.common}
            country={country}
            handleCountrySelection={handleCountrySelection}
          />
        ))
      )}
    </div>
  );
}
