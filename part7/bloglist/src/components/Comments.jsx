import { useComments } from '../hooks';

export default function Comments({ blogId }) {
  const comments = useComments(blogId);
  return (
    <ul>
      {comments?.data?.map((comment) => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </ul>
  );
}
