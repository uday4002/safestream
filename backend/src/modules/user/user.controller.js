const User = require("./user.model");

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("email role createdAt").sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.params.id;

        // Prevent admin from demoting themselves
        if (req.user.id === userId && role !== "admin") {
            return res.status(400).json({ message: "Cannot change your own role" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = role;
        await user.save();

        res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: "Failed to update user role" });
    }
};

module.exports = {
    getUsers,
    updateUserRole
};