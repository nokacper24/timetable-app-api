import { Hono } from "hono";
import { auth_middleware } from "./auth/auth";
import { MyError } from "./my_error";

type Context = {
  Bindings: {
    DB: D1Database;
  };
  Variables: {
    user: User;
  };
};

const app = new Hono<Context>();

app.onError((e, c) => {
  e instanceof MyError ? c.status(e.status) : c.status(500);
  return c.json({
    message: e.message
  });
});

app.notFound((c) => {
  throw new MyError("Not Found", 404);
});

app.get("/", async (c) => {
  return c.json({ message: "Hello from worker!!!" });
});

app.get("/error", async (c) => {
  throw new MyError("This is a custom error", 400);
});

app.get("/users", async (c) => {
  let user: User = await c.env.DB.prepare("SELECT * FROM users").first();
  return c.json(user);
});

app.get("/user", auth_middleware, async (c) => {
  const user = c.get("user");
  return c.json(user);
});

app.get("/login-form", async (c) => {
  const html = `
    <!DOCTYPE html>
<html>
<head>
  <title>Login Form</title>
</head>
<body>
  <div class="container">
    <h2>Login</h2>
    <form id="loginForm">
      <input type="text" id="username" placeholder="Username" required><br>
      <input type="password" id="password" placeholder="Password" required><br>
      <button type="submit">Login</button>
    </form>
  </div>

  <script>
    document.getElementById("loginForm").addEventListener("submit", function(event) {
      event.preventDefault();
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;

      // Here you can perform your API login request using the username and password
      // For demonstration purposes, we'll just log the values to the console
      console.log("Username: " + username);
      console.log("Password: " + password);

      // Reset the form
      document.getElementById("loginForm").reset();
    });
  </script>
</body>
</html>
`;
  return c.html(html);
});

export default app;

export interface User {
  id: number;
  username: string;
  passhash: string;
  role: string;
}
