class AuthService {
  apiUrl = "";
  constructor() {
    this.apiUrl = `${process.env.WORDPRESS_API_BASE_URL}/wp-json/virtubooks/v1`;
  }

  async getUser(user) {
    const password = user.password;

    const response = await fetch(`${this.apiUrl}/auth`, {
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
}

module.exports = new AuthService();
