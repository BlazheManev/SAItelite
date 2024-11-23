import React, { useState, useEffect, useMemo } from "react";
import Earth from "../Earth/Earth"; // Assuming this is your Earth component
import SatelliteDataProvider from "./SatelliteDataProvider";
import AddSatelliteForm from "./AddSatelliteForm";
import * as satellite from "satellite.js";
import * as THREE from "three";

const EARTH_RADIUS_KM = 6371; // Earth's radius in km
const SAT_SIZE = 2; // Satellite size in km (for rendering)
const TIME_STEP = 3000; // Time step in ms for animation

const Satellites = ({ showAddSatelliteForm, toggleAddSatelliteForm }) => {
  const [satData, setSatData] = useState([]); // Satellites fetched from CelesTrak
  const [time, setTime] = useState(new Date()); // Current time for propagation
  const [addedSatellites, setAddedSatellites] = useState([]); // Track new satellites

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
      color: isNew ? "orange" : "palegreen", // New satellites are marked in red
      transparent: true,
      opacity: 0.7,
    });

    return new THREE.Mesh(geometry, material);
  };

  // Calculate Satellite Positions
  const objectsData = useMemo(() => {
    const gmst = satellite.gstime(time); // Greenwich Mean Sidereal Time

    // Combine `satData` and `addedSatellites` for rendering
    const allSatellites = [
      ...satData.map((sat) => {
        if (sat.satrec) {
          const eci = satellite.propagate(sat.satrec, time); // Get ECI position
          if (eci.position) {
            const geodetic = satellite.eciToGeodetic(eci.position, gmst);
            const latitude = satellite.radiansToDegrees(geodetic.latitude);
            const longitude = satellite.radiansToDegrees(geodetic.longitude);
            const altitude = geodetic.height / EARTH_RADIUS_KM;

            return {
              name: sat.name,
              lat: latitude,
              lng: longitude,
              alt: altitude,
              threeObject: createSatObject(false),
            };
          }
        }
        return null;
      }).filter(Boolean), // Filter invalid satellites

      // Add stationary satellites
      ...addedSatellites.map((sat) => ({
        name: sat.name,
        lat: sat.lat, // Static latitude
        lng: sat.lng, // Static longitude
        alt: sat.alt, // Static altitude
        threeObject: createSatObject(true),
      })),
    ];

    return allSatellites;
  }, [satData, addedSatellites, time]);

  // Handle adding new satellite
  const handleAddSatellite = (newSatellite) => {
    const gmst = satellite.gstime(time); // Get GMST for geodetic conversion
    const eci = satellite.propagate(newSatellite.satrec, time); // Get initial position

    if (eci.position) {
      const geodetic = satellite.eciToGeodetic(eci.position, gmst);
      const latitude = satellite.radiansToDegrees(geodetic.latitude);
      const longitude = satellite.radiansToDegrees(geodetic.longitude);
      const altitude = geodetic.height / EARTH_RADIUS_KM;

      setAddedSatellites((prevAdded) => [
        ...prevAdded,
        {
          ...newSatellite,
          lat: latitude,
          lng: longitude,
          alt: altitude,
        },
      ]);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Satellite Data Provider */}
      <SatelliteDataProvider onDataUpdate={setSatData} />

      {/* Earth Component for rendering satellites */}
      <Earth objectsData={objectsData} time={time} />

      {/* Conditionally render the Add Satellite Form */}
      {showAddSatelliteForm && (
        <div style={{ position: "absolute", top: "50px", left: "10px", zIndex: 10 }}>
          <AddSatelliteForm onAddSatellite={handleAddSatellite} />
        </div>
      )}
    </div>
  );
};

export default Satellites;
