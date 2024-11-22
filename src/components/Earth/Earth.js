// src/components/EarthWithSatellites.js

import React, { useState, useEffect, useRef, useMemo } from "react";
import Globe from "react-globe.gl";
import * as satellite from "satellite.js";
import * as THREE from "three";

const EARTH_RADIUS_KM = 6371; // Earth's radius in km
const SAT_SIZE = 160; // Satellite size in km (for rendering)
const TIME_STEP = 3000; // Time step in ms for animation

const EarthWithSatellites = () => {
  const globeEl = useRef();
  const [satData, setSatData] = useState([]);
  const [globeRadius, setGlobeRadius] = useState();
  const [time, setTime] = useState(new Date());

  // TLE Data
  const tleData = `
0 VANGUARD 2
1    11U 59001A   22053.83197560  .00000847  00000-0  45179-3 0  9996
2    11  32.8647 264.6509 1466352 126.0358 248.5175 11.85932318689790
0 VANGUARD 3
1 00020U 59007A   22053.60170665  .00000832  00000-0  32375-3 0  9992
2 00020  33.3540 150.1993 1666456 290.4879  52.4980 11.56070084301793
0 EXPLORER 7
1 00022U 59009A   22053.49750630  .00000970  00000-0  93426-4 0  9997
2 00022  50.2831  94.4956 0136813  90.0531 271.6094 14.96180956562418
  `;

  // Parse TLE Data
  useEffect(() => {
    const parsedSatData = tleData
      .trim()
      .split(/\n(?=0 )/) // Split by satellite block
      .map((block) => {
        const lines = block.trim().split("\n");
        const name = lines[0].slice(2).trim();
        const tle1 = lines[1].trim();
        const tle2 = lines[2].trim();

        return {
          name,
          satrec: satellite.twoline2satrec(tle1, tle2),
        };
      });

    setSatData(parsedSatData);
  }, [tleData]);

  // Update time for satellite propagation
  useEffect(() => {
    const ticker = setInterval(() => {
      setTime((prevTime) => new Date(+prevTime + TIME_STEP));
    }, TIME_STEP);

    return () => clearInterval(ticker); // Cleanup on unmount
  }, []);

  // Update Satellite Positions
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
          };
        }
        return null;
      })
      .filter(Boolean); // Filter invalid satellites
  }, [satData, time]);

  // Satellite 3D Object
  const satObject = useMemo(() => {
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
  }, [globeRadius]);

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
        objectThreeObject={satObject}
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
