import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import LoginPage from "./components/LoginPage";
import LanguageToggle from "./components/LanguageToggle";
import ThemeToggle from "./components/ThemeToggle";
import englishWords from "./translations/englishWords";
import georgianWords from "./translations/georgianWords";
import SignupPage from "./components/SignupPage";
import MainPage from "./components/MainPage";

const App: React.FC = () => {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");

  const translations = language === "en" ? englishWords : georgianWords;

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
  };

  const handleThemeChange = (selectedTheme: "light" | "dark") => {
    setTheme(selectedTheme);
  };

  return (
    <Container
      fluid
      className={`vh-100 ${theme === "dark" ? "bg-dark" : "bg-light"}`}
    >
      <LanguageToggle onLanguageChange={handleLanguageChange} />
      <ThemeToggle onThemeChange={handleThemeChange} />
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage translations={translations} />
          }
        />
        {/* <Route
          path="/signup"
          element={
            <SignupPage translations={translations} />
          }
        /> */}
        <Route path="/mainPage"  element={
            <MainPage translations={translations} />
          }/>
      </Routes>
    </Container>
  );
};

export default App;
