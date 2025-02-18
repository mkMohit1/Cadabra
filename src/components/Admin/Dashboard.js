import React from 'react';

const Dashboard = () => {
      // MetricCard: Reusable component for displaying metrics
  const MetricCard = ({ value, label }) => (
    <div className="metric-card">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      <button className="more-info">More info →</button>
    </div>
  );
  return (
    <>
    <h1>Dashboard</h1>
    <div className="metrics-grid">
    <MetricCard value="150" label="Total Orders" />
    <MetricCard value="50" label="Total Customers" />
    <MetricCard value="₹1000" label="Total Sale" />
  </div>
  </>
  )
}

export default Dashboard