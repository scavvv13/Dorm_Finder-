// src/pages/RoleSelection.jsx
import { useState } from "react";
import { db } from "../Auth/FirebaseAuth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const { user } = useAuth();
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleRoleSelection = async (selectedRole) => {
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { role: selectedRole },
        { merge: true }
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  return (
    <div>
      <h1>Select Your Role</h1>
      <button onClick={() => handleRoleSelection("owner")}>
        I am an Owner
      </button>
      <button onClick={() => handleRoleSelection("renter")}>
        I am a Renter
      </button>
    </div>
  );
};

export default RoleSelection;
