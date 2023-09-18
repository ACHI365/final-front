import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import SocialButton from "./SocialButton";
import { NavLink } from "react-router-dom";
import { signup } from "../service/api";

interface SignupPageProps {
  translations: { [key: string]: string };
}

const SignupPage: React.FC<SignupPageProps> = ({ translations }) => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
    } else if (!validateEmail(email)) {
      setError("Invalid email format.");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      try {
        const response = await signup({
          Name: name,
          UserName: userName,
          Email: email,
          Password: password,
        });
        if (response.data.isSuccess) {
          setSuccess("Registration successful");
          setName("");
          setUserName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        } else {
          setError(response.data.errorMessage);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
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

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
          <div className="form-container p-4">
            <form onSubmit={handleSignup} className="form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter your Full Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter your Username"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Confirm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Sign In
              </button>
            </form>
            <p className="signup-link mt-3 text-center">
              Already have an account? 
              <NavLink className="link" to="/login">
                Log in now
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
