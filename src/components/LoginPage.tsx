import React, { useState } from "react";
import SocialButton from "./SocialButton";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { googleLogin, login } from "../service/api";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {
  translations: { [key: string]: string };
}

const LoginPage: React.FC<LoginPageProps> = ({ translations }) => {
  const navigate = useNavigate();
  const auth = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please fill all fields.");
    } else if (!validateEmail(email)) {
      setError("Invalid email format.");
    } else {
      try {
        const response = await login({ email, password });
        console.log(response.data);
        if (response.data.result.isSuccess) {
          if (response.data.result.data && !response.data.result.data.isBlocked) {
            auth.login(response.data);
            navigate("/mainPage");
          } else {
            setError("User is blocked.");
          }
        } else {
          setError(response.data.result.errorMessage);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          setError(error.response.data.errorMessage);
        } else {
          setError("An error occurred during login.");
        }
      }
    }
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const googleAuth = async () => {
    try {
    const response = await googleLogin();
    console.log(response);
    }catch(error){
      console.log(error); 
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6">
          <div className="form-container p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="social-buttons mb-3">
              <SocialButton
                icon="facebook"
                text="Sign in with Facebook"
                color="primary"
                action={googleAuth}
              />
              <SocialButton
                icon="fa-apple"
                text="Sign in with git"
                color="dark"
                action={googleAuth}
              />
            </div>
            {/* <hr className="mb-3" />
            <form onSubmit={handleLogin} className="form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  required
                  className="form-control"
                  type="text"
                  id="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  required
                  className="form-control"
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Sign In
              </button>
            </form>
            <a className="forgot-password-link d-block mt-2" href="#">
              Forgot Password
            </a>
            <p className="signup-link mt-3 text-center">
              Don't have an account?
              <NavLink className="link" to="/signup">
                Sign up now
              </NavLink>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
