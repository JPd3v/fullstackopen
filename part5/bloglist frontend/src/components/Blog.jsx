import { useState } from "react";

/* eslint-disable react/prop-types */
export default function Blog({ blog, handleLike, hadleDeletion, logedInUsername }) {
  const { title, author, url, likes, user, id } = blog;

  const [showDetails, setShowDetails] = useState(false);

  function onLike() {
    handleLike(likes, id);
  }

  function onDeletion() {
    hadleDeletion(blog);
  }
  return (
    <div className="blog">
      <p>{title}</p>
      <p>{author}</p>
      {
        <button onClick={() => setShowDetails((prev) => !prev)}>
          {showDetails ? "hide" : "view"}
        </button>
      }
      {showDetails && (
        <>
          <p>{url}</p>

          <p>likes:{likes}</p>
          <button onClick={() => onLike()}>like</button>

          <p>{user?.name}</p>
          {user?.username === logedInUsername && (
            <button onClick={() => onDeletion()}>delete</button>
          )}
        </>
      )}
    </div>
  );
}
