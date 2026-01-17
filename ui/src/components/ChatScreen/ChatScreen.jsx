import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatScreen({ chat, setChats, isMobile, onBack }) {
  function handleSend(text) {
    const tempId = Date.now();

    // 1. Add message as "sending"
    setChats((prev) =>
      prev.map((c) =>
        c.id === chat.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: tempId,
                  text,
                  mine: true,
                  status: "sending",
                  createdAt: Date.now(),
                },
              ],
            }
          : c
      )
    );

    // 2. Simulate server confirmation
    setTimeout(() => {
      
      setChats((prev) =>
        prev.map((c) =>
          c.id === chat.id
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === tempId ? { ...m, status: "sent" } : m
                ),
              }
            : c
        )
      );
    }, 600);

    // 3. Simulate read receipt
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setChats((prev) =>
        prev.map((c) =>
          c.id === chat.id
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === tempId ? { ...m, status: success ? "sent" : "failed" } : m
                ),
              }
            : c
        )
      );
    }, 2000);
  }
function retryMessage(messageId) {
  setChats(prev =>
    prev.map(c =>
      c.id === chat.id
        ? {
            ...c,
            messages: c.messages.map(m =>
              m.id === messageId
                ? { ...m, status: "sending" }
                : m
            )
          }
        : c
    )
  );

  // Simulate retry success
  setTimeout(() => {
    setChats(prev =>
      prev.map(c =>
        c.id === chat.id
          ? {
              ...c,
              messages: c.messages.map(m =>
                m.id === messageId
                  ? { ...m, status: "sent" }
                  : m
              )
            }
          : c
      )
    );
  }, 600);
}

  return (
    <div className="chat-screen">
      <ChatHeader name={chat.name} isMobile={isMobile} onBack={onBack} />
      <MessageList messages={chat.messages} retryMessage={retryMessage} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}

export default ChatScreen;
