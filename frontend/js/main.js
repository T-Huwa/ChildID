document.addEventListener("DOMContentLoaded", () => {
  const auth = new Auth();
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errorDiv = document.getElementById("loginError");
      errorDiv.textContent = "";

      try {
        const user_id = document.getElementById("user_id").value;
        const password = document.getElementById("password").value;
        await auth.login(user_id, password);
        window.location.href = "dashboard.html";
      } catch (error) {
        errorDiv.textContent =
          error.message || "Login failed. Please check your credentials.";
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errorDiv = document.getElementById("registerError");
      errorDiv.textContent = "";

      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        errorDiv.textContent = "Passwords do not match";
        return;
      }

      try {
        const userData = {
          fullName: document.getElementById("fullName").value,
          user_id: document.getElementById("user_id").value,
          user_id: document.getElementById("user_id").value,
          password: password,
        };

        await auth.register(userData);
        window.location.href = "index.html";
      } catch (error) {
        errorDiv.textContent =
          error.message || "Registration failed. Please try again.";
      }
    });
  }

  auth.updateUI();

  if (auth.isAuthenticated()) {
    setInterval(() => {
      auth.refreshToken().catch(console.error);
    }, 14 * 60 * 1000);
  }
});
