const express = require("express");
const userControll = require("../CONTROLLER/user.controller");
const rateLimit = require("express-rate-limit");


const registerLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, 
        max: process.env.NODE_ENV === "production"
                ? 50      
                : 10000,
        message: {
                success: false,
                message: "Too many accounts created, try again later"
        }
});

const router = express.Router();

router.post("/register", registerLimiter, userControll.createUser);
router.post("/login", registerLimiter, userControll.loginUser);
router.get("/logout", userControll.logoutUser)

module.exports = router;