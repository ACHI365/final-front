import Cookies from "js-cookie";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  currUser: User | undefined;
  setCurrUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: number;
  email: string;
  userName: string;
  role: string;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    // localStorage.getItem("jwtToken") !== null
    // document.cookie.includes("jwtToken")
    Cookies.get("jwtToken") !== null
  );
  const [currUser, setCurrUser] = useState<User>();

  const login = (data: any): void => {
    localStorage.setItem("jwtToken", data.token);
    
    let loggedUser = data.result.data;
    console.log(loggedUser);
    setCurrUser(loggedUser)
    localStorage.setItem("userID", String(loggedUser?.userId))
    localStorage.setItem("userRole", String(loggedUser?.role))
    setIsAuthenticated(true);
  };

  const logout = (): void => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userID");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
  };

  // const login = (data: any): void => {
  //   document.cookie = `jwtToken=${data.token}; path=/`;

  //   let loggedUser = data.result.data;
  //   console.log(loggedUser);
  //   setCurrUser(loggedUser);

  //   document.cookie = `userID=${loggedUser?.userId}; path=/`;
  //   document.cookie = `userRole=${loggedUser?.role}; path=/`;
  //   setIsAuthenticated(true);
  // };

  // const logout = (): void => {
  //   document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  //   document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  //   document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

  //   setIsAuthenticated(false);
  // };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, currUser, setCurrUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

