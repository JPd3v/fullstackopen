import { useState } from "react";
import countriesService from "./services/countries";
import Countries from "./components/Countries";

function App() {
  const [countryInput, setCountryInput] = useState("");
  const [fetchResults, setFetchResults] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    countriesService
      .getAll()
      .then((response) =>
        setFetchResults(
          response.filter((country) =>
            country.name.common
              .toLowerCase()
              .includes(countryInput.toLowerCase().trim())
          )
        )
      );
  }

  function handleCountryInputChange(event) {
    setCountryInput(event.target.value);
  }

  function handleCountrySelection(name) {
    setFetchResults((prev) =>
      prev.filter((country) => country.name.common === name)
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="country-input">
          find countries
          <input
            id="country-input"
            value={countryInput}
            onChange={handleCountryInputChange}
          />
        </label>
        <button type="submit">find</button>
      </form>
      <Countries
        countries={fetchResults}
        handleCountrySelection={handleCountrySelection}
      />
    </>
  );
}

export default App;
