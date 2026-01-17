import React from 'react'

function ChatItem({ chat, active, onClick }) {
  return (
    <div
      className={`chat-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="avatar" />
      <div>
        <div className="name">{chat.name}</div>
        <div className="preview">{chat.lastMessage}</div>
      </div>
    </div>
  );
}

export default ChatItem