class AuthService {
  WP_API_BASE_URL = "";
  API_BASE_URL = "";
  constructor() {
    this.WP_API_BASE_URL = `${process.env.WP_API_BASE_URL}/wp-json/virtubooks/v1`;
    this.API_BASE_URL = process.env.API_BASE_URL;
  }

  async getUser(user) {
    const password = user.password;

    const response = await fetch(`${this.WP_API_BASE_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: user.username || user.email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate user: ", response.message);
    }
    const data = await response.json();

    return data.user;
  }

  async getUserById(id) {
    const response = await fetch(`${this.WP_API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Origin: this.API_BASE_URL,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user by ID: ", response);
    }
    const data = await response.json();

    return data.user;
  }

  async getUsers() {
    const response = await fetch(`${this.WP_API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Origin: this.API_BASE_URL,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users: ", response);
    }
    const data = await response.json();

    return data.users;
  }
}

module.exports = new AuthService();
