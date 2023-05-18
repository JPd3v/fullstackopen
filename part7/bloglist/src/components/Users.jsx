import { Link } from 'react-router-dom';
import { useUsers } from '../hooks';

export default function Users() {
  const users = useUsers();
  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td>
              <strong>blogs created</strong>
            </td>
          </tr>
          {users?.data?.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user?.blogs?.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
