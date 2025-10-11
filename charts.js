// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    renderCharts();
});

function renderCharts() {
    // Chart 1: World Map with Points
    const mapSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "World map showing migration to Australia",
        "width": "container",
        "height": 400,
        "layer": [
            {
                // Base world map with black borders
                "data": {
                    "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "countries"
                    }
                },
                "mark": {
                    "type": "geoshape",
                    "fill": "#f0f0f0",
                    "stroke": "#000",
                    "strokeWidth": 0.3
                },
                "projection": {
                    "type": "equirectangular"
                }
            },
            {
                // Migration data points
                "data": {
                    "values": migrationData
                },
                "mark": {
                    "type": "circle",
                    "tooltip": true,
                    "stroke": "#000",
                    "strokeWidth": 1
                },
                "encoding": {
                    "longitude": {
                        "field": "lon",
                        "type": "quantitative"
                    },
                    "latitude": {
                        "field": "lat",
                        "type": "quantitative"
                    },
                    "size": {
                        "field": "migrants",
                        "type": "quantitative",
                        "title": "Migrants to Australia",
                        "scale": {
                            "range": [50, 2000]
                        },
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
                        "scale": {
                            "scheme": "viridis"
                        },
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
                        {"field": "region", "type": "nominal", "title": "Region"},
                        {"field": "education_level", "type": "nominal", "title": "Education Level"}
                    ]
                }
            }
        ],
        "config": {
            "view": {"stroke": "transparent"},
            "background": "transparent"
        }
    };

    // Chart 2: Migration to Australian States with consistent colors
    const stateSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Migration flow to Australian states",
        "width": "container",
        "height": 400,
        "data": {
            "values": migrationData
        },
        "mark": {
            "type": "bar",
            "cornerRadius": 4
        },
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
                {"aggregate": "sum", "field": "migrants", "title": "Migrants", "format": ","}
            ]
        },
        "config": {
            "view": {"stroke": "transparent"},
            "axis": {"grid": false}
        }
    };

    // Embed charts
    vegaEmbed('#worldMap', mapSpec, {actions: false}).catch(error => {
        console.error("Error embedding world map:", error);
        // Fallback visualization
        const fallbackSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "description": "Migration by country (fallback)",
            "width": "container",
            "height": 400,
            "data": {
                "values": migrationData
            },
            "mark": "bar",
            "encoding": {
                "x": {
                    "field": "country",
                    "type": "nominal",
                    "title": "Country",
                    "axis": {"labelAngle": 45}
                },
                "y": {
                    "field": "migrants",
                    "type": "quantitative",
                    "title": "Migrants to Australia"
                },
                "color": {
                    "field": "country",
                    "type": "nominal",
                    "legend": null
                },
                "tooltip": [
                    {"field": "country", "title": "Country"},
                    {"field": "migrants", "title": "Migrants", "format": ","}
                ]
            }
        };
        vegaEmbed('#worldMap', fallbackSpec, {actions: false});
    });
    
    vegaEmbed('#stateChart', stateSpec, {actions: false});
}