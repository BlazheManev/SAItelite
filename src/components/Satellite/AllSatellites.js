import React from 'react';
import { useLocation } from 'react-router-dom';

const AllSatellites = () => {
  const location = useLocation(); // Get the current location
  const satData = location.state?.satData || []; // Access satData passed from the previous component
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>All Satellites</h1>
      <p>There are {satData.length} satellites currently.</p>
      {/* Optionally, render the satellites data here */}
    </div>
  );
};

export default AllSatellites;
