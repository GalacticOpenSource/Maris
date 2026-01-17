import { useState, useRef } from "react";
import "./MessageInput.css";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const taRef = useRef(null);

  function autoGrow() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }

  function handleChange(e) {
    setText(e.target.value);
    autoGrow();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
     send()
    }
  }
function send() {
  if (!text.trim()) return;
  onSend(text);
  setText("");
  requestAnimationFrame(() => {
    if (taRef.current) taRef.current.style.height = "auto";
  });
}

  return (
    <div className="message-input">
      <textarea
        ref={taRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
        rows={1}
      />
      <button disabled={!text.trim()} onClick={send}>
        📤
      </button>
    </div>
  );
}

export default MessageInput;
