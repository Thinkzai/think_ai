const express = require("express");
const router = express.Router();
const { users } = require("../data/users");
const { roles } = require("../data/roles");
const { successResponse, errorResponse } = require("../utils/response");
const { validateUserIdParam, validateRoleBody } = require("../validations/roleValidation");

router.get("/users", (req, res) => {
  return successResponse(res, 200, "Users fetched", users);
});

router.get("/roles", (req, res) => {
  return successResponse(res, 200, "Roles fetched", roles);
});

router.post("/users/:id/assign-role", validateUserIdParam, validateRoleBody, (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;
  const user = users.find((u) => u.id === userId);
  if (!user) return errorResponse(res, 404, "User not found");
  user.role = role;
  return successResponse(res, 200, "Role assigned", user);
});

router.put("/users/:id/role", validateUserIdParam, validateRoleBody, (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;
  const user = users.find((u) => u.id === userId);
  if (!user) return errorResponse(res, 404, "User not found");
  user.role = role;
  return successResponse(res, 200, "Role updated", user);
});

// 1. Toggle User Status (Active/Inactive)
router.patch("/users/:id/status", (req, res) => {
  const userId = parseInt(req.params.id);
  const { status } = req.body; // "active" or "inactive"
  
  const user = users.find((u) => u.id === userId);
  if (!user) return errorResponse(res, 404, "User not found");
  
  user.status = status;
  return successResponse(res, 200, `User status updated to ${status}`, user);
});

// 2. Trigger Password Reset
router.post("/users/:id/reset-password", (req, res) => {
  const userId = parseInt(req.params.id);
  
  const user = users.find((u) => u.id === userId);
  if (!user) return errorResponse(res, 404, "User not found");
  
  return successResponse(res, 200, "Password reset email sent successfully", { userId });
});

// 3. Bulk Role Assignment
router.post("/users/bulk-role", (req, res) => {
  const { userIds, role } = req.body; // Array of IDs and target role
  
  if (!Array.isArray(userIds) || !role) {
    return errorResponse(res, 400, "Invalid payload");
  }

  const updatedUsers = [];
  users.forEach((u) => {
    if (userIds.includes(u.id)) {
      u.role = role;
      updatedUsers.push(u);
    }
  });

  return successResponse(res, 200, `Bulk role assigned to ${updatedUsers.length} users`, updatedUsers);
});

module.exports = router;