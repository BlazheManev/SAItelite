import React, { useState, useEffect, useMemo } from "react";
import * as satellite from "satellite.js";
import * as THREE from "three"; 
import Earth from "../Earth/Earth";
import SatelliteDataProvider from "../Satellite/SatelliteDataProvider";

const EARTH_RADIUS_KM = 6371; // Earth's radius in km
const SAT_SIZE = 120; // Satellite size in km (for rendering)
const TIME_STEP = 3000; // Time step in ms for animation

const Satellites = () => {
  const [satData, setSatData] = useState([]);
  const [time, setTime] = useState(new Date());

  // Update time for satellite propagation
  useEffect(() => {
    const ticker = setInterval(() => {
      setTime((prevTime) => new Date(+prevTime + TIME_STEP));
    }, TIME_STEP);

    return () => clearInterval(ticker); // Cleanup on unmount
  }, []);

  const createSatObject = () => {
    const geometry = new THREE.OctahedronGeometry(
      (SAT_SIZE * EARTH_RADIUS_KM) / EARTH_RADIUS_KM / 2,
      0
    );
    const material = new THREE.MeshLambertMaterial({
      color: "palegreen",
      transparent: true,
      opacity: 0.7,
    });

    return new THREE.Mesh(geometry, material);
  };

  const objectsData = useMemo(() => {
    if (!satData.length) return [];

    const gmst = satellite.gstime(time); // Greenwich Mean Sidereal Time
    return satData
      .map((sat) => {
        const eci = satellite.propagate(sat.satrec, time); // Get ECI position
        if (eci.position) {
          const geodetic = satellite.eciToGeodetic(eci.position, gmst);
          return {
            name: sat.name,
            lat: satellite.radiansToDegrees(geodetic.latitude),
            lng: satellite.radiansToDegrees(geodetic.longitude),
            alt: geodetic.height / EARTH_RADIUS_KM, // Normalize altitude
            // Create a unique 3D object for each satellite
            threeObject: createSatObject(),
          };
        }
        return null;
      })
      .filter(Boolean); // Filter invalid satellites
  }, [satData, time]);

  return (
    <div>
      <SatelliteDataProvider onDataUpdate={setSatData} />
      <Earth objectsData={objectsData} time={time} />
    </div>
  );
};

export default Satellites;
