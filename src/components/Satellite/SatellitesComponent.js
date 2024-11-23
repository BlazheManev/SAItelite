import React, { useState, useEffect, useMemo } from "react";
import * as satellite from "satellite.js";
import * as THREE from "three";
import Earth from "../Earth/Earth";
import SatelliteDataProvider from "./SatelliteDataProvider";
import AddSatelliteForm from "./AddSatelliteForm"; // Import the AddSatelliteForm

const EARTH_RADIUS_KM = 6371; // Earth's radius in km
const SAT_SIZE = 120; // Satellite size in km (for rendering)
const TIME_STEP = 3000; // Time step in ms for animation

const Satellites = ({ showAddSatelliteForm, toggleAddSatelliteForm }) => {
  const [satData, setSatData] = useState([]);
  const [time, setTime] = useState(new Date());
  const [addedSatellites, setAddedSatellites] = useState([]); // Track added satellites

  // Update time for satellite propagation
  useEffect(() => {
    const ticker = setInterval(() => {
      setTime((prevTime) => new Date(+prevTime + TIME_STEP));
    }, TIME_STEP);

    return () => clearInterval(ticker); // Cleanup on unmount
  }, []);

  const createSatObject = (isNew) => {
    const geometry = new THREE.OctahedronGeometry(
      (SAT_SIZE * EARTH_RADIUS_KM) / EARTH_RADIUS_KM / 2,
      0
    );
    const material = new THREE.MeshLambertMaterial({
      color: isNew ? "red" : "palegreen", // Use a different color for new satellites
      transparent: true,
      opacity: 0.7,
    });

    return new THREE.Mesh(geometry, material);
  };

  const objectsData = useMemo(() => {
    if (!satData.length && !addedSatellites.length) return [];

    const gmst = satellite.gstime(time); // Greenwich Mean Sidereal Time
    return [...satData, ...addedSatellites] // Combine existing and new satellites
      .map((sat) => {
        // Check if satrec is available for propagation
        if (sat.satrec) {
          const eci = satellite.propagate(sat.satrec, time); // Get ECI position
          if (eci.position) {
            const geodetic = satellite.eciToGeodetic(eci.position, gmst);
            const latitude = satellite.radiansToDegrees(geodetic.latitude);
            const longitude = satellite.radiansToDegrees(geodetic.longitude);
            const altitude = geodetic.height / EARTH_RADIUS_KM; // Normalize altitude
            
            console.log(`Satellite ${sat.name} Position: Lat: ${latitude}, Lng: ${longitude}, Alt: ${altitude} km`);

            return {
              name: sat.name,
              lat: latitude,
              lng: longitude,
              alt: altitude,
              // Create a unique 3D object for each satellite
              threeObject: createSatObject(sat.isNew),
            };
          }
        }
        return null;
      })
      .filter(Boolean); // Filter invalid satellites
  }, [satData, addedSatellites, time]); // Ensure addedSatellites and time are watched

  const handleAddSatellite = (newSatellite) => {
    setAddedSatellites((prevSatellites) => [...prevSatellites, newSatellite]);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Track Satellites View */}
      <SatelliteDataProvider onDataUpdate={setSatData} />
      <Earth objectsData={objectsData} time={time} />

      {/* Add Satellite Form Overlay (Conditionally Rendered) */}
      {showAddSatelliteForm && (
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '10px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '10px',
        }}>
          <AddSatelliteForm onAddSatellite={handleAddSatellite} />
        </div>
      )}
    </div>
  );
};

export default Satellites;
