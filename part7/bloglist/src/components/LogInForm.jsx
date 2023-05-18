import { useState } from 'react';

import { useAuth } from '../hooks';

export default function LogInForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  function handleSubmit(event) {
    event.preventDefault();

    auth.logIn(username, password);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>log in</h1>

      <label htmlFor="username">
        username
        <input
          id="username"
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </label>
      <label htmlFor="password">
        password
        <input
          id="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </label>
      <button type="submit">log in </button>
    </form>
  );
}
