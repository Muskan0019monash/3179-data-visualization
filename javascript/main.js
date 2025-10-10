// Enhanced main.js with multiple visualizations
const csvUrl = "migration.csv";

// World Map Specification
const worldMapSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 450,
  "background": "#f8fbff",
  "projection": {"type": "naturalEarth1"},
  
  "layer": [
    // Base world map
    {
      "data": {
        "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
        "format": {"type": "topojson", "feature": "countries"}
      },
      "mark": {
        "type": "geoshape",
        "fill": "#e8f4f8",
        "stroke": "#b8d4e3",
        "strokeWidth": 0.5
      }
    },
    
    // Migration flow lines (from origin to Australia)
    {
      "data": {"url": csvUrl},
      "transform": [
        {"calculate": "toNumber(datum.migrants)", "as": "migrants_num"},
        {"calculate": "datum.migrants_num > 100000 ? 'Major' : datum.migrants_num > 50000 ? 'Moderate' : 'Minor'", "as": "flow_category"}
      ],
      "mark": {
        "type": "rule",
        "opacity": 0.3,
        "strokeWidth": 2
      },
      "encoding": {
        "longitude": {"field": "lon", "type": "quantitative"},
        "latitude": {"field": "lat", "type": "quantitative"},
        "longitude2": {"value": 133.7751}, // Australia longitude
        "latitude2": {"value": -25.2744},  // Australia latitude
        "color": {
          "field": "flow_category",
          "type": "nominal",
          "scale": {
            "domain": ["Major", "Moderate", "Minor"],
            "range": ["#d73027", "#fc8d59", "#91bfdb"]
          }
        },
        "strokeWidth": {
          "field": "migrants_num",
          "type": "quantitative",
          "scale": {"range": [1, 4]}
        }
      }
    },
    
    // Origin country circles
    {
      "data": {"url": csvUrl},
      "transform": [
        {"calculate": "toNumber(datum.migrants)", "as": "migrants_num"},
        {"calculate": "sqrt(datum.migrants_num / 1000)", "as": "migrants_sqrt"}
      ],
      "mark": {
        "type": "circle",
        "opacity": 0.8,
        "stroke": "#2c3e50",
        "strokeWidth": 1.5,
        "tooltip": {"content": "data"}
      },
      "encoding": {
        "longitude": {"field": "lon", "type": "quantitative"},
        "latitude": {"field": "lat", "type": "quantitative"},
        "size": {
          "field": "migrants_sqrt",
          "type": "quantitative",
          "scale": {"range": [100, 2000]},
          "legend": {"title": "Migration Volume", "symbolOpacity": 0.8}
        },
        "color": {
          "field": "region",
          "type": "nominal",
          "scale": {
            "domain": ["Asia", "Europe", "Africa", "Oceania", "Middle East", "South America"],
            "range": ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33"]
          },
          "legend": {"title": "Region of Origin"}
        },
        "tooltip": [
          {"field": "country", "type": "nominal", "title": "Country"},
          {"field": "migrants_num", "type": "quantitative", "title": "Migrants", "format": ","},
          {"field": "region", "type": "nominal", "title": "Region"},
          {"field": "settlement_state", "type": "nominal", "title": "Primary Settlement State"},
          {"field": "education_level", "type": "nominal", "title": "Education Level"}
        ]
      }
    },
    
    // Australia marker
    {
      "data": {"values": [{"country": "Australia", "lon": 133.7751, "lat": -25.2744}]},
      "mark": {
        "type": "point",
        "shape": "diamond",
        "size": 400,
        "fill": "#d73027",
        "stroke": "#ffffff",
        "strokeWidth": 3
      },
      "encoding": {
        "longitude": {"field": "lon", "type": "quantitative"},
        "latitude": {"field": "lat", "type": "quantitative"},
        "tooltip": {"value": "Australia - Destination Country"}
      }
    }
  ]
};

// Scatter Plot Specification - Migration vs Demographics
const scatterPlotSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 350,
  "background": "#fafbfc",
  "data": {"url": csvUrl},
  "transform": [
    {"calculate": "toNumber(datum.migrants)", "as": "migrants_num"},
    {"calculate": "toNumber(datum.gender_ratio)", "as": "gender_ratio_num"}
  ],
  "mark": {
    "type": "circle",
    "size": 150,
    "opacity": 0.8,
    "stroke": "#2c3e50",
    "strokeWidth": 1
  },
  "encoding": {
    "x": {
      "field": "migrants_num",
      "type": "quantitative",
      "title": "Number of Migrants",
      "axis": {"format": ",", "grid": true},
      "scale": {"type": "log"}
    },
    "y": {
      "field": "gender_ratio_num",
      "type": "quantitative",
      "title": "Gender Ratio (Female Proportion)",
      "axis": {"format": ".2f", "grid": true},
      "scale": {"domain": [0.35, 0.65]}
    },
    "color": {
      "field": "education_level",
      "type": "nominal",
      "scale": {
        "domain": ["Low", "Medium", "High"],
        "range": ["#fee5d9", "#fcae91", "#cb181d"]
      },
      "legend": {"title": "Education Level"}
    },
    "shape": {
      "field": "age_group",
      "type": "nominal",
      "scale": {
        "domain": ["Young", "Middle", "Mixed", "Older"],
        "range": ["circle", "square", "triangle-up", "diamond"]
      },
      "legend": {"title": "Age Group"}
    },
    "tooltip": [
      {"field": "country", "type": "nominal", "title": "Country"},
      {"field": "migrants_num", "type": "quantitative", "title": "Migrants", "format": ","},
      {"field": "gender_ratio_num", "type": "quantitative", "title": "Gender Ratio", "format": ".3f"},
      {"field": "education_level", "type": "nominal", "title": "Education Level"},
      {"field": "age_group", "type": "nominal", "title": "Age Group"},
      {"field": "settlement_state", "type": "nominal", "title": "Primary Settlement State"}
    ]
  }
};

// Demographics Pie Chart Specification
const demographicsSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": 300,
  "background": "#fafbfc",
  "hconcat": [
    // Settlement by State
    {
      "title": "Settlement Distribution by State",
      "data": {"url": csvUrl},
      "transform": [
        {"calculate": "toNumber(datum.migrants)", "as": "migrants_num"},
        {
          "aggregate": [{"op": "sum", "field": "migrants_num", "as": "total_migrants"}],
          "groupby": ["settlement_state"]
        }
      ],
      "mark": {"type": "arc", "innerRadius": 50, "outerRadius": 120, "stroke": "#fff", "strokeWidth": 2},
      "encoding": {
        "theta": {"field": "total_migrants", "type": "quantitative"},
        "color": {
          "field": "settlement_state",
          "type": "nominal",
          "scale": {"scheme": "category10"},
          "legend": {"title": "Settlement State", "orient": "bottom"}
        },
        "tooltip": [
          {"field": "settlement_state", "type": "nominal", "title": "State"},
          {"field": "total_migrants", "type": "quantitative", "title": "Total Migrants", "format": ","}
        ]
      }
    },
    
    // Education Level Distribution
    {
      "title": "Distribution by Education Level",
      "data": {"url": csvUrl},
      "transform": [
        {"calculate": "toNumber(datum.migrants)", "as": "migrants_num"},
        {
          "aggregate": [{"op": "sum", "field": "migrants_num", "as": "total_migrants"}],
          "groupby": ["education_level"]
        }
      ],
      "mark": {"type": "arc", "innerRadius": 50, "outerRadius": 120, "stroke": "#fff", "strokeWidth": 2},
      "encoding": {
        "theta": {"field": "total_migrants", "type": "quantitative"},
        "color": {
          "field": "education_level",
          "type": "nominal",
          "scale": {
            "domain": ["Low", "Medium", "High"],
            "range": ["#fee5d9", "#fcae91", "#cb181d"]
          },
          "legend": {"title": "Education Level", "orient": "bottom"}
        },
        "tooltip": [
          {"field": "education_level", "type": "nominal", "title": "Education Level"},
          {"field": "total_migrants", "type": "quantitative", "title": "Total Migrants", "format": ","}
        ]
      }
    }
  ]
};

// Embed all visualizations
async function loadVisualizations() {
  try {
    // Load World Map
    const worldMapResult = await vegaEmbed('#world-map', worldMapSpec, {
      actions: {export: true, source: false, compiled: false, editor: false},
      theme: "quartz"
    });
    console.log("✅ World map loaded successfully");

    // Load Scatter Plot
    const scatterResult = await vegaEmbed('#scatter-plot', scatterPlotSpec, {
      actions: {export: true, source: false, compiled: false, editor: false},
      theme: "quartz"
    });
    console.log("✅ Scatter plot loaded successfully");

    // Load Demographics Chart
    const demographicsResult = await vegaEmbed('#demographics-chart', demographicsSpec, {
      actions: {export: true, source: false, compiled: false, editor: false},
      theme: "quartz"
    });
    console.log("✅ Demographics chart loaded successfully");

    // Add interaction logging for all charts
    [worldMapResult, scatterResult, demographicsResult].forEach((result, index) => {
      const chartNames = ['World Map', 'Scatter Plot', 'Demographics Chart'];
      result.view.addEventListener('click', function(event, item) {
        if (item && item.datum) {
          console.log(`${chartNames[index]} clicked:`, item.datum);
        }
      });
    });

  } catch (error) {
    console.error("❌ Error loading visualizations:", error);
    document.querySelectorAll('.loading').forEach(loader => {
      loader.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">Error loading visualization. Please check the console for details.</div>';
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadVisualizations);