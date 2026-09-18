const express = require("express");
const ctrl = require("../controllers/userController");

const router = express.Router();

router.get("/", ctrl.list);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);
router.put("/:id/role", ctrl.changeRole);

module.exports = router;
