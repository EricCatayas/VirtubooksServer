require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const apiRoute = require("./routes/index");

const DB_URL = process.env.DB_URL;

mongoose.set("strictQuery", true);

main().catch((err) => {
  console.error("Database connection error:", err);
  process.exit(1);
});

async function main() {
  await mongoose
    .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }) //  useCreateIndex:true, Not supported XX
    .then(() => {
      console.log("Db Connection established");
    })
    .catch((err) => {
      console.log(err);
    });
}

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use("/api", apiRoute);
app.listen(process.env.PORT, () => {
  console.log(`I am listenin to port ${process.env.PORT}`);
});

/**
  TODO:
    [ ] Add authentication middleware
*/
