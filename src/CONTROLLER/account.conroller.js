const accountModel = require("../MODEL/account.model");
const AddBalanceSchema = require("../MODEL/UpdateBalance.model");

async function createAccount(req, res) {
        const user = req.user;

        const account = await accountModel.create({
                user: user._id,
        });

        return res.status(201).json({
                success: true,
                message: "Account created successfully",
                account: account,
        });
}

async function getAccount(req, res) {
        const user = req.user;

        const account = await accountModel.find({ user: user._id });

        return res.status(200).json({
                success: true,
                message: "Account fetched successfully",
                account: account,
        });
}

async function getBalance(req, res) {
        const { accountId } = req.params;
        const account = await accountModel.findOne({ _id: accountId, user: req.user._id });
        if (!account) {
                return res.status(404).json({
                        success: false,
                        message: "Account not found",
                })
        }

        const Account_Data = await accountModel.findOne({ _id: accountId, user: req.user._id });
        return res.status(200).json({
                success: true,
                message: "Balance fetched successfully",
                accountId: Account_Data._id,
                balance: Account_Data.balance,
        })
}

async function addBalance(req, res) {
        try {
                const { balance, idempotencyKey } = req.body;
                const { accountId } = req.params;

                if (!balance || balance <= 0 || !idempotencyKey) {
                        return res.status(400).json({
                                success: false,
                                message: "Please enter a valid balance to add",
                        })
                }

                const account = await accountModel.findOneAndUpdate(
                        { _id: accountId, status: "Active" },
                        { $inc: { balance: balance } },
                        { idempotencyKey: idempotencyKey },
                        { new: true, runValidators: true }
                );

                if (!account) {
                        return res.status(404).json({
                                success: false,
                                message: "Account not found",
                        });
                }

                const UpdatedData = await AddBalanceSchema.create({
                        account: account._id,
                        balance: balance,
                        idempotencyKey: idempotencyKey,
                })

                return res.status(200).json({
                        success: true,
                        message: "Balance added successfully",
                        UpdatedData,
                });
        } catch (err) {
                return res.status(500).json({
                        success: false,
                        message: "Internal Server Error",
                        error: err.message,
                });
        }
}

module.exports = {
        createAccount,
        getAccount,
        getBalance,
        addBalance,
}
