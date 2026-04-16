const mongoose = require("mongoose");

const AddBalanceSchema = new mongoose.Schema({
        account:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "account",
                required: [true, "Please enter an account"],
                index: true,
                immutable: true,
        },
        balance: {
                type: Number,
                immutable: true,
                required: [true, "Please enter an amount"],
        },
        idempotencyKey: {
                type: String,
                required: [true, "Please enter an idempotencyKey"],
                index: true,
                unique: true,
        }

}, {
        timestamps: true,
})

module.exports = mongoose.model("UpdateBalance", AddBalanceSchema);