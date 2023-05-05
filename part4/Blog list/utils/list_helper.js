/* eslint-disable no-return-assign */
/* eslint-disable comma-dangle */
const dummy = (_blogs) => 1;
function totalLikes(blogs) {
  return blogs.reduce((prev, current) => prev + current.likes, 0);
}

function favoriteBlog(blogs) {
  if (!blogs.length) return [];
  return blogs.reduce((prev, current) => (prev.likes < current.likes ? current : prev));
}

function mostBlogs(blogs) {
  if (!blogs.length) return [];
  let authorsList = {};

  blogs.map((currentBlog) => (authorsList[currentBlog.author]
      ? (authorsList[currentBlog.author].blogs += 1)
      : (authorsList = {
          ...authorsList,
          [currentBlog.author]: { author: currentBlog.author, blogs: 1 },
        })));

  return Object.values(authorsList).reduce((prev, current) => (prev.blogs < current.blogs ? current : prev));
}
function mostLikes(blogs) {
  if (!blogs.length) return [];
  let authorsList = {};

  blogs.map((currentBlog) => (authorsList[currentBlog.author]
      ? (authorsList[currentBlog.author].likes += currentBlog.likes)
      : (authorsList = {
          ...authorsList,
          [currentBlog.author]: {
            author: currentBlog.author,
            likes: currentBlog.likes,
          },
        })));

  return Object.values(authorsList).reduce((prev, current) => (prev.likes < current.likes ? current : prev));
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
