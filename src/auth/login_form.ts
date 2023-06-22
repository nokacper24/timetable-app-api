export const login_form = `
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