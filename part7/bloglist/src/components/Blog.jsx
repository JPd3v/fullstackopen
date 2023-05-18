import { Link } from 'react-router-dom';

export default function Blog({ blog }) {
  const { title, author, id } = blog;

  return (
    <div className="blog">
      <Link to={`/blogs/${id}`}>{`${title} ${author}`}</Link>
    </div>
  );
}
