// main.js
// World map of migrants to Australia (proportional symbol map)

const csvUrl = "migration.csv"; // relative path, same repo

const spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 600,
  "background": "#ffffff",
  "projection": { "type": "equirectangular" },

  "layer": [
    // 1) Base world map (simplified 1:110m)
    {
      "data": {
        "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
        "format": { "type": "topojson", "feature": "countries" }
      },
      "mark": { "type": "geoshape", "fill": "#f0f4f8", "stroke": "#d0d7de" }
    },

    // 2) Graticule (lines of constant latitude/longitude)
    {
      "data": {
        "graticule": { "step": [30, 30] } // 30-degree resolution
      },
      "mark": { "type": "geoshape", "stroke": "#cccccc", "strokeWidth": 0.5 }
    },

    // 3) Migration proportional circles
    {
      "data": { "url": csvUrl, "format": { "type": "csv" } },
      "transform": [
        { "calculate": "toNumber(datum.migrants)", "as": "migrants_num" }
      ],
      "mark": { "type": "circle", "opacity": 0.7, "stroke": "#222", "strokeWidth": 0.2 },
      "encoding": {
        "longitude": { "field": "lon", "type": "quantitative" },
        "latitude": { "field": "lat", "type": "quantitative" },
        "size": {
          "field": "migrants_num",
          "type": "quantitative",
          "scale": { "range": [100, 3000] },
          "legend": { "title": "Migrants" }
        },
        "color": { "value": "#1f77b4" },
        "tooltip": [
          { "field": "country", "type": "nominal", "title": "Country" },
          { "field": "migrants_num", "type": "quantitative", "title": "Migrants", "format": "," }
        ]
      }
    }
  ],

  "title": {
    "text": "Top origin countries of migrants to Australia",
    "subtitle": "Data from migration.csv | Circle size = migrant numbers",
    "anchor": "middle"
  }
};

vegaEmbed('#vis', spec, { actions: false })
  .then(() => console.log("Map loaded"))
  .catch(err => console.error(err));
