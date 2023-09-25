import React, { ReactNode, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { signup } from "../service/api";
import { useAuth } from "../context/AuthContext";

const SignUpAttempt: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const auth = useAuth(); 
  const navigate = useNavigate();
  
  useEffect(() => {
    handleSignup();
  }, [])

  const handleSignup = async () => {
    try {
      console.log( user?.fullName,
        user?.username,
         user?.primaryEmailAddress?.emailAddress,);
      
      const response = await signup({
        Name: user?.fullName,
        UserName: user?.username,
        Email: user?.primaryEmailAddress?.emailAddress,
      });
      console.log(response)
      if (response.data.isSuccess) {
        navigate("/protected")
      } else {
        window.alert("SignUp failed success");
        navigate("/sign-in");
      }
    } catch (error: any) {
      window.alert("SignUp failed error");
      navigate("/sign-in");
    }
  };

  return (
    <div>
      {/* {user ? <p>Hello, {user.id}</p> : <p>Not signed in.</p>}
      {user ? <p>Hello, {user.username}</p> : <p>Not signed in.</p>}
      {user ? <p>Hello, {user.fullName}</p> : <p>Not signed in.</p>}
      {user ? (
        <p>Hello, {user.primaryEmailAddress?.emailAddress}</p>
      ) : (
        <p>Not signed in.</p>
      )}
      <button onClick={handleSignOut}>Sign Out</button> */}
    </div>
  );
};

export default SignUpAttempt;
