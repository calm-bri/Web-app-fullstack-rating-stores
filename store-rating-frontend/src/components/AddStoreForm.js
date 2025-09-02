import React, { useState, useEffect } from "react";
import api from "../api/api";

const AddStoreForm = ({ role = "owner", onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    if (role === "admin") {
      api
        .get("/admin/users")
        .then((res) => {
          const ownersOnly = (res.data.data || []).filter(
            (u) => u.role === "owner"
          );
          setOwners(ownersOnly);
        })
        .catch((err) => console.error("Error fetching owners:", err));
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (role === "admin") {
        await api.post("/stores", { name, email, address, ownerId });
      } else {
        await api.post("/stores/owner/create", { name, email, address });
      }
      alert("Store created successfully!");
      setName("");
      setEmail("");
      setAddress("");
      setOwnerId("");
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Error creating store:", err);
      alert("Error creating store. Check console for details.");
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Add New Store</h3>
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Address:
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>
      {role === "admin" && (
        <label>
          Assign Owner:
          <select
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            required
          >
            <option value="">Select Owner</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.email})
              </option>
            ))}
          </select>
        </label>
      )}
      <button type="submit" className="btn primary">
        ➕ Create Store
      </button>
    </form>
  );
};

export default AddStoreForm;
