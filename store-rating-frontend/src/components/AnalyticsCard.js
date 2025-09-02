import React from "react";

const AnalyticsCard = ({ title, value }) => (
  <div className="analytics-card">
    <h3>{title}</h3>
    <p className="analytics-value">{value}</p>
  </div>
);

export default AnalyticsCard;
