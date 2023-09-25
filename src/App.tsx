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

const App: React.FC = () => {
  if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
  }

  const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

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
          <Route path="/create-review" element={<CreateReview />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/review/:revId" element={<ReviewPage />}></Route>
          <Route path="/tag/:tagName" element={<TagPage />}></Route>
          <Route path="/groups/:group" element={<GroupPage />}></Route>
          <Route path="/piece/:pieceId" element={<PiecePage />}></Route>
          <Route path="/user/:userId" element={<UserPage></UserPage>}></Route>
          <Route
            path="/sign-in/*"
            element={
              <SignIn
                afterSignUpUrl={"/sign-up-attempt"}
                redirectUrl={"/protected"}
                signUpUrl="/sign-up"
              />
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <SignUp
                redirectUrl={"/protected"}
                afterSignUpUrl={"/sign-up-attempt"}
              />
            }
          />
          <Route
            path="/protected"
            element={
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
