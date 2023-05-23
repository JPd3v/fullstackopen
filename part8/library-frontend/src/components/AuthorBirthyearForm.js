import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

export default function AuthorBirthyearForm() {
  const [name, setName] = useState("");
  const [birthyear, setBirthyear] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const allAuthors = useQuery(ALL_AUTHORS);

  function handleSubmit(e) {
    e.preventDefault();
    editAuthor({ variables: { name, setBornTo: Number(birthyear) } });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Set birthyear</h1>
      <label htmlFor="name">
        name
        <select id="name" value={name} onChange={({ target }) => setName(target.value)}>
          <option value="" disabled>
            Select Author
          </option>
          {allAuthors?.data?.allAuthors.map((author) => {
            return <option value={author.name}>{author.name}</option>;
          })}
        </select>
      </label>

      <label htmlFor="birthyear">
        birthyear
        <input
          type="number"
          id="birthyear"
          onChange={({ target }) => setBirthyear(target.value)}
        />
      </label>
      <button type="submit">edit</button>
    </form>
  );
}
