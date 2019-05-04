import "reflect-metadata";
import { ApolloServer, Config } from "apollo-server-express";
import Express from "express";
import cors from "cors";
import session from "express-session";
import connectRedis from "connect-redis";
// import { formatArgumentValidationError } from "type-graphql";
import * as path from "path";
import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions
} from "typeorm";
import { createSchema } from "./utils/createSchema";
import { redis } from "./redis";

const main = async () => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions(
    process.env.NODE_ENV === "production" ? "production" : "default"
  );
  await createConnection({
    ...connectionOptions,
    name: "default"
  });
  const apolloServerOptions: Config = {
    schema: await createSchema(),
    // formatError: formatArgumentValidationError,
    playground: true,
    context: ({ req, res }: any) => ({ req, res })
  };
  if (process.env.NODE_ENV === "production") {
    apolloServerOptions.introspection = true;
  }
  const apolloServer = new ApolloServer(apolloServerOptions);
  const app = Express();
  const RedisStore = connectRedis(session);
  app.use(Express.static("assets"));
  app.use(
    cors({
      credentials: true,
      origin: true
    })
  );
  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );
  app.get("/", (_, res) => {
    res.send("Working");
  });
  const port = process.env.PORT || 8080;
  app.use(Express.static(path.join(__dirname, "assets")));
  apolloServer.applyMiddleware({
    app,
    cors: false
  });
  app.listen(port, () => {
    console.log(
      `server is running on post ${port} ${process.env.SERVER_URL}/graphql`
    );
  });
};
main();
