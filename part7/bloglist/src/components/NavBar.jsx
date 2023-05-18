import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';

export default function NavBar() {
  const { user, logOut } = useAuth();

  return user ? (
    <nav className="nav-bar">
      <ul className="nav-bar__list">
        <li>
          <Link to="/blogs">blogs</Link>
        </li>
        <li>
          <Link to="/users">users</Link>
        </li>
      </ul>
      <p>{user.name} is logged in</p>
      <button type="button" onClick={logOut}>
        log out
      </button>
    </nav>
  ) : null;
}
