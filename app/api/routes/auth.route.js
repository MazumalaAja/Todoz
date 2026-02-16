// Imports
const authMiddleware = require("../../middleware/authMiddleware");
const { register, login, verify, send } = require("../controllers/auth.controller");
const router = require("express").Router();

// My-code
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/verify", authMiddleware, verify)
router.post("/auth/resendOTP", authMiddleware, send)

// Exports
module.exports = router;