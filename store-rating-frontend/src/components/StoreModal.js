import React from "react";

const StoreModal = ({
  store,
  name,
  email,
  address,
  setName,
  setEmail,
  setAddress,
  onSave,
  onClose,
}) => {
  if (!store) return null; // no modal if no store selected

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Store</h3>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onSave} className="btn btn-primary">
            Save
          </button>
          <button onClick={onClose} className="btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreModal;
