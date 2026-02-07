const express = require("express");
const router = express.Router();
const {
  getScheduledEmails,
  getSentEmails,
  getAllEmails,
} = require("../controllers/emailDashboardController");

router.get("/scheduled", getScheduledEmails);
router.get("/sent", getSentEmails);
router.get("/all", getAllEmails);

module.exports = router;
