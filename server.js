require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const apiRoute = require("./routes/index");

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", true);

main().catch((err) => {
  console.error("Database connection error:", err);
  process.exit(1);
});

async function main() {
  await mongoose
    .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Db Connection established");
    })
    .catch((err) => {
      console.log(err);
    });
}

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

// Move error handling middleware to the end
app.use("/api", apiRoute);

// Error handling middleware should be last
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// Add 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
