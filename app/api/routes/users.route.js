const authMiddleware = require("../../middleware/authMiddleware");
const { insert, update, deleteUser } = require("../controllers/users.controller");

// Imports
const router = require("express").Router();

// My-code
router.post("/users", authMiddleware, insert);
router.put("/users/:id", authMiddleware, update);
router.delete("/users/:id", authMiddleware, deleteUser);

// Exports
module.exports = router;