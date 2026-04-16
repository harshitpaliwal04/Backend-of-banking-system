require("dotenv").config();
const DB = require("./src/DATABASE/db");
const cluster = require("cluster");
const os = require("os");
const app = require("./src/app");

DB();

const PORT = process.env.PORT || 3000;
const totalCPUs = os.cpus().length;

if (cluster.isPrimary) {
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker) => {
        cluster.fork();
    });
} else {
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} running`);
    });
}

