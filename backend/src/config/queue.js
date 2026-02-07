const { Queue } = require("bullmq");
const redis = require("./redis");

const emailQueue = new Queue("email-queue", {
  connection: redis,
});

console.log("✅ BullMQ queue initialized");

module.exports = emailQueue;
