require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const connectRedis = require("./config/redis");
require("./config/queue");
const express=require('express');
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};
const path = require('path');

// Serve React frontend build
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});


startServer();
