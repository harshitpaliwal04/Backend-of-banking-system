const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
        name: {
                type: String,
                required: [true, "Please enter your name"],
                maxlength: [30, "Name cannot exceed 30 characters"],
                minlength: [4, "Name should have more than 4 characters"],
        },
        email: {
                type: String,
                required: [true, "Please enter your email"],
                unique: true,
                trim: true,
                lowercase: true,
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]

        },
        systemUser: {
                type: Boolean,
                default: false,
                select: false,
                immutable: true,
        },
        password: {
                type: String,
                required: [true, "Please enter your password"],
                minlength: [6, "Password should be greater than 6 characters"],
                select: false,
        },
}, {
        timestamps: true,
});

userSchema.pre("save", async function () {
        if (!this.isModified("password")) return;
        this.password = await bcrypt.hash(
                this.password,
                Number(process.env.BCRYPT_SALT_ROUNDS) || 8
        );
});

const User = mongoose.model("User", userSchema);

module.exports = User;  