import React from 'react';

interface LanguageToggleProps {
  onLanguageChange: (language: string) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ onLanguageChange }) => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <button
        className="btn btn-primary mx-2"
        onClick={() => onLanguageChange('en')}
      >
        English
      </button>
      <button
        className="btn btn-secondary mx-2"
        onClick={() => onLanguageChange('ge')}
      >
        ქართული
      </button>
    </div>
  );
};

export default LanguageToggle;
