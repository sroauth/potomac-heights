const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "houses.html"));
});

module.exports = router;
