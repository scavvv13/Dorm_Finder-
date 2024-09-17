import React, { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../Auth/FirebaseAuth";
import { clearLocalStorage } from "../utils/cleanup";

const VerifyEmailPage = () => {
  const [emailVerified, setEmailVerified] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = JSON.parse(localStorage.getItem("user"));
    if (userToken) {
      setEmailVerified(userToken.emailVerified);
    }
  }, []);

  const handleResendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        alert("A verification email has been sent to your email address.");
        clearLocalStorage(); // Clear storage after verification
      } catch (error) {
        console.error("Error sending verification email:", error);
        alert("There was an error sending the verification email.");
      }
    } else {
      alert("Unable to get user information. Please log in again.");
    }
  };

  const handleBackToLogin = () => {
    clearLocalStorage(); // Clear storage when navigating back
    navigate("/login");
    window.location.reload(); // Refresh the page after navigating
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-semibold mb-4 text-center">
            Verify Your Email
          </h1>
          <p className="mb-4 text-center">
            An email verification link has been sent to your email address.
            Please check your email and follow the instructions to verify your
            account.
          </p>
          <p className="mb-4 text-center">
            If you didn't receive the email, you can{" "}
            <button
              onClick={handleResendVerificationEmail}
              className="btn btn-link text-blue-500 hover:underline"
            >
              click here to resend it
            </button>
            .
          </p>
          <div className="text-center">
            <button onClick={handleBackToLogin} className="btn btn-primary">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
