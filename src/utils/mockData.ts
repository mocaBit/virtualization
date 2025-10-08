// Mock data for development and testing
const locations = [
  "Northern California", "Southern California", "Central California",
  "Alaska Peninsula", "Aleutian Islands", "South Central Alaska",
  "Japan region", "Tokyo, Japan", "Hokkaido, Japan",
  "Central Chile", "Northern Chile", "Southern Chile",
  "Turkey-Syria border", "Eastern Turkey", "Western Turkey",
  "Indonesia", "Papua New Guinea", "Philippines",
  "Mexico", "Central Mexico", "Baja California",
  "Nevada", "Utah", "Idaho", "Montana", "Wyoming",
  "Greece", "Italy", "Peru", "Ecuador", "Colombia"
];

const generateMockEarthquake = (index: number) => {
  const now = Date.now();
  const timeOffset = index * 3600000 + Math.random() * 3600000; // Hours apart with some randomness
  const magnitude = 2.5 + Math.random() * 5; // 2.5 to 7.5
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  // Random coordinates (roughly global)
  const lat = (Math.random() - 0.5) * 180;
  const lng = (Math.random() - 0.5) * 360;
  const depth = Math.random() * 100;

  return {
    "type": "Feature",
    "properties": {
      "mag": Math.round(magnitude * 10) / 10,
      "place": location,
      "time": now - timeOffset,
      "url": `https://earthquake.usgs.gov/earthquakes/eventpage/mock${index}`,
      "detail": `https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/mock${index}.geojson`,
      "felt": Math.floor(Math.random() * 1000),
      "status": "reviewed",
      "tsunami": magnitude > 6.5 ? (Math.random() > 0.7 ? 1 : 0) : 0,
      "sig": Math.floor(magnitude * 100 + Math.random() * 200),
      "net": ["us", "nc", "ak", "ci", "uw"][Math.floor(Math.random() * 5)],
      "code": `mock${index}`,
      "ids": `,mock${index},`,
      "sources": ",us,",
      "types": ",general-link,origin,phase-data,",
      "magType": magnitude > 5 ? "mww" : (magnitude > 4 ? "mb" : "ml"),
      "type": "earthquake",
      "title": `M ${Math.round(magnitude * 10) / 10} - ${location}`
    },
    "geometry": {
      "type": "Point",
      "coordinates": [lng, lat, depth]
    },
    "id": `mock${index}`
  };
};

// Generate a large dataset for testing infinite scroll
const generateMockData = (count: number) => {
  const features = [];
  for (let i = 0; i < count; i++) {
    features.push(generateMockEarthquake(i));
  }
  
  // Sort by time descending (most recent first)
  features.sort((a, b) => b.properties.time - a.properties.time);
  
  return {
    "type": "FeatureCollection",
    "metadata": {
      "generated": Date.now(),
      "url": "mock-data",
      "title": "Mock Earthquake Data",
      "status": 200,
      "api": "mock",
      "count": count
    },
    "features": features
  };
};

export const mockEarthquakeData = generateMockData(500); // Generate 500 mock earthquakes

export { generateMockData };

export default mockEarthquakeData;
