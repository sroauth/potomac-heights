const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/board-of-directors", (req, res) => {
  res.sendFile(
    path.join(process.cwd(), "views", "about/board-of-directors.html")
  );
});

router.get("/memberships", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "about/memberships.html"));
});

router.get("/cooperative", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "about/cooperative.html"));
});

router.get("/lenders", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "about/lenders.html"));
});

module.exports = router;
