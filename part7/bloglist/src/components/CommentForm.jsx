import { useState } from 'react';
import { useNewComment } from '../hooks';

export default function CommentForm({ blogId }) {
  const [comment, setComment] = useState('');
  const newComment = useNewComment();

  function handleSubmit(event) {
    event.preventDefault();
    newComment.mutate({ text: comment, id: blogId });
    setComment('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="comment">
        Comment
        <input
          type="text"
          id="comment"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
      </label>

      <button type="submit">send</button>
    </form>
  );
}
