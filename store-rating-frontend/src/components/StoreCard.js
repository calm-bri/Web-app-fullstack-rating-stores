import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const StoreCard = ({ store, onEdit, onDelete, onRate, showRatings = false }) => {
  const { user } = useContext(AuthContext);

  const isOwner = user?.role === "owner" && user?.id === store.owner?.id;
  const isAdmin = user?.role === "admin";
  const isUser  = user?.role === "user";

  return (
    <div className="store-card">
      <h3>{store.name}</h3>
      <p>📍 Address: {store.address || "Not available"}</p>
      {showRatings && (
        <p>
          ⭐ Average Rating:{" "}
          {typeof store.averageRating === "number"
            ? store.averageRating.toFixed(1)
            : "No ratings yet"}{" "}
          ({store.totalRatings || 0} ratings)
        </p>
      )}
      <p>
        <strong>Owner:</strong> {store.owner?.name || "N/A"} (
        {store.owner?.email || "N/A"})
      </p>

      <div className="actions">
        {isUser  && onRate && (
          <button onClick={onRate} className="btn rate">
            Rate
          </button>
        )}

        {(isOwner || isAdmin) && (
          <>
            {onEdit && (
              <button onClick={onEdit} className="btn edit">
                Edit
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="btn delete">
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StoreCard;