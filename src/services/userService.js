/**
 * SERVICE (use-case)
 * Toàn bộ quy tắc phân quyền nằm ở đây — không nằm ở route hay UI.
 *
 * Quy tắc:
 * - User: chỉ được sửa/cập nhật chính tài khoản của mình.
 * - Admin: được tạo, xóa tài khoản và phân quyền cho người dùng khác.
 */
const repo = require("../repositories/userRepository");

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
  }
}
class NotFound extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

function list(currentUser) {
  // User chỉ thấy tài khoản của mình, admin thấy tất cả
  return currentUser.isAdmin() ? repo.findAll() : [currentUser];
}

function update(currentUser, targetId, data) {
  const target = repo.findById(targetId);
  if (!target) throw new NotFound("Không tìm thấy tài khoản");

  const isOwner = currentUser.id === target.id;
  if (!currentUser.isAdmin() && !isOwner) {
    throw new Forbidden("Bạn chỉ có thể sửa tài khoản của chính mình");
  }
  if (!currentUser.isAdmin()) {
    delete data.role; // user không được tự đổi quyền của mình
  }
  return repo.update(targetId, data);
}

function create(currentUser, data) {
  if (!currentUser.isAdmin()) throw new Forbidden("Chỉ admin được tạo tài khoản");
  return repo.create(data);
}

function remove(currentUser, targetId) {
  if (!currentUser.isAdmin()) throw new Forbidden("Chỉ admin được xóa tài khoản");
  if (currentUser.id === Number(targetId)) throw new Forbidden("Không thể tự xóa chính mình");
  if (!repo.remove(targetId)) throw new NotFound("Không tìm thấy tài khoản");
}

function changeRole(currentUser, targetId, role) {
  if (!currentUser.isAdmin()) throw new Forbidden("Chỉ admin được phân quyền");
  const target = repo.update(targetId, { role });
  if (!target) throw new NotFound("Không tìm thấy tài khoản");
  return target;
}

module.exports = { list, update, create, remove, changeRole, Forbidden, NotFound };
