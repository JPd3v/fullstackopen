const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user");
const app = require("../app");

const api = supertest(app);

async function getUsersFromDb() {
  const response = await api.get("/api/users");
  return response.body;
}

const INITIAL_USERS = [
  {
    username: "username 1",
    name: "name 1",
    password: "123",
  },
  { username: "username 2", name: "name 2", password: "123" },
  { username: "username 3", name: "name 3", password: "123" },
];
module.exports = { INITIAL_USERS };

beforeEach(async () => {
  await User.deleteMany({});

  const userObjects = INITIAL_USERS.map((user) => new User(user));
  const userPromises = userObjects.map((user) => user.save());
  await Promise.all(userPromises);
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe("user creation", () => {
  test("creation success with 201 if all fields are valid", async () => {
    const initialUserList = await getUsersFromDb();
    const newUser = {
      username: "julian user",
      name: "julian",
      password: "123456",
    };

    await api.post("/api/users").send(newUser).expect(201);
    const finalUserList = await getUsersFromDb();
    const userNamesList = finalUserList.map((user) => user.username);

    expect(userNamesList).toContain(newUser.username);

    expect(finalUserList).toHaveLength(initialUserList.length + 1);
  });

  test("creation fails if username length is < 3", async () => {
    const initialUserList = await getUsersFromDb();
    const userWithInvalidUsername = {
      username: "ab",
      name: "a test name",
      password: "12123123",
    };

    await api.post("/api/users").send(userWithInvalidUsername).expect(400);
    const finalUserList = await getUsersFromDb();
    const userNamesList = finalUserList.map((user) => user.username);

    expect(userNamesList).not.toContain(userWithInvalidUsername.username);
    expect(finalUserList).toHaveLength(initialUserList.length);
  });

  test("creation fails if password length is < 3", async () => {
    const initialUserList = await getUsersFromDb();
    const userWithPasswordError = {
      username: "a test username",
      name: "a test name",
      password: "12",
    };

    await api.post("/api/users").send(userWithPasswordError).expect(400);
    const finalUserList = await getUsersFromDb();
    const userNamesList = finalUserList.map((user) => user.username);

    expect(userNamesList).not.toContain(userWithPasswordError.username);
    expect(finalUserList).toHaveLength(initialUserList.length);
  });
});

describe("get users", () => {
  test("should return all users", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(INITIAL_USERS.length);
  });

  test("users should not contain password field", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body[0]).not.toHaveProperty("password");
  });

  test("users have the id property instead of _id", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body[0].id).toBeDefined();
  });
});
