const mongoose = require("mongoose");

async function ConnectDB() {
        try {
                await mongoose.connect(process.env.MONGO_URI, {
                        maxPoolSize: 10,   // 👈 limit per worker
                        minPoolSize: 2,
                });
                console.log("Connected to MongoDB");
        }
        catch (err) {
                console.log("Error connecting to MongoDB", err)
                process.exit(1);
        }
}

module.exports = ConnectDB;