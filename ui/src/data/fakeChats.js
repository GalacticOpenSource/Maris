export const chats = [
  {
    id: "1",
    name: "Alice",
    lastMessage: "Hey! 👋",
    messages: [
      {
        id: 1,
        text: "Hey!",
        mine: false,
        status: "sending" | "sent" | "read" | "failed",
        createdAt: Date.now() - 86400000,
      },
      {
        id: 2,
        text: "Hi Alice 😊",
        mine: true,
        status: "sending" | "sent" | "read" | "failed",
        createdAt: Date.now() - 86400000,
      },
      {
        id: 3,
        text: "How are you?",
        mine: false,
        status:"sending" | "sent" | "read" | "failed",
        createdAt: Date.now() - 86400000,
      },
    ],
  },
  {
    id: "2",
    name: "Bob",
    lastMessage: "See you tomorrow",
    messages: [
      {
        id: 1,
        text: "Meeting done?",
        mine: false,
        status: "sending" | "sent" | "read" | "failed",
        createdAt: Date.now() - 86400000,
      },
      {
        id: 2,
        text: "Yes 👍",
        mine: true,
        status: "sending" | "sent" | "read" | "failed",
        createdAt: Date.now() - 86400000,
      },
        {
        id: 3,
        text: "Yes 👍",
        mine: true,
        status: "sending" | "sent" | "read" | "failed",
        createdAt: Date.now() - 86400000,
      },
        {
        id: 4,
        text: "Yes 👍",
        mine: true,
        status:"sending" | "sent" | "read" | "failed",
        createdAt: Date.now() - 86400000,
      },
        {
        id: 5,
        text: "Yes 👍",
        mine: true,
        status:"sending" | "sent" | "read" | "failed",
        createdAt: Date.now() - 86400000,
      },
        {
        id: 6,
        text: "Yes 👍",
        mine: false,
        status: "sending" | "sent" | "read" | "failed",
        createdAt: Date.now() - 86400000,
      },
    ],
  },
];
