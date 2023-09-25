import React, { ReactNode, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { login, signup } from "../service/api";
import { useAuth } from "../context/AuthContext";

const SignInAttempt: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const auth = useAuth(); 
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    auth.logout();
    navigate("/sign-in")
  };

  const handleSignCreate = () => {
    navigate("/")
  }

  useEffect(() => {
    handleSignIn();
    handleSignCreate();
  }, [])

  const handleSignIn = async () => {
    try {
      const response = await login({ email: user?.primaryEmailAddress?.emailAddress});
      if (!response.data.result.isSuccess) {
        window.alert("Signin failed success");
          handleSignOut();
          navigate("/sign-in");
      }else{
        auth.login(response.data);
      }
    } catch (error: any) {
      window.alert("Signin failed");
      handleSignOut();
      navigate("/sign-in");
    }
  };

  return (
    <div>
      {user ? <p>Hello, {user.id}</p> : <p>Not signed in.</p>}
      {user ? <p>Hello, {user.username}</p> : <p>Not signed in.</p>}
      {user ? <p>Hello, {user.fullName}</p> : <p>Not signed in.</p>}
      {user ? (
        <p>Hello, {user.primaryEmailAddress?.emailAddress}</p>
      ) : (
        <p>Not signed in.</p>
      )}
      
       <button onClick={handleSignOut}>Sign Out</button>
       <button onClick={handleSignCreate}>Create</button>
    </div>
  );
};

export default SignInAttempt;
