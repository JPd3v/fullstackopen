import CapitalWeather from "./CapitalWeather";

export default function CountryDetails({ country }) {
  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>capital: {country.capital}</p>
      <p>area: {country.area}</p>

      <h4>languages</h4>
      <ul>
        {Object.keys(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={`${country?.flags?.png}`} />
      <CapitalWeather city={country.capital[0]} />
    </div>
  );
}
