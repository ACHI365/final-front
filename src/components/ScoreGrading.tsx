import React, { useState } from 'react';
interface ScoreGradingProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

const ScoreGrading: React.FC<ScoreGradingProps> = ({ score, setScore }) => {

  const handleIncrement = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (score < 10) {
      setScore(score + 1);
    }
  };

  const handleDecrement = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (score > 0) {
      setScore(score - 1);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleDecrement}
        className="px-4 py-2 border border-gray-400 text-gray-600 rounded-l"
        type="button"  // Specify type as button
      >
        -
      </button>
      <div className="flex items-center">
        <span className="text-lg font-bold">{score}</span>
      </div>
      <button
        onClick={handleIncrement}
        className="px-4 py-2 border border-gray-400 text-gray-600 rounded-r"
        type="button"  // Specify type as button
      >
        +
      </button>
    </div>
  );
};

export default ScoreGrading;
