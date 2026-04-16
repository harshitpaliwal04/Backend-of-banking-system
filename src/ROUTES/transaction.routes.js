const { Router } = require("express");
const authMiddleware = require("../VERIFICATION_MIDDLEWARE/auth.middleware");
const transactionController = require("../CONTROLLER/transaction.controller");

const transaction = Router();

transaction.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)

transaction.post("/system/initial-fund", authMiddleware.authSystemUserMiddleware, transactionController.systemInitialFund)

module.exports = transaction;