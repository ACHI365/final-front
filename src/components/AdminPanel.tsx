import React, { useState, useEffect } from "react";
import { getReviewsByUser, getUserManagement } from "../service/api";
import { Link, useNavigate } from "react-router-dom";

interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  reviews: string[];
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<{ [id: number]: any[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUserManagement();
        const reviewers: { [id: number]: any[] } = {};

        for (const user of response.data) {
          const response = await getReviewsByUser(user.userId);
          console.log(response.data);

          reviewers[user.userId] = response.data;
        }
        setReviews(reviewers);
        setUsers(response.data);
      } catch {
        window.alert("Sorry");
      }
    };
    fetchUsers();
  }, []);

  const handleNavigate = (revId: number) => {
    navigate("/review/" + revId);
  };

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {users.map((user) => (
        <li key={user.email} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div
              className="h-12 w-12 flex-none "
              //   src={user.imageUrl}
              //   alt=""
            ></div>
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {user.name}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {user.email}
              </p>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Reviews:{" "}
                {reviews[user.userId].map((review) => (
                  <React.Fragment key={review.reviewId}>
                    <Link
                      to={`/review/${review.reviewId}`}
                      onClick={() => handleNavigate(review.reviewId)}
                    >
                      {review.reviewName}
                    </Link>
                    {", "}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm leading-6 text-gray-900">{user.role}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AdminPanel;
