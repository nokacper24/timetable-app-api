import { Hono } from "hono";
import { MyError } from "./my_error";
import { login_form } from "./auth/login_form";
import { User } from "./models";
import { auth_middleware } from "./auth/auth";
import { setCookie } from "hono/cookie";

export const COOKIE_NAME = 'session';

type Context = {
  Bindings: {
    DB: D1Database;
  };
  Variables: {};
};

type ContextLoggedIn = {
  Bindings: {
    DB: D1Database;
  };
  Variables: {
    user: User;
  };
};

const app = new Hono<Context>();
export const priv = new Hono<ContextLoggedIn>();
// priv.use('*', auth_middleware);

priv.get('/me', auth_middleware, async (c) => {
  const user = c.get('user');
  return c.json(user);
});

priv.get('/setcookie', async (c) => {
  setCookie(c, COOKIE_NAME, 'sessionid');
  return c.json({ message: 'cookie set' });
});

app.onError((e, c) => {
  const status_code = e instanceof MyError ? e.status : 500;
  c.status(status_code);
  return c.json({
    status: status_code,
    message: e.message,
  });
});

app.notFound((c) => {
  throw new MyError("Not Found", 404);
});

app.get("/", async (c) => {
  throw new MyError("Nothing here", 404);
});



app.get("/login-form", async (c) => {
  
  return c.html(login_form);
});




app.route('/priv', priv);
export default app;


