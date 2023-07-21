import { Hono } from "hono";
import { MyError } from "./my_error";
import { COOKIE_NAME, priv } from "./auth/auth";
import { setCookie } from "hono/cookie";
import { UserFull } from "./models";
import bcrypt from "bcryptjs";



type Context = {
  Bindings: {
    DB: D1Database;
  };
  Variables: {};
};

const app = new Hono<Context>();

app.onError((e, c) => {
  const status_code = e instanceof MyError ? e.status : 500;
  c.status(status_code);
  return c.json({
    status: status_code,
    message: e.message,
  });
});

app.notFound((c) => {
  throw new MyError("Route not Found", 404);
});

app.get("/", async (c) => {
  throw new MyError("Nothing here", 404);
});

app.post("/login", async (c) => {
  let data = await c.req.json();
  if (!data.username || !data.password) {
    throw new MyError("Invalid login data", 400);
  }
  let fulluser: UserFull | null = await c.env.DB.prepare(
    `SELECT id, username, passwordhash, role
    FROM users WHERE username = ?`
  )
    .bind(data.username)
    .first();
  if (!fulluser) {
    throw new MyError("Invalid login data", 400);
  }

  let correct_creds = await bcrypt.compare(
    data.password,
    fulluser.passwordhash
  );
  if (!correct_creds) {
    throw new MyError("Invalid login data", 400);
  }
  const sessionid = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO sessions (session_secret, userid)
        VALUES (?, ?)`
  )
    .bind(sessionid, fulluser.id)
    .run();
  setCookie(c, COOKIE_NAME, sessionid, { httpOnly: true, secure: true });
  return c.json({ message: "logged in" });
});

app.post("/register", async (c) => {
  let data = await c.req.json();
  if (!data.username || !data.password) {
    throw new MyError("Invalid register data", 400);
  }
  const salt = await bcrypt.genSalt();
  let passwordhash = await bcrypt.hash(data.password, salt);
  let _res = await c.env.DB.prepare(
    `INSERT INTO users (username, passwordhash)
        VALUES (?, ?);`
  )
    .bind(data.username, passwordhash).run();
    // TODO catch db errors, duplicate username?
    
  return c.json({ message: "registered" });
});

app.route("/priv", priv); // add all routes from /priv to app
export default app;
