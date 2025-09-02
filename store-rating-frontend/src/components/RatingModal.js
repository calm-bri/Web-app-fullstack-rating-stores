import React from "react";

const RatingModal = ({
  store,
  rating,
  comment,
  setRating,
  setComment,
  onSubmit,
  onClose,
  isUpdating,
}) => {
  if (!store) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{isUpdating ? "Update Rating" : "Rate"} {store.name}</h3>

        <div className="form-group">
          <label>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="select-input"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} ⭐
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="textarea-input"
            placeholder="Optional comment..."
          />
        </div>

        <div className="modal-actions">
          <button onClick={onSubmit} className="btn btn-success">
            {isUpdating ? "Update" : "Submit"}
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
