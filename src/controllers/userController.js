/**
 * CONTROLLER
 * Chỉ chuyển đổi request <-> service. Bắt lỗi và trả mã HTTP phù hợp.
 */
const service = require("../services/userService");

const handle = (fn) => (req, res) => {
  try {
    res.json(fn(req));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Lỗi hệ thống" });
  }
};

exports.list = handle((req) => service.list(req.currentUser));

exports.update = handle((req) => service.update(req.currentUser, req.params.id, req.body));

exports.create = handle((req) => service.create(req.currentUser, req.body));

exports.remove = handle((req) => {
  service.remove(req.currentUser, req.params.id);
  return { success: true };
});

exports.changeRole = handle((req) =>
  service.changeRole(req.currentUser, req.params.id, req.body.role)
);
