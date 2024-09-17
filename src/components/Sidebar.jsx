import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth"; // Import Firebase signOut

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const auth = getAuth();

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
 
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-base-200 p-4 absolute top-0 left-0 h-full flex flex-col justify-between z-10 overflow-hidden`}
        style={{
          boxShadow: isSidebarOpen ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
          visibility: isSidebarOpen ? "visible" : "hidden",
        }}
      >
        <div
          className={`flex flex-col flex-grow ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between mt-2 mb-4">
            <h2
              className={`text-2xl font-bold ${
                isSidebarOpen ? "block" : "hidden md:block"
              }`}
            >
              Owner
            </h2>
            <button
              className="md:hidden focus:outline-none"
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
          </div>
          <div className="container mx-auto px-4 mt-10">
            <div className="card bg-base-200 shadow-md p-4 rounded-lg">
              <div className="space-y-2">
                <Link
                  to="/dashboard/overview"
                  className="btn btn-ghost w-full text-lg font-medium rounded-lg py-2 px-4 hover:bg-base-300 transition-colors"
                >
                  Overview
                </Link>
                <Link
                  to="/dashboard/owner/properties"
                  className="btn btn-ghost w-full text-lg font-medium rounded-lg py-2 px-4 hover:bg-base-300 transition-colors"
                >
                  My Properties
                </Link>
                <Link
                  to="/dashboard/owner/requests"
                  className="btn btn-ghost w-full text-lg font-medium rounded-lg py-2 px-4 hover:bg-base-300 transition-colors"
                >
                  Requests
                </Link>
                <Link
                  to="/dashboard/owner/settings"
                  className="btn btn-ghost w-full text-lg font-medium rounded-lg py-2 px-4 hover:bg-base-300 transition-colors"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`pb-4 flex justify-center ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          <button
            onClick={handleLogout} // Call the handleLogout function on click
            className="btn btn-ghost bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
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
    </>
  );
};

export default Sidebar;
