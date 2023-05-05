const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

router.get("/", async (_request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", { blogs: 0 });
    response.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  const {
 title, url, likes, author,
} = request.body;
  const { user } = request;

  try {
    const findUser = await User.findById(user.id);
    const blog = new Blog({
 title, url, likes, author, user: user.id,
});

    const savedBlog = await blog.save();
    findUser.blogs.push(savedBlog._id);
    await findUser.save();

    return response.status(201).json(savedBlog);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (request, response, next) => {
  const { id } = request.params;
  const { user } = request;
  try {
    const foundBlog = await Blog.findById(id);
    if (!foundBlog) {
      return response.status(404).json({ error: "blog not found" });
    }

    if (foundBlog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(id);
      return response.status(204).end();
    }

    return response.status(403).json({ error: "Unauthorized" });
  } catch (error) {
    return next(error);
  }
});
router.put("/:id", async (request, response, next) => {
  const { id } = request.params;
  const {
 title, author, url, likes,
} = request.body;
  const { user } = request;
  const blogChanges = {
    title,
    author,
    url,
    likes,
  };

  try {
    const foundBlog = await Blog.findById(id);

    if (!foundBlog) {
      return response.status(404).json({ error: "blog not found" });
    }

    if (foundBlog.user.toString() === user.id.toString()) {
      const updateBlog = await Blog.findByIdAndUpdate(id, blogChanges, {
        runValidators: true,
        new: true,
      });

      return response.status(200).json(updateBlog);
    }
    return response.status(403).json({ error: "Unauthorized" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
