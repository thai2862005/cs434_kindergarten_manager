/**
 * Mô phỏng đăng nhập: front-end gửi header "x-user-id" cho biết
 * đang thao tác với vai trò của tài khoản nào.
 */
const repo = require("../repositories/userRepository");

module.exports = function currentUser(req, res, next) {
  const id = req.header("x-user-id");
  const user = repo.findById(id);
  if (!user) return res.status(401).json({ error: "Chưa xác định người dùng" });
  req.currentUser = user;
  next();
};
