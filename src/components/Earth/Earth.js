// src/components/Earth/Earth.js

import React from 'react';
import Globe from 'react-globe.gl';  // Import Globe from react-globe.gl

const Earth = () => {
  const globeProps = {
    globeImageUrl: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',  // Texture URL for the Earth
    arcsData: [],  // Optional: Can add arc data (e.g., flights, paths, routes)
    arcColor: 'color',  // Arc color type (optional)
    arcStroke: 0.5,  // Arc stroke (optional)
    arcDashLength: 0.5,  // Arc dash length (optional)
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Render the Globe in full screen */}
      <Globe {...globeProps} />
    </div>
  );
};

export default Earth;
