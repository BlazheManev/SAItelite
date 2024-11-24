import React, { useState, useEffect, useMemo } from "react";
import Earth from "../Earth/Earth"; // Assuming this is your Earth component
import SatelliteDataProvider from "./SatelliteDataProvider";
import AddSatelliteForm from "./AddSatelliteForm";
import ReactSlider from "react-slider";
import * as satellite from "satellite.js";
import * as THREE from "three";
import "./SatellitesComponent.css"; // Import the new styles

const EARTH_RADIUS_KM = 6371; // Earth's radius in km
const SAT_SIZE = 2.7; // Satellite size in km (for rendering)

const Satellites = ({ showAddSatelliteForm, toggleAddSatelliteForm }) => {
  const [satData, setSatData] = useState([]); // Satellites fetched from CelesTrak
  const [time, setTime] = useState(new Date()); // Current time for propagation
  const [sliderValue, setSliderValue] = useState(0); // Time adjustment in minutes (-120 to 120)
  const [addedSatellites, setAddedSatellites] = useState([]); // Track new satellites
  const [fetchAllSatellites, setFetchAllSatellites] = useState(true); // State to toggle fetching all satellites
  const [loading, setLoading] = useState(true); // Track loading state

  const TIME_STEP = useMemo(() => {
    return fetchAllSatellites ? 3000 : 30000000; // 30 million ms if fetchAllSatellites, otherwise 3000 ms
  }, [fetchAllSatellites]);

  // Adjust time based on the slider value
  useEffect(() => {
    const adjustedTime = new Date(time); // Use current time as the base
    adjustedTime.setMinutes(adjustedTime.getMinutes() + sliderValue);
    setTime(adjustedTime); // Update time for propagation
  }, [sliderValue]); // Recalculate time when sliderValue changes

  console.log(`Satellite-1               1 99999U 99067A   24015.17520000  .00001000  00000-0  17001-4 0  9998
2 99999  0.0030 121.0801 0003702  15.6262  78.0874  1.00273769 00001
`)
  // Automatically progress time if slider isn't in use
  useEffect(() => {
    const TIME_STEP = fetchAllSatellites ? 30000000 : 3000; // Recalculate based on the state

    const ticker = setInterval(() => {
      setTime((prevTime) => {
        if (sliderValue === 0) { // Only auto-progress time if sliderValue is at 0
          return new Date(+prevTime + TIME_STEP);
        }
        return prevTime; // If the slider is being used, prevent automatic progression
      });
    }, TIME_STEP);

    return () => clearInterval(ticker); // Cleanup on unmount
  }, [sliderValue, fetchAllSatellites]);

  const createSatObject = (isNew, isDebris) => {
    const geometry = new THREE.OctahedronGeometry(SAT_SIZE / 2, 0);
    const material = new THREE.MeshLambertMaterial({
      color: isDebris ? "red" : isNew ? "orange" : "palegreen", // Color debris satellites
      transparent: true,
      opacity: 0.7,
    });
  
    return new THREE.Mesh(geometry, material);
  };

  // Calculate satellite positions based on time
  const objectsData = useMemo(() => {
    const gmst = satellite.gstime(time); // Greenwich Mean Sidereal Time
  
    // Combine satData and addedSatellites for rendering
    const allSatellites = [
      ...satData.map((sat) => {
        if (sat.satrec) {
          const eci = satellite.propagate(sat.satrec, time); // Propagate satellite based on TLE
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
              threeObject: createSatObject(false, sat.isDebris),
            };
          }
        }
        return null;
      }).filter(Boolean), // Filter invalid satellites
  
      // Add addedSatellites (static satellites)
      ...addedSatellites.map((sat) => ({
        name: sat.name,
        lat: sat.lat, // Static latitude
        lng: sat.lng, // Static longitude
        alt: sat.alt, // Static altitude
        threeObject: createSatObject(true),
      })),
    ];
  
    return allSatellites;
  }, [satData, addedSatellites, time]); // Ensure this recalculates when time or satellite data changes

  // Function to handle adding a new satellite
  const handleAddSatellite = (newSatellite) => {
    const gmst = satellite.gstime(time);
    const eci = satellite.propagate(newSatellite.satrec, time);

    if (eci.position) {
      const geodetic = satellite.eciToGeodetic(eci.position, gmst);
      const latitude = satellite.radiansToDegrees(geodetic.latitude);
      const longitude = satellite.radiansToDegrees(geodetic.longitude);
      const altitude = geodetic.height / EARTH_RADIUS_KM;

      // Add the new satellite to the addedSatellites state
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

  // Toggle function for the button
  const toggleFetchSatellites = () => {
    setFetchAllSatellites((prevState) => !prevState);
  };

  // Set loading to false once data is fetched
  useEffect(() => {
    if (satData.length > 0) {
      setLoading(false);
    }
  }, [satData]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Satellite Data Provider */}
      <SatelliteDataProvider onDataUpdate={setSatData} fetchAllSatellites={fetchAllSatellites} />

      {/* Earth Component */}
      <Earth objectsData={objectsData} time={time} />

      {/* Show loading indicator if data is not yet loaded */}
      {loading && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontSize: "24px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "10px",
          borderRadius: "5px",
        }}>
          Loading Satellites...
        </div>
      )}

      {/* Time Slider */}
      <div
        style={{
          position: "absolute",
          bottom: "20px", // Move it up a bit (from bottom)
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "20px 20px", // Add more padding to the top
          background: "rgba(0, 0, 0, 0.8)",
        }}
      >
        <div style={{ color: "white", marginBottom: "5px", textAlign: "center" }}>
          Adjust Time: {sliderValue > 0 ? `+${sliderValue}` : sliderValue} minutes
        </div>
        <ReactSlider
          value={sliderValue}
          onChange={(value) => setSliderValue(value)}
          min={-120} // Range: 2 hours back
          max={120} // Range: 2 hours forward
          step={1}
          className="slider"
          thumbClassName="thumb"
          trackClassName="track"
        />
      </div>

      {/* Add Satellite Form */}
      {showAddSatelliteForm && (
        <div style={{ position: "absolute", top: "150px", left: "10px", zIndex: 10 }}>
          <AddSatelliteForm onAddSatellite={handleAddSatellite} />
        </div>
      )}

      {/* Button to toggle satellite fetch */}
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          left: "10px",
          zIndex: 10,
          padding: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          cursor: "pointer",
        }}
        onClick={toggleFetchSatellites}
      >
        {fetchAllSatellites ? "All Satellites" : "Small Amount Of Satellites"}
      </div>
    </div>
  );
};

export default Satellites;
