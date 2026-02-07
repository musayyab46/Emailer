const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "sent", "failed"],
      default: "scheduled",
    },
    jobId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Email", emailSchema);
