const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const CollageDataq = require("./collage.json");
const Research = require("./research.json");
const Review = require("./review.json");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// all api routes

// collage -------------------
app.get("/collage", (req, res) => {
  res.send(CollageDataq);
});

// /research------------------
app.get("/research", (req, res) => {
  res.send(Research);
});
// review----------------------
app.get("/review", (req, res) => {
  res.send(Review);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
