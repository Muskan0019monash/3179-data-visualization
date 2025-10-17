// State color mapping
const stateColors = {
    "NSW": "#3498db",
    "VIC": "#e74c3c", 
    "QLD": "#f39c12",
    "WA": "#9b59b6",
    "SA": "#2ecc71",
    "NT": "#e67e22"
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDataAndRenderCharts();
});

async function loadDataAndRenderCharts() {
    try {
        const migrationResponse = await fetch('migration.csv');
        const migrationText = await migrationResponse.text();
        const migrationData = parseCSV(migrationText);
        
        const trendsResponse = await fetch('migration_quarters.csv');
        const trendsText = await trendsResponse.text();
        const trendsData = parseCSV(trendsText);
        
        migrationData.forEach(d => {
            d.migrants = +d.migrants;
            d.latitude = +d.latitude;
            d.longitude = +d.longitude;
        });
        
        trendsData.forEach(d => {
            d.arrivals = +d.arrivals;
            d.departures = +d.departures;
            d.net = +d.net;
        });
        
        renderCharts(migrationData, trendsData);
    } catch (error) {
        console.error('Error loading data:', error);
        const sampleMigrationData = [
            {country: "India", latitude: 20.5937, longitude: 78.9629, migrants: 720000, settlement_state: "NSW"},
            {country: "China", latitude: 35.8617, longitude: 104.1954, migrants: 680000, settlement_state: "VIC"},
            {country: "United Kingdom", latitude: 55.3781, longitude: -3.4360, migrants: 550000, settlement_state: "QLD"}
        ];
        
        const sampleTrendsData = [
            {quarter: "Mar-23", arrivals: 710.45, departures: 215.62, net: 494.83},
            {quarter: "Jun-23", arrivals: 739.37, departures: 203.85, net: 535.52}
        ];
        
        renderCharts(sampleMigrationData, sampleTrendsData);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        return obj;
    }).filter(obj => obj[headers[0]]);
}

function renderCharts(migrationData, trendsData) {
    renderWorldMap(migrationData);
    renderStateChart(migrationData);
    renderCountryChart(migrationData);
    renderTrendChart(trendsData);
}

function renderWorldMap(migrationData) {
    const mapSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": "container",
        "height": 450,
        "layer": [
            {
                "data": {
                    "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
                    "format": {"type": "topojson", "feature": "countries"}
                },
                "mark": {
                    "type": "geoshape",
                    "fill": "#f0f0f0",
                    "stroke": "#000",
                    "strokeWidth": 0.3
                },
                "projection": {"type": "equirectangular"}
            },
            {
                "data": {"values": migrationData},
                "mark": {
                    "type": "circle",
                    "tooltip": true,
                    "stroke": "#000",
                    "strokeWidth": 1
                },
                "encoding": {
                    "longitude": {"field": "longitude", "type": "quantitative"},
                    "latitude": {"field": "latitude", "type": "quantitative"},
                    "size": {
                        "field": "migrants",
                        "type": "quantitative",
                        "title": "Migrants to Australia",
                        "scale": {"range": [30, 500]},
                        "legend": {
                            "direction": "horizontal",
                            "gradientLength": 120,
                            "titleFontSize": 12,
                            "labelFontSize": 10,
                            "orient": "bottom"
                        }
                    },
                    "color": {
                        "field": "migrants",
                        "type": "quantitative",
                        "title": "Number of Migrants",
                        "scale": {"scheme": "viridis"},
                        "legend": {
                            "direction": "vertical",
                            "gradientLength": 150,
                            "titleFontSize": 12,
                            "labelFontSize": 10,
                            "orient": "right"
                        }
                    },
                    "tooltip": [
                        {"field": "country", "type": "nominal", "title": "Country"},
                        {"field": "migrants", "type": "quantitative", "title": "Migrants", "format": ","},
                        {"field": "settlement_state", "type": "nominal", "title": "Primary State"}
                    ]
                }
            }
        ],
        "config": {
            "view": {"stroke": "transparent"},
            "background": "transparent"
        }
    };

    vegaEmbed('#worldMap', mapSpec, {actions: false});
}

function renderStateChart(migrationData) {
    const stateSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": "container",
        "height": 350,
        "data": {"values": migrationData},
        "mark": {"type": "bar", "cornerRadius": 4},
        "encoding": {
            "x": {
                "field": "settlement_state",
                "type": "nominal",
                "title": "Australian State",
                "axis": {"labelAngle": 0},
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
                "title": "State",
                "scale": {
                    "domain": Object.keys(stateColors),
                    "range": Object.values(stateColors)
                },
                "legend": {
                    "orient": "bottom",
                    "titleFontSize": 12,
                    "labelFontSize": 10
                }
            },
            "tooltip": [
                {"field": "settlement_state", "title": "State"},
                {"aggregate": "sum", "field": "migrants", "title": "Total Migrants", "format": ","}
            ]
        },
        "config": {
            "view": {"stroke": "transparent"},
            "axis": {"grid": false}
        }
    };

    vegaEmbed('#stateChart', stateSpec, {actions: false});
}

function renderCountryChart(migrationData) {
    const countrySpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": "container",
        "height": 350,
        "data": {"values": migrationData},
        "transform": [
            {"sort": [{"field": "migrants", "order": "descending"}]},
            {"window": [{"op": "row_number", "as": "rank"}]},
            {"filter": "datum.rank <= 10"}
        ],
        "mark": {"type": "bar", "cornerRadius": 4},
        "encoding": {
            "x": {
                "field": "migrants",
                "type": "quantitative",
                "title": "Number of Migrants"
            },
            "y": {
                "field": "country",
                "type": "nominal",
                "title": "Country",
                "sort": "-x"
            },
            "color": {
                "field": "country",
                "type": "nominal",
                "scale": {"scheme": "purples"},
                "legend": null
            },
            "tooltip": [
                {"field": "country", "title": "Country"},
                {"field": "migrants", "title": "Migrants", "format": ","},
                {"field": "settlement_state", "title": "Primary State"}
            ]
        },
        "config": {
            "view": {"stroke": "transparent"},
            "axis": {"grid": false}
        }
    };

    vegaEmbed('#countryChart', countrySpec, {actions: false});
}

function renderTrendChart(trendsData) {
    const trendSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": "container",
        "height": 350,
        "data": {"values": trendsData},
        "transform": [
            {"fold": ["arrivals", "departures", "net"], "as": ["Migration Type", "value"]}
        ],
        "encoding": {
            "x": {
                "field": "quarter",
                "type": "nominal", 
                "title": "Quarter",
                "axis": {"labelAngle": -45}
            },
            "y": {
                "field": "value",
                "type": "quantitative",
                "title": "Number of Migrants (thousands)"
            },
            "color": {
                "field": "Migration Type",
                "type": "nominal",
                "title": "Migration Type",
                "scale": {
                    "domain": ["arrivals", "departures", "net"],
                    "range": ["#3498db", "#e74c3c", "#2ecc71"]
                },
                "legend": {
                    "orient": "bottom",
                    "titleFontSize": 12,
                    "labelFontSize": 10
                }
            },
            "tooltip": [
                {"field": "quarter", "title": "Quarter"},
                {"field": "Migration Type", "title": "Type"},
                {"field": "value", "title": "Migrants", "format": ",.2f"}
            ]
        },
        "layer": [
            {
                "mark": {"type": "line", "strokeWidth": 3}
            },
            {
                "mark": {
                    "type": "point",
                    "filled": true,
                    "size": 60,
                    "stroke": "#000",
                    "strokeWidth": 1
                }
            }
        ],
        "config": {
            "view": {"stroke": "transparent"},
            "axis": {"grid": false}
        }
    };

    vegaEmbed('#trendChart', trendSpec, {actions: false});
}