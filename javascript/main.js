// main.js - Enhanced version with time series and better interactivity

const csvUrl = "dataset/migration.csv";

// Enhanced specification with multiple views
const spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Global Migration to Australia: Analysis by Country of Origin",
  "width": "container",
  "height": 700,
  "background": "#e8f4f8",
  "config": {
    "view": {"stroke": "transparent"},
    "legend": {
      "labelFont": "system-ui",
      "titleFont": "system-ui",
      "titleFontWeight": "bold"
    }
  },

  "vconcat": [
    // TOP: World Map
    {
      "width": "container",
      "height": 500,
      "title": "Geographic Distribution of Migrants",
      "projection": {"type": "equirectangular"},
      
      "layer": [
        // Base world map
        {
          "data": {
            "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
            "format": {"type": "topojson", "feature": "countries"}
          },
          "mark": {
            "type": "geoshape",
            "fill": "#f8f8f8",
            "stroke": "#ddd",
            "strokeWidth": 0.5
          }
        },
        
        // Migration circles
        {
          "data": {"url": csvUrl},
          "transform": [
            {"calculate": "toNumber(datum.migrants)", "as": "migrants_num"},
            {"calculate": "sqrt(datum.migrants_num)", "as": "migrants_sqrt"} // Better size scaling
          ],
          "mark": {
            "type": "circle",
            "opacity": 0.7,
            "stroke": "#333",
            "strokeWidth": 0.8,
            "tooltip": {"content": "data"}
          },
          "encoding": {
            "longitude": {"field": "lon", "type": "quantitative"},
            "latitude": {"field": "lat", "type": "quantitative"},
            "size": {
              "field": "migrants_sqrt",
              "type": "quantitative",
              "scale": {"range": [50, 2500]},
              "legend": {"title": "Number of Migrants"}
            },
            "color": {
              "field": "migrants_num",
              "type": "quantitative",
              "scale": {
                "scheme": "reds",
                "domainMid": 50000 // Adjust based on your data range
              },
              "legend": {"title": "Migrants Count"}
            },
            "tooltip": [
              {"field": "country", "type": "nominal", "title": "Country"},
              {"field": "migrants_num", "type": "quantitative", "title": "Migrants", "format": ","},
              {"field": "region", "type": "nominal", "title": "Region"} // Add if available
            ]
          }
        }
      ]
    },
    
    // BOTTOM: Bar chart of top countries
    {
      "width": "container",
      "height": 200,
      "title": "Top 15 Countries by Number of Migrants",
      "data": {"url": csvUrl},
      "transform": [
        {"calculate": "toNumber(datum.migrants)", "as": "migrants_num"},
        {"window": [{"op": "rank", "as": "rank"}], "sort": [{"field": "migrants_num", "order": "descending"}]},
        {"filter": "datum.rank <= 15"}
      ],
      "mark": {"type": "bar", "color": "#c32f27"},
      "encoding": {
        "y": {
          "field": "country",
          "type": "nominal",
          "sort": {"field": "migrants_num", "order": "descending"},
          "title": "Country",
          "axis": {"labelLimit": 150}
        },
        "x": {
          "field": "migrants_num",
          "type": "quantitative",
          "title": "Number of Migrants",
          "axis": {"format": ","}
        },
        "tooltip": [
          {"field": "country", "type": "nominal", "title": "Country"},
          {"field": "migrants_num", "type": "quantitative", "title": "Migrants", "format": ","}
        ]
      }
    }
  ]
};

// Embed the visualization
vegaEmbed('#vis', spec, {
  actions: {export: true, source: false, compiled: false, editor: false},
  theme: "quartz"
})
  .then(result => {
    console.log("✅ Enhanced migration map loaded successfully");
    
    // Add interaction logging
    result.view.addEventListener('click', function(event, item) {
      if (item && item.datum) {
        console.log('Clicked:', item.datum);
      }
    });
  })
  .catch(err => {
    console.error("❌ Error loading visualization:", err);
    document.getElementById('vis').innerHTML = 
      '<div style="color: red; text-align: center; padding: 20px;">Error loading visualization. Please check the console.</div>';
  });