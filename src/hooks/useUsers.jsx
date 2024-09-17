// src/hooks/useUsers.js
import { useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../Auth/FirebaseAuth"; // Adjust path as needed

const useUsers = (setUsers) => {
  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(users);
    });

    return () => unsubscribe();
  }, [setUsers]);
};

export default useUsers;
