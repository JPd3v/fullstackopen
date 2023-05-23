import { useQuery } from "@apollo/client";
import React from "react";
import { ALL_BOOKS, ME } from "../queries";

export default function RecommendedBooks() {
  const me = useQuery(ME);
  const favoriteGenre = me?.data?.me.favoriteGenre;
  const books = useQuery(ALL_BOOKS, { variables: { genre: favoriteGenre } });
  if (!favoriteGenre) {
    return null;
  }

  return (
    <div>
      <h1>recommendations</h1>
      <p>recommended books based on your favorite genre: {favoriteGenre}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books?.data?.allBooks?.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
