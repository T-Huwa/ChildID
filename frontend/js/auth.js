class Auth {
  constructor() {
    this.apiUrl = "http://localhost:3000/api";
    this.token = localStorage.getItem("token");
    this.user = JSON.parse(localStorage.getItem("user") || "null");
    this.setupLogoutHandler();
  }

  setupLogoutHandler() {
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      this.updateUI();
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(user_id, password) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);

        throw new Error(error.error || "Login failed");
      }

      const data = await response.json();
      console.log(data);

      //this.token = data.token;
      //this.user = data.user;
      //localStorage.setItem("token", data.token);
      //localStorage.setItem("user", JSON.stringify(data.user));
      this.updateUI();

      //window.location.href = "dashboard.html";

      return data;
    } catch (error) {
      console.error("Login error:");
      console.error(error);

      throw error;
    }
  }

  async verifyAge(proof) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/verify-age`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ proof }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Age verification failed");
      }

      const data = await response.json();
      this.user = { ...this.user, ageVerified: true };
      localStorage.setItem("user", JSON.stringify(this.user));
      return data;
    } catch (error) {
      console.error("Verification error:", error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const response = await fetch(`${this.apiUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      this.token = data.token;
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error("Token refresh error:", error);
      this.logout();
      throw error;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.updateUI();
    window.location.href = "login.html";
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  updateUI() {
    const isAuth = this.isAuthenticated();

    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const logoutLink = document.getElementById("logoutLink");
    const profileLink = document.getElementById("profileLink");

    if (loginLink) loginLink.style.display = isAuth ? "none" : "block";
    if (registerLink) registerLink.style.display = isAuth ? "none" : "block";
    if (logoutLink) logoutLink.style.display = isAuth ? "block" : "none";
    if (profileLink) {
      profileLink.style.display = isAuth ? "block" : "none";
      if (isAuth) {
        profileLink.href = `profile.html`;
      }
    }

    const userInfo = document.getElementById("userInfo");
    if (userInfo && this.user) {
      userInfo.innerHTML = `
                <div class="space-y-4">
                    <p class="text-lg"><strong>Name:</strong> ${
                      this.user.fullName
                    }</p>
                    <p class="text-lg"><strong>Username:</strong> ${
                      this.user.user_id
                    }</p>
                    <p class="text-lg"><strong>User ID:</strong> ${
                      this.user.user_id
                    }</p>
                    <p class="text-lg"><strong>Age Verified:</strong> 
                        <span class="${
                          this.user.ageVerified
                            ? "text-green-600"
                            : "text-red-600"
                        }">
                            ${this.user.ageVerified ? "Yes" : "No"}
                        </span>
                    </p>
                </div>
            `;
    }
  }

  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }
}
