import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LogInForm from "./components/logInForm";
import NewBlog from "./components/newBlog";
import "./App.css";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [newBlog, setNewBlog] = useState(null);
  const [error, setError] = useState("");
  const NewBlogForm = useRef();
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  useEffect(() => {
    async function fetchAllBlogs() {
      try {
        const response = await blogService.getAll();
        setBlogs(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllBlogs();
    // blogService
    // .getAll()
    // .then((blogs) => setBlogs(blogs))
    // .catch((err) => console.log(err));
  }, [user]);

  useEffect(() => {
    const logedUser = window.localStorage.getItem("logedInUser");
    if (logedUser) {
      const user = JSON.parse(logedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  function handleLogIn(response) {
    const userJson = JSON.stringify(response);
    window.localStorage.setItem("logedInUser", userJson);
    setUser(response);
    blogService.setToken(response.token);
  }

  function handleLogOut() {
    window.localStorage.removeItem("logedInUser");
    blogService.setToken(null);

    setBlogs([]);
    setUser(null);
  }

  async function handleNewBlog(title, author, url) {
    window.localStorage.removeItem("logedInUser");
    try {
      const blogSaved = await blogService.newBlog(title, author, url);
      setBlogs((prev) => [...prev, blogSaved]);
      NewBlogForm.current.toggleVisibility();
      setNewBlog(blogSaved);
      setError(null);
    } catch (error) {
      setError(error.response.data.error);
    }
  }
  async function updateBlogLikes(likes, id) {
    try {
      const blogUpdated = await blogService.updateBlog(likes, id);
      setBlogs((prev) =>
        prev.map((blog) => (blog.id === blogUpdated.id ? blogUpdated : blog))
      );
      setError(null);
    } catch (error) {
      setError(error.response.data.error);
    }
  }
  async function deleteBlog(blog) {
    const { title, author, id } = blog;
    try {
      if (window.confirm(`Remove blog ${title} by ${author}`)) {
        await blogService.deleteBLog(id);
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
        setError(null);
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  }

  return (
    <div>
      {!user && <LogInForm handleLogIn={handleLogIn} />}

      {user && (
        <>
          <h2>blogs</h2>
          {error && (
            <Notification
              message={error}
              type="error"
              handleOnDismount={() => setError("")}
            />
          )}
          {newBlog && (
            <Notification
              message={`a new blog ${newBlog.title} by ${newBlog.author} was added`}
              type={"success"}
              handleOnDismount={() => setNewBlog(null)}
            />
          )}
          <p>{user.name} is logged in</p>
          <button type="button" onClick={handleLogOut}>
            log out
          </button>
          <Togglable ref={NewBlogForm} buttonText="new blog">
            <NewBlog handleNewBlog={handleNewBlog} />
          </Togglable>

          <div className="blog-list">
            {sortedBlogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={updateBlogLikes}
                hadleDeletion={deleteBlog}
                logedInUsername={user.username}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
