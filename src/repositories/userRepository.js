/**
 * REPOSITORY
 * Chỉ lo việc đọc/ghi dữ liệu. Không chứa quy tắc nghiệp vụ.
 * Thay bằng MySQL/MongoDB thật thì chỉ cần sửa file này.
 */
const User = require("../domain/User");

let users = [
  new User({ id: 1, name: "Nguyễn Văn Phong", email: "phong@shop.vn", role: "admin" }),
  new User({ id: 2, name: "Trần Thị Lan", email: "lan@shop.vn", role: "user" }),
  new User({ id: 3, name: "Lê Minh Khoa", email: "khoa@shop.vn", role: "user" }),
];
let nextId = 4;

module.exports = {
  findAll: () => users,
  findById: (id) => users.find((u) => u.id === Number(id)),
  create: (data) => {
    const user = new User({ id: nextId++, ...data });
    users.push(user);
    return user;
  },
  update: (id, data) => {
    const user = users.find((u) => u.id === Number(id));
    if (!user) return null;
    Object.assign(user, data);
    return user;
  },
  remove: (id) => {
    const before = users.length;
    users = users.filter((u) => u.id !== Number(id));
    return users.length < before;
  },
};
