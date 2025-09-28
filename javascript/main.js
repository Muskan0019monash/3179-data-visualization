// main.js
// World map of migrants to Australia — high-contrast bubble colors

const csvUrl = "Dataset/migration.csv"; // dataset path

const spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 600,
  "background": "#a3c9f7", // ocean background
  "projection": { "type": "equirectangular" },

  "layer": [
    // 1) Base world map (white landmass + black borders)
    {
      "data": {
        "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
        "format": { "type": "topojson", "feature": "countries" }
      },
      "mark": { "type": "geoshape", "fill": "white", "stroke": "black", "strokeWidth": 0.8 }
    },

    // 2) Migration proportional circles (bright multi-hue colors)
    {
      "data": { "url": csvUrl, "format": { "type": "csv" } },
      "transform": [
        { "calculate": "toNumber(datum.migrants)", "as": "migrants_num" }
      ],
      "mark": {
        "type": "circle",
        "opacity": 0.85,
        "stroke": "black",   // black outline for visibility
        "strokeWidth": 0.5
      },
      "encoding": {
        "longitude": { "field": "lon", "type": "quantitative" },
        "latitude": { "field": "lat", "type": "quantitative" },
        "size": {
          "field": "migrants_num",
          "type": "quantitative",
          "scale": { "range": [120, 3200] },
          "legend": { "title": "Migrants" }
        },
        "color": {
          "field": "migrants_num",
          "type": "quantitative",
          // Yellow → Orange → Red → Dark Red (better visibility for small values)
          "scale": { "scheme": "ylorrd" },
          "legend": { "title": "Migrants" }
        },
        "tooltip": [
          { "field": "country", "type": "nominal", "title": "Country" },
          { "field": "migrants_num", "type": "quantitative", "title": "Migrants", "format": "," }
        ]
      }
    }
  ]
};

vegaEmbed('#vis', spec, { actions: false })
  .then(() => console.log("Map loaded"))
  .catch(err => console.error(err));
