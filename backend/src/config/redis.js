const Redis = require("ioredis");

let redis;

const connectRedis = async () => {
  return new Promise((resolve) => {
    try {
      redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        maxRetriesPerRequest: null,
      });
``
      redis.on("connect", () => {
        console.log("✅ Redis connected");
        resolve(redis);
      });

      redis.on("error", (err) => {
        console.warn("⚠️  Redis connection failed - running without Redis:", err.message);
        resolve(null);
      });
    } catch (error) {
      console.warn("⚠️  Redis connection failed - running without Redis:", error.message);
      resolve(null);
    }
  });
};

module.exports = connectRedis;
