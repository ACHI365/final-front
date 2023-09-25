import React, { useState } from 'react';
import { FaComment } from 'react-icons/fa';

const CommentButton = () => {

  return (
    <button
      className={`flex items-center border rounded-full p-1 'border-gray-300' transition-colors`}
    >
      <FaComment className="mr-1" />
      {'Comment'}
    </button>
  );
};

export default CommentButton;
