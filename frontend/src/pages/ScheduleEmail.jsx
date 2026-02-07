import { useState } from "react";
import { scheduleEmail } from "../services/api";

export default function ScheduleEmail() {
  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
    scheduledAt: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try{
    e.preventDefault();
    await scheduleEmail(form);
    alert("Email scheduled!");
    setForm({ to: "", subject: "", body: "", scheduledAt: "" });
    }
    catch(error){
        console.error("API error",error);
        alert("email scheduling failed");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Schedule Email</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="to"
          placeholder="Recipient Email"
          className="w-full border p-2 rounded"
          value={form.to}
          onChange={handleChange}
          required
        />

        <input
          name="subject"
          placeholder="Subject"
          className="w-full border p-2 rounded"
          value={form.subject}
          onChange={handleChange}
        />

        <textarea
          name="body"
          placeholder="Email Body"
          className="w-full border p-2 rounded h-32"
          value={form.body}
          onChange={handleChange}
        />

        <input
          type="datetime-local"
          name="scheduledAt"
          className="w-full border p-2 rounded"
          value={form.scheduledAt}
          onChange={handleChange}
          required
        />

        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">
          Schedule Email
        </button>
      </form>
    </div>
  );
}
