import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import GenresFilter from "./GenresFilter";
import { useEffect, useState } from "react";

const Books = (props) => {
  const books = useQuery(ALL_BOOKS);
  const [genres, setGenres] = useState([]);

  const filteredBooks = useQuery(ALL_BOOKS);

  useEffect(() => {
    const genresSet = new Set();
    books?.data?.allBooks?.forEach((book) => {
      book.genres.forEach((genre) => genresSet.add(genre));
    });

    setGenres(Array.from(genresSet));
  }, [books?.data?.allBooks]);
  function handleFilterChange(filter) {
    filteredBooks.refetch({ genre: filter });
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks?.data?.allBooks?.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <GenresFilter genres={genres} setFilter={handleFilterChange} />
    </div>
  );
};

export default Books;
