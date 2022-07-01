const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/photos", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "community/photos.html"));
});

router.get("/news", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "community/news.html"));
});

router.get("/pool", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "community/pool.html"));
});

module.exports = router;
