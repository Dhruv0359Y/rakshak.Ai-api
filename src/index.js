require("dotenv").config();

const express = require("express");
const path = require("path");
const receiveRoute = require("./routes/receive");

const app = express();
const PORT = 3000;

app.use(express.json());

// 🔥 PUBLIC FOLDER SERVE (NOTE THE PATH CHANGE)
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.use("/api", receiveRoute);

// optional health route
app.get("/health", (req, res) => {
  res.json({ status: "AI Honeypot running 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
