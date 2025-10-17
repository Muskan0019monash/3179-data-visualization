// Convert CSV data to JavaScript objects
const migrationData = [
    { country: "United Kingdom", lon: -0.1276, lat: 51.5072, migrants: 1000000, year: 2023, region: "Europe", settlement_state: "NSW" },
    { country: "China", lon: 116.4074, lat: 39.9042, migrants: 650000, year: 2023, region: "Asia", settlement_state: "VIC" },
    { country: "India", lon: 77.2090, lat: 28.6139, migrants: 600000, year: 2023, region: "Asia", settlement_state: "NSW" },
    { country: "New Zealand", lon: 174.7633, lat: -36.8485, migrants: 550000, year: 2023, region: "Oceania", settlement_state: "QLD" },
    { country: "Vietnam", lon: 105.8544, lat: 21.0285, migrants: 300000, year: 2023, region: "Asia", settlement_state: "VIC" },
    { country: "Italy", lon: 12.4964, lat: 41.9028, migrants: 250000, year: 2023, region: "Europe", settlement_state: "SA" },
    { country: "Philippines", lon: 121.7740, lat: 12.8797, migrants: 200000, year: 2023, region: "Asia", settlement_state: "WA" },
    { country: "South Africa", lon: 28.0473, lat: -26.2041, migrants: 180000, year: 2023, region: "Africa", settlement_state: "NSW" },
    { country: "Malaysia", lon: 101.6869, lat: 3.1390, migrants: 170000, year: 2023, region: "Asia", settlement_state: "VIC" },
    { country: "Sri Lanka", lon: 80.7718, lat: 7.8731, migrants: 150000, year: 2023, region: "Asia", settlement_state: "NSW" },
    { country: "Germany", lon: 10.4515, lat: 51.1657, migrants: 140000, year: 2023, region: "Europe", settlement_state: "VIC" },
    { country: "Lebanon", lon: 35.8623, lat: 33.8547, migrants: 130000, year: 2023, region: "Middle East", settlement_state: "NSW" },
    { country: "Greece", lon: 21.8243, lat: 39.0742, migrants: 120000, year: 2023, region: "Europe", settlement_state: "VIC" },
    { country: "Thailand", lon: 100.9925, lat: 15.8700, migrants: 110000, year: 2023, region: "Asia", settlement_state: "QLD" },
    { country: "Indonesia", lon: 113.9213, lat: -0.7893, migrants: 100000, year: 2023, region: "Asia", settlement_state: "WA" },
    { country: "South Korea", lon: 127.7669, lat: 35.9078, migrants: 95000, year: 2023, region: "Asia", settlement_state: "NSW" },
    { country: "Japan", lon: 138.2529, lat: 36.2048, migrants: 90000, year: 2023, region: "Asia", settlement_state: "VIC" },
    { country: "Nepal", lon: 85.3240, lat: 28.3949, migrants: 85000, year: 2023, region: "Asia", settlement_state: "QLD" },
    { country: "Bangladesh", lon: 90.3563, lat: 23.6850, migrants: 80000, year: 2023, region: "Asia", settlement_state: "NSW" },
    { country: "Pakistan", lon: 69.3451, lat: 30.3753, migrants: 75000, year: 2023, region: "Asia", settlement_state: "VIC" },
    { country: "Iran", lon: 53.6880, lat: 32.4279, migrants: 70000, year: 2023, region: "Middle East", settlement_state: "NSW" },
    { country: "Turkey", lon: 35.2433, lat: 38.9637, migrants: 65000, year: 2023, region: "Europe", settlement_state: "VIC" },
    { country: "Afghanistan", lon: 67.7090, lat: 33.9391, migrants: 60000, year: 2023, region: "Asia", settlement_state: "NSW" },
    { country: "Myanmar", lon: 95.9560, lat: 21.9162, migrants: 55000, year: 2023, region: "Asia", settlement_state: "WA" },
    { country: "Brazil", lon: -51.9253, lat: -14.2350, migrants: 50000, year: 2023, region: "South America", settlement_state: "QLD" }
];

// Migration trends data - now per year
const migrationTrends = [
    { year: "2014", arrivals: 1844, departures: 1109, net: 735 },
    { year: "2015", arrivals: 1869, departures: 1132, net: 737 },
    { year: "2016", arrivals: 2003, departures: 1124, net: 879 },
    { year: "2017", arrivals: 2136, departures: 1124, net: 1012 },
    { year: "2018", arrivals: 2120, departures: 1149, net: 971 },
    { year: "2019", arrivals: 2261, departures: 1279, net: 982 },
    { year: "2020", arrivals: 1722, departures: 1220, net: 502 },
    { year: "2021", arrivals: 637, departures: 866, net: -229 },
    { year: "2022", arrivals: 2188, departures: 882, net: 1306 },
    { year: "2023", arrivals: 2941, departures: 820, net: 2121 },
    { year: "2024", arrivals: 2131, departures: 644, net: 1487 }
];

// Visa groups data
const visaData = [
    { year: "2013-14", temporary: 253.16, australian: 72.18, permanent: 94.35, nz: 37.77, unknown: 7.21 },
    { year: "2014-15", temporary: 262.93, australian: 71.68, permanent: 91.49, nz: 31.75, unknown: 7.40 },
    { year: "2015-16", temporary: 281.76, australian: 75.80, permanent: 90.59, nz: 33.70, unknown: 7.43 },
    { year: "2016-17", temporary: 314.82, australian: 79.28, permanent: 106.20, nz: 32.33, unknown: 7.53 },
    { year: "2017-18", temporary: 327.30, australian: 77.16, permanent: 87.91, nz: 30.38, unknown: 4.77 },
    { year: "2018-19", temporary: 350.67, australian: 78.90, permanent: 85.39, nz: 30.54, unknown: 4.90 },
    { year: "2019-20", temporary: 313.66, australian: 96.41, permanent: 70.89, nz: 22.22, unknown: 3.67 },
    { year: "2020-21", temporary: 29.58, australian: 61.37, permanent: 36.95, nz: 16.95, unknown: 1.15 },
    { year: "2021-22", temporary: 266.21, australian: 62.48, permanent: 71.10, nz: 24.12, unknown: 2.82 },
    { year: "2022-23", temporary: 556.62, australian: 58.75, permanent: 80.39, nz: 42.66, unknown: 0.96 },
    { year: "2023-24", temporary: 464.78, australian: 60.04, permanent: 90.88, nz: 51.10, unknown: 0.00 }
];

// State color mapping - only for states with data
const stateColors = {
    "NSW": "#3498db",  // Blue
    "VIC": "#e74c3c",  // Red
    "QLD": "#f39c12",  // Orange
    "WA": "#9b59b6",   // Purple
    "SA": "#2ecc71"    // Green
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    renderCharts();
});

function initializeFilters() {
    // Add event listener to visa type filter
    document.getElementById('visaTypeFilter').addEventListener('change', updateVisaChart);
}

function updateVisaChart() {
    const selectedVisaType = document.getElementById('visaTypeFilter').value;
    renderVisaChart(selectedVisaType);
}

function renderVisaChart(selectedVisaType = "All") {
    let visaSpec;
    
    if (selectedVisaType === "All") {
        // Show stacked bar chart for all visa types
        visaSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "description": "Visa and citizenship groups over time",
            "width": "container",
            "height": 300,
            "data": {
                "values": visaData
            },
            "transform": [
                {"fold": ["temporary", "australian", "permanent", "nz", "unknown"], 
                 "as": ["Visa Type", "value"]}
            ],
            "mark": {
                "type": "bar",
                "cornerRadius": 2
            },
            "encoding": {
                "x": {
                    "field": "year",
                    "type": "nominal",
                    "title": "Year",
                    "axis": {"labelAngle": -45}
                },
                "y": {
                    "field": "value",
                    "type": "quantitative",
                    "title": "Number of Migrants (thousands)"
                },
                "color": {
                    "field": "Visa Type",
                    "type": "nominal",
                    "title": "Visa Type",
                    "scale": {
                        "domain": ["temporary", "australian", "permanent", "nz", "unknown"],
                        "range": ["#3498db", "#e74c3c", "#f39c12", "#9b59b6", "#95a5a6"]
                    },
                    "legend": {
                        "orient": "bottom",
                        "titleFontSize": 12,
                        "labelFontSize": 10
                    }
                },
                "tooltip": [
                    {"field": "year", "title": "Year"},
                    {"field": "Visa Type", "title": "Visa Type"},
                    {"field": "value", "title": "Migrants", "format": ","}
                ]
            },
            "config": {
                "view": {"stroke": "transparent"},
                "axis": {"grid": false}
            }
        };
    } else {
        // Show line chart for selected visa type
        const visaTypeLabels = {
            "temporary": "Temporary",
            "australian": "Australian Citizens", 
            "permanent": "Permanent",
            "nz": "New Zealand Citizens"
        };
        
        visaSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "description": `${visaTypeLabels[selectedVisaType]} migration over time`,
            "width": "container",
            "height": 300,
            "data": {
                "values": visaData
            },
            "mark": {
                "type": "line",
                "strokeWidth": 3,
                "point": true
            },
            "encoding": {
                "x": {
                    "field": "year",
                    "type": "nominal",
                    "title": "Year",
                    "axis": {"labelAngle": -45}
                },
                "y": {
                    "field": selectedVisaType,
                    "type": "quantitative",
                    "title": "Number of Migrants (thousands)"
                },
                "color": {
                    "value": selectedVisaType === "temporary" ? "#3498db" : 
                             selectedVisaType === "australian" ? "#e74c3c" :
                             selectedVisaType === "permanent" ? "#f39c12" : "#9b59b6"
                },
                "tooltip": [
                    {"field": "year", "title": "Year"},
                    {"field": selectedVisaType, "title": visaTypeLabels[selectedVisaType], "format": ","}
                ]
            },
            "config": {
                "view": {"stroke": "transparent"},
                "axis": {"grid": false}
            }
        };
    }

    vegaEmbed('#visaChart', visaSpec, {actions: false});
}

function renderCharts() {
    // Chart 1: World Map with Points - Further reduced bubble sizes and increased map size
    const mapSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "World map showing migration to Australia",
        "width": "container",
        "height": 450, // Increased from 400 to 450
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
                // Migration data points with further reduced size
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
                            "range": [20, 400]  // Further reduced from [30, 800]
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
                        {"field": "region", "type": "nominal", "title": "Region"}
                    ]
                }
            }
        ],
        "config": {
            "view": {"stroke": "transparent"},
            "background": "transparent"
        }
    };

    // Chart 2: Migration to Australian States with consistent colors - Removed states with no data from legend
    const stateSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Migration flow to Australian states",
        "width": "container",
        "height": 350,
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

    // Chart 3: Migration by Region
    const regionSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Migration by region",
        "width": "container",
        "height": 350,
        "data": {
            "values": migrationData
        },
        "mark": {
            "type": "arc",
            "innerRadius": 50,
            "tooltip": true
        },
        "encoding": {
            "theta": {
                "aggregate": "sum",
                "field": "migrants",
                "type": "quantitative",
                "title": "Migrants"
            },
            "color": {
                "field": "region",
                "type": "nominal",
                "title": "Region",
                "scale": {
                    "scheme": "category10"
                },
                "legend": {
                    "orient": "bottom",
                    "titleFontSize": 12,
                    "labelFontSize": 10
                }
            },
            "tooltip": [
                {"field": "region", "type": "nominal", "title": "Region"},
                {"aggregate": "sum", "field": "migrants", "title": "Migrants", "format": ","}
            ]
        },
        "config": {
            "view": {"stroke": "transparent"}
        }
    };

    // Chart 4: Top migration sources
    const countrySpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Top migration sources by country",
        "width": "container",
        "height": 350,
        "data": {
            "values": migrationData
        },
        "transform": [
            {"sort": [{"field": "migrants", "order": "descending"}]},
            {"window": [{"op": "row_number", "as": "rank"}]},
            {"filter": "datum.rank <= 10"}
        ],
        "mark": {
            "type": "bar",
            "cornerRadius": 4
        },
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
                "title": "Country",
                "scale": {
                    "scheme": "purples"
                },
                "legend": null
            },
            "tooltip": [
                {"field": "country", "title": "Country"},
                {"field": "migrants", "title": "Migrants", "format": ","},
                {"field": "region", "title": "Region"}
            ]
        },
        "config": {
            "view": {"stroke": "transparent"},
            "axis": {"grid": false}
        }
    };

    // Chart 5: Migration Trends Over Time (Line Chart) - Updated with legends, points and tooltips
    const trendSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Migration trends over time",
        "width": "container",
        "height": 350,
        "data": {
            "values": migrationTrends
        },
        "transform": [
            {"fold": ["arrivals", "departures", "net"], 
             "as": ["Migration Type", "value"]}
        ],
        "encoding": {
            "x": {
                "field": "year",
                "type": "nominal",
                "title": "Year",
                "axis": {"labelAngle": 0}
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
                {"field": "year", "title": "Year"},
                {"field": "Migration Type", "title": "Type"},
                {"field": "value", "title": "Migrants", "format": ","}
            ]
        },
        "layer": [
            {
                "mark": {
                    "type": "line",
                    "strokeWidth": 3
                }
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

    // Embed charts
    vegaEmbed('#worldMap', mapSpec, {actions: false}).catch(error => {
        console.error("Error embedding world map:", error);
        // Fallback visualization
        const fallbackSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "description": "Migration by country (fallback)",
            "width": "container",
            "height": 350,
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
    vegaEmbed('#regionChart', regionSpec, {actions: false});
    vegaEmbed('#countryChart', countrySpec, {actions: false});
    vegaEmbed('#trendChart', trendSpec, {actions: false});
    
    // Render visa chart with initial selection
    renderVisaChart("All");
}