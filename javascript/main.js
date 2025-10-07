// main.js
// Migration to Australia Dashboard - Three Visualizations

// Process the migration data from the CSV file
const migrationData = [
  {country: "United Kingdom", lon: -0.1276, lat: 51.5072, migrants: 1000000},
  {country: "China", lon: 116.4074, lat: 39.9042, migrants: 650000},
  {country: "India", lon: 77.2090, lat: 28.6139, migrants: 600000},
  {country: "New Zealand", lon: 174.7633, lat: -36.8485, migrants: 550000},
  {country: "Vietnam", lon: 105.8544, lat: 21.0285, migrants: 300000},
  {country: "Italy", lon: 12.4964, lat: 41.9028, migrants: 250000},
  {country: "Philippines", lon: 121.7740, lat: 12.8797, migrants: 200000},
  {country: "South Africa", lon: 28.0473, lat: -26.2041, migrants: 180000},
  {country: "Malaysia", lon: 101.6869, lat: 3.1390, migrants: 170000},
  {country: "Sri Lanka", lon: 80.7718, lat: 7.8731, migrants: 150000}
];

// Process the overseas departures data
const departuresData = [
  {year: "2013-14", temporary: 127.76, citizen: 92.18, permanent: 19.68, nz: 25.30, unknown: 11.97},
  {year: "2014-15", temporary: 128.06, citizen: 97.57, permanent: 21.28, nz: 27.08, unknown: 7.23},
  {year: "2015-16", temporary: 129.28, citizen: 97.29, permanent: 20.98, nz: 27.64, unknown: 7.86},
  {year: "2016-17", temporary: 131.22, citizen: 92.56, permanent: 20.49, nz: 25.60, unknown: 6.94},
  {year: "2017-18", temporary: 143.55, citizen: 89.77, permanent: 20.59, nz: 22.91, unknown: 12.48},
  {year: "2018-19", temporary: 168.53, citizen: 85.89, permanent: 21.54, nz: 22.41, unknown: 10.70},
  {year: "2019-20", temporary: 196.83, citizen: 60.38, permanent: 24.41, nz: 20.85, unknown: 11.69},
  {year: "2020-21", temporary: 146.53, citizen: 44.01, permanent: 17.93, nz: 19.05, unknown: 3.41},
  {year: "2021-22", temporary: 99.45, citizen: 77.67, permanent: 23.65, nz: 15.23, unknown: 7.14},
  {year: "2022-23", temporary: 74.33, citizen: 89.22, permanent: 20.14, nz: 16.39, unknown: 3.78},
  {year: "2023-24", temporary: 103.97, citizen: 84.21, permanent: 18.86, nz: 14.13, unknown: 0.00}
];

// Process OECD inflow data
const oecdData = [
  {year: 2011, inflow: 206.362},
  {year: 2012, inflow: 235.993},
  {year: 2013, inflow: 244.849},
  {year: 2014, inflow: 233.908},
  {year: 2015, inflow: 223.654},
  {year: 2016, inflow: 218.488},
  {year: 2017, inflow: 224.22},
  {year: 2018, inflow: 186.64},
  {year: 2019, inflow: 155.817},
  {year: 2020, inflow: 137.465},
  {year: 2021, inflow: 153.826}
];

// World Map Visualization
const mapSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": "container",
  "background": "#a3c9f7",
  "projection": { "type": "equirectangular" },
  "layer": [
    {
      "data": {
        "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
        "format": { "type": "topojson", "feature": "countries" }
      },
      "mark": { 
        "type": "geoshape", 
        "fill": "white", 
        "stroke": "black", 
        "strokeWidth": 0.5 
      }
    },
    {
      "data": { "values": migrationData },
      "mark": { 
        "type": "circle", 
        "opacity": 0.85, 
        "stroke": "#222", 
        "strokeWidth": 0.4 
      },
      "encoding": {
        "longitude": { "field": "lon", "type": "quantitative" },
        "latitude": { "field": "lat", "type": "quantitative" },
        "size": {
          "field": "migrants",
          "type": "quantitative",
          "scale": { "range": [100, 3000] },
          "legend": { "title": "Number of Migrants" }
        },
        "color": {
          "field": "migrants",
          "type": "quantitative",
          "scale": { "scheme": "reds" },
          "legend": { "title": "Migrants" }
        },
        "tooltip": [
          { "field": "country", "type": "nominal", "title": "Country" },
          { "field": "migrants", "type": "quantitative", "title": "Migrants", "format": "," }
        ]
      }
    }
  ]
};

// Time Trend Visualization
const trendSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": "container",
  "data": { "values": oecdData },
  "layer": [
    {
      "mark": {
        "type": "line",
        "point": true,
        "color": "#003366",
        "strokeWidth": 3
      },
      "encoding": {
        "x": {
          "field": "year",
          "type": "temporal",
          "axis": { "title": "Year", "grid": false }
        },
        "y": {
          "field": "inflow",
          "type": "quantitative",
          "title": "Inflows (thousands)",
          "axis": { "grid": false }
        },
        "tooltip": [
          { "field": "year", "type": "temporal", "title": "Year" },
          { "field": "inflow", "type": "quantitative", "title": "Inflows", "format": ",.0f" }
        ]
      }
    },
    {
      "mark": { "type": "area", "opacity": 0.3, "color": "#003366" },
      "encoding": {
        "x": { "field": "year", "type": "temporal" },
        "y": { "field": "inflow", "type": "quantitative" }
      }
    }
  ]
};

// Visa Breakdown Visualization
const visaSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": "container",
  "data": { "values": departuresData },
  "transform": [
    { 
      "fold": ["temporary", "citizen", "permanent", "nz", "unknown"], 
      "as": ["category", "value"] 
    },
    {
      "calculate": "datum.category === 'temporary' ? 'Temporary Visa' : datum.category === 'citizen' ? 'Australian Citizen' : datum.category === 'permanent' ? 'Permanent Visa' : datum.category === 'nz' ? 'NZ Citizen' : 'Unknown Visa'",
      "as": "category_label"
    }
  ],
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "year",
      "type": "nominal",
      "axis": { "title": "Financial Year", "labelAngle": -45 }
    },
    "y": {
      "field": "value",
      "type": "quantitative",
      "title": "Departures (thousands)",
      "axis": { "grid": false }
    },
    "color": {
      "field": "category_label",
      "type": "nominal",
      "scale": {
        "domain": ["Temporary Visa", "Australian Citizen", "Permanent Visa", "NZ Citizen", "Unknown Visa"],
        "range": ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f"]
      },
      "legend": { 
        "title": "Category",
        "symbolType": "circle"
      }
    },
    "tooltip": [
      { "field": "year", "type": "nominal", "title": "Year" },
      { "field": "category_label", "type": "nominal", "title": "Category" },
      { "field": "value", "type": "quantitative", "title": "Departures (thousands)", "format": ".2f" }
    ]
  },
  "config": {
    "view": { "stroke": "transparent" }
  }
};

// Embed all visualizations
vegaEmbed('#map-vis', mapSpec, { actions: false })
  .then(() => console.log("World map loaded"))
  .catch(err => console.error(err));

vegaEmbed('#trend-vis', trendSpec, { actions: false })
  .then(() => console.log("Time trend loaded"))
  .catch(err => console.error(err));

vegaEmbed('#visa-vis', visaSpec, { actions: false })
  .then(() => console.log("Visa breakdown loaded"))
  .catch(err => console.error(err));