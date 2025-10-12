// Convert CSV data to JavaScript objects
const migrationData = [
  { country: "United Kingdom", lon: -0.1276, lat: 51.5072, migrants: 1000000, year: 2023, region: "Europe", age_group: "Mixed", gender_ratio: 0.52, education_level: "High", settlement_state: "NSW" },
  { country: "China", lon: 116.4074, lat: 39.9042, migrants: 650000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.48, education_level: "High", settlement_state: "VIC" },
  { country: "India", lon: 77.2090, lat: 28.6139, migrants: 600000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.45, education_level: "Medium", settlement_state: "NSW" },
  { country: "New Zealand", lon: 174.7633, lat: -36.8485, migrants: 550000, year: 2023, region: "Oceania", age_group: "Mixed", gender_ratio: 0.51, education_level: "High", settlement_state: "QLD" },
  { country: "Vietnam", lon: 105.8544, lat: 21.0285, migrants: 300000, year: 2023, region: "Asia", age_group: "Middle", gender_ratio: 0.49, education_level: "Medium", settlement_state: "VIC" },
  { country: "Italy", lon: 12.4964, lat: 41.9028, migrants: 250000, year: 2023, region: "Europe", age_group: "Older", gender_ratio: 0.53, education_level: "Medium", settlement_state: "SA" },
  { country: "Philippines", lon: 121.7740, lat: 12.8797, migrants: 200000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.54, education_level: "Medium", settlement_state: "WA" },
  { country: "South Africa", lon: 28.0473, lat: -26.2041, migrants: 180000, year: 2023, region: "Africa", age_group: "Mixed", gender_ratio: 0.47, education_level: "High", settlement_state: "NSW" },
  { country: "Malaysia", lon: 101.6869, lat: 3.1390, migrants: 170000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.50, education_level: "High", settlement_state: "VIC" },
  { country: "Sri Lanka", lon: 80.7718, lat: 7.8731, migrants: 150000, year: 2023, region: "Asia", age_group: "Middle", gender_ratio: 0.46, education_level: "Medium", settlement_state: "NSW" },
  { country: "Germany", lon: 10.4515, lat: 51.1657, migrants: 140000, year: 2023, region: "Europe", age_group: "Mixed", gender_ratio: 0.49, education_level: "High", settlement_state: "VIC" },
  { country: "Lebanon", lon: 35.8623, lat: 33.8547, migrants: 130000, year: 2023, region: "Middle East", age_group: "Mixed", gender_ratio: 0.48, education_level: "Medium", settlement_state: "NSW" },
  { country: "Greece", lon: 21.8243, lat: 39.0742, migrants: 120000, year: 2023, region: "Europe", age_group: "Older", gender_ratio: 0.52, education_level: "Medium", settlement_state: "VIC" },
  { country: "Thailand", lon: 100.9925, lat: 15.8700, migrants: 110000, year: 2023, region: "Asia", age_group: "Mixed", gender_ratio: 0.55, education_level: "Medium", settlement_state: "QLD" },
  { country: "Indonesia", lon: 113.9213, lat: -0.7893, migrants: 100000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.51, education_level: "Medium", settlement_state: "WA" },
  { country: "South Korea", lon: 127.7669, lat: 35.9078, migrants: 95000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.47, education_level: "High", settlement_state: "NSW" },
  { country: "Japan", lon: 138.2529, lat: 36.2048, migrants: 90000, year: 2023, region: "Asia", age_group: "Mixed", gender_ratio: 0.49, education_level: "High", settlement_state: "VIC" },
  { country: "Nepal", lon: 85.3240, lat: 28.3949, migrants: 85000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.44, education_level: "Low", settlement_state: "QLD" },
  { country: "Bangladesh", lon: 90.3563, lat: 23.6850, migrants: 80000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.43, education_level: "Low", settlement_state: "NSW" },
  { country: "Pakistan", lon: 69.3451, lat: 30.3753, migrants: 75000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.42, education_level: "Medium", settlement_state: "VIC" },
  { country: "Iran", lon: 53.6880, lat: 32.4279, migrants: 70000, year: 2023, region: "Middle East", age_group: "Mixed", gender_ratio: 0.46, education_level: "High", settlement_state: "NSW" },
  { country: "Turkey", lon: 35.2433, lat: 38.9637, migrants: 65000, year: 2023, region: "Europe", age_group: "Mixed", gender_ratio: 0.48, education_level: "Medium", settlement_state: "VIC" },
  { country: "Afghanistan", lon: 67.7090, lat: 33.9391, migrants: 60000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.41, education_level: "Low", settlement_state: "NSW" },
  { country: "Myanmar", lon: 95.9560, lat: 21.9162, migrants: 55000, year: 2023, region: "Asia", age_group: "Mixed", gender_ratio: 0.52, education_level: "Low", settlement_state: "WA" },
  { country: "Brazil", lon: -51.9253, lat: -14.2350, migrants: 50000, year: 2023, region: "South America", age_group: "Young", gender_ratio: 0.51, education_level: "Medium", settlement_state: "QLD" }
];

const stateColors = {
  "NSW": "#3498db",
  "VIC": "#e74c3c",
  "QLD": "#f39c12",
  "WA": "#9b59b6",
  "SA": "#2ecc71",
};

document.addEventListener('DOMContentLoaded', function () {
  renderCharts();
});

function renderCharts() {
  const mapSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "World map showing migration to Australia",
    "width": "container",
    "height": 400,
    "layer": [
      {
        "data": {
          "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
          "format": { "type": "topojson", "feature": "countries" }
        },
        "mark": { "type": "geoshape", "fill": "#f0f0f0", "stroke": "#000", "strokeWidth": 0.3 },
        "projection": { "type": "equirectangular" }
      },
      {
        "data": { "values": migrationData },
        "mark": { "type": "circle", "tooltip": true, "stroke": "#000", "strokeWidth": 1 },
        "encoding": {
          "longitude": { "field": "lon", "type": "quantitative" },
          "latitude": { "field": "lat", "type": "quantitative" },
          "size": { "field": "migrants", "type": "quantitative", "title": "Migrants to Australia", "scale": { "range": [50, 2000] } },
          "color": { "field": "migrants", "type": "quantitative", "title": "Number of Migrants", "scale": { "scheme": "viridis" } },
          "tooltip": [
            { "field": "country", "title": "Country" },
            { "field": "migrants", "title": "Migrants", "format": "," },
            { "field": "region", "title": "Region" },
            { "field": "education_level", "title": "Education Level" }
          ]
        }
      }
    ],
    "config": { "view": { "stroke": "transparent" }, "background": "transparent" }
  };

  const stateSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "Migration flow to Australian states",
    "width": "container",
    "height": 400,
    "data": { "values": migrationData },
    "mark": { "type": "bar", "cornerRadius": 4 },
    "encoding": {
      "x": { "field": "settlement_state", "type": "nominal", "title": "Australian State", "axis": { "labelAngle": 0 }, "sort": "-y" },
      "y": { "aggregate": "sum", "field": "migrants", "type": "quantitative", "title": "Number of Migrants" },
      "color": { "field": "settlement_state", "type": "nominal", "scale": { "domain": Object.keys(stateColors), "range": Object.values(stateColors) } },
      "tooltip": [
        { "field": "settlement_state", "title": "State" },
        { "aggregate": "sum", "field": "migrants", "title": "Migrants", "format": "," }
      ]
    },
    "config": { "view": { "stroke": "transparent" }, "axis": { "grid": false } }
  };

  vegaEmbed('#worldMap', mapSpec, { actions: false }).catch(error => console.error("Error embedding world map:", error));
  vegaEmbed('#stateChart', stateSpec, { actions: false });
}
