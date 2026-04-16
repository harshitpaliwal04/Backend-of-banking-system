const transactionModel = require("./../MODEL/transaction.model");
const ledgerModel = require("./../MODEL/ledger.model");
const mongoose = require("mongoose");
// const emailServices = require("./../SERVICES/email.services");
const accountModel = require("./../MODEL/account.model");


/* 

1. validate request
2. validate Idempotencykey
3. check account status
4. derive sender balance from ledger
5. create transaction (Pending)
6. create debit ledger
7. create credit ledger
8. mark transaction completed
9. commit MongoDB session
10. send email notification

*/

async function createTransaction(req, res) {
        const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();
        const isCommited = false;

        // ✅ Validate request

        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
                return res.status(400).json({
                        success: false,
                        message: "Please provide all required fields"
                });
        }

        // ✅ Check existing transaction
        const existingTransaction = await transactionModel.findOne({ idempotencyKey });
        if (existingTransaction) {
                return res.status(409).json({
                        success: false,
                        message: `Transaction already ${existingTransaction.status}`
                });
        }

        // ✅ Find both accounts
        const fromUserAccount = await accountModel
                .findOne({ _id: fromAccount, status: "Active" })
                .session(session);  // 👈 locks document

        const toUserAccount = await accountModel
                .findOne({ _id: toAccount, status: "Active" })
                .session(session);  // 👈 locks document

        if (!fromUserAccount || !toUserAccount) {
                await session.abortTransaction();
                return res.status(400).json({
                        success: false,
                        message: "Invalid or inactive account"
                });
        }

        // ✅ Check balance directly from account model
        if (fromUserAccount.balance < amount) {
                return res.status(400).json({
                        success: false,
                        message: "Insufficient balance"
                });
        }

        try {
                // ✅ Create transaction
                const [transaction] = await transactionModel.create([{
                        fromAccount: fromAccount,
                        toAccount: toAccount,
                        amount: amount,
                        idempotencyKey: idempotencyKey,
                        status: "Pending"
                }], { session });

                // ✅ Debit ledger entry
                await ledgerModel.create([{
                        account: fromAccount,
                        amount: amount,
                        transaction: transaction._id,
                        type: "Debit"
                }], { session });

                // ✅ Credit ledger entry
                await ledgerModel.create([{
                        account: toAccount,
                        amount: amount,
                        transaction: transaction._id,
                        type: "Credit"
                }], { session });

                // ✅ Update balances directly
                const updatedFromAccount = await accountModel.findByIdAndUpdate(
                        fromAccount,
                        { $inc: { balance: -amount } },
                        { new: true, session }
                );

                const updatedToAccount = await accountModel.findByIdAndUpdate(
                        toAccount,
                        { $inc: { balance: +amount } },
                        { new: true, session }
                );

                // ✅ Mark transaction completed
                await transactionModel.findByIdAndUpdate(
                        transaction._id,
                        { status: "Completed" },
                        { session }
                );

                await session.commitTransaction();

                // ✅ Send email after commit
                await emailServices.sendTransactionEmail(
                        req.user.email,
                        fromUserAccount.name,
                        amount,
                        toUserAccount.name
                );

                return res.status(201).json({
                        success: true,
                        message: "Transaction created successfully",
                        transaction,
                        fromAccount: {
                                id: updatedFromAccount._id,
                                balance: updatedFromAccount.balance   // 👈 new balance
                        },
                        toAccount: {
                                id: updatedToAccount._id,
                                balance: updatedToAccount.balance     // 👈 new balance
                        }
                });

        } catch (err) {
                if (!isCommited){
                        await session.abortTransaction();
                }
                console.error("createTransaction error →", err.message);
                return res.status(500).json({
                        success: false,
                        message: "Internal Server Error",
                        error: err.message
                });
        } finally {
                session.endSession();
        }
}

async function systemInitialFund(req, res) {
        const { toAccount, amount, idempotencyKey } = req.body;

        if (!toAccount || !amount || !idempotencyKey) {
                return res.status(400).json({
                        success: false,
                        message: "Please provide all required fields"
                });
        }

        const toUserAccount = await accountModel.findOne({
                _id: toAccount,
                status: "Active"
        });
        if (!toUserAccount) {
                return res.status(400).json({
                        success: false,
                        message: "Invalid ToUser account"
                });
        }

        const fromUserAccount = await accountModel.findOne({
                user: req.user._id,
                status: "Active"
        });
        if (!fromUserAccount) {
                return res.status(400).json({
                        success: false,
                        message: "Invalid FromUser account"
                });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
                // ✅ Create transaction inside session
                const [transaction] = await transactionModel.create([{
                        fromAccount: fromUserAccount._id,
                        toAccount: toAccount,
                        amount: amount,
                        idempotencyKey: idempotencyKey,
                        status: "Pending",
                }], { session });

                // ✅ type not types
                await ledgerModel.create([{
                        account: fromUserAccount._id,
                        amount: amount,
                        transaction: transaction._id,
                        type: "Debit",
                }], { session });

                await ledgerModel.create([{
                        account: toAccount,
                        amount: amount,
                        transaction: transaction._id,
                        type: "Credit",
                }], { session });

                // ✅ Update balances
                await accountModel.findByIdAndUpdate(
                        fromUserAccount._id,
                        { $inc: { balance: -amount } },
                        { session }
                );

                await accountModel.findByIdAndUpdate(
                        toAccount,
                        { $inc: { balance: +amount } },
                        { session }
                );

                // ✅ Update transaction status
                await transactionModel.findByIdAndUpdate(
                        transaction._id,
                        { status: "Completed" },
                        { session }
                );

                await session.commitTransaction();

                return res.status(201).json({
                        success: true,
                        message: "Initial fund created successfully",
                        transaction
                });

        } catch (err) {
                await session.abortTransaction();
                console.error("systemInitialFund error →", err.message);
                return res.status(500).json({
                        success: false,
                        message: "Internal Server Error",
                        error: err.message
                });
        } finally {
                session.endSession();
        }
}

module.exports = { createTransaction, systemInitialFund };