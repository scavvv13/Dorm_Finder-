import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { db } from "../Auth/FirebaseAuth";
import { doc, getDoc } from "firebase/firestore";
import OwnerDashboard from "./OwnerDashboard";
import RenterDashboard from "./RenterDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          setRole(userData?.role || "");
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole(""); // Handle fetch errors
        } finally {
          setLoading(false);
        }
      } else {
        // Handle case where user is not logged in
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (loading) return <h1>Loading...</h1>;
  if (role === "owner") return <OwnerDashboard />;
  if (role === "renter") return <RenterDashboard />;
  return <h1>Access Denied</h1>;
};

export default Dashboard;
