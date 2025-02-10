const express = require("express");
const { register, verifyOTP } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);  

module.exports = router;