import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Auth/FirebaseAuth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { db } from "../Auth/FirebaseAuth"; // Import your firestore database instance

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if the user's email is verified
      if (user.emailVerified) {
        navigate("/dashboard");
      } else {
        // Save the intended path in local storage or state
        localStorage.setItem("intendedPath", "/dashboard");
        navigate("/verify-email");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Reference to the Firestore document for the user
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // User does not exist in Firestore, create a new document
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(), // Adding timestamp for record
        });

        // Redirect to role selection if the user is newly created
        navigate("/role-selection");
      } else {
        // User exists in Firestore, redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error with Google login:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-center mb-6">
            <img src="/assets/download.png" alt="App Logo" className="h-16" />
          </div>
          <h2 className="text-center text-3xl font-bold mb-6">Login</h2>

          {/* Manual Login Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pr-12"
                />
                <label className="absolute inset-y-0 right-3 flex items-center">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="checkbox checkbox-sm"
                  />
                  <span className="ml-2 text-sm">Show</span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Login with Email
            </button>
          </form>

          <div className="divider">or</div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full flex items-center justify-center gap-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google Logo"
              className="h-6"
            />
            <span>Continue with Google</span>
          </button>

          {/* Create Account Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Create an Account
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
