/* eslint-disable react/prop-types */
import { useState } from "react";

export default function NewBlog({ handleNewBlog }) {
  const [title, setTitle] = useState("");
  const [author, setauthor] = useState("");
  const [url, setUrl] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    handleNewBlog(title, author, url);
    setTitle("");
    setauthor("");
    setUrl("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>create new</h1>
      <label htmlFor="title">
        Title
        <input
          id="title"
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </label>
      <label htmlFor="author">
        Author
        <input
          id="author"
          type="text"
          value={author}
          onChange={({ target }) => setauthor(target.value)}
        />
      </label>
      <label htmlFor="url">
        Url
        <input
          id="url"
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </label>
      <button type="submit">create</button>
    </form>
  );
}
