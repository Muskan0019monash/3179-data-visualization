// main.js
// World map of migrants to Australia — clean white landmass, black borders, red bubbles

const csvUrl = "dataset/migration.csv"; // dataset path

const spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 600,
  "background": "#a3c9f7", // light blue ocean background
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

    // 2) Migration proportional circles (red color scale)
    {
      "data": { "url": csvUrl, "format": { "type": "csv" } },
      "transform": [
        { "calculate": "toNumber(datum.migrants)", "as": "migrants_num" }
      ],
      "mark": { "type": "circle", "opacity": 0.85, "stroke": "#222", "strokeWidth": 0.4 },
      "encoding": {
        "longitude": { "field": "lon", "type": "quantitative" },
        "latitude": { "field": "lat", "type": "quantitative" },
        "size": {
          "field": "migrants_num",
          "type": "quantitative",
          "scale": { "range": [100, 3000] },
          "legend": { "title": "Migrants" }
        },
        "color": {
          "field": "migrants_num",
          "type": "quantitative",
          "scale": { "scheme": "reds" },
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
