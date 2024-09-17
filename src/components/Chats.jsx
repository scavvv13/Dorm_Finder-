import React, { useState, useEffect } from "react";
import { db } from "../Auth/FirebaseAuth"; // Your Firebase instance
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Chats = ({ isChatsOpen, toggleChats }) => {
  const [users, setUsers] = useState([]); // Users you can chat with
  const [chats, setChats] = useState([]); // Existing chats
  const [searchQuery, setSearchQuery] = useState(""); // For searching users
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  const currentUser = "currentUserId"; // Replace with your logic to get the current logged-in user

  // Fetch all users
  useEffect(() => {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    });
    return () => unsubscribe();
  }, []);

  // Fetch existing chats
  useEffect(() => {
    const chatsCollection = collection(db, "chats");
    const q = query(
      chatsCollection,
      where("participants", "array-contains", currentUser)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatsData);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Search users based on searchQuery
  // Search users based on searchQuery
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.name &&
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery, users]);

  // Handle starting a new chat
  const startChat = async (userId) => {
    // Check if a chat already exists with this user
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser)
    );
    const existingChatSnapshot = await getDocs(q);
    const existingChat = existingChatSnapshot.docs.find((doc) =>
      doc.data().participants.includes(userId)
    );

    if (existingChat) {
      // Navigate to the existing chat
      navigate(`/chats/${existingChat.id}`);
    } else {
      // Create a new chat
      const newChatRef = await addDoc(collection(db, "chats"), {
        participants: [currentUser, userId],
        messages: [],
      });
      navigate(`/chats/${newChatRef.id}`);
    }
  };

  return (
    <>
      {/* Sidebar Layout for Chats */}
      <aside
        className={`${
          isChatsOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-base-200 p-4 absolute top-0 right-0 h-full flex flex-col justify-between z-10 overflow-hidden`}
        style={{
          boxShadow: isChatsOpen ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
          visibility: isChatsOpen ? "visible" : "hidden",
        }}
      >
        <div
          className={`flex flex-col flex-grow ${
            isChatsOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between mt-2 mb-4">
            <h2 className="text-2xl font-bold">Chats</h2>
            {isChatsOpen && (
              <button
                className="md:hidden focus:outline-none"
                onClick={toggleChats}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Search Users */}
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="input input-bordered w-full"
            />
            {filteredUsers.length > 0 && (
              <ul className="user-search-results">
                {filteredUsers.map((user) => (
                  <li key={user.id}>
                    <button
                      onClick={() => startChat(user.id)}
                      className="btn btn-outline"
                    >
                      Start Chat with {user.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Existing Chats */}
          <div className="existing-chats">
            <h3 className="text-lg font-bold mb-2">Existing Chats</h3>
            {chats.length > 0 ? (
              <ul>
                {chats.map((chat) => (
                  <li key={chat.id}>
                    <button
                      onClick={() => navigate(`/chats/${chat.id}`)}
                      className="btn btn-block"
                    >
                      Chat with{" "}
                      {chat.participants.find((p) => p !== currentUser)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No existing chats</p>
            )}
          </div>
        </div>

        {/* Close Chats Button */}
        <div
          className={`pb-4 flex justify-center ${
            isChatsOpen ? "block" : "hidden"
          }`}
        >
          <button
            onClick={toggleChats}
            className="btn btn-ghost bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition-colors"
          >
            Close Chats
          </button>
        </div>
      </aside>
    </>
  );
};

export default Chats;
