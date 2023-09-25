import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addComment,
  checkLikeStatus,
  getCommentsByReview,
  getLikeCount,
  getPieceById,
  getRating,
  getReview,
  getTagsForReview,
  getUserById,
  ratePiece,
} from "../../service/api"; // Replace with your API call to get a review by ID
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import Cookies from "js-cookie";

interface Comment {
  id: number;
  text: string;
}

interface Review {
  reviewId: number;
  reviewName: string;
  piece: any;
  pieceId: number;
  grade: number;
  reviewText: string;
  userId: number;
  creationTime: string;
  tags: string[];
  author: string;
  group: number;
}

interface Comment {
  commentId: number;
  content: string;
  author: string;
  userId: number;
}

const ReviewPage: React.FC = () => {
  const { revId } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [likeAmount, setLikeAmount] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState<number>(0);

  const handleCommentClick = () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleCommentTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() === "") {
      alert("Please enter a comment.");
      return;
    }

    try {
      const response = await addComment({
        reviewId: revId!,
        context: commentText,
      });
      const commentsResponse = await getCommentsByReview(parseInt(revId!));
      setComments(commentsResponse.data);

      setCommentText("");
      setShowCommentBox(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const response = await getReview(parseInt(revId!));
        let review = response.data;
        let pieceResponse = await getPieceName(review.pieceId);
        review.piece = pieceResponse[0];
        review.group = pieceResponse[1];
        review.tags = await getTags(parseInt(revId!));
        review.author = await getUserName(review.userId);
        const commentsResponse = await getCommentsByReview(parseInt(revId!));
        console.log(commentsResponse.data);
        setComments(commentsResponse.data);
        setReview(response.data);
        // if (localStorage.getItem("jwtToken")) {
        if (Cookies.get("jwtToken")) {
          const response3 = await checkLikeStatus(parseInt(revId!));
          const response2 = await getLikeCount(parseInt(revId!));
          setIsLiked(response3.data);
          setLikeAmount(response2.data);
          const ratingResponse = await getRating(review.pieceId);
          setRating(ratingResponse.data);
        }
      } catch (error) {
        console.error("Error fetching review details:", error);
      }
    };

    const fetchLikeStatus = async () => {
      try {
        if (revId) {
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    fetchReviewDetails();
    setTimeout(async () => {
      await fetchLikeStatus();
    }, 2000);
  }, [revId]);

  const handleRatePiece = async (score: number) => {
    try {
      await ratePiece(review?.pieceId!, score);
      console.log("Piece rated successfully");
      setRating(score);
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
            // localStorage.getItem("jwtToken") ? () => handleRatePiece(i) : () => navigate("/sign-in")
            Cookies.get("jwtToken") ? () => handleRatePiece(i) : () => navigate("/sign-in")
          }
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getTags = async (id: number): Promise<string[]> => {
    try {
      const response = await getTagsForReview(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching user name:", error);
      return [];
    }
  };

  const getUserName = async (id: number) => {
    try {
      const response = await getUserById(id);
      return response.data.name || "Unknown User";
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown User";
    }
  };

  const getAuthor = async (id: number) => {
    try {
      const response = await getUserById(id);
      return response.data.name || "Unknown User";
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown User";
    }
  };

  const getPieceName = async (id: number): Promise<[any, number]> => {
    try {
      const response = await getPieceById(id);
      const pieceName = response.data.data || "Unknown Piece";
      return [pieceName, response.data.data.group];
    } catch (error) {
      console.error("Error fetching piece name:", error);
      return ["Unknown Piece", 0];
    }
  };

  const convertIntToCategory = (int: number): string => {
    switch (int) {
      case 0:
        return "Book";
      case 1:
        return "Movie";
      case 2:
        return "TvSeries";
      case 3:
        return "Game";
      default:
        return "Unknown Category";
    }
  };

  const formatDate = (isoDate: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(isoDate).toLocaleDateString(undefined, options);
  };
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

  return (
    <div>
      {review ? (
        <div className="max-w-2xl mx-auto p-6 border rounded-md shadow-md">
          <time dateTime={review.creationTime} className="text-gray-500">
            {formatDate(review.creationTime)}
          </time>
          <a onClick={() => handleNavigateUser(review.userId)}>
            <br />
            <span className="mt-2 text-gray-700 hover:cursor-pointer">
              {review.author}
            </span>
          </a>
          <div className="flex justify-between items-center mb-2 mt-2">
            <h1 className="text-2xl font-bold">{review.reviewName}</h1>
            <div className="text-gray-900 text-lg">{review.grade}</div>
          </div>
          Review Piece:
          <a
            onClick={() => handleNavigatePiece(review.pieceId)}
            className="relative z-10 rounded-full m-3 bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
          >
            <span className="" />
            {review.piece.name}
          </a>
          <a
            onClick={() => handleNavigateGroup(review.group)}
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
          >
            <span className="" />
            {convertIntToCategory(review.group)}
          </a>
          <p className="text-gray-700"> </p>
          {/* <p className="text-gray-700 mt-2">Tags:</p> */}
          <p className="mt-5 text-gray-700">{review.reviewText}</p>
          <div className="mt-12 flex flex-wrap gap-2 items-center text-xs mt-2">
            {review.tags != undefined &&
              review.tags.map((tag, index) => (
                <a
                  key={index}
                  className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => handleNavigateTag(tag)}
                >
                  {tag}
                </a>
              ))}
          </div>
          <div className="flex items-center ">
            {renderStarRating()}
            <div className="text-2xl text-yellow-500 ml-2">
              {review.piece.averageRating ?? 0}
            </div>
          </div>
          <p className="text-gray-700 mt-2">Rating: {review.grade}</p>
          <div
            onClick={
              // localStorage.getItem("jwtToken")
              Cookies.get("jwtToken")
                ? handleCommentClick
                : () => navigate("/sign-in")
            }
            className="mt-8 flex items-center gap-4 cursor-pointer"
          >
            <LikeButton
              key={parseInt(revId!)}
              reviewId={parseInt(revId!)}
              initialLiked={isLiked != null ? isLiked : false}
              setLikeAmount={setLikeAmount}
              likeAmount={likeAmount}
            />
            {likeAmount}
            <button onClick={handleCommentClick}>
              <CommentButton />
            </button>
          </div>
          <h2 className="text-xl font-bold mt-6">Comments</h2>
          <ul className="mt-2">
            {comments.map((comment) => (
              <li
                key={comment.commentId}
                className="text-gray-700 border p-5 shadow-sm rounded-sm m-5"
              >
                <strong>
                  {<a href={"user/" + comment.userId}>{comment.author}</a>}:
                </strong>{" "}
                {comment.content}
              </li>
            ))}
          </ul>
          {showCommentBox && (
            <div className="mt-4 flex flex-col">
              <textarea
                placeholder="Add your comment..."
                value={commentText}
                onChange={handleCommentTextChange}
                className="border border-gray-300 p-2 rounded"
              />
              <button
                onClick={handleCommentSubmit}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading review...</p>
      )}
    </div>
  );
};

export default ReviewPage;
