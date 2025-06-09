const express = require("express");
const router = express.Router();
const userContoller = require("../controllers/userContoller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", userContoller.registration);
router.post("/login", userContoller.login);
router.get("/auth", authMiddleware, userContoller.check);

module.exports = router;
