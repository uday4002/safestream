const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const { rbacMiddleware } = require("../../middlewares/rbac.middleware");
const { getUsers, updateUserRole } = require("./user.controller");

router.get("/", authMiddleware, rbacMiddleware(["admin"]), getUsers);
router.put("/:id/role", authMiddleware, rbacMiddleware(["admin"]), updateUserRole);

module.exports = router;