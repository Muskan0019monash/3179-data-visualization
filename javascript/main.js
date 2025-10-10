// javascript/main.js
// Ensure this file path matches index.html: "javascript/main.js"

const csvUrl = "migration.csv"; // relative path to your data file

// Shared Vega-Lite config (theme-like tweaks)
const commonConfig = {
  background: "#ffffff",
  autosize: { type: "fit", contains: "padding" },
  view: { continuousWidth: 600, continuousHeight: 350 }
};

// -- 1) World map + flow lines + origin circles (interactive by region) --
const worldMapSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  config: commonConfig,
  width: "container",
  height: 480,
  projection: { type: "naturalEarth1" },
  layer: [
    // base world map (topojson)
    {
      data: {
        url: "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
        format: { type: "topojson", feature: "countries" }
      },
      mark: { type: "geoshape", fill: "#e9f3f8", stroke: "#c9e0ea", strokeWidth: 0.6 }
    },

    // flow lines from origin to centroid of Australia
    {
      data: { url: csvUrl },
      transform: [
        { calculate: "toNumber(datum.migrants)", as: "migrants_num" },
        { calculate: "sqrt(datum.migrants_num)", as: "migrants_sqrt" },
        { calculate: "133.7751", as: "aus_lon" },
        { calculate: "-25.2744", as: "aus_lat" },
        { calculate: "datum.migrants_num > 150000 ? 'Major' : datum.migrants_num > 80000 ? 'Moderate' : 'Minor'", as: "flow_category" }
      ],
      mark: { type: "rule", opacity: 0.38, strokeWidth: 2, tooltip: null },
      encoding: {
        longitude: { field: "lon", type: "quantitative" },
        latitude: { field: "lat", type: "quantitative" },
        longitude2: { field: "aus_lon", type: "quantitative" },
        latitude2: { field: "aus_lat", type: "quantitative" },
        color: {
          field: "flow_category",
          type: "nominal",
          title: "Flow size",
          scale: { domain: ["Major", "Moderate", "Minor"], range: ["#b10026", "#fc8d59", "#91bfdb"] },
          legend: { orient: "right" }
        },
        strokeWidth: {
          field: "migrants_num",
          type: "quantitative",
          scale: { domain: [0, 1000000], range: [1, 6] }
        }
      }
    },

    // origin country circles
    {
      data: { url: csvUrl },
      transform: [
        { calculate: "toNumber(datum.migrants)", as: "migrants_num" },
        { calculate: "sqrt(datum.migrants_num)", as: "migrants_sqrt" }
      ],
      mark: { type: "circle", opacity: 0.85, stroke: "#1b2b3a", strokeWidth: 1, tooltip: true },
      encoding: {
        longitude: { field: "lon", type: "quantitative" },
        latitude: { field: "lat", type: "quantitative" },
        size: {
          field: "migrants_sqrt",
          type: "quantitative",
          title: "Relative size",
          scale: { range: [80, 3500] }
        },
        color: {
          field: "region",
          type: "nominal",
          title: "Region",
          legend: { orient: "right", columns: 1 },
          scale: {
            domain: ["Asia", "Europe", "Africa", "Oceania", "Middle East", "South America"],
            range: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffd92f"]
          }
        },
        tooltip: [
          { field: "country", title: "Country" },
          { field: "migrants_num", title: "Migrants", format: "," },
          { field: "region", title: "Region" },
          { field: "settlement_state", title: "Primary settlement" },
          { field: "education_level", title: "Education Level" }
        ]
      }
    },

    // Australia marker
    {
      data: { values: [{ country: "Australia", lon: 133.7751, lat: -25.2744 }] },
      mark: { type: "point", shape: "diamond", size: 500, filled: true, tooltip: true },
      encoding: {
        longitude: { field: "lon", type: "quantitative" },
        latitude: { field: "lat", type: "quantitative" },
        color: { value: "#d73027" },
        tooltip: { value: "Australia — Destination" }
      }
    }
  ]
};

// -- 2) Scatter plot: migrants (x, log) vs gender ratio (y) with interactive brush --
const scatterPlotSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  config: commonConfig,
  width: "container",
  height: 420,
  data: { url: csvUrl },
  transform: [
    { calculate: "toNumber(datum.migrants)", as: "migrants_num" },
    { calculate: "toNumber(datum.gender_ratio)", as: "gender_ratio_num" }
  ],
  params: [
    {
      name: "pts",
      select: { type: "point", fields: ["country"], on: "click" },
      bind: "legend"
    },
    {
      name: "brush",
      select: { type: "interval", encodings: ["x", "y"] }
    }
  ],
  layer: [
    // points (dimmed when not selected by brush)
    {
      mark: { type: "circle", size: 160, opacity: 0.9, stroke: "#0f1b26", strokeWidth: 0.8 },
      encoding: {
        x: {
          field: "migrants_num",
          type: "quantitative",
          title: "Number of Migrants (log scale)",
          axis: { format: ",", grid: true },
          scale: { type: "log", clamp: true }
        },
        y: {
          field: "gender_ratio_num",
          type: "quantitative",
          title: "Female proportion (0–1)",
          axis: { format: ".2f", grid: true },
          scale: { domain: [0.35, 0.65] }
        },
        color: {
          field: "education_level",
          type: "nominal",
          title: "Education Level",
          legend: { orient: "right" },
          scale: { domain: ["Low", "Medium", "High"], range: ["#fee5d9", "#fcae91", "#cb181d"] }
        },
        shape: {
          field: "age_group",
          type: "nominal",
          title: "Age Group",
          scale: { domain: ["Young", "Middle", "Mixed", "Older"], range: ["circle", "square", "triangle", "diamond"] },
          legend: { orient: "right" }
        },
        tooltip: [
          { field: "country", title: "Country" },
          { field: "migrants_num", title: "Migrants", format: "," },
          { field: "gender_ratio_num", title: "Gender Ratio", format: ".3f" },
          { field: "education_level", title: "Education Level" },
          { field: "age_group", title: "Age Group" },
          { field: "settlement_state", title: "Primary State" }
        ],
        opacity: {
          condition: { param: "brush", value: 1 },
          value: 0.25
        }
      }
    },

    // highlight selected points from legend clicks
    {
      mark: { type: "circle", size: 220, opacity: 1, stroke: "#000", strokeWidth: 1.2 },
      encoding: {
        x: { field: "migrants_num", type: "quantitative", scale: { type: "log" } },
        y: { field: "gender_ratio_num", type: "quantitative" },
        color: { field: "education_level", type: "nominal" },
        opacity: {
          condition: { param: "pts", value: 1 },
          value: 0
        }
      }
    }
  ]
};

// -- 3) Demographics view: two charts (settlement by state stacked bar & education pie) side-by-side --
const demographicsSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  config: commonConfig,
  width: "container",
  height: 340,
  hconcat: [
    {
      title: "Settlement distribution by state (sum of migrants)",
      data: { url: csvUrl },
      transform: [{ calculate: "toNumber(datum.migrants)", as: "migrants_num" }],
      mark: { type: "bar", tooltip: true },
      encoding: {
        x: {
          aggregate: "sum",
          field: "migrants_num",
          type: "quantitative",
          title: "Total migrants",
          axis: { format: "," }
        },
        y: { field: "settlement_state", type: "nominal", title: "State", sort: "-x" },
        color: {
          field: "region",
          type: "nominal",
          title: "Region of origin",
          legend: { orient: "bottom", columns: 3 }
        },
        tooltip: [
          { field: "settlement_state", title: "State" },
          { aggregate: "sum", field: "migrants_num", title: "Total migrants", format: "," }
        ]
      }
    },
    {
      title: "Education Level share",
      data: { url: csvUrl },
      transform: [{ calculate: "toNumber(datum.migrants)", as: "migrants_num" }, { aggregate: [{ op: "sum", field: "migrants_num", as: "sum_migrants" }], groupby: ["education_level"] }],
      mark: { type: "arc", innerRadius: 50, stroke: "#fff", strokeWidth: 1.5, tooltip: true },
      encoding: {
        theta: { field: "sum_migrants", type: "quantitative", title: "Migrants" },
        color: { field: "education_level", type: "nominal", title: "Education Level", scale: { domain: ["Low", "Medium", "High"], range: ["#fee5d9", "#fcae91", "#cb181d"] } },
        tooltip: [{ field: "education_level", title: "Education Level" }, { field: "sum_migrants", title: "Total migrants", format: "," }]
      }
    }
  ]
};

// Embed all charts and compute header stats
async function loadVisualizations() {
  try {
    const worldRes = await vegaEmbed("#world-map", worldMapSpec, { actions: false, theme: "quartz" });
    console.log("World map loaded");

    const scatterRes = await vegaEmbed("#scatter-plot", scatterPlotSpec, { actions: false, theme: "quartz" });
    console.log("Scatter loaded");

    const demoRes = await vegaEmbed("#demographics-chart", demographicsSpec, { actions: false, theme: "quartz" });
    console.log("Demographics loaded");

    // Compute header stats using the data (fetch CSV and compute sums)
    const resp = await fetch(csvUrl);
    const csvText = await resp.text();
    const data = parseCSV(csvText);

    // Stats
    const countriesCount = new Set(data.map(d => d.country)).size;
    const totalMigrants = data.reduce((s, r) => s + Number(r.migrants || 0), 0);
    const settlementCounts = {};
    data.forEach(r => {
      const st = r.settlement_state || "Unknown";
      settlementCounts[st] = (settlementCounts[st] || 0) + Number(r.migrants || 0);
    });
    const topState = Object.entries(settlementCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    document.getElementById("stat-countries").innerText = countriesCount;
    document.getElementById("stat-migrants").innerText = totalMigrants.toLocaleString();
    document.getElementById("stat-state").innerText = topState;

    // optional: wire click events for console logging
    [worldRes, scatterRes, demoRes].forEach((res, idx) => {
      const name = ["World Map", "Scatter", "Demographics"][idx];
      try {
        res.view.addEventListener("click", (ev, item) => {
          if (item && item.datum) console.log(name, "clicked:", item.datum);
        });
      } catch (e) {
        // some embeds may not expose view actions in all builds
      }
    });

  } catch (error) {
    console.error("Error loading visualizations:", error);
    document.querySelectorAll(".loading").forEach(el => {
      el.innerHTML = '<div style="color: red; text-align:center; padding:12px">Error loading chart — check console.</div>';
    });
  }
}

// Minimal CSV parser for small files (returns array of objects)
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const cols = line.split(",").map(c => c.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = cols[i] === undefined ? "" : cols[i]);
    return obj;
  });
}

document.addEventListener("DOMContentLoaded", loadVisualizations);
