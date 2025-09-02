import React, { useEffect, useState } from "react";
import api from "../api/api";
import StoreCard from "./StoreCard";
import { normalizeResponse } from "../utils/normalizeResponse";

const StoreList = ({
  endpoint = "/stores",
  title = "Stores",
  canEdit = false,
  canDelete = false,
  canRate = false,
  onEdit,
  onDelete,
  onRate,
  showRatings = false,
}) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get(endpoint);
        setStores(normalizeResponse(res));
      } catch (err) {
        console.error(`Error fetching stores from ${endpoint}:`, err);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [endpoint]);

  const handleDelete = async (store) => {
    if (!canDelete) return;
    try {
      const rolePath = store.owner ? "owner" : "admin"; // rough distinction
      await api.delete(`/stores/${rolePath}/${store.id}`);
      setStores((prev) => prev.filter((s) => s.id !== store.id));
      if (onDelete) onDelete(store);
    } catch (err) {
      console.error("Error deleting store:", err);
      alert("Failed to delete store.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{title}</h2>
      <div className="store-list">
        {stores.length > 0 ? (
          stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onEdit={canEdit ? () => onEdit && onEdit(store) : undefined}
              onDelete={canDelete ? () => handleDelete(store) : undefined}
              onRate={canRate ? () => onRate && onRate(store) : undefined}
              showRatings={showRatings}
            />
          ))
        ) : (
          <p>No stores available</p>
        )}
      </div>
    </div>
  );
};

export default StoreList;