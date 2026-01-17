import React from 'react'
import ChatItem from './ChatItem';
import "./ChatList.css"
function ChatList({ chats, activeChatId, onSelectChat }) {
  return (
    <div className="chat-list">
      {chats.map(chat => (
        <ChatItem
          key={chat.id}
          chat={chat}
          active={chat.id === activeChatId}
          onClick={() => onSelectChat(chat.id)}
        />
      ))}
    </div>
  );
}

export default ChatList