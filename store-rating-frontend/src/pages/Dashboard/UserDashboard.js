import React, { useEffect, useState } from "react";
import api from "../../api/api";
import StoreCard from "../../components/StoreCard";
import RatingList from "../../components/RatingList";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // modal state
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storeRes = await api.get("/stores");
      const ratingRes = await api.get("/ratings/user");
      const statsRes = await api.get("/dashboard/user/stats");

      setStores(storeRes.data.data || []);
      setRatings(ratingRes.data.data || []);
      setStats(statsRes.data || {});
    } catch (err) {
      console.error("UserDashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const existingRating = ratings.find(
        (r) => r.storeId === selectedStore.id
      );

      if (existingRating) {
        // update rating
        await api.put(`/ratings/${existingRating.id}`, {
          rating: Number(rating),
          comment,
        });
        alert("Rating updated!");
      } else {
        // create rating
        await api.post("/ratings", {
          storeId: Number(selectedStore.id),
          rating: Number(rating),
          comment,
        });
        alert("Rating submitted!");
      }

      setSelectedStore(null);
      setRating(5);
      setComment("");
      fetchUserData();
    } catch (err) {
      console.error("Error submitting rating:", err.response?.data || err);
      alert(err.response?.data?.message || "Error submitting rating.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>User Dashboard</h2>

      <div className="analytics">
        <p>Total Stores: {stats?.totalStores || stores.length}</p>
        <p>My Ratings: {stats?.totalRatings || ratings.length}</p>
        <p>Average Rating Given: {stats?.avgRating?.toFixed(1) || (ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : 0)} ⭐</p>

      </div>

      <h3>My Ratings</h3>
      <RatingList ratings={ratings} />

      <h3>All Stores</h3>
      <div className="store-list">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onRate={() => setSelectedStore(store)}
          />
        ))}
      </div>

      {/* ⭐ Rating Modal with Slider */}
      {selectedStore && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h3>Rate {selectedStore.name}</h3>

            {/* Slider Input */}
            <div style={{ marginBottom: "15px" }}>
              <label>Rating:</label>
              <input
                type="range"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <div>
                Selected: <strong>{rating} ⭐</strong>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Comment:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: "100%", height: "80px", padding: "5px" }}
                placeholder="Optional comment..."
              />
            </div>

            <div>
              <button
                onClick={handleSubmit}
                style={{
                  marginRight: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                }}
              >
                {ratings.find((r) => r.storeId === selectedStore?.id)
                  ? "Update Rating"
                  : "Submit Rating"}
              </button>
              <button
                onClick={() => setSelectedStore(null)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
