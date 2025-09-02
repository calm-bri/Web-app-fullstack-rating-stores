import React, { useEffect, useState } from "react";
import api from "../api/api";
import { normalizeResponse } from "../utils/normalizeResponse";
import StarRating from "./StarRating";

const RatingList = ({ endpoint = "/ratings/user", canEdit = false, canDelete = false }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await api.get(endpoint);
        setRatings(normalizeResponse(res));
      } catch (err) {
        console.error(`Error fetching ratings from ${endpoint}:`, err);
        setRatings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [endpoint]);

  const handleDelete = async (id) => {
    if (!canDelete) return;
    try {
      await api.delete(`/ratings/${id}`);
      setRatings((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting rating:", err);
    }
  };

  return (
    <div>
      <h2>Ratings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : ratings.length > 0 ? (
        <div className="rating-list">
          {ratings.map((r) => (
            <div key={r.id} className="rating-card">
              <p><strong>Store:</strong> {r.store?.name}</p>
              <p><strong>User:</strong> {r.user?.name || "Me"}</p>
              <p><strong>Rating:</strong> <StarRating rating={r.rating} /></p>
              <p><strong>Comment:</strong> {r.comment}</p>
              {canDelete && (
                <button onClick={() => handleDelete(r.id)} className="btn btn-danger">
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No ratings found</p>
      )}
    </div>
  );
};

export default RatingList;
