const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User không tồn tại" });

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            user.avatar = result.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        await user.save();

        res.json({ message: "Cập nhật thành công", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};