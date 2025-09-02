import React from "react";

const StarRating = ({ rating }) => {
  return (
    <span className="star-rating">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </span>
  );
};

export default StarRating;
