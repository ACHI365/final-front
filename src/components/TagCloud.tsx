import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllPieces,
  getAllTags,
  getReviewsByPiece,
} from "../service/api";

interface Review {
  reviewId: number;
  reviewName: string;
  piece: string;
  pieceId: number;
  grade: number;
  reviewText: string;
  userId: number;
  creationTime: string;
  group: number;
}

const TagCloud: React.FC = () => {

  const [tagCloud, setTagCloud] = useState<string[]>();
  const [pieceCloud, setPieceCloud] = useState<any[]>();

  const fetchMostUsedTags = async (): Promise<string[]> => {
    try {
      const response = await getAllTags();
      const tags: any[] = response.data;
      const sortedTags = tags
        .sort((a, b) => b.amount - a.amount)
        .map((tag) => tag.name);
      return sortedTags.slice(0, 10);
    } catch (error) {
      console.error("Error fetching most used tags:", error);
      throw error;
    }
  };

  const getReviewCountForPiece = async (pieceId: number): Promise<number> => {
    try {
      const response = await getReviewsByPiece(pieceId);
      return response.data.length;
    } catch (error) {
      console.error("Error fetching review count for piece:", error);
      throw error;
    }
  };

  const fetchMostReviewedPieces = async (): Promise<string[]> => {
    try {
      const response = await getAllPieces();
      const pieces: any[] = response.data;

      const reviewCounts = await Promise.all(
        pieces.map(async (piece) => ({
          pieceId: piece.pieceId,
          reviewCount: await getReviewCountForPiece(piece.pieceId),
        }))
      );

      const sortedPieces = pieces.sort((a, b) => {
        const reviewCountA =
          reviewCounts.find((item) => item.pieceId === a.pieceId)
            ?.reviewCount || 0;
        const reviewCountB =
          reviewCounts.find((item) => item.pieceId === b.pieceId)
            ?.reviewCount || 0;
        return reviewCountB - reviewCountA;
      });

      return sortedPieces.slice(0, 10);
    } catch (error) {
      console.error("Error fetching most reviewed pieces:", error);
      throw error;
    }
  };

  const getMostUsedTagsAndPieces = async () => {
    try {
      setTagCloud(await fetchMostUsedTags());
      setPieceCloud(await fetchMostReviewedPieces());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getMostUsedTagsAndPieces();
  }, []);


  return (
    <div className="bg-white py-5 sm:py-5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-white py-5 sm:py-5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-6 flex gap-6">
              <div className="flex-grow bg-gray-100 p-4 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">Most Used Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {tagCloud?.map((tag, index) => (
                    <Link
                      key={index}
                      to={`/tag/${tag}`}
                      className="text-gray-700 font-semibold hover:underline"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex-grow bg-gray-100 p-4 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">
                  Most Reviewed Pieces
                </h2>
                <div className="flex flex-wrap gap-2">
                  {pieceCloud?.map((piece, index) => (
                    <Link
                      key={index}
                      to={`/piece/${piece.pieceId}`}
                      className="text-gray-700 font-semibold hover:underline"
                    >
                      {piece.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagCloud;
