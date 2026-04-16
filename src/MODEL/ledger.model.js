const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
        account: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "account",
                required: [true, "Please enter an account"],
                index: true,
                immutable: true,
        },

        amount: {
                type: Number,
                required: [true, "Please enter an amount"],
                immutable: true,
        },

        transaction: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "transaction",
                required: [true, "Please enter a transaction"],
                index: true,
                immutable: true,
        },
        type: {
                type: String,
                enum: {
                        values: ["Credit", "Debit"]
                },
                required: [true, "Please enter a types"],
                immutable: true,
        }

});

function prevent_Ledger_Modification(){
        throw new Error("Ledger Entries are immutable.")
}

ledgerSchema.pre("findOneAndUpdate", prevent_Ledger_Modification);
ledgerSchema.pre("updateOne", prevent_Ledger_Modification);
ledgerSchema.pre("updateMany", prevent_Ledger_Modification);
ledgerSchema.pre("deleteOne", prevent_Ledger_Modification);
ledgerSchema.pre("deleteMany", prevent_Ledger_Modification);
ledgerSchema.pre("findOneAndDelete", prevent_Ledger_Modification);

module.exports = mongoose.model("ledger", ledgerSchema);