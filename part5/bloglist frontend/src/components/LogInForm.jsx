import { useState } from "react";
import { logIn } from "../services/auth";
import PropTypes from "prop-types";
import Notification from "./Notification";

export default function LogInForm({ handleLogIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const logInResponse = await logIn(username, password);
      handleLogIn(logInResponse);
    } catch (error) {
      setError(error.response.data.error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>log in</h1>
      {error && (
        <Notification
          message={error}
          type="error"
          handleOnDismount={() => setError(null)}
        />
      )}
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
LogInForm.propTypes = {
  handleLogIn: PropTypes.func.isRequired,
};
