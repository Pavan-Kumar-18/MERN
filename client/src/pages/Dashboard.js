import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const userName = 'User'; // Placeholder, replace with actual logic to get the username

  return (
    <div>
      <h1>Welcome, {userName}</h1>
      <Link to="/employees">Manage Employees</Link>
    </div>
  );
};

export default Dashboard;
