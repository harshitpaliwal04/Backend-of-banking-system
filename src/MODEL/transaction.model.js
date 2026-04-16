const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
        fromAccount: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "account",
                required: [true, "Please enter a fromAccount"],
                index: true,
        },
        toAccount: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "account",
                required: [true, "Please enter a toAccount"],
                index: true,
        },
        status: {
                type: String,
                enum: {
                        values: ["Pending", "Completed", "Failed", "Reversed"]
                },
                required: [true, "Please enter a status"],
                default: "Pending",
        },
        amount: {
                type: Number,
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
});

transactionSchema.index({ fromAccount: 1, toAccount: 1, idempotencyKey: 1 })

module.exports = mongoose.model("transaction", transactionSchema);