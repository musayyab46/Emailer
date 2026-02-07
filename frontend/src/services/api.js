import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Schedule email
export const scheduleEmail = (data) => API.post("/emails/schedule", data);

// Get scheduled emails
export const getScheduledEmails = () => API.get("/emails/dashboard/scheduled");

export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

// Get sent emails
export const getSentEmails = () => API.get("/emails/dashboard/sent");
