import React from "react";
import "./chat.css";

export default function ChatLayout() {
  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">Chats</div>

        <input className="search" placeholder="Search" />

        <div className="chat-item active">
          <img src="https://i.pravatar.cc/40" alt="" />
          <div>
            <div className="name">Maya Johnson</div>
            <div className="last">🎤 Voice message</div>
          </div>
        </div>
      </aside>

      {/* Chat */}
      <main className="chat">
        <header className="chat-header">
          <span className="back">←</span>
          <img src="https://i.pravatar.cc/40" alt="" />
          <span>Maya Johnson</span>
        </header>

        <div className="messages">
          <div className="msg received">We’re at 118 68th Ave.</div>

          <div className="msg sent">
            I’m on my way! What’s the address?
          </div>

          <div className="msg sent file">
            📎 location.pdf
          </div>

          <div className="msg received voice">
            🎤 Voice message (1:32)
          </div>
        </div>

        {/* Input */}
        <footer className="input-bar">
          <button className="icon">📎</button>
          <button className="icon">🖼</button>

          <input placeholder="Message" />

          <button className="icon send">➤</button>
          <button className="icon mic">🎤</button>
        </footer>
      </main>
    </div>
  );
}
