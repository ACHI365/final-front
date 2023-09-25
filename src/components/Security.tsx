import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SecurityProps {
  children: React.ReactNode;
}

const redirectToSignIn = (navigate: any) => {
  navigate('/sign-in');
};

const Security: React.FC<SecurityProps> = ({ children }) => {
  const navigate = useNavigate();

  console.log("SDADSA");
  

  useEffect(() => {
    // const jwtToken = localStorage.getItem('jwtToken');
    const jwtToken = Cookies.get('jwtToken');

    if (!jwtToken) {
      redirectToSignIn(navigate);
    }
  }, [navigate]);

  return <>{children}</>;
};

export default Security;
