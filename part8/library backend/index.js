require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const Authors = require("./models/author");
const Books = require("./models/book");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const typeDefs = `
  type Book {
  title: String!
  published: Int!
  author:Author!
  id:ID!
  genres:[String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    dummy: Int,
    bookCount:Int,
    authorCount:Int,
    allBooks(author:String,genre:String):[Book!]!,
    allAuthors:[Author!]!,
    me: User

  }

  type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}
  type Mutation {
  addBook(
      title: String!
      published: Int!
      author:String!
      genres:[String!]!
      ):Book
    editAuthor(
      name:String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
 type Subscription {
  bookAdded: Book!
 }
`;

const resolvers = {
  Query: {
    me: async (root, args, { currentUser }) => {
      return currentUser;
    },
    bookCount: async () => Books.find({}).countDocuments(),
    allBooks: async (root, args) => {
      const query = {};
      console.log("QUERY FOR ALL BOOKS");
      if (args.author) {
        query.author = await Authors.find({ name: args.author });
      }
      if (args.genre) {
        query.genres = args.genre;
      }
      return Books.find(query).populate("author");
    },
    authorCount: async () => Authors.find({}).countDocuments(),
    allAuthors: async () => {
      return Authors.find({});
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const { username, favoriteGenre } = args;
      const newUser = new User({ username, favoriteGenre });

      try {
        await newUser.save();
        return newUser;
      } catch (error) {
        throw new GraphQLError("User creation failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
    },
    login: async (root, args) => {
      const { username, password } = args;
      const findUser = await User.findOne({ username });

      if (!findUser || password !== "secret") {
        throw (
          (new GraphQLError("wrong username or password"),
          {
            code: "BAD_USER_INPUT",
            extends: {
              error: "wrong username or password",
            },
          })
        );
      }

      const userForToken = {
        username: findUser.username,
        id: findUser._id,
      };
      const token = jwt.sign(userForToken, process.env.JWT_SECRET);
      return { value: token };
    },

    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        let authorExists = await Authors.findOne({ name: args.author });

        if (!authorExists) {
          const newAuthor = new Authors({ name: args.author });
          await newAuthor.save();
          authorExists = newAuthor;
        }

        const newBook = new Books({
          title: args.title,
          author: authorExists._id,
          published: args.published,
          genres: args.genres,
        });

        await newBook.save();
        authorExists.bookCount += 1;
        await authorExists.save();
        newBook.author = authorExists;

        pubsub.publish("BOOK_ADDED", { bookAdded: newBook });

        return newBook;
      } catch (error) {
        throw new GraphQLError("Saving Book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        const editedAuthor = {
          name: args.name,
          born: args.setBornTo,
        };

        const authorExists = await Authors.findOneAndUpdate(
          { name: args.name },
          editedAuthor,
          { new: true }
        );
        if (!authorExists) {
          return null;
        }

        return authorExists;
      } catch (error) {
        throw new GraphQLError("Edit Author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
    },
  },
  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterator("BOOK_ADDED") },
  },
};

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
          const currentUser = await User.findById(decodedToken.id);
          return { currentUser };
        }
      },
    })
  );

  const PORT = 4000;

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  );
};

start();
