require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const { Queue } = require("bullmq");
const Redis = require("ioredis");

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

const queue = new Queue("email-queue", { connection });

(async () => {
  const counts = await queue.getJobCounts();
  console.log("📊 Job counts:", counts);

  const delayed = await queue.getJobs(["delayed"]);
  console.log("⏳ Delayed jobs:", delayed.map(j => ({
    id: j.id,
    delay: j.delay,
    timestamp: j.timestamp,
  })));

  process.exit(0);
})();
