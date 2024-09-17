import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "./Sidebar";
import Chats from "./Chats"; // Import the Chats component

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isChatsOpen, setChatsOpen] = useState(false); // State for chat sidebar
  const [user, setUser] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleChats = () => {
    setChatsOpen(!isChatsOpen);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } ${isChatsOpen ? "mr-64" : "mr-0"}`} // Adjust for right sidebar (Chats)
        style={{
          marginLeft: isSidebarOpen ? "16rem" : "0",
          marginRight: isChatsOpen ? "16rem" : "0",
          transition: "margin 0.3s ease",
        }}
      >
        {/* Header */}
        <header className="bg-base-100 shadow-md p-4 flex items-center justify-between">
          {/* Menu Toggle for Sidebar */}
          <button
            className={`absolute top-4 left-4 focus:outline-none ${
              isSidebarOpen ? "hidden" : "block"
            } md:hidden`}
            onClick={toggleSidebar}
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

          <div className="flex-1 text-center text-xl font-bold">DormFinds</div>

          {/* User Profile and Chats Button */}
          <div className="flex items-center space-x-4 relative">
            {/* Profile / User Icon */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost">
                <div className="avatar">
                  <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {user && user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User Avatar"
                        className="cursor-pointer"
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/150"
                        alt="Default Avatar"
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>
              {user && (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li>
                    <a className="font-semibold text-lg">
                      {user.displayName || "User"}
                    </a>
                  </li>
                  <li>
                    <a className="text-sm text-gray-600">{user.email}</a>
                  </li>
                  <li>
                    <a className="text-xs text-gray-400">
                      Joined:{" "}
                      {new Date(
                        user.metadata.creationTime
                      ).toLocaleDateString()}
                    </a>
                  </li>
                  <li>
                    <button className="btn btn-ghost w-full mt-2 border-t rounded-b-lg py-2">
                      Log Out
                    </button>
                  </li>
                </ul>
              )}
            </div>

            {/* Toggle for Chats */}
            <button className="btn btn-primary" onClick={toggleChats}>
              Chats
            </button>
          </div>
        </header>

        {/* Main Section */}
        <main className="p-4 h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Right Chat Sidebar */}
      <Chats isChatsOpen={isChatsOpen} toggleChats={toggleChats} />
    </div>
  );
};

export default DashboardLayout;
