export default function EmailCard({ email, type }) {
  return (
    <div className="border rounded p-3 shadow-sm bg-white">
      <p className="font-medium">{email.to}</p>
      <p className="text-sm text-gray-600">{email.subject}</p>

      {type === "scheduled" && (
        <p className="text-xs text-blue-600">
          Scheduled: {new Date(email.scheduledAt).toLocaleString()}
        </p>
      )}

      {type === "sent" && (
        <p className="text-xs text-green-600">
          Sent: {new Date(email.sentAt).toLocaleString()}
        </p>
      )}

      {email.status && (
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {email.status}
        </span>
      )}
    </div>
  );
}
