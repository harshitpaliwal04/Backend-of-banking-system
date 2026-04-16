const express = require("express");
const authMiddleware = require("../VERIFICATION_MIDDLEWARE/auth.middleware");
const accountController = require("../CONTROLLER/account.conroller");

const router = express.Router();

router.post("/", authMiddleware.authMiddleware, accountController.createAccount)

router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getBalance)

router.patch("/add-balance/:accountId", authMiddleware.authMiddleware, accountController.addBalance)

module.exports = router;