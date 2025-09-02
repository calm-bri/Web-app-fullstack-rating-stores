import React, { useEffect, useState} from "react";
import api from "../../api/api";
import StoreCard from "../../components/StoreCard";
import AddStoreForm from "../../components/AddStoreForm";


const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // ✅ edit modal state
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", address: "" });

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const storeRes = await api.get("/stores/owner/my-stores");
      const statsRes = await api.get("/dashboard/owner/stats");

      setStores(storeRes.data.data || []);
      setStats(statsRes.data || {});
    } catch (err) {
      console.error("OwnerDashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    try {
      await api.delete(`/stores/owner/${storeId}`);
      fetchOwnerData();
    } catch (err) {
      console.error("Error deleting store:", err);
    }
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name || "",
      email: store.email || "",
      address: store.address || "",
    });
  };

  const submitEdit = async () => {
    try {
      await api.put(`/stores/owner/${editingStore.id}`, formData);
      alert("Store updated successfully!");
      setEditingStore(null);
      setFormData({ name: "", email: "", address: "" });
      fetchOwnerData();
    } catch (err) {
      console.error("Error updating store:", err);
      alert("Error updating store");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Owner Dashboard</h2>

      <div className="analytics">
        <p>My Stores: {stats?.totalStores || stores.length}</p>
        <p>Total Ratings: {stats?.totalRatings || 0}</p>
        <p>Average Rating: {stats?.avgRating?.toFixed(1) || 0} ⭐</p>
      </div>
      {/* Toggle Add Store */}
<button onClick={() => setShowForm(!showForm)} className="btn primary">
  {showForm ? "✖ Close Form" : "➕ Add Store"}
</button>

{/* Show form only when toggled */}
{showForm && <AddStoreForm role="owner" onSuccess={fetchOwnerData} />}

      <h3>My Stores</h3>
      <div className="store-list">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onEdit={() => handleEdit(store)} // ✅ real edit handler
            onDelete={() => handleDelete(store.id)}
            onRate={() => console.log("Owner rating flow untouched")}
          />
        ))}
      </div>

      {/* ✅ Edit Modal */}
      {editingStore && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Store</h3>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            <div style={{ marginTop: "1rem" }}>
              <button className="btn-primary" onClick={submitEdit}>
                Save
              </button>
              <button
                className="btn-secondary"
                onClick={() => setEditingStore(null)}
                style={{ marginLeft: "0.5rem" }}
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

export default OwnerDashboard;
