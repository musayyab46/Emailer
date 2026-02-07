import { useEffect, useState } from "react";
import { getScheduledEmails } from "../services/api";
import EmailCard from "../components/EmailCard";

export default function ScheduledList() {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    const res = await getScheduledEmails();
    setEmails(res.data.data);
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto space-y-3">
      <h2 className="text-xl font-semibold">Scheduled Emails</h2>

      {emails.map((email) => (
        <EmailCard key={email.id} email={email} type="scheduled" />
      ))}
    </div>
  );
}
