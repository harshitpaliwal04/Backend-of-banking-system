const mongoose = require("mongoose");
const ledgerSchema = require("./ledger.model");

const accountSchema = new mongoose.Schema({
        user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: [true, "Please enter a user"],
                index: true,
        },
        status: {
                type: String,
                enum: {
                        values: ["Active", "Frozen", "Closed"]
                },
                required: [true, "Please enter a status"],
                default: "Active",
        },
        balance: {
                type: Number,
                required: [true, "Please enter a balance"],
                default: 0,
        },
        currency: {
                type: String,
                required: [true, "Please enter a currency"],
                default: "INR"
        },

}, {
        timestamps: true,
});

accountSchema.index({ user: 1, status: 1 })

// accountSchema.methods.getBalance = async function () {
//         const BalanceData = await ledgerSchema.aggregate([
//                 { $match: { account: this._id } },
//                 {
//                         $group: {
//                                 _id: null,
//                                 totalDebit: {
//                                         $sum: {
//                                                 $cond: [
//                                                         { $eq: ["$types", "Debit"] },
//                                                         "$amount",  // ✅ $ added
//                                                         0
//                                                 ]
//                                         }
//                                 },
//                                 totalCredit: {
//                                         $sum: {
//                                                 $cond: [
//                                                         { $eq: ["$types", "Credit"] },
//                                                         "$amount",  // ✅ $ added
//                                                         0
//                                                 ]
//                                         }
//                                 }
//                         }
//                 },
//                 {
//                         $project: {
//                                 _id: 0,                 // ✅ _id not id
//                                 balance: {
//                                         $subtract: ["$totalCredit", "$totalDebit"]
//                                 }
//                         }
//                 }
//         ]);

//         if (BalanceData.length === 0) return 0;

//         return BalanceData[0].balance;
// }


module.exports = mongoose.model("account", accountSchema);
