import React, { useEffect, useState } from "react";
import api from "../../api/api";
import StoreCard from "../../components/StoreCard";
import RatingList from "../../components/RatingList";
import AddStoreForm from "../../components/AddStoreForm";

const AdminDashboard = () => {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const storeRes = await api.get("/stores/admin/all");
      const ratingRes = await api.get("/ratings/admin/all");
      const statsRes = await api.get("/dashboard/admin/stats");

      setStores(storeRes.data.data || []);
      setRatings(ratingRes.data.data || []);
      setStats(statsRes.data || {});
    } catch (err) {
      console.error("AdminDashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (store) => {
    const name = prompt("Enter new name:", store.name);
    const email = prompt("Enter new email:", store.email);
    const address = prompt("Enter new address:", store.address);
    if (!name || !email || !address) return;

    try {
      await api.put(`/stores/admin/${store.id}`, { name, email, address });
      fetchAdminData();
    } catch (err) {
      console.error("Error updating store:", err);
    }
  };

  const handleDelete = async (store) => {
    if (!window.confirm("Delete this store?")) return;
    try {
      await api.delete(`/stores/admin/${store.id}`);
      fetchAdminData();
    } catch (err) {
      console.error("Error deleting store:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div className="analytics">
        <p>Total Stores: {stats?.totalStores || stores.length}</p>
        <p>Total Ratings: {stats?.totalRatings || ratings.length}</p>
        <p>Average Rating Given: {stats?.avgRating?.toFixed(1) || (ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : 0)} ⭐</p>

      </div>

      {/* Toggle Add Store */}
      <button onClick={() => setShowForm(!showForm)} className="btn primary">
        {showForm ? "✖ Close Form" : "➕ Add Store"}
      </button>

      {showForm && <AddStoreForm role="admin" onSuccess={fetchAdminData} />}

      <h3>All Stores</h3>
      <div className="store-list">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onEdit={() => handleEdit(store)}
            onDelete={() => handleDelete(store)}
          />
        ))}
      </div>

      <h3>All Ratings</h3>
      <RatingList ratings={ratings} />
    </div>
  );
};

export default AdminDashboard;
