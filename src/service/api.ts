import axios, { AxiosInstance, AxiosResponse } from "axios";

const apiBaseUrl: string = process.env.REACT_APP_BACK_URL!;
const API_BASE_URL: string = `${apiBaseUrl}/api`;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

interface AuthData {
  email: string | undefined;
}

interface registerData {
  Name: string | null | undefined;
  UserName: string | null | undefined;
  Email: string | null | undefined;
}

interface Tag {
  name: string;
}

interface User {
  name: string;
  userName: string;
  email: string;
  role: Role;
}

enum Role {
  Admin = "Admin",
  User = "User",
}

export enum Group {
  Book = "Book",
  Movie = "Movie",
  TvSeries = "TvSeries",
  Game = "Game",
}

export interface PieceDto {
  name: string;
  group: number;
}

interface ReviewCreateDto {
  reviewName: string;
  group: number;
  reviewText: string;
  grade: number;
  pieceId: number;
  userId: number;
  tagNames: string[];
  imageUrl?: string;
}

interface ReviewEditDto {
  reviewName: string;
  group: number;
  reviewText: string;
  grade: number;
}

interface CommentDto {
  reviewId: string;
  context: string;
}

export const login = (data: AuthData): Promise<AxiosResponse> =>
  api.post("/Auth/login", data);
export const googleLogin = (): Promise<AxiosResponse> =>
  api.post("/Auth/google-login");
export const signup = (data: registerData): Promise<AxiosResponse> =>
  api.post("/Auth/register", data);
export const getAllTags = (): Promise<AxiosResponse<Tag[]>> =>
  api.get("/Tag/get-all");

export const createTag = (tag: Tag): Promise<AxiosResponse> =>
  api.post("/Tag", tag);

export const getTagByName = (tagName: string): Promise<AxiosResponse<Tag>> =>
  api.get(`/Tag/${tagName}`);
export const getAllPieces = (): Promise<AxiosResponse<PieceDto[]>> =>
  api.get("/Piece/getAll",);

export const createPiece = (piece: PieceDto): Promise<AxiosResponse> =>
  api.post("/Piece/create-piece", piece, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });

export const getPieceByName = (
  pieceName: string
): Promise<AxiosResponse<PieceDto>> =>
  api.get(`/Piece/get/${pieceName}`);

export const getPieceById = (pieceId: number): Promise<AxiosResponse> =>
  api.get(`/Piece/getId/${pieceId}`);

export const getPiecesByGroup = (
  groupId: number
): Promise<AxiosResponse<PieceDto[]>> =>
  api.get(`/Piece/getAllGroup/${groupId}`);
export const getUserManagement = (): Promise<AxiosResponse> =>
  api.get("/User/user-management", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });

export const getUserById = (userId: number): Promise<AxiosResponse<User>> =>
  api.get(`/User/get/${userId}`);

export const createReview = (model: ReviewCreateDto): Promise<AxiosResponse> =>
  api.post("/Review/create-review", model, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });

export const editReview = (
  reviewId: number,
  model: ReviewEditDto
): Promise<AxiosResponse> =>
  api.put(`/Review/edit-review/${reviewId}`, model, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });

export const deleteReview = (reviewId: number): Promise<AxiosResponse> =>
  api.delete(`/Review/delete-review/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });

export const getReview = (reviewId: number): Promise<AxiosResponse> =>
  api.get(`/Review/get-review/${reviewId}`);

export const getAllReviews = (): Promise<AxiosResponse> =>
  api.get("/Review/get-all-reviews");

export const getReviewsByTag = (tagName: string): Promise<AxiosResponse> =>
  api.get(`/Review/get-review-by-tag/${tagName}`);
export const getReviewsByUser = (userId: number): Promise<AxiosResponse> =>
  api.get(`/Review/get-review-by-user/${userId}`);

export const getReviewsByPiece = (pieceId: number): Promise<AxiosResponse> =>
  api.get(`/Review/get-review-by-piece/${pieceId}`);

export const getReviewsByGroup = (group: number): Promise<AxiosResponse> =>
  api.get(`/Review/get-review-by-group/${group}`);

export const getLikeCount = (reviewId: number): Promise<AxiosResponse> =>
  api.get(`/Review/likeCount/${reviewId}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });

export const likeReview = (reviewId: number): Promise<AxiosResponse> =>
  api.post(`/Review/like/${reviewId}/`, null, {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
  });
export const checkLikeStatus = (
  reviewId: number
): Promise<AxiosResponse<boolean>> =>
  api.get(`/Review/likestatus/${reviewId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
  });

export const unlikeReview = (reviewId: number): Promise<AxiosResponse> =>
  api.post(
    `/Review/unlike/${reviewId}`,
    {},
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    }
  );

export const getTagsForReview = (reviewId: number): Promise<AxiosResponse> =>
  api.get(`/Review/review-tags/${reviewId}`);

export const getCommentsByReview = (reviewId: number): Promise<AxiosResponse> =>
  api.get(`/Review/get-comments/${reviewId}`);

export const addComment = (commentDto: CommentDto): Promise<AxiosResponse> =>
  api.post(`/Review/add-comment`, commentDto, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });

export const ratePiece = (
  pieceId: number,
  score: number
): Promise<AxiosResponse> =>
  api.post(`/Piece/rate-piece/${pieceId}/${score}`, null, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });

export const getRating = (pieceId: number): Promise<AxiosResponse> =>
  api.get(`/Piece/get-rating/${pieceId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });
