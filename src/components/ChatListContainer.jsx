import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Auth/FirebaseAuth"; // Import your firestore database instance

const ChatListContainer = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
      const chatList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="card bg-base-100 shadow-md rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold">{`Chat ${chat.id}`}</h3>
          {/* Display last message preview if needed */}
        </div>
      ))}
    </div>
  );
};

export default ChatListContainer;
