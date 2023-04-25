export default function Country({ country, handleCountrySelection }) {
  return (
    <div>
      <p>{country.name.common}</p>
      <button
        type="button"
        onClick={() => handleCountrySelection(country.name.common)}
      >
        show
      </button>
    </div>
  );
}
