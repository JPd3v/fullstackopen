import { useRef } from 'react';
import { useBlogs } from '../hooks';
import Togglable from './Togglable';
import NewBlog from './newBlog';
import Blog from './Blog';

export default function BlogsPage() {
  const blogs = useBlogs();
  const sortedBlogs = blogs?.data?.sort((a, b) => b.likes - a.likes);
  const NewBlogForm = useRef();

  async function handleCloseForm() {
    NewBlogForm.current.toggleVisibility();
  }

  return (
    <div>
      <h2>blogs</h2>

      <Togglable ref={NewBlogForm} buttonText="new blog">
        <NewBlog onCreation={handleCloseForm} />
      </Togglable>
      <div className="blog-list">
        {sortedBlogs?.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
