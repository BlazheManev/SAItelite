import React, { useState, useEffect, useRef, useMemo } from "react";
import Globe from "react-globe.gl";
import * as satellite from "satellite.js";
import * as THREE from "three";
import axios from "axios";

const EARTH_RADIUS_KM = 6371; // Earth's radius in km
const SAT_SIZE = 300; // Satellite size in km (for rendering)
const TIME_STEP = 3000; // Time step in ms for animation

const EarthWithSatellites = () => {
  const globeEl = useRef();
  const [satData, setSatData] = useState([]);
  const [globeRadius, setGlobeRadius] = useState();
  const [time, setTime] = useState(new Date());

  // Fetch Satellite TLE data dynamically
  const tleCategories = [
    "weather.txt",
    "gps-ops.txt",
    "amateur.txt",
    // Add other categories as needed
  ];

  // Fetch Satellite TLE data dynamically from multiple categories
  useEffect(() => {
    const fetchSatelliteData = async () => {
      const allSatellites = [];

      try {
        // Fetch data for each category
        for (const category of tleCategories) {
          const response = await axios.get(`https://celestrak.com/NORAD/elements/${category}`);
          const tleArray = response.data.trim().split("\n");

          // Process each block of 3 lines (name, TLE line 1, TLE line 2)
          for (let i = 0; i < tleArray.length; i += 3) {
            const name = tleArray[i].trim();
            const tle1 = tleArray[i + 1].trim();
            const tle2 = tleArray[i + 2].trim();

            // Assuming you have the satellite.js library for parsing TLE
            const satrec = satellite.twoline2satrec(tle1, tle2);

            allSatellites.push({
              name,
              satrec,
            });
          }
        }

        // Set the parsed satellite data
        setSatData(allSatellites);
      } catch (error) {
        console.error("Error fetching satellite data:", error);
      }
    };

    fetchSatelliteData();
  }, []);

  // Update time for satellite propagation
  useEffect(() => {
    const ticker = setInterval(() => {
      setTime((prevTime) => new Date(+prevTime + TIME_STEP));
    }, TIME_STEP);

    return () => clearInterval(ticker); // Cleanup on unmount
  }, []);

  // Function to create a unique satellite object
  const createSatObject = () => {
    if (!globeRadius) return null;

    const geometry = new THREE.OctahedronGeometry(
      (SAT_SIZE * globeRadius) / EARTH_RADIUS_KM / 2,
      0
    );
    const material = new THREE.MeshLambertMaterial({
      color: "palegreen",
      transparent: true,
      opacity: 0.7,
    });

    return new THREE.Mesh(geometry, material);
  };

  // Calculate Satellite Positions
  const objectsData = useMemo(() => {
    if (!satData.length) return [];

    const gmst = satellite.gstime(time); // Greenwich Mean Sidereal Time
    const updatedObjectsData = satData
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

    return updatedObjectsData;
  }, [satData, time]);

  useEffect(() => {
    if (globeEl.current) {
      setGlobeRadius(globeEl.current.getGlobeRadius());
      globeEl.current.pointOfView({ altitude: 3.5 }); // Set initial view
    }
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Globe
        ref={globeEl}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        objectsData={objectsData}
        objectLabel="name"
        objectLat="lat"
        objectLng="lng"
        objectAltitude="alt"
        objectFacesSurface={false}
        objectThreeObject="threeObject" // Link the object to its unique 3D object
      />
      <div
        style={{
          position: "absolute",
          fontSize: "12px",
          fontFamily: "sans-serif",
          padding: "5px",
          borderRadius: "3px",
          backgroundColor: "rgba(200, 200, 200, 0.1)",
          color: "lavender",
          bottom: "10px",
          right: "10px",
        }}
      >
        {time.toString()}
      </div>
    </div>
  );
};

export default EarthWithSatellites;
