import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "lireddit",
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  type: "postgresql",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
