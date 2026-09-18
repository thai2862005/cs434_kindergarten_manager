/**
 * DOMAIN
 * Thực thể thuần, không phụ thuộc Express hay bất kỳ framework nào.
 */
class User {
  constructor({ id, name, email, role = "user" }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role; // "user" | "admin"
  }

  isAdmin() {
    return this.role === "admin";
  }
}

module.exports = User;
