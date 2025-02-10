const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    otp: String,
    isVerified: { type: Boolean, default: false },
    avatar: String, 
});

module.exports = mongoose.model("User", UserSchema);