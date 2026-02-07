const express = require("express");
const cors=require('cors');
const emailRoutes = require("./routes/emailRoutes");
const emailDashboardRoutes = require("./routes/emailDashboardRoutes");
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/emails", emailRoutes);

app.use("/api/emails/dashboard", emailDashboardRoutes);

app.use("/api/auth", require("./routes/authRoutes"));


app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


module.exports = app;
