const stateColors = {
  NSW: "#005CAF",
  VIC: "#00843D",
  QLD: "#E4002B",
  WA: "#FFB81C",
  SA: "#A7A8AA",
  TAS: "#603F8B",
  NT: "#F58220",
  ACT: "#009CA6"
};

const stateDomain = Object.keys(stateColors);
const stateRange = Object.values(stateColors);

const specs = {
  map: {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "title": "Global Migration Origins",
    "data": { "url": "data/migration.csv" },
    "projection": { "type": "equalEarth" },
    "layer": [
      {
        "data": { "url": "https://vega.github.io/vega-datasets/data/world-110m.json", "format": { "type": "topojson", "feature": "countries" } },
        "mark": { "type": "geoshape", "fill": "#e0e0e0", "stroke": "#fff" }
      },
      {
        "mark": { "type": "circle", "tooltip": true },
        "encoding": {
          "longitude": { "field": "longitude", "type": "quantitative" },
          "latitude": { "field": "latitude", "type": "quantitative" },
          "size": { "field": "migrants", "type": "quantitative", "title": "Migrants" },
          "color": { "field": "settlement_state", "type": "nominal", "scale": { "domain": stateDomain, "range": stateRange }, "legend": { "title": "State" } },
          "tooltip": [
            { "field": "country", "title": "Country" },
            { "field": "migrants", "title": "Migrants" },
            { "field": "settlement_state", "title": "State" }
          ]
        }
      }
    ]
  },

  arrivals: {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 200,
    "title": "Quarterly Arrivals",
    "data": { "url": "data/migration_quarters.csv" },
    "mark": "line",
    "encoding": {
      "x": { "field": "quarter", "type": "ordinal", "title": "Quarter" },
      "y": { "field": "arrivals", "type": "quantitative", "title": "Arrivals" },
      "color": { "field": "settlement_state", "type": "nominal", "scale": { "domain": stateDomain, "range": stateRange }, "legend": null }
    }
  },

  departures: {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 200,
    "title": "Quarterly Departures",
    "data": { "url": "data/migration_quarters.csv" },
    "mark": "line",
    "encoding": {
      "x": { "field": "quarter", "type": "ordinal", "title": "Quarter" },
      "y": { "field": "departures", "type": "quantitative", "title": "Departures" },
      "color": { "field": "settlement_state", "type": "nominal", "scale": { "domain": stateDomain, "range": stateRange }, "legend": null }
    }
  },

  net: {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 200,
    "title": "Net Migration",
    "data": { "url": "data/migration_quarters.csv" },
    "mark": "bar",
    "encoding": {
      "x": { "field": "quarter", "type": "ordinal", "title": "Quarter" },
      "y": { "field": "net", "type": "quantitative", "title": "Net Migration" },
      "color": { "field": "settlement_state", "type": "nominal", "scale": { "domain": stateDomain, "range": stateRange } }
    }
  },

  "top-countries": {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 300,
    "title": "Top Source Countries by Migrants",
    "data": { "url": "data/migration.csv" },
    "transform": [
      { "aggregate": [{ "op": "sum", "field": "migrants", "as": "total_migrants" }], "groupby": ["country"] },
      { "sort": [{ "field": "total_migrants", "order": "descending" }], "window": [{ "op": "rank", "as": "rank" }] },
      { "filter": "datum.rank <= 10" }
    ],
    "mark": "bar",
    "encoding": {
      "y": { "field": "country", "type": "ordinal", "sort": "-x", "title": "Country" },
      "x": { "field": "total_migrants", "type": "quantitative", "title": "Migrants" },
      "color": { "value": "#005CAF" },
      "tooltip": [
        { "field": "country", "title": "Country" },
        { "field": "total_migrants", "title": "Total Migrants" }
      ]
    }
  }
};

// Embed all charts
vegaEmbed("#map", specs.map);
vegaEmbed("#arrivals", specs.arrivals);
vegaEmbed("#departures", specs.departures);
vegaEmbed("#net", specs.net);
vegaEmbed("#top-countries", specs["top-countries"]);
