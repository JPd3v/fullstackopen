import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { LOG_IN } from "../queries";

export default function LogInForm({ setLoggedUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [logIn] = useMutation(LOG_IN, {
    onCompleted({ login }) {
      setLoggedUser(login.value);
      window.localStorage.setItem("phonenumbers-user-token", login.value);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    logIn({ variables: { username, password } });
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>log in </h2>
      <label htmlFor="username">
        Username
        <input
          id="username"
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </label>
      <label htmlFor="password">
        Password
        <input
          id="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </label>
      <button type="submit">submit</button>
    </form>
  );
}
