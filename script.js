// Importing VegaEmbed (included the script in HTML)
// <script src="https://cdn.jsdelivr.net/npm/vega-embed"></script>

// Defining the Vega-Lite specification
const spec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json", 
  // Schema version - tells Vega-Lite how to read this

  width: 800,
  height: 450,
  // Size of the chart

  projection: { type: "equirectangular" },
  // Projection means how the globe is "flattened" into 2D

  layer: [
    {
      // First layer: the background world map
      data: {
        url: "https://raw.githubusercontent.com/vega/vega/main/docs/data/world-110m.json",
        // Loading map data from Vega’s GitHub
        format: { type: "topojson", feature: "countries" }
        // this is topojson and we want "countries"
      },
      mark: "geoshape"
      // Draw shapes for countries
    },
    {
      // Second layer: migration points
      data: { url: "data/world_migration.csv" },
      // Load my migration dataset (CSV)

      mark: "circle",
      // Each migration record is shown as a circle

      encoding: {
        longitude: { field: "lon", type: "quantitative" },
        // Using longitude from CSV for x position

        latitude: { field: "lat", type: "quantitative" },
        // Using latitude from CSV for y position

        size: { field: "migrants", type: "quantitative" },
        // Circle size = number of migrants

        color: { value: "blue" },
        // All circles are blue

        tooltip: [
          { field: "origin_country" },
          { field: "migrants" }
        ]
        // Show country + migrant number on hover
      }
    }
  ]
};

// Render the chart into a div with id="vis"
vegaEmbed("#vis", spec);
