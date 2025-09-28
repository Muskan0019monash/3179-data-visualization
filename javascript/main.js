// main.js
// World map of migrants to Australia with styling improvements

const csvUrl = "Dataset/migration.csv"; // dataset path updated

const spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 600,
  "background": "#eef6fb", // match page background
  "projection": { "type": "equirectangular" },

  "layer": [
    // 1) Base world map (landmass highlighted)
    {
      "data": {
        "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
        "format": { "type": "topojson", "feature": "countries" }
      },
      "mark": { "type": "geoshape", "fill": "#d9e6c3", "stroke": "#888" }
    },

    // 2) Graticule (latitude/longitude grid)
    {
      "data": { "graticule": { "step": [30, 30] } },
      "mark": { "type": "geoshape", "stroke": "#cccccc", "strokeWidth": 0.5 }
    },

    // 3) Migration proportional circles
    {
      "data": { "url": csvUrl, "format": { "type": "csv" } },
      "transform": [
        { "calculate": "toNumber(datum.migrants)", "as": "migrants_num" }
      ],
      "mark": { "type": "circle", "opacity": 0.75, "stroke": "#222", "strokeWidth": 0.3 },
      "encoding": {
        "longitude": { "field": "lon", "type": "quantitative" },
        "latitude": { "field": "lat", "type": "quantitative" },
        "size": {
          "field": "migrants_num",
          "type": "quantitative",
          "scale": { "range": [100, 3000] },
          "legend": { "title": "Migrants" }
        },
        // Color scale instead of one solid color
        "color": {
          "field": "migrants_num",
          "type": "quantitative",
          "scale": { "scheme": "blues" },
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
