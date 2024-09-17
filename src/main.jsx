import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "./Auth/FirebaseAuth";
import "./Index.css";

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to local.");
    ReactDOM.createRoot(document.getElementById("root")).render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });
