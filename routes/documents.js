const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "documents/index.html"));
});

router.get("/procedures-for-selling", (req, res) => {
  res.sendFile(
    path.join(process.cwd(), "views", "documents/procedures-for-selling.html")
  );
});

router.get("/procedures-for-purchasing", (req, res) => {
  res.sendFile(
    path.join(
      process.cwd(),
      "views",
      "documents/procedures-for-purchasing.html"
    )
  );
});

router.get("/operating-payments", (req, res) => {
  res.sendFile(
    path.join(process.cwd(), "views", "documents/operating-payments.html")
  );
});

module.exports = router;
