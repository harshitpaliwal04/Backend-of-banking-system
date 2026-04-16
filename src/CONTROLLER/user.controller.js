const userSchema = require("./../MODEL/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BlacklistTokenModel = require("./../MODEL/logout.model");
const emailServices = require("./../SERVICES/email.services");

async function createUser(req, res) {
        try {
                const { name, email, password } = req.body;
                const userExists = await userSchema.findOne({ email });

                if (userExists) {
                        return res.status(400).json({
                                success: false,
                                message: "User already exists",
                        })
                }

                const user = await userSchema.create({
                        name,
                        email,
                        password
                });

                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                        expiresIn: "1d",
                });

                res.cookie("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict"
                });

                res.status(201).json({
                        success: true,
                        message: "User created successfully",
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        token: token,
                });

                await emailServices.sendRegistrationEmail(user.email, user.name)
        }
        catch (err) {
                return res.status(500).json({
                        success: false,
                        message: "Internal Server Error",
                        error: err.message,
                })
        }
}

async function loginUser(req, res) {
        try {
                const { email, password } = req.body;
                const user = await userSchema.findOne({ email }).select("+password");
                if (!user) {
                        return res.status(404).json({
                                success: false,
                                message: "Invalid email or password, E",
                        })
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                        return res.status(401).json({
                                success: false,
                                message: "Invalid email or password, P",
                        })
                }

                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                        expiresIn: "1d",
                });

                return res.status(200).json({
                        success: true,
                        message: "User logged in successfully",
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        token: token,
                })
        }
        catch (err) {
                return res.status(500).json({
                        success: false,
                        message: "Internal Server Error",
                        error: err.message,
                })
        }
}

async function logoutUser(req, res) {
        try {
                const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
                if (!token) {
                        return res.status(401).json({
                                success: false,
                                message: "Unauthorized",
                        })
                }
                const BlacklistToken = new BlacklistTokenModel({ token: token });
                await BlacklistToken.save();

                res.clearCookie("token");

                return res.status(200).json({
                        success: true,
                        message: "User logged out successfully",
                })
        }
        catch (err) {
                return res.status(500).json({
                        message: "Internal Server Error",
                        error: err.message,
                })

        }
}

module.exports = {
        createUser,
        loginUser,
        logoutUser,

}