import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getPieceById,
  getReviewsByUser,
  getTagsForReview,
  getUserById,
} from "../../service/api"; // Replace with your API call to get a review by ID
import TagCloud from "../TagCloud";
import SortByDate from "../sorting/SortByDate";
import SortByGrade from "../sorting/SortByGrade";
import ReviewView from "./Review";

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

const UserPage: React.FC = () => {
  const { userId } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pieceNames, setPieceNames] = useState<{ [id: number]: string }>({});
  const [pieceGroups, setPieceGroups] = useState<{ [id: number]: string }>({});
  const [userNames, setUserNames] = useState<{ [id: number]: string }>({});
  const [tags, setTags] = useState<{ [id: number]: string[] }>({});
  const [sortByDate, setSortByDate] = useState<"asc" | "desc">("asc");
  const [sortByGrade, setSortByGrade] = useState<"asc" | "desc">("asc");
  const [dummy, setDummy] = useState<number>(0);


  useEffect(() => {
    fetchReviews();
  }, [sortByDate, sortByGrade]);

  const handleSortByDate = (value: "asc" | "desc") => {
    setSortByDate(value);
  };

  const handleSortByGrade = (value: "asc" | "desc") => {
    setSortByGrade(value);
  };
  const fetchReviews = async () => {
    try {
      const response = await getReviewsByUser(parseInt(userId!));
      let sortedReviews = response.data;

      if (sortByDate) {
        sortedReviews = sortedReviews.sort((a: Review, b: Review) => {
          if (sortByDate === "asc")
            return (
              new Date(a.creationTime).getTime() -
              new Date(b.creationTime).getTime()
            );
          else
            return (
              new Date(b.creationTime).getTime() -
              new Date(a.creationTime).getTime()
            );
        });
      }

      if (sortByGrade) {
        sortedReviews = sortedReviews.sort((a: Review, b: Review) => {
          if (sortByGrade === "asc") return a.grade - b.grade;
          else return b.grade - a.grade;
        });
      }
      setReviews(response.data);
      const names: { [id: number]: string } = {};
      const userNamers: { [id: number]: string } = {};
      const pieceGroupers: { [id: number]: string } = {};
      const tagList: { [id: number]: string[] } = {};
      for (const review of response.data) {
        const [pieceName, group] = await getPieceName(review.pieceId);
        names[review.reviewId] = pieceName;
        pieceGroupers[review.reviewId] = group;
        tagList[review.reviewId] = await getTags(review.reviewId);

        const userName = await getUserName(review.userId);
        userNamers[review.reviewId] = userName;
      }

      setTags(tagList);
      setPieceGroups(pieceGroupers);
      setPieceNames(names);
      setUserNames(userNamers);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
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

  const getPieceName = async (id: number): Promise<[string, string]> => {
    try {
      const response = await getPieceById(id);
      const pieceName = response.data.data.name || "Unknown Piece";
      return [pieceName, convertIntToCategory(response.data.data.group)];
    } catch (error) {
      console.error("Error fetching piece name:", error);
      return ["Unknown Piece", "Unknown Category"];
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

  return (
    <div className="bg-white py-5 sm:py-5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-white py-5 sm:py-5">
          <TagCloud />
          <div className="ml-20 mb-6 flex gap-96">
            <SortByDate handleSortByDate={handleSortByDate} />
            <SortByGrade handleSortByGrade={handleSortByGrade} />
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {reviews.map((post) => (
              <ReviewView
              key={post.reviewId}
              post={post}
              pieceGroups={pieceGroups}
              pieceNames={pieceNames}
              userNames={userNames}
              tags={tags}
              dummy={dummy} 
              setDummy={setDummy}
            />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
