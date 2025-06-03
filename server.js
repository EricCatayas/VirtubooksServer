require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const notebookRouter = require("./routes/notebookRoute");
const pageRouter = require("./routes/pageRoute");

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
app.use("/notebooks", notebookRouter);
app.use("/pages", pageRouter);
app.listen(process.env.PORT, () => {
  console.log(`I am listenin to port ${process.env.PORT}`);
});

/**
  TODO:
    [ ] Add authentication middleware
*/
