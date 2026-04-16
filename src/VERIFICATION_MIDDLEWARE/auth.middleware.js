const userModel = require("./../MODEL/user.model");
const jwt = require("jsonwebtoken");
const BlacklistTokenModel = require("./../MODEL/logout.model");

async function authMiddleware(req, res, next) {

        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
                return res.status(401).json({
                        success: false,
                        message: "Unauthorized, Token is missing",
                });
        }

        const isBlacklisted = await BlacklistTokenModel.exists({ token: token });
        if (isBlacklisted) {
                return res.status(400).json({
                        success: false,
                        message: "Unauthorized, Token is blacklisted",
                })
        }

        try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                const user = await userModel.findById(decoded._id);

                req.user = user;

                return next();
        }
        catch (err) {
                return res.status(401).json({
                        success: false,
                        message: "Unauthorized, Token is expired",
                })
        }
}

async function authSystemUserMiddleware(req, res, next) {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
                return res.status(401).json({
                        success: false,
                        message: "Unauthorized, Token is missing",
                });
        }

        const isBlacklisted = await BlacklistTokenModel.findOne({ token: token });
        if (isBlacklisted) {
                return res.status(400).json({
                        success: false,
                        message: "Unauthorized, Token is blacklisted",
                })
        }

        try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                const user = await userModel.findById(decoded._id).select("+systemUser");

                if (!user) {
                        return res.status(401).json({
                                success: false,
                                message: "Unauthorized, User not found",
                        })
                }

                if (!user.systemUser) {
                        return res.status(403).json({
                                success: false,
                                message: "Unauthorized, User is not a system user",
                        });
                }
                req.user = user;

                return next();

        }
        catch (err) {
                return res.status(401).json({
                        success: false,
                        message: "Unauthorized, Token is expired",
                })
        }
}

module.exports = { authMiddleware, authSystemUserMiddleware };