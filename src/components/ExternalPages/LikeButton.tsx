import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { likeReview, unlikeReview } from '../../service/api';

interface LikeButtonProps {
  reviewId: number;
  initialLiked: boolean;
  setLikeAmount: React.Dispatch<React.SetStateAction<number | null>>;
  likeAmount: number | null
}

const LikeButton: React.FC<LikeButtonProps> = ({ reviewId, initialLiked, setLikeAmount, likeAmount }) => {
  const [liked, setLiked] = useState(initialLiked);

  const handleLikeClick = async () => {
    try {
      if (liked) {
        await unlikeReview(reviewId);
        setLikeAmount(likeAmount! - 1);
      } else {
        await likeReview(reviewId);
        setLikeAmount(likeAmount! + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      className={`flex items-center gap-1 ${liked ? 'text-blue-500' : 'text-gray-500'}`}
    >
      {<FaThumbsUp />}
      {liked ? 'Liked' : 'Like'}
    </button>
  );
};

export default LikeButton;
