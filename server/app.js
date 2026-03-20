require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app; 

const queryRoutes = require("./routes/queryRoutes");

app.use("/api", queryRoutes);
// ⚡ NEW: Hook up the Authentication URLs!
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
