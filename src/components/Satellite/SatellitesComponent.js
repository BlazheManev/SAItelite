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
const TIME_STEP = 3000; // Time step in ms for animation

const Satellites = ({ showAddSatelliteForm, toggleAddSatelliteForm }) => {
  const [satData, setSatData] = useState([]); // Satellites fetched from CelesTrak
  const [time, setTime] = useState(new Date()); // Current time for propagation
  const [sliderValue, setSliderValue] = useState(0); // Time adjustment in minutes (-120 to 120)

  // Adjust time based on the slider value
  useEffect(() => {
    const adjustedTime = new Date(time); // Use current time as the base
    adjustedTime.setMinutes(adjustedTime.getMinutes() + sliderValue);
    setTime(adjustedTime); // Update time for propagation
  }, [sliderValue]); // Recalculate time when sliderValue changes

  // Automatically progress time if slider isn't in use
  useEffect(() => {
    const ticker = setInterval(() => {
      setTime((prevTime) => {
        if (sliderValue === 0) { // Only auto-progress time if sliderValue is at 0
          return new Date(+prevTime + TIME_STEP);
        }
        return prevTime; // If the slider is being used, prevent automatic progression
      });
    }, TIME_STEP);

    return () => clearInterval(ticker); // Cleanup on unmount
  }, [sliderValue]); // Depend on sliderValue so auto-progress is paused when slider is in use

  const createSatObject = (isNew) => {
    const geometry = new THREE.OctahedronGeometry(SAT_SIZE / 2, 0);
    const material = new THREE.MeshLambertMaterial({
      color: isNew ? "orange" : "palegreen",
      transparent: true,
      opacity: 0.7,
    });

    return new THREE.Mesh(geometry, material);
  };

  // Calculate satellite positions based on time
  const objectsData = useMemo(() => {
    const gmst = satellite.gstime(time); // Greenwich Mean Sidereal Time
    return satData
      .map((sat) => {
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
      })
      .filter(Boolean);
  }, [satData, time]);

  // Function to handle adding a new satellite
  const handleAddSatellite = (newSatellite) => {
    const gmst = satellite.gstime(time);
    const eci = satellite.propagate(newSatellite.satrec, time);

    if (eci.position) {
      const geodetic = satellite.eciToGeodetic(eci.position, gmst);
      const latitude = satellite.radiansToDegrees(geodetic.latitude);
      const longitude = satellite.radiansToDegrees(geodetic.longitude);
      const altitude = geodetic.height / EARTH_RADIUS_KM;

      setSatData((prevAdded) => [
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

      {/* Earth Component */}
      <Earth objectsData={objectsData} time={time} />

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
    </div>
  );
};

export default Satellites;
