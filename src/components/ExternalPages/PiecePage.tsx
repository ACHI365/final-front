import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPieceById,
  getReview,
  getReviewsByPiece,
  getReviewsByUser,
  getTagsForReview,
  getUserById,
} from "../../service/api"; // Replace with your API call to get a review by ID
import TagCloud from "../TagCloud";
import SortByDate from "../sorting/SortByDate";
import SortByGrade from "../sorting/SortByGrade";

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

const PiecePage: React.FC = () => {
  const { pieceId } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pieceNames, setPieceNames] = useState<{ [id: number]: string }>({});
  const [pieceGroups, setPieceGroups] = useState<{ [id: number]: string }>({});
  const [userNames, setUserNames] = useState<{ [id: number]: string }>({});
  const [tags, setTags] = useState<{ [id: number]: string[] }>({});
  const [sortByDate, setSortByDate] = useState<"asc" | "desc">("asc");
  const [sortByGrade, setSortByGrade] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();


  useEffect(() => {
    fetchReviews();
  }, [sortByDate, sortByGrade]);

  // useEffect(() => {
  //   fetchReviews();
  // }, [])

  
  const handleSortByDate = (value: "asc" | "desc") => {
    setSortByDate(value);
    // fetchReviews();
  };

  const handleSortByGrade = (value: "asc" | "desc") => {
    setSortByGrade(value);
    // fetchReviews();
  };

  const fetchReviews = async () => {
    try {
      const response = await getReviewsByPiece(parseInt(pieceId!));
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
  return (
    <div className="bg-white py-5 sm:py-5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <TagCloud />
        <div className="ml-20 mb-6 flex gap-96">
            <SortByDate handleSortByDate={handleSortByDate} />
            <SortByGrade handleSortByGrade={handleSortByGrade} />
          </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {reviews.map((post) => (
            <article
              key={post.reviewId}
              className="flex max-w-xl flex-col items-start justify-between border rounded-md p-5 shadow-md"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={post.creationTime} className="text-gray-500">
                    {formatDate(post.creationTime)}
                  </time>
                  <a className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                    <span className="absolute inset-0" onClick={() => handleNavigatePiece(post.pieceId)}/>
                    {pieceNames[post.reviewId]}
                  </a>
                  <a className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                    <span className="absolute inset-0" onClick={() => handleNavigateGroup(post.group)} />
                    {pieceGroups[post.reviewId]}
                  </a>
                </div>
                <div className="text-gray-500">{post.grade}</div>{" "}
                {/* Display the number "10" */}
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
              <div className="relative mt-8 flex items-center gap-x-4">
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
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PiecePage;
