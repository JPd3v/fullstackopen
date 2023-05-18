import { useParams } from 'react-router-dom';
import { useUsers } from '../hooks';

export default function User() {
  const { id } = useParams();
  const users = useUsers();
  const user = users?.data?.find((user) => user.id === id);

  if (!user) {
    return null;
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => {
          return <li key={blog.id}>{blog.title}</li>;
        })}
      </ul>
    </div>
  );
}
