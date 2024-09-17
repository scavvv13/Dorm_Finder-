import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const OwnerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-hidden"
        }`}
      >
        <div className="md:hidden p-4">
          <button className="btn btn-primary" onClick={toggleSidebar}>
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
        <main className="p-4 h-full overflow-y-hidden">
          <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
          {/* Other content components */}
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
