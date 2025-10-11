// ==============================
// Vega-Lite Charts for Migration Dashboard
// ==============================

// This function runs once data is loaded in data.js
function createCharts(data) {

    // ---------- 1. World Map: Regional Migration -------------
    const regionData = data.filter(d => d.Category === "Region");

    const worldMapSpec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        width: "container",
        height: 400,
        projection: { type: "equalEarth" },
        layer: [
            {
                data: {
                    url: "https://raw.githubusercontent.com/vega/vega-datasets/master/data/world-110m.json",
                    format: { type: "topojson", feature: "countries" }
                },
                mark: { type: "geoshape", fill: "#e0e0e0", stroke: "white" }
            },
            {
                data: { values: regionData },
                transform: [
                    { filter: "datum['Year'] == '2023-24'" }
                ],
                mark: "circle",
                encoding: {
                    longitude: { field: "lon", type: "quantitative" },
                    latitude: { field: "lat", type: "quantitative" },
                    size: { field: "Migrants", type: "quantitative", scale: { range: [100, 2000] } },
                    color: { field: "Region", type: "nominal", legend: { title: "Region" } },
                    tooltip: [
                        { field: "Region", title: "Region" },
                        { field: "Migrants", title: "Migrants (thousands)" }
                    ]
                }
            }
        ],
        title: "Global Migration to Australia by Region (2023–24)"
    };

    // ---------- 2. Bar Chart: Visa Categories Over Time ----------
    const visaData = data.filter(d => d.Category === "Visa");

    const visaChartSpec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        width: "container",
        height: 400,
        data: { values: visaData },
        mark: "bar",
        encoding: {
            x: { field: "Year", type: "ordinal", title: "Year" },
            y: { field: "Migrants", type: "quantitative", title: "Migrants (thousands)" },
            color: { field: "Group", type: "nominal", title: "Visa Category" },
            tooltip: [
                { field: "Year", title: "Year" },
                { field: "Group", title: "Visa Category" },
                { field: "Migrants", title: "Migrants (thousands)" }
            ]
        },
        title: "Visa Category Trends (2013–14 to 2023–24)"
    };

    // Embed both charts into your HTML
    vegaEmbed("#worldMap", worldMapSpec, { actions: false }).catch(console.error);
    vegaEmbed("#stateChart", visaChartSpec, { actions: false }).catch(console.error);
}
