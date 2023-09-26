import Navbar from "./components/NavBar";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./styles.css";
import SignInAttempt from "./components/SignInAttempt";
import SignUpAttempt from "./components/SignUpAttempt";
import CreateReview from "./components/CreateReview";
import MainPage from "./components/MainPage";
import AdminPanel from "./components/AdminPanel";
import ReviewPage from "./components/ExternalPages/ReviewPage";
import UserPage from "./components/ExternalPages/UserPage";
import TagPage from "./components/ExternalPages/TagPage";
import GroupPage from "./components/ExternalPages/GroupPage";
import PiecePage from "./components/ExternalPages/PiecePage";
import Security from "./components/Security";
import React, { useEffect } from 'react';


const App: React.FC = () => {

  if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
  }

  const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
  const AdminPanelRoute: React.FC = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        navigate('/sign-in');
      }
    }, []);

    return localStorage.getItem("userRole") === "1" ? <AdminPanel /> : null;
  };

  const ClerkWithRoutes = () => {
    const navigate = useNavigate();

    return (
      <ClerkProvider
        publishableKey={clerkPubKey}
        navigate={(to) => navigate(to)}
      >
        <Navbar />
        <Routes>
          <Route path="/sign-up-attempt" element={<SignUpAttempt />} />
          <Route  
            path="/create-review"
            element={
              <Security>
                <CreateReview />
              </Security>
            }
          />
          <Route path="/" element={<MainPage />} />
          <Route
            path="/admin-panel"
            element={
              <Security>
                <AdminPanelRoute />
              </Security>
            }
          />
          <Route path="/review/:revId" element={<ReviewPage />}></Route>
          <Route path="/tag/:tagName" element={<TagPage />}></Route>
          <Route path="/groups/:group" element={<GroupPage />}></Route>
          <Route path="/piece/:pieceId" element={<PiecePage />}></Route>
          <Route path="/user/:userId" element={<UserPage />}></Route>

          <Route
            path="/sign-in/*"
            element={
              <div className="flex justify-center items-center h-screen">
                <SignIn
                  afterSignUpUrl={"/sign-up-attempt"}
                  redirectUrl={"/protected"}
                  signUpUrl="/sign-up"
                />
              </div>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <div className="flex justify-center items-center h-screen">
                <SignUp
                  redirectUrl={"/protected"}
                  afterSignUpUrl={"/sign-up-attempt"}
                />
              </div>
            }
          />
          <Route
            path="/protected"
            element={
              <div className="flex justify-center items-center h-screen">
                <>
                  <SignedIn>
                    <SignInAttempt />
                  </SignedIn>
                  <SignedOut>
                    <SignIn
                      afterSignUpUrl={"/sign-up-attempt"}
                      redirectUrl={"/protected"}
                      signUpUrl="/sign-up"
                    />
                  </SignedOut>
                </>
              </div>
            }
          />
        </Routes>
      </ClerkProvider>
    );
  };

  return (
    <div>
      <ClerkWithRoutes />
    </div>
  );
};

export default App;
