import React, { useEffect } from "react";
import { useRef } from "react";
import "./MessageList.css";
import MessageBubble from "./MessageBubble";
import { getDateLabel } from "../../utils/date";
function MessageList({ messages ,retryMessage }) {
  let lastDate = null;
  let lastSender = null;
  const listRef = useRef(null)
   function isNearBottom() {
    const el = listRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }
  const bottomRef = useRef(null);

  useEffect(() => {
      if (isNearBottom()) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="message-list" ref={listRef} >
      {messages.map(msg => {
        const dateLabel = getDateLabel(msg.createdAt);
        const showDate = dateLabel !== lastDate;
        const showAvatar = msg.mine !== lastSender;

        lastDate = dateLabel;
        lastSender = msg.mine;

        return (
          <div key={msg.id}>
            {showDate && (
              <div className="date-separator">
                {dateLabel}
              </div>
            )}

            <MessageBubble
              text={msg.text}
              mine={msg.mine}
              status={msg.status}
              createdAt={msg.createdAt}
              grouped={!showAvatar}
              onRetry={()=>retryMessage(msg.id)}
            />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
