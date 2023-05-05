const mongoose = require("mongoose");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const { INITIAL_USERS } = require("./userApi.test");

const INITIAL_BLOGS = [
  {
    title: "blog 1 ",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    author: "Edsger W. Dijkstra",
    likes: 1,
    user: "6453269e223c193467133e6c",
  },
  {
    title: "blog 2 ",
    url: "http://www.amazon.com",
    author: "jean M",
    likes: 99,
    user: "6453269e223c193467133e6c",
  },
  {
    title: "blog 3 ",
    url: "http://www.google.com",
    author: "maria L",
    likes: 99,
    user: "6453269e223c193467133e6c",
  },
];

const api = supertest(app);

let userForTesting;
let jwtBearerToken;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const usersObjects = INITIAL_USERS.map(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return new User({ ...user, password: hashedPassword });
  });
  const userWithPasswordHashed = await Promise.all(usersObjects);

  const usersPromiseArray = userWithPasswordHashed.map((user) => user.save());
  const savedUsers = await Promise.all(usersPromiseArray);
  userForTesting = savedUsers[1];

  const blogObjects = INITIAL_BLOGS.map(
    (blog, i) => new Blog({ ...blog, user: savedUsers[i]._id }),
  );

  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  const respone = await api.post("/api/login").send(INITIAL_USERS[1]);

  jwtBearerToken = `Bearer ${respone.body.token}`;
});

describe("get multiple blogs", () => {
  test("gets auth error if a valid jwt is not provided", async () => {
    await api
      .get("/api/blogs")
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .set("Authorization", jwtBearerToken)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs").set("Authorization", jwtBearerToken);

    expect(response.body).toHaveLength(3);
  });

  test("blogs have the id property instead of _id", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", jwtBearerToken)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body[0].id).toBeDefined();
  });
});

describe("blog creation", () => {
  test("gets auth error if a valid jwt is not provided", async () => {
    const newBlog = {
      title: "test blog",
      author: "author of the test blog",
      url: "http://blog.test.com/test",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
  test("blogs are created successfully and added to user blogs", async () => {
    const newBlog = {
      title: "test blog",
      author: "author of the test blog",
      url: "http://blog.test.com/test",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", jwtBearerToken)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const updatedBlogs = await api.get("/api/blogs").set("Authorization", jwtBearerToken);

    const blogsTitles = updatedBlogs.body.map((blog) => blog.title);
    expect(updatedBlogs.body).toHaveLength(INITIAL_BLOGS.length + 1);
    expect(blogsTitles).toContain(newBlog.title);
  });

  test("likes are setted to 0 if they aren't provided in the request", async () => {
    const newBlog = {
      title: "test blog",
      author: "author of the test blog",
      url: "http://blog.test.com/test",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", jwtBearerToken)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(response.body.likes).toBe(0);
  });

  test("Blog creation fails if title and url is not provided", async () => {
    const incompleteBlog = {
      author: "author of the test blog",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", jwtBearerToken)
      .send(incompleteBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const updatedBlogs = await api.get("/api/blogs").set("Authorization", jwtBearerToken);
    const blogsTitles = updatedBlogs.body.map((blog) => blog.title);
    expect(updatedBlogs.body).toHaveLength(INITIAL_BLOGS.length);
    expect(blogsTitles).not.toContain(incompleteBlog.title);
  });
});

describe("blog deletion", () => {
  test("succesfully deletes a blog if user is the creator", async () => {
    const initialList = await api.get("/api/blogs").set("Authorization", jwtBearerToken);
    const blogCreatedByUser = await Blog.findOne({ user: userForTesting._id });

    await api
      .delete(`/api/blogs/${blogCreatedByUser._id}`)
      .set("Authorization", jwtBearerToken)
      .expect(204);

    const blogsList = await api.get("/api/blogs").set("Authorization", jwtBearerToken);

    const blogsTitles = blogsList.body.map((blog) => blog.title);
    expect(blogsTitles).not.toContain(blogCreatedByUser.title);
    expect(blogsList.body).toHaveLength(initialList.body.length - 1);
  });
});

test("fails when user try to delete blogs that does not belongs to him", async () => {
  const initialList = await api.get("/api/blogs").set("Authorization", jwtBearerToken);
  const id = userForTesting._id;
  const blogNotCreatedByUser = await Blog.findOne({ user: { $ne: id } });
  await api
    .delete(`/api/blogs/${blogNotCreatedByUser._id}`)
    .set("Authorization", jwtBearerToken)
    .expect(403);

  const blogsList = await api.get("/api/blogs").set("Authorization", jwtBearerToken);

  const blogsTitles = blogsList.body.map((blog) => blog.title);
  expect(blogsTitles).toContain(blogNotCreatedByUser.title);
  expect(blogsList.body).toHaveLength(initialList.body.length);
});

test("fails with status code 400 when invalid id is provided", async () => {
  const invalidId = "5a422aa71b54a676234d17f8b7v2";
  const initialList = await api.get("/api/blogs/").set("Authorization", jwtBearerToken);

  await api
    .delete(`/api/blogs/${invalidId}`)
    .set("Authorization", jwtBearerToken)
    .expect(400);

  const blogsList = await api.get("/api/blogs/").set("Authorization", jwtBearerToken);
  expect(blogsList.body).toHaveLength(initialList.body.length);
});

test("fails with status code 404 if blog doesnt exists", async () => {
  const noExistantBlogId = "64542c6787a85a10729369f4";
  const initialList = await api.get("/api/blogs/").set("Authorization", jwtBearerToken);

  await api
    .delete(`/api/blogs/${noExistantBlogId}`)
    .set("Authorization", jwtBearerToken)
    .expect(404);

  const blogsList = await api.get("/api/blogs/").set("Authorization", jwtBearerToken);
  expect(blogsList.body).toHaveLength(initialList.body.length);
});

describe("blog edition", () => {
  test("fails when user try to edit blogs that does not belongs to him", async () => {
    const id = userForTesting._id;
    const blogNotCreatedByUser = await Blog.findOne({ user: { $ne: id } });

    const blogUpdate = {
      title: "updated title",
      author: "updated author",
      url: "updated url",
      likes: 99,
    };

    await api
      .put(`/api/blogs/${blogNotCreatedByUser._id}`)
      .set("Authorization", jwtBearerToken)
      .send(blogUpdate)
      .expect(403);

    const findBlog = await Blog.findById(blogNotCreatedByUser._id);
    expect(findBlog).not.toMatchObject(blogUpdate);
  });

  test("returns 404 status code if not found", async () => {
    const notExistingBlogId = "6453269e223c193467133e6c";

    const blogUpdate = {
      title: "not found blog",
      author: "not found blog",
      url: "not found blog",
      likes: 99,
    };

    await api
      .put(`/api/blogs/${notExistingBlogId}`)
      .set("Authorization", jwtBearerToken)
      .send(blogUpdate)
      .expect(404);

    const blogsList = await api.get("/api/blogs/").set("Authorization", jwtBearerToken);
    const blogsTitles = blogsList.body.map((blog) => blog.title);

    expect(blogsTitles).not.toContain(blogUpdate.title);
  });

  test("updates only blog like property and returns it", async () => {
    const blogCreatedByUser = await Blog.findOne({ user: userForTesting._id });
    const blogId = blogCreatedByUser._id;

    const blogUpdate = {
      likes: 9999999,
    };

    const response = await api
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", jwtBearerToken)
      .send(blogUpdate)
      .expect(200);
    expect(response.body).toMatchObject(blogUpdate);

    const blogsList = await api.get("/api/blogs/").set("Authorization", jwtBearerToken);
    const blogsTitles = blogsList.body.map((blog) => blog.likes);

    expect(blogsTitles).toContain(blogUpdate.likes);
  });

  test("updates the blog if user is the owner", async () => {
    const blogCreatedByUser = await Blog.findOne({ user: userForTesting._id });
    const blogId = blogCreatedByUser._id;

    const blogUpdate = {
      title: "updated title",
      author: "updated author",
      url: "updated url",
      likes: 99,
    };

    const response = await api
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", jwtBearerToken)
      .send(blogUpdate)
      .expect(200);
    expect(response.body).toMatchObject(blogUpdate);

    const updatedBlog = await Blog.findById(blogId);

    expect(updatedBlog).toMatchObject(blogUpdate);
  });

  test("fails with status code 400 when the update values breaks the schema validations", async () => {
    const blogCreatedByUser = await Blog.findOne({ user: userForTesting._id });
    const blogId = blogCreatedByUser._id;

    const invalidBlogUpdate = {
      title: null,
      author: null,
      url: null,
      likes: null,
    };
    await api
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", jwtBearerToken)
      .send(invalidBlogUpdate)
      .expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
