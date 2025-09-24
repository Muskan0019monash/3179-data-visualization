{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json", 
  // This tells Vega-Lite what version/schema we are using

  "width": 800,
  "height": 450,
  // Set the width and height of the chart

  "projection": {"type": "equirectangular"},
  // The map projection (how the world is shown flat)

  "layer": [
    {
      // First layer: draw the world map
      "data": {
        "url": "https://raw.githubusercontent.com/vega/vega/main/docs/data/world-110m.json",
        // Get the world map data (topojson format)
        "format": {"type": "topojson", "feature": "countries"}
        // Tell Vega-Lite this is topojson and we want the countries
      },
      "mark": "geoshape" 
      // Draw the shapes of the countries
    },
    {
      // Second layer: plot migration data points
      "data": {"url": "data/world_migration.csv"},
      // Use my CSV file with migration data

      "mark": "circle",
      // Each data point is a circle

      "encoding": {
        "longitude": {"field": "lon", "type": "quantitative"},
        // Use 'lon' column for longitude (x position on map)

        "latitude": {"field": "lat", "type": "quantitative"},
        // Use 'lat' column for latitude (y position on map)

        "size": {"field": "migrants", "type": "quantitative"},
        // Circle size shows number of migrants

        "color": {"value": "blue"},
        // All circles are colored blue

        "tooltip": [
          {"field": "origin_country"},
          {"field": "migrants"}
        ]
        // When I hover, show country and migrant number
      }
    }
  ]
}
