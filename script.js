// World Map Visualization
const worldMapSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 800,
  "height": 450,
  "projection": {"type": "equirectangular"},
  "data": {
    "url": "https://raw.githubusercontent.com/vega/vega/main/docs/data/world-110m.json",
    "format": {"type": "topojson", "feature": "countries"}
  },
  "layer": [
    {
      "mark": {"type": "geoshape", "fill": "#eee", "stroke": "lightgray"}
    },
    {
      "data": {
        "url": "data/world_migration.csv"
      },
      "mark": "circle",
      "encoding": {
        "longitude": {"field": "lon", "type": "quantitative"},
        "latitude": {"field": "lat", "type": "quantitative"},
        "size": {"field": "migrants", "type": "quantitative"},
        "color": {"value": "steelblue"},
        "tooltip": [
          {"field": "origin_country", "type": "nominal"},
          {"field": "migrants", "type": "quantitative"}
        ]
      }
    }
  ]
};

// Australia Zoom Visualization (e.g., bar chart of top origin countries)
const ausChartSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 600,
  "height": 400,
  "data": {
    "url": "data/aus_migration.csv"
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "origin_country", "type": "nominal", "sort": "-y"},
    "y": {"field": "migrants", "type": "quantitative"},
    "tooltip": [
      {"field": "origin_country", "type": "nominal"},
      {"field": "migrants", "type": "quantitative"}
    ],
    "color": {"value": "darkorange"}
  }
};

// Embed visualizations
vegaEmbed('#worldMap', worldMapSpec);
vegaEmbed('#ausChart', ausChartSpec);
