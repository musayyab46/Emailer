const Email = require("../model/Email");

// shared query builder
const buildQuery = (query) => {
  const mongoQuery = {};

  if (query.status) {
    mongoQuery.status = query.status;
  }

  if (query.startDate || query.endDate) {
    mongoQuery.createdAt = {};
    if (query.startDate) {
      mongoQuery.createdAt.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      mongoQuery.createdAt.$lte = new Date(query.endDate);
    }
  }

  return mongoQuery;
};
exports.getScheduledEmails = async (req, res) => {
  try {
    const filter = buildQuery({
      ...req.query,
      status: "scheduled",
    });

    const emails = await Email.find(filter)
      .sort({ scheduledAt: 1 })
      .lean();

    res.json({
      count: emails.length,
      data: emails,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch scheduled emails" });
  }
};
exports.getSentEmails = async (req, res) => {
  try {
    const filter = buildQuery({
      ...req.query,
      status: "sent",
    });

    const emails = await Email.find(filter)
      .sort({ sentAt: -1 })
      .lean();

    res.json({
      count: emails.length,
      data: emails,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sent emails" });
  }
};
exports.getAllEmails = async (req, res) => {
  try {
    let page = parseInt(req.query.page,10);
    let limit = parseInt(req.query.limit,10);

     if (req.query.page && (isNaN(page) || page < 1)) {
      return res.status(400).json({
        message: "Invalid page parameter. Must be a positive integer.",
      });
    }

    if (req.query.limit && (isNaN(limit) || limit < 1 || limit > 100)) {
      return res.status(400).json({
        message: "Invalid limit parameter. Must be between 1 and 100.",
      });
    }

    const skip = (page - 1) * limit;

    const filter = buildQuery(req.query);

    const [emails, total] = await Promise.all([
      Email.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Email.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: emails,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch emails" });
  }
};
