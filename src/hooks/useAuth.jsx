import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../Auth/FirebaseAuth";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { clearLocalStorage } from "../utils/cleanup";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const tokenResult = await getIdTokenResult(currentUser);
          setUser({
            ...currentUser,
            emailVerified: tokenResult.claims.email_verified,
          });
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    clearLocalStorage();
    signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
