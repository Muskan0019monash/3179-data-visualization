// Convert CSV data to JavaScript objects
const migrationData = [
    { country: "United Kingdom", lon: -0.1276, lat: 51.5072, migrants: 1000000, year: 2023, region: "Europe", age_group: "Mixed", gender_ratio: 0.52, education_level: "High", settlement_state: "NSW" },
    { country: "China", lon: 116.4074, lat: 39.9042, migrants: 650000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.48, education_level: "High", settlement_state: "VIC" },
    { country: "India", lon: 77.2090, lat: 28.6139, migrants: 600000, year: 2023, region: "Asia", age_group: "Young", gender_ratio: 0.45, education_level: "Medium", settlement_state: "NSW" },
    { country: "New Zealand", lon: 174.7633, lat: -36.8485, migrants: 550000, year: 2023, region: "Oceania", age_group: "Mixed", gender_ratio: 0.51, education_level: "High", settlement_state: "QLD" },
    { country: "Vietnam", lon: 105.8544, lat: 21.0285, migrants: 300000, year: 2023, region: "Asia", age_group: "Middle", gender_ratio: 0.49, education_level: "Medium", settlement_state: "VIC" },
    // ... (rest of the migrationData continues here — keep as-is)
];

// State color mapping - consistent throughout
const stateColors = {
    "NSW": "#3498db",
    "VIC": "#e74c3c",
    "QLD": "#f39c12",
    "WA": "#9b59b6",
    "SA": "#2ecc71",
    "TAS": "#1abc9c",
    "NT": "#e67e22",
    "ACT": "#95a5a6"
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    renderCharts();
});

function renderCharts() {
    // World map
    const mapSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "World map showing migration to Australia",
        "width": "container",
        "height": 400,
        "layer": [
            {
                "data": {
                    "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
                    "format": { "type": "topojson", "feature": "countries" }
                },
                "mark": { "type": "geoshape", "fill": "#f0f0f0", "stroke": "#000", "strokeWidth": 0.3 },
                "projection": { "type": "equirectangular" }
            },
            {
                "data": { "values": migrationData },
                "mark": { "type": "circle", "tooltip": true, "stroke": "#000", "strokeWidth": 1 },
                "encoding": {
                    "longitude": { "field": "lon", "type": "quantitative" },
                    "latitude": { "field": "lat", "type": "quantitative" },
                    "size": {
                        "field": "migrants",
                        "type": "quantitative",
                        "scale": { "range": [50, 2000] },
                        "title": "Migrants to Australia"
                    },
                    "color": {
                        "field": "migrants",
                        "type": "quantitative",
                        "scale": { "scheme": "viridis" },
                        "title": "Number of Migrants"
                    },
                    "tooltip": [
                        { "field": "country", "title": "Country" },
                        { "field": "migrants", "title": "Migrants", "format": "," },
                        { "field": "region", "title": "Region" },
                        { "field": "education_level", "title": "Education Level" }
                    ]
                }
            }
        ],
        "config": { "view": { "stroke": "transparent" }, "background": "transparent" }
    };

    // Bar chart by state
    const stateSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Migration flow to Australian states",
        "width": "container",
        "height": 400,
        "data": { "values": migrationData },
        "mark": { "type": "bar", "cornerRadius": 4 },
        "encoding": {
            "x": {
                "field": "settlement_state",
                "type": "nominal",
                "title": "Australian State",
                "axis": { "labelAngle": 0 },
                "sort": "-y"
            },
            "y": {
                "aggregate": "sum",
                "field": "migrants",
                "type": "quantitative",
                "title": "Number of Migrants"
            },
            "color": {
                "field": "settlement_state",
                "type": "nominal",
                "scale": { "domain": Object.keys(stateColors), "range": Object.values(stateColors) },
                "title": "State"
            },
            "tooltip": [
                { "field": "settlement_state", "title": "State" },
                { "aggregate": "sum", "field": "migrants", "title": "Migrants", "format": "," }
            ]
        },
        "config": { "view": { "stroke": "transparent" }, "axis": { "grid": false } }
    };

    // Embed charts
    vegaEmbed('#worldMap', mapSpec, { actions: false }).catch(err => console.error(err));
    vegaEmbed('#stateChart', stateSpec, { actions: false });
}
