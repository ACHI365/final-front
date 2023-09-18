import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface MainPageProps {
  translations: { [key: string]: string };
}

const MainPage: React.FC<MainPageProps> = ({ translations }) => {
  const auth = useAuth();

  return (
    <div className="container mt-5">
        {auth.currUser?.id} <br/>
        {auth.currUser?.email}<br/>
        {auth.currUser?.userName}<br/>
    </div>
  );
};

export default MainPage;
