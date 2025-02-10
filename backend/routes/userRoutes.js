const express = require("express");
const { updateProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();
router.put("/update", authMiddleware, upload.single("avatar"), updateProfile);

module.exports = router;