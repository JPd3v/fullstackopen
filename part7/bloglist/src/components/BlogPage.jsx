import { useParams } from 'react-router-dom';
import { useAuth, useBlogs, useDeleteBlog, useLikeBlog } from '../hooks';
import CommentForm from './CommentForm';
import Comments from './comments';

export default function BlogPage() {
  const { id } = useParams();
  const like = useLikeBlog();
  const deleteBlog = useDeleteBlog();
  const blogs = useBlogs();
  const { username } = useAuth();

  const blog = blogs?.data?.find((blog) => blog.id === id);

  function onLike() {
    const { likes, id } = blog;
    like.mutate({ likes, id });
  }

  function onDeletion() {
    deleteBlog.mutate(id);
  }

  if (!blog) {
    return null;
  }
  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.author}</p>
      <a href={blog.url}>{blog.url}</a>

      <p>likes:{blog.likes}</p>
      <button onClick={() => onLike()}>like</button>

      <p>added by {blog.user?.name}</p>
      {blog.user?.username === username && (
        <button onClick={() => onDeletion()}>delete</button>
      )}

      <h3>comments</h3>
      <CommentForm blogId={blog.id} />
      <Comments blogId={blog.id} />
    </div>
  );
}
