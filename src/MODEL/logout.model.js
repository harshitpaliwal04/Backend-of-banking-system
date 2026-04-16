const mongoose = require("mongoose");

const BlacklistTokenSchema = new mongoose.Schema({
        token: {
                type: String,
                required: true,
                unique: true,
        },
        expiresAt: {
                type: Date,
                default: Date.now,
                required: true,
                immutable: true,
        }

}, {
        timestamps: true,
});

BlacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 2});

module.exports = mongoose.model("BlacklistToken", BlacklistTokenSchema)