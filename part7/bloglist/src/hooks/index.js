import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContextProvider';
import blogsServices from '../services/blogs';
import usersServices from '../services/users';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AuthContext } from '../context/AuthContextProvider';

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  return context;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export function useBlogs() {
  return useQuery({ queryKey: ['blogs'], queryFn: blogsServices.getAll });
}
export function useNewBlog(callback) {
  const queryClient = useQueryClient();
  const notification = useNotificationContext();
  return useMutation({
    mutationFn: ({ title, author, url }) =>
      blogsServices.newBlog(title, author, url),
    onSuccess(newBlog) {
      queryClient.setQueryData(['blogs'], (prevBlogs) => [
        ...prevBlogs,
        newBlog,
      ]);

      notification.set(
        `a new blog ${newBlog.title} by ${newBlog.author} was added`,
        'success'
      );
      callback();
    },
    onError(error) {
      console.log(error.response.data.error);
      notification.set(error.response.data.error, 'error');
    },
  });
}

export function useLikeBlog() {
  const queryClient = useQueryClient();
  const notification = useNotificationContext();
  return useMutation({
    mutationFn: ({ likes, id }) => blogsServices.likeBlog(likes, id),
    onSuccess(likedBlog) {
      queryClient.setQueryData(['blogs'], (prevBlogs) =>
        prevBlogs.map((blog) => (blog.id === likedBlog.id ? likedBlog : blog))
      );

      notification.set(
        ` ${likedBlog.title} by ${likedBlog.author} liked`,
        'success'
      );
    },
    onError(error) {
      console.log(error.response.data.error);
      notification.set(error.response.data.error, 'error');
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  const notification = useNotificationContext();
  return useMutation({
    mutationFn: (id) => blogsServices.deleteBLog(id),
    onSuccess(_likedBlog, id) {
      queryClient.setQueryData(['blogs'], (prevBlogs) =>
        prevBlogs.filter((blog) => blog.id !== id)
      );

      notification.set('blog deleted successfully', 'success');
    },
    onError(error) {
      console.log(error.response.data.error);
      notification.set(error.response.data.error, 'error');
    },
  });
}

export function useUsers() {
  return useQuery({ queryKey: ['blogs'], queryFn: usersServices.getAll });
}

export function useComments(id) {
  return useQuery({
    queryKey: ['comments', id],
    queryFn: () => blogsServices.getAllComments(id),
  });
}

export function useNewComment() {
  const queryClient = useQueryClient();
  const notification = useNotificationContext();
  return useMutation({
    mutationFn: ({ text, id }) => blogsServices.newComment(text, id),
    onSuccess(newComment) {
      queryClient.setQueryData(
        ['comments', newComment.blog_id],
        (prevBlogs) => [...prevBlogs, newComment]
      );

      notification.set(`comment added`, 'success');
    },
    onError(error) {
      console.log(error.response.data.error);
      notification.set(error.response.data.error, 'error');
    },
  });
}
