import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPieceById,
  getReview,
  getTagsForReview,
  getUserById,
} from "../../service/api"; // Replace with your API call to get a review by ID

interface Comment {
  id: number;
  text: string;
}

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

const ReviewPage: React.FC = () => {
  const { revId } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const navigate = useNavigate();

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
        setReview(response.data);
      } catch (error) {
        console.error("Error fetching review details:", error);
      }
    };

    fetchReviewDetails();
  }, [revId]);

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

  const getPieceName = async (id: number): Promise<[string, number]> => {
    try {
      const response = await getPieceById(id);
      const pieceName = response.data.data.name || "Unknown Piece";
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
            <span className="mt-2 text-gray-700 hover:cursor-pointer">{review.author}</span>
          </a>
          <div className="flex justify-between items-center mb-2 mt-2">
            <h1 className="text-2xl font-bold">{review.reviewName}</h1>
            <div className="text-gray-900 text-lg">{review.grade}</div>
          </div>
          Review Piece:
          <a  onClick={() => handleNavigatePiece(review.pieceId)} className="relative z-10 rounded-full m-3 bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
            <span className="" />
            {review.piece}
          </a>
          <a onClick={() => handleNavigateGroup(review.group)} className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
            <span className="" />
            {convertIntToCategory(review.group)}
          </a>
          <p className="text-gray-700"> </p>
          {/* <p className="text-gray-700 mt-2">Tags:</p> */}
          <div className="flex flex-wrap gap-2 items-center text-xs mt-2">
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
          <p className="text-gray-700 mt-2">Rating: {review.grade}</p>
          <p className="mt-2 text-gray-700">{review.reviewText}</p>
          <h2 className="text-xl font-bold mt-6">Comments</h2>
          {/* <ul className="mt-2">
            {review.comments.map((comment) => (
              <li key={comment.id} className="text-gray-700">{comment.text}</li>
            ))}
          </ul> */}
        </div>
      ) : (
        <p>Loading review...</p>
      )}
    </div>
  );
};

export default ReviewPage;
