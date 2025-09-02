import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; 
import AdminDashboard from "./AdminDashboard";
import OwnerDashboard from "./OwnerDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Context still loading
  if (user === null) {
    return <div>Loading...</div>;
  }

  // No logged-in user
  if (!user?.role) {
    return <div>Please log in to access the dashboard.</div>;
  }

  // Role-based rendering
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  if (user.role === "owner") {
    return <OwnerDashboard />;
  }

  if (user.role === "user") {
    return <UserDashboard />;
  }

  // fallback (in case of unknown role)
  return <div>Access denied: Unknown role</div>;
};

export default Dashboard;
