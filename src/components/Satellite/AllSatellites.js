import React, { useEffect, useState } from "react";
import * as satellite from "satellite.js";
import { Link } from "react-router-dom";

// Function to generate random TLE for GEO or MEO satellites
const generateRandomTLE = (orbitType, index) => {
  const satelliteName = `Satellite-${index + 1}`;

  // Randomize TLE parameters within realistic ranges
  const epochYear = Math.floor(Math.random() * 100) + 2000; // Random year between 2000 and 2099
  const epochDay = Math.random() * 365; // Random day of the year

  // GEO Satellites
  if (orbitType === "GEO") {
    const inclination = 0.0000 + Math.random() * 0.1;  // Close to 0 for GEO
    const eccentricity = Math.random() * 0.0001; // Small eccentricity
    const raAscendingNode = Math.random() * 360; // Random RAAN
    const argumentOfPerigee = Math.random() * 360; // Random argument of perigee
    const meanAnomaly = Math.random() * 360; // Random mean anomaly

    const tle1 = `${satelliteName}               1 99999U 99067A   ${epochYear % 100}${Math.floor(epochDay)}.${Math.random().toFixed(8).slice(2)}  .00001000  00000-0 ${eccentricity.toFixed(4)}-4 0  9999`;
    const tle2 = `2 99999 ${inclination.toFixed(4)} ${raAscendingNode.toFixed(4)} ${eccentricity.toFixed(4)} ${argumentOfPerigee.toFixed(4)} ${meanAnomaly.toFixed(4)}  1.00273769  00001`;

    return {
      name: satelliteName,
      tle1: tle1,
      tle2: tle2,
      orbitType: "GEO",  // Add orbitType as GEO
    };
  }

  // MEO Satellites
  if (orbitType === "MEO") {
    const inclination = 40 + Math.random() * 20;  // Random inclination between 40° and 60°
    const eccentricity = Math.random() * 0.01; // Small eccentricity
    const raAscendingNode = Math.random() * 360; // Random RAAN
    const argumentOfPerigee = Math.random() * 360; // Random argument of perigee
    const meanAnomaly = Math.random() * 360; // Random mean anomaly
    const period = 3 + Math.random() * 9; // Orbital period between 3 and 12 hours
    const semiMajorAxis = Math.pow(period, 2) * 398600.4418 / (4 * Math.PI * Math.PI); // Semi-major axis based on period

    const tle1 = `${satelliteName}               1 99999U 99067A   ${epochYear % 100}${Math.floor(epochDay)}.${Math.random().toFixed(8).slice(2)}  .00001000  00000-0 ${eccentricity.toFixed(4)}-4 0  9999`;
    const tle2 = `2 99999 ${inclination.toFixed(4)} ${raAscendingNode.toFixed(4)} ${eccentricity.toFixed(4)} ${argumentOfPerigee.toFixed(4)} ${meanAnomaly.toFixed(4)}  1.00273769  00001`;

    return {
      name: satelliteName,
      tle1: tle1,
      tle2: tle2,
      orbitType: "MEO",  // Add orbitType as MEO
    };
  }

  return {}; // Default return if orbitType is unknown
};

// Function to propagate satellite orbit and check future positions
const propagateOrbit = (tle1, tle2, timeIntervalInMinutes) => {
  const satrec = satellite.twoline2satrec(tle1, tle2);
  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + timeIntervalInMinutes * 60000); // Add time interval in minutes

  // Propagate orbit
  const positionAndVelocity = satellite.propagate(satrec, futureDate);

  // Check if the propagation result is valid
  if (!positionAndVelocity || positionAndVelocity.length < 2) {
    console.error("Invalid propagation result", positionAndVelocity);
    return { position: [0, 0, 0], velocity: [0, 0, 0] }; // Return default values to prevent errors
  }

  const position = positionAndVelocity[0]; // Position in km
  const velocity = positionAndVelocity[1]; // Velocity in km/s

  return { position, velocity };
};

// Calculate distance between two positions
const calculateDistance = (pos1, pos2) => {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz); // Distance in kilometers
};

// Function to check if two satellites are at risk of collision
const checkCollision = (sat1, sat2, timeIntervalInMinutes) => {
  const sat1Future = propagateOrbit(sat1.tle1, sat1.tle2, timeIntervalInMinutes);
  const sat2Future = propagateOrbit(sat2.tle1, sat2.tle2, timeIntervalInMinutes);

  // Check if positions are valid
  if (!sat1Future.position || !sat2Future.position) {
    console.error("Invalid positions for satellites:", sat1.name, sat2.name);
    return { collisionRisk: false, collisionProbability: 0, distance: Infinity };
  }

  const distance = calculateDistance(sat1Future.position, sat2Future.position);

  const collisionThreshold = 10; // Set a safe distance threshold (10 km)
  const collisionProbability = 1 - distance / collisionThreshold; // Normalize the probability (inverse of distance)

  return {
    collisionRisk: distance < collisionThreshold,
    collisionProbability: Math.max(0, Math.min(1, collisionProbability)), // Ensure it is between 0 and 1
    distance,
  };
};

// Component to display satellites and check for collisions
const AllSatellites = () => {
  const [satellites, setSatellites] = useState([]);
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [collisionWarnings, setCollisionWarnings] = useState([]);

  // Generate random satellites (10 GEO and 10 MEO)
  useEffect(() => {
    // First 5 satellites as GEO
    const geoSatellites = Array.from({ length: 5 }, (_, index) => generateRandomTLE("GEO", index));
    
    // Next 5 satellites as MEO
    const meoSatellites = Array.from({ length: 5 }, (_, index) => generateRandomTLE("MEO", index));
  
    // Combine both GEO and MEO satellites
    setSatellites([...geoSatellites, ...meoSatellites]);
  }, []);

  // Handle selecting satellites and checking collisions (simplified for now)
  useEffect(() => {
    let warnings = [];

    for (let i = 0; i < satellites.length; i++) {
      for (let j = i + 1; j < satellites.length; j++) {
        const sat1 = satellites[i];
        const sat2 = satellites[j];
        const { collisionRisk } = checkCollision(sat1, sat2, 60); // Check 60 minutes into the future
        if (collisionRisk) {
          warnings.push(`Collision risk detected between ${sat1.name} and ${sat2.name}`);
        }
      }
    }

    setCollisionWarnings(warnings);
  }, [satellites]);

  return (
    <div style={{ padding: "20px", backgroundColor: "#2C2F36", color: "#FFFFFF" }}>
      {/* Menu Bar */}
      <nav style={{ padding: "10px 20px", backgroundColor: "#1E1E1E", marginBottom: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", padding: "10px" }}>Home</Link>
        <Link to="/satellites" style={{ color: "white", textDecoration: "none", padding: "10px" }}>Satellites</Link>
      </nav>
  
      <h1>All Satellites</h1>
      <p>There are {satellites.length} satellites currently.</p>
  
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {satellites.map((sat, index) => (
          <li 
            key={index} 
            style={{ cursor: "pointer", marginBottom: "10px" }}
            onClick={() => setSelectedSatellite(sat)}>
            {/* Displaying Satellite Name and Orbit Type */}
            {sat.name} - <strong>{sat.orbitType === "GEO" ? "Geostationary (GEO)" : "Medium Earth Orbit (MEO)"}</strong>
          </li>
        ))}
      </ul>
  
      {/* Selected Satellite Information */}
      {selectedSatellite && (
        <div style={{ marginTop: "20px", backgroundColor: "#3A3F47", padding: "15px" }}>
          <h2>{selectedSatellite.name} Details</h2>
          <p><strong>Orbit Type:</strong> {selectedSatellite.orbitType}</p>
          <p><strong>TLE 1:</strong> {selectedSatellite.tle1}</p>
          <p><strong>TLE 2:</strong> {selectedSatellite.tle2}</p>
        </div>
      )}
  
      <h2>Collision Warnings</h2>
      {collisionWarnings.length > 0 ? (
        <ul>
          {collisionWarnings.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      ) : (
        <p>No collision risks detected.</p>
      )}
    </div>
  );
  
};

export default AllSatellites;