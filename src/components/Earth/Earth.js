// Earth.js
import React from "react";
import Globe from "react-globe.gl";

const Earth = ({ objectsData, time }) => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Globe
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        objectsData={objectsData}
        objectLabel="name"
        objectLat="lat"
        objectLng="lng"
        objectAltitude="alt"
        objectFacesSurface={false}
        objectThreeObject="threeObject"
      />
      <div
        style={{
          position: "absolute",
          fontSize: "12px",
          fontFamily: "sans-serif",
          padding: "5px",
          borderRadius: "3px",
          backgroundColor: "rgba(200, 200, 200, 0.1)",
        }}
      >
        Time: {time.toISOString()}
      </div>
    </div>
  );
};

export default Earth;
