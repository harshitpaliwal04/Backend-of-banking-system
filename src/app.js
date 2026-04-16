const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./ROUTES/userAuth.routes"));

app.use("/api/account", require("./ROUTES/account.routes"));

app.use("/api/transaction", require("./ROUTES/transaction.routes"));

app.get("/", (req, res) => {
    res.send("<h1>Backend is running</h1>")
})


module.exports = app;