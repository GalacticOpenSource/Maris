import React from 'react'

function ChatHeader({ name, isMobile, onBack }) {
  return (
    <div className="chat-header">
      {isMobile && (
        <button className="back-btn" onClick={onBack}>
          ⬅
        </button>
      )}

      <div className="avatar" />
      <div className="name">{name}</div>
    </div>
  );
}


export default ChatHeader