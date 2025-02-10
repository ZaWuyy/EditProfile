const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const sendOTP = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Mã OTP xác nhận",
        text: `Mã OTP của bạn là: ${otp}`
    });
    return otp;
};

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = await sendOTP(email);
        const user = new User({ email, password: hashedPassword, otp });
        await user.save();
        res.json({ message: "OTP đã gửi, vui lòng xác nhận!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp) return res.status(400).json({ message: "OTP sai!" });

        user.isVerified = true;
        await user.save();
        res.json({ message: "Tài khoản đã xác minh!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP hết hạn sau 10 phút
    await user.save();
  
    await sendEmail(email, "Reset mật khẩu", `Mã OTP của bạn là: ${otp}`);
    res.json({ message: "OTP đã gửi qua email!" });
  };
  
  // Xác thực OTP & đặt lại mật khẩu mới
  exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
  
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn!" });
    }
  
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
  
    res.json({ message: "Mật khẩu đã được đặt lại!" });
  };