const { registerUser, loginUser } = require("./auth.service");

const register = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        const user = await registerUser({ email, password, role });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await loginUser(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
