import "./MessageBubble.css";
function MessageBubble({ text, mine, status, createdAt, grouped, onRetry }) {
  const time = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`bubble ${mine ? "mine" : "theirs"} ${
        grouped ? "grouped" : ""
      }  ${status === "failed" ? "failed" : ""}`}
    >
      <div className="text">{text}</div>

      <div className="meta">
        <span className="time">{time}</span>
        {mine && status === "failed" && (
          <button className="retry" onClick={onRetry}>
            Retry
          </button>
        )}
        {mine && status !== "failed" && (
          <span className="status">{statusIcon(status)}</span>
        )}
      </div>
    </div>
  );
}

function statusIcon(status) {
  if (status === "sending") return "⏳";
  if (status === "sent") return "✓";
  if (status === "read") return "✓✓";
  if (status === "failed") return "⚠️";
}

export default MessageBubble;
