import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp, FaComment } from "react-icons/fa";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import {
  checkLikeStatus,
  getLikeCount,
  getPieceById,
  getRating,
  ratePiece,
} from "../../service/api";

interface Review {
  reviewId: number;
  reviewName: string;
  piece: string;
  pieceId: number;
  grade: number;
  reviewText: string;
  userId: number;
  creationTime: string;
  tags: string[];
  author: string;
  group: number;
}

interface ReviewPageProps {
  post: Review; // Assuming `Review` is the type for a review
  pieceGroups: { [id: number]: string };
  pieceNames: { [id: number]: string };
  userNames: { [id: number]: string };
  tags: { [id: number]: string[] };
  dummy: number;
  setDummy: React.Dispatch<React.SetStateAction<number>>;
}

const ReviewView: React.FC<ReviewPageProps> = ({
  post,
  pieceGroups,
  pieceNames,
  userNames,
  tags,
  dummy,
  setDummy,
}) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  // const isAuthorized = localStorage.getItem("jwtToken");
  const isAuthorized = (document.cookie.match(/(?<=jwtToken=)[^;]*/) || [])[0];


  const handleNavigate = (revId: number) => {
    navigate("/review/" + revId);
  };

  const handleNavigateUser = (userId: number) => {
    navigate("/user/" + userId);
  };

  const handleNavigatePiece = (pieceId: number) => {
    navigate("/piece/" + pieceId);
  };

  const handleNavigateTag = (tagName: string) => {
    navigate("/tag/" + tagName);
  };

  const handleNavigateGroup = (group: number) => {
    navigate("/groups/" + group);
  };

  const formatDate = (isoDate: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(isoDate).toLocaleDateString(undefined, options);
  };

  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [likeAmount, setLikeAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        if (isAuthorized) {
          const response3 = await checkLikeStatus(post.reviewId);
          const response2 = await getLikeCount(post.reviewId);
          setIsLiked(response3.data);
          setLikeAmount(response2.data);
        }
        const pieces = await getPieceById(post.pieceId);
        setAverageRating(pieces.data.data.averageRating);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    const fetch2 = async () => {
      try {
        const ratingResponse = await getRating(post.pieceId);
        setRating(ratingResponse.data);
      } catch {
        console.log();
      }
    };

    fetchLikeStatus();
    if (isAuthorized) fetch2();
  }, [rating, averageRating]);

  const handleRatePiece = async (score: number) => {
    try {
      if (isAuthorized) await ratePiece(post.pieceId!, score);
      setRating(score);
      setDummy(dummy + 1);
    } catch (error) {
      console.error("Error rating the piece:", error);
    }
  };

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`cursor-pointer text-2xl ${
            i <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={
            isAuthorized ? () => handleRatePiece(i) : () => navigate("/sign-in")
          }
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <article
      key={post.reviewId}
      className="flex max-w-xl flex-col items-start justify-between border rounded-md p-5 shadow-md"
    >
      {(isLiked != null ||
         !isAuthorized) && (
          <div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.creationTime} className="text-gray-500">
                  {formatDate(post.creationTime)}
                </time>
                <a className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                  <span
                    className="absolute inset-0"
                    onClick={() => handleNavigatePiece(post.pieceId)}
                  />
                  {pieceNames[post.reviewId]}
                </a>
                <a className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                  <span
                    className="absolute inset-0"
                    onClick={() => handleNavigateGroup(post.group)}
                  />
                  {pieceGroups[post.reviewId]}
                </a>
              </div>
              <div className="text-gray-500 ml-5 float-left">
                Grade: {post.grade}
              </div>{" "}
            </div>

            <div className="group relative mt-3">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                <a onClick={() => handleNavigate(post.reviewId)}>
                  <span className="absolute inset-0" />
                  {post.reviewName}
                </a>
              </h3>
              <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 overflow-hidden">
                {post.reviewText}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-xs mt-2">
              {tags[post.reviewId] != undefined &&
                tags[post.reviewId].map((tag, index) => (
                  <a
                    key={index}
                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                    onClick={() => handleNavigateTag(tag)}
                  >
                    <span className="absolute inset-0" />
                    {tag}
                  </a>
                ))}
            </div>

            <div className="flex items-center ">
              {renderStarRating()}
              <div className="text-2xl text-yellow-500 ml-2">
                {averageRating ?? 0}
              </div>
            </div>
            <p className="text-gray-700 mt-2">Rating: {post.grade}</p>

            <div className="mt-8 flex items-center gap-4">
              {isAuthorized ? (
                <>
                  <LikeButton
                    key={post.reviewId}
                    reviewId={post.reviewId}
                    initialLiked={isLiked != null ? isLiked : false}
                    setLikeAmount={setLikeAmount}
                    likeAmount={likeAmount}
                  />
                  {likeAmount}
                  <div onClick={() => handleNavigate(post.reviewId)}>
                    <CommentButton />
                  </div>
                </>
              ) : (
                <div
                  onClick={() => navigate("/sign-in")}
                  className="cursor-pointer"
                >
                  <LikeButton
                    key={post.reviewId}
                    reviewId={post.reviewId}
                    initialLiked={isLiked != null ? isLiked : false}
                    setLikeAmount={setLikeAmount}
                    likeAmount={likeAmount}
                  />
                  {likeAmount}
                  <div onClick={() => handleNavigate(post.reviewId)}>
                    <CommentButton />
                  </div>
                </div>
              )}
            </div>

            <div className="relative  flex items-center gap-x-4">
              {/* <img src={post.author.imageUrl} alt="" className="h-10 w-10 rounded-full bg-gray-50" /> */}
              <div className="text-sm leading-6">
                <p className="font-semibold text-gray-900">
                  <a onClick={() => handleNavigateUser(post.userId)}>
                    <span className="absolute inset-0 hover:cursor-pointer" />
                    {userNames[post.reviewId]}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
    </article>
  );
};

export default ReviewView;
