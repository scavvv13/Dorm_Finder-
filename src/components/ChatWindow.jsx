import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../Auth/FirebaseAuth";

const ChatWindow = () => {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const chatRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatRef, (doc) => {
      setChat({ id: doc.id, ...doc.data() });
    });
    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      messages: arrayUnion({
        sender: "currentUserId", // Replace with actual sender ID
        text: message,
        timestamp: new Date(),
      }),
    });
    setMessage(""); // Clear input after sending
  };

  return (
    <div className="chat-window">
      {chat ? (
        <>
          <h2>Chat</h2>
          <div className="messages">
            {chat.messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "currentUserId"
                    ? "message-sent"
                    : "message-received"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="input input-bordered w-full"
          />
          <button onClick={sendMessage} className="btn btn-primary">
            Send
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ChatWindow;
