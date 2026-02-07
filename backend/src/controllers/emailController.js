const Email = require("../model/Email");
const emailQueue = require("../config/queue");

exports.scheduleEmail = async (req, res) => {
  try {
    const { to, subject, body, scheduledAt } = req.body;

    // 1️⃣ Validate input
    if (!to || !subject || !body || !scheduledAt) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const scheduledTime = new Date(scheduledAt).getTime();
    const now = Date.now();

    if (scheduledTime <= now) {
      return res.status(400).json({
        message: "Scheduled time must be in the future",
      });
    }

    // 2️⃣ Save email to DB
    const email = await Email.create({
      to,
      subject,
      body,
      scheduledAt,
      status: "scheduled",
    });

    // 3️⃣ Add delayed job to queue
    const delay = scheduledTime - now;

    const job = await emailQueue.add(
      "send-email",
      { emailId: email._id },
      { delay ,
        attempts:3,
        backoff:{
          type:"exponential",
          delay:5000,
        },
        removeOnComplete:true,
        removeOnFail:false
      }
    );

    // 4️⃣ Save jobId in DB
    email.jobId = job.id;
    await email.save();

    // 5️⃣ Return success
    return res.status(201).json({
      message: "Email scheduled successfully",
      emailId: email._id,
      jobId: job.id,
    });
  } catch (error) {
    console.error("Schedule email error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
