import React, { FC, ReactNode } from 'react';
import { FaFacebookF, FaApple, FaGithub, FaGoogle } from 'react-icons/fa';

interface SocialButtonProps {
  icon: string;
  text: string;
  color: string;
  action: any
}

const SocialButton: FC<SocialButtonProps> = ({ icon, text, color, action }) => {
  const IconComponent = icon === 'facebook' ? FaGoogle : FaGithub;

  return (
    <button className={`btn btn-${color} btn-block mb-2`} onClick={action}>
      <IconComponent />
      {text}
    </button>
  );
};

export default SocialButton;
