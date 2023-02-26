const cors = require("cors");
const express = require("express");

// CONFIGURATION
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.send("Welcome to Tuner");
});

// SONGS ROUTES
const songController = require("./controllers/songController");
app.use("/songs", songController);

app.get("*", (req, res) => {
  res.status(404).json({ error: "Sorry, page not found" });
});

module.exports = app;
