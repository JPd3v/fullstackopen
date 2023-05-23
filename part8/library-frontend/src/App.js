import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import LogInForm from "./components/LogInForm";
import NewBook from "./components/NewBook";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useApolloClient, useSubscription } from "@apollo/client";
import RecommendedBooks from "./components/RecommendedBooks";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";

const App = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const client = useApolloClient();

  const navigate = useNavigate();
  console.log(loggedUser);
  useEffect(() => {
    const user = window.localStorage.getItem("phonenumbers-user-token");
    if (user) {
      setLoggedUser(user);
    }
  }, [loggedUser]);

  function handleLogOut() {
    setLoggedUser(null);
    window.localStorage.removeItem("phonenumbers-user-token");
    client.resetStore();
  }

  useSubscription(BOOK_ADDED, {
    onData({ data }) {
      const bookAdded = data.data.bookAdded;
      alert(`book ${bookAdded.title} from ${bookAdded.author.name} added`);
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return { allBooks: [...allBooks, bookAdded] };
      });
    },
  });

  return (
    <div>
      <div>
        <button onClick={() => navigate("authors")}>authors</button>
        <button onClick={() => navigate("books")}>books</button>
        <button onClick={() => navigate("add")}>add book</button>
        {loggedUser ? (
          <>
            <button onClick={() => navigate("recommended")}>recommendations</button>

            <button onClick={handleLogOut}>log out</button>
          </>
        ) : (
          <button onClick={() => navigate("login")}>log in</button>
        )}
      </div>
      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
        <Route path="/recommended" element={<RecommendedBooks />} />
        <Route path="/login" element={<LogInForm setLoggedUser={setLoggedUser} />} />
      </Routes>
    </div>
  );
};

export default App;
