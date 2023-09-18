import React from 'react';

interface ThemeToggleProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ onThemeChange }) => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <button
        className="btn btn-primary mx-2"
        onClick={() => onThemeChange('light')}
      >
        Light Mode
      </button>
      <button
        className="btn btn-secondary mx-2"
        onClick={() => onThemeChange('dark')}
      >
        Dark Mode
      </button>
    </div>
  );
};

export default ThemeToggle;
