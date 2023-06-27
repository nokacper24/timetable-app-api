import { Hono } from "hono";
import { MyError } from "./my_error";
import { login_form } from "./auth/login_form";
import { priv } from "./auth/auth";

export const COOKIE_NAME = 'session';

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



app.get("/login-form", async (c) => {
  
  return c.html(login_form);
});


app.route('/priv', priv); // add all routes from /priv to app
export default app;


