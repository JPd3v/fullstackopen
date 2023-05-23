import React from "react";

export default function GenresFilter({ genres, setFilter }) {
  function handleClick(genre) {
    setFilter(genre);
  }

  return (
    <div>
      {genres.map((genre) => (
        <button type="button" key={genre} onClick={() => handleClick(genre)}>
          {genre}
        </button>
      ))}
      <button type="button" onClick={() => handleClick(null)}>
        all genres
      </button>
    </div>
  );
}
