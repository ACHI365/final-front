import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { createPiece, createReview, getAllPieces, getAllTags } from "../service/api";
import { useAuth } from "../context/AuthContext";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import YourComponent from "./TagInput";
import Tags from "./TagInput";
import ScoreGrading from "./ScoreGrading";

interface Review {
  reviewName: string;
  pieceId: number;
  group: string;
  tags: string[];
  reviewText: string;
  grade: number;
}

const CreateReview = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const auth = useAuth();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);

  const [review, setReview] = useState<Review>({
    reviewName: "",
    pieceId: 0,
    group: "",
    tags: [],
    reviewText: "",
    grade: 0,
  });

  const [image, setImage] = useState<File | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [pieces, setPieces] = useState<string[]>([]);
  const [suggestedPieces, setSuggestedPieces] = useState<string[]>([]);
  const [pieceInput, setPieceInput] = useState("");

  const handlePieceInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setPieceInput(input);

    const filteredPieces = input
      ? pieces.filter((piece) =>
          piece.toLowerCase().includes(input.toLowerCase())
        )
      : [];

    setSuggestedPieces(filteredPieces);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPieceInput(suggestion);
    setSuggestedPieces([]);
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getAllTags();
        setAllTags(response.data.map((tag: { name: string }) => tag.name));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    const fetchPieces = async () => {
      try {
        const response = await getAllPieces();
        setPieces(response.data.map((piece: { name: string }) => piece.name));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
    fetchPieces();
  }, []);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const uploadedImage = event.target.files[0];
      setImage(uploadedImage);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;    
    setReview({ ...review, group: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const getGroupNumber = (group: string): number => {
    switch (group) {
      case "Book":
        return 0;
      case "Movie":
        return 1;
      case "TvSeries":
        return 2;
      case "Game":
        return 3;
      default:
        return 0;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const pieceData = {
        name: pieceInput,
        group: getGroupNumber(review.group),
      };

      const pieceResponse = await createPiece(pieceData);

      if (pieceResponse && pieceResponse.data) {
        const pieceId = pieceResponse.data.pieceId;

        const reviewData = {
          pieceId: pieceId,
          tagNames: tags,
          reviewName: review.reviewName,
          group: getGroupNumber(review.group),
          reviewText: review.reviewText,
          grade: score,
          userId: Number(localStorage.getItem("userID")),
        };
        const reviewResponse = await createReview(reviewData);

        if (reviewResponse) {
          console.log("Review created successfully:", reviewResponse.data);
          setReview({
            reviewName: "",
            pieceId: 0,
            group: "",
            tags: [],
            reviewText: "",
            grade: 0,
          });
      
          setTags([]);
          setScore(0);
          setPieceInput("");
        } else {
          window.alert("Failed to create review.");
        }
      } else {
        window.alert("Failed to create review.");
      }
    } catch (error) {
      window.alert("Failed to create review.");
    }
  };

  const handleReviewTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview({ ...review, reviewText: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Create Review
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Reveiew Title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                      <input
                        required
                        type="text"
                        name="reviewName"
                        value={review.reviewName}
                        onChange={handleInputChange}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Piece Title
                  </label>
                  <div className="mt-2 relative">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                      <input
                        required
                        type="text"
                        name="reviewName"
                        value={pieceInput}
                        onChange={handlePieceInputChange}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {suggestedPieces.length > 0 && (
                      <div className="mt-2 bg-white border border-gray-300 shadow-md rounded-md max-h-36 overflow-y-auto">
                        {suggestedPieces.map((piece, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(piece)}
                          >
                            {piece}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Group
                  </label>
                  <div className="mt-2">
                    <select
                      name="group"
                      value={review.group}
                      onChange={handleSelectChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="Book">Book</option>
                      <option value="Movie">Movie</option>
                      <option value="TvSeries">TvSeries</option>
                      <option value="Game">Game</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={5}
                      name="reviewText"
                      value={review.reviewText}
                      onChange={handleReviewTextChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <Tags allTags={allTags} tags={tags} setTags={setTags} />
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Cover photo
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>

                  <h2>Score:</h2>
                  <ScoreGrading score={score} setScore={setScore} />
                </div>
              </div>
            </div>
          </div>

          <Button variant="primary" type="submit">
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateReview;
