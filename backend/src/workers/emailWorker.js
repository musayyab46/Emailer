require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const nodemailer = require("nodemailer");
const Redis = require("ioredis");
const Email = require("../model/Email");
//Connection
const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest:null,
});
//Node mailer Transporter
const createTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();
  

  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};
//Creating MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 Worker connected to MongoDB");
  } catch (err) {
    console.error("🔴 Worker MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

connectDB();

//Create a bullMQ Worker
const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { emailId } = job.data;

    console.log("📥 Processing job:", job.id);

    // 1️⃣ Fetch email from DB
    const email = await Email.findById(emailId);
    if (!email) throw new Error("Email not found");

    if(email.status=="sent"){
        console.log("Email already sent,Skipping",emailId);
        return;
    }

    const transporter = await createTransporter();

    // 2️⃣ Send email
    const info = await transporter.sendMail({
      from: '"Scheduler" <no-reply@test.com>',
      to: email.to,
      subject: email.subject,
      text: email.body,
    });

    // 3️⃣ Update DB (SUCCESS)
    email.status = "sent";
    email.sentAt = new Date();
    await email.save();

    // 4️⃣ Log preview URL
    console.log("✅ Email sent");
    console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
  },
  { connection }
);
//Failure handling
emailWorker.on("failed", async (job, err) => {
  console.error("❌ Job failed:", job.id, err.message);

  const email = await Email.findById(job.data.emailId);
  if (email) {
    email.status = "failed";
    email.error = err.message;
    await email.save();
  }
});
process.on("SIGINT", async () => {
  console.log("🛑 Worker shutting down...");
  await emailWorker.close();
  process.exit(0);
});

console.log("🚀 Email worker started and listening...");

