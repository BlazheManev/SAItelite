function parseTLE(tleData) {
    const lines = tleData.trim().split("\n");
    const satellites = {};
    for (let i = 0; i < lines.length; i += 3) {
        const name = lines[i].trim();
        const line1 = lines[i + 1].trim();
        const line2 = lines[i + 2].trim();
        satellites[name] = { line1, line2 };
    }
    return satellites;
}

const satellite = require("satellite.js");

function getSatellitePosition(line1, line2, date) {
    const satrec = satellite.twoline2satrec(line1, line2);
    const positionAndVelocity = satellite.propagate(satrec, date);
    const positionEci = positionAndVelocity.position;

    if (positionEci) {
        const gmst = satellite.gstime(date);
        const positionGd = satellite.eciToGeodetic(positionEci, gmst);
        const { x, y, z } = positionEci;
        return [x, y, z];
    }
    return null; // Handle propagation errors
}

function filterByZ(positions, targetPosition, zThreshold = 150, targetSatelliteName) {
    const similarSatellites = {};
    const targetZ = targetPosition[2]; // Z-coordinate of the target satellite
    for (const [name, position] of Object.entries(positions)) {
        if (position && name !== targetSatelliteName && Math.abs(position[2] - targetZ) <= zThreshold) {
            similarSatellites[name] = position;
        }
    }
    return similarSatellites;
}


function calculateProbability(targetPosition, similarPositions) {
    let probability = 0;
    const collisionDetails = [];

    for (const [name, position] of Object.entries(similarPositions)) {
        const distance = Math.sqrt(
            (targetPosition[0] - position[0]) ** 2 +
            (targetPosition[1] - position[1]) ** 2 +
            (targetPosition[2] - position[2]) ** 2
        );

        // Add probability based on distance
        if (distance < 10) {
            probability += 50;
            collisionDetails.push({ satellite: name, distance, addedProbability: 50 });
        } else if (distance >= 10 && distance < 50) {
            probability += 20;
            collisionDetails.push({ satellite: name, distance, addedProbability: 20 });
        } else if (distance >= 50 && distance < 150) {
            probability += 10;
            collisionDetails.push({ satellite: name, distance, addedProbability: 10 });
        } else if (distance >= 150 && distance < 300) {
            probability += 5;
            collisionDetails.push({ satellite: name, distance, addedProbability: 5 });
        }
    }

    return { probability, collisionDetails };
}



function getCollisionProbability(tleData, targetSatellite, zThreshold = 50) {
    const satellites = parseTLE(tleData);

    if (!satellites[targetSatellite]) {
        throw new Error(`Satellite ${targetSatellite} not found in TLE data.`);
    }

    const positions = {};
    let targetPosition = null;
    const startTime = new Date(); // Start time: current date and time
    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + 1); // End time: 24 hours later

    const results = [];
    const timeStep = 60 * 1000; // 1 minute in milliseconds

    // Iterate through each timestamp
    for (let time = startTime; time <= endTime; time = new Date(+time + timeStep)) {
        // Compute positions for all satellites at the current timestamp
        for (const [name, { line1, line2 }] of Object.entries(satellites)) {
            const position = getSatellitePosition(line1, line2, time);
            positions[name] = position;
            if (name === targetSatellite) {
                targetPosition = position;
            }
        }

        if (!targetPosition) {
            throw new Error(`Could not compute position for satellite ${targetSatellite}.`);
        }

        // Filter satellites with similar Z-coordinate, excluding the target satellite
        const similarPositions = filterByZ(positions, targetPosition, zThreshold, targetSatellite);

        // Calculate collision probability and details
        const { probability, collisionDetails } = calculateProbability(targetPosition, similarPositions);

        results.push({
            time: time.toISOString(),
            probability,
            collisionDetails,
        });
    }

    // Log results for the day
    results.forEach(({ time, probability, collisionDetails }) => {
        console.log(`Time: ${time}`);
        if (collisionDetails.length > 0) {
            console.log(`Collision Probability: ${probability.toFixed(2)}%`);
            console.log(`Potential collisions with:`);
            collisionDetails.forEach(({ satellite, distance, addedProbability }) => {
                console.log(`- Satellite: ${satellite}, Distance: ${distance.toFixed(2)} km, Added Probability: ${addedProbability}%`);
            });
        } else {
            console.log(`No potential collisions detected.`);
        }
    });

    return results;
}

// Export the Main Function
module.exports = { getCollisionProbability };