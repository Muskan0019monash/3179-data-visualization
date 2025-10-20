// Load Vega-Lite map
const spec = {
  width: 1000,
  height: 500,
  projection: { type: "equalEarth" },
  data: { url: "https://raw.githubusercontent.com/vega/vega-datasets/master/data/world-110m.json", format: { type: "topojson", feature: "countries" } },
  layer: [
    {
      // Base map
      mark: { type: "geoshape", fill: "#e0e0e0", stroke: "white" }
    },
    {
      // Data overlay
      data: { url: "data.csv" },
      transform: [
        { calculate: "datum.Country", as: "country" }
      ],
      mark: "geoshape",
      encoding: {
        color: {
          field: "2021",
          type: "quantitative",
          scale: { scheme: "blues" },
          title: "Inflows (in Thousands)"
        },
        tooltip: [
          { field: "Country", title: "Country" },
          { field: "2021", title: "Inflows (2021, in K)" }
        ]
      }
    }
  ]
};

vegaEmbed("#world_map", spec).catch(console.error);
