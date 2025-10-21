// script.js - Updated with blue theme and improved visualizations

/* ============================
 Utilities & Setup
 ============================ */
function cssVar(name, fallback = '') {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return v ? v.trim() : fallback;
}

function downloadText(filename, content) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

// Common Vega-Lite config for light theme
const vegaLightThemeConfig = {
    background: "transparent",
    view: { stroke: "transparent" },
    axis: {
        domainColor: "#cbd5e1",
        gridColor: "#f1f5f9",
        labelColor: "#64748b",
        titleColor: "#1e293b",
        labelFont: cssVar('--font-sans'),
        titleFont: cssVar('--font-sans'),
        labelFontSize: 12,
        titleFontSize: 14,
        titleFontWeight: 600,
        labelAngle: 0
    },
    legend: {
        labelColor: "#64748b",
        titleColor: "#1e293b",
        labelFont: cssVar('--font-sans'),
        titleFont: cssVar('--font-sans'),
    },
    title: {
        color: "#1e293b",
        font: cssVar('--font-sans'),
        fontSize: 16,
        fontWeight: 600
    }
};

/* ============================
 Embedded Data
 ============================ */
let migrationData = [
 {country:"United Kingdom",latitude:51.5072,longitude:-0.1276,migrants:1000000,settlement_state:"NSW",region:"Europe",year:2023},
 {country:"China",latitude:39.9042,longitude:116.4074,migrants:680000,settlement_state:"VIC",region:"Asia",year:2023},
 {country:"India",latitude:28.6139,longitude:77.2090,migrants:720000,settlement_state:"NSW",region:"Asia",year:2023},
 {country:"Philippines",latitude:12.8797,longitude:121.7740,migrants:320000,settlement_state:"WA",region:"Asia",year:2023},
 {country:"Vietnam",latitude:21.0285,longitude:105.8544,migrants:300000,settlement_state:"SA",region:"Asia",year:2023},
 {country:"Sri Lanka",latitude:7.8731,longitude:80.7718,migrants:180000,settlement_state:"NSW",region:"Asia",year:2023},
 {country:"Malaysia",latitude:3.1390,longitude:101.6869,migrants:150000,settlement_state:"VIC",region:"Asia",year:2023},
 {country:"Nepal",latitude:28.3949,longitude:85.3240,migrants:130000,settlement_state:"NSW",region:"Asia",year:2023},
 {country:"South Africa",latitude:-26.2041,longitude:28.0473,migrants:120000,settlement_state:"QLD",region:"Africa",year:2023},
 {country:"Pakistan",latitude:30.3753,longitude:69.3451,migrants:110000,settlement_state:"NSW",region:"Asia",year:2023},
 {country:"Italy",latitude:41.9028,longitude:12.4964,migrants:95000,settlement_state:"WA",region:"Europe",year:2023},
 {country:"Greece",latitude:39.0742,longitude:21.8243,migrants:90000,settlement_state:"SA",region:"Europe",year:2023},
 {country:"Indonesia",latitude:-0.7893,longitude:113.9213,migrants:85000,settlement_state:"NT",region:"Asia",year:2023},
 {country:"Bangladesh",latitude:23.6850,longitude:90.3563,migrants:80000,settlement_state:"NSW",region:"Asia",year:2023},
 {country:"Ireland",latitude:53.4129,longitude:-8.2439,migrants:75000,settlement_state:"QLD",region:"Europe",year:2023},
 {country:"Singapore",latitude:1.3521,longitude:103.8198,migrants:70000,settlement_state:"VIC",region:"Asia",year:2023},
 {country:"Hong Kong",latitude:22.3193,longitude:114.1694,migrants:65000,settlement_state:"NSW",region:"Asia",year:2023},
 {country:"United States",latitude:37.0902,longitude:-95.7129,migrants:62000,settlement_state:"WA",region:"North America",year:2023},
 {country:"Lebanon",latitude:33.8547,longitude:35.8623,migrants:60000,settlement_state:"NSW",region:"Middle East",year:2023},
 {country:"Fiji",latitude:-17.7134,longitude:178.065,migrants:55000,settlement_state:"QLD",region:"Oceania",year:2023}
];
const migrationTrends = [
 { year: "2014", arrivals: 1844, departures: 1109, net: 735 }, { year: "2015", arrivals: 1869, departures: 1132, net: 737 }, { year: "2016", arrivals: 2003, departures: 1124, net: 879 }, { year: "2017", arrivals: 2136, departures: 1124, net: 1012 }, { year: "2018", arrivals: 2120, departures: 1149, net: 971 }, { year: "2019", arrivals: 2261, departures: 1279, net: 982 }, { year: "2020", arrivals: 1722, departures: 1220, net: 502 }, { year: "2021", arrivals: 637, departures: 866, net: -229 }, { year: "2022", arrivals: 2188, departures: 882, net: 1306 }, { year: "2023", arrivals: 2941, departures: 820, net: 2121 }, { year: "2024", arrivals: 2131, departures: 644, net: 1487 }
];
const visaData = [
 { year: "2013-14", temporary: 253.16, australian: 72.18, permanent: 94.35, nz: 37.77, unknown: 7.21 }, { year: "2014-15", temporary: 262.93, australian: 71.68, permanent: 91.49, nz: 31.75, unknown: 7.40 }, { year: "2015-16", temporary: 281.76, australian: 75.80, permanent: 90.59, nz: 33.70, unknown: 7.43 }, { year: "2016-17", temporary: 314.82, australian: 79.28, permanent: 106.20, nz: 32.33, unknown: 7.53 }, { year: "2017-18", temporary: 327.30, australian: 77.16, permanent: 87.91, nz: 30.38, unknown: 4.77 }, { year: "2018-19", temporary: 350.67, australian: 78.90, permanent: 85.39, nz: 30.54, unknown: 4.90 }, { year: "2019-20", temporary: 313.66, australian: 96.41, permanent: 70.89, nz: 22.22, unknown: 3.67 }, { year: "2020-21", temporary: 29.58, australian: 61.37, permanent: 36.95, nz: 16.95, unknown: 1.15 }, { year: "2021-22", temporary: 266.21, australian: 62.48, permanent: 71.10, nz: 24.12, unknown: 2.82 }, { year: "2022-23", temporary: 556.62, australian: 58.75, permanent: 80.39, nz: 42.66, unknown: 0.96 }, { year: "2023-24", temporary: 464.78, australian: 60.04, permanent: 90.88, nz: 51.10, unknown: 0.00 }
];
const educationData = [
 { visaStream: "Skilled", "2015-2019": 2.0, "2010-2014": 5.6, "Before 2010": 7.7, Total: 5.8 }, { visaStream: "Family", "2015-2019": 1.2, "2010-2014": 4.1, "Before 2010": 4.4, Total: 3.4 }, { visaStream: "Humanitarian", "2015-2019": 2.7, "2010-2014": 7.1, "Before 2010": 10.0, Total: 7.4 }, { visaStream: "All permanent migrants", "2015-2019": 1.8, "2010-2014": 5.2, "Before 2010": 6.9, Total: 5.0 }
];

/* ============================
 Theming & Colors - Region-based mapping
 ============================ */
const regionColorMap = {
    "Asia": cssVar('--region-asia'),
    "Europe": cssVar('--region-europe'),
    "Africa": cssVar('--region-africa'),
    "Oceania": cssVar('--region-oceania'),
    "North America": cssVar('--region-north-america'),
    "Middle East": cssVar('--region-middle-east'),
    "South America": cssVar('--region-south-america')
};

const stateColors = {
 "NSW": cssVar('--nsw'), "VIC": cssVar('--vic'), "QLD": cssVar('--qld'), "WA": cssVar('--wa'), "SA": cssVar('--sa')
};

const trendColors = {
    arrivals: cssVar('--secondary'),
    departures: cssVar('--accent'),
    net: cssVar('--sa')
};

const visaColors = {
    domain: ["temporary", "australian", "permanent", "nz", "unknown"],
    range: [cssVar('--secondary'), cssVar('--accent'), cssVar('--qld'), cssVar('--primary'), '#94a3b8']
};

/* ============================
 Map Rendering with country borders
 ============================ */
let mapIsFullscreen = false;

function computeSizeRange(numPoints) {
    const vw = Math.max(document.documentElement.clientWidth || 900, 900);
    const baseMin = Math.max(20, Math.round(vw * 0.02));
    const baseMax = Math.min(2000, Math.round(vw * 0.2));
    const divisor = Math.max(1, Math.sqrt(Math.max(1, numPoints)) / 3);
    return [baseMin, Math.round(baseMax / divisor)];
}

function normalizePointsForMapWithColor() {
    const pts = (migrationData || []).map(d => ({
        country: d.country || '',
        lat: +d.latitude,
        lon: +d.longitude,
        migrants: +d.migrants || 0,
        region: d.region || 'Other',
        settlement_state: d.settlement_state || ''
    })).filter(p => p.lat && p.lon);

    // Assign colors based on region
    return pts.map(p => ({
        ...p,
        color: regionColorMap[p.region] || '#94a3b8'
    }));
}

function renderMap() {
    const points = normalizePointsForMapWithColor();
    if (!points.length) return;

    const sizeRange = computeSizeRange(points.length);

    const mapSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "World map with country borders and migration bubbles.",
        "width": "container",
        "height": mapIsFullscreen ? Math.max(420, window.innerHeight - 150) : 550,
        "layer": [
            {
                "data": { "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json", "format": { "type": "topojson", "feature": "countries" } },
                "projection": { "type": "equirectangular" },
                "mark": { "type": "geoshape", "fill": "#e0e7ff", "stroke": "#1e3a8a", "strokeWidth": 1.2 }
            },
            {
                "data": { "values": points },
                "mark": { "type": "circle", "filled": true, "tooltip": true, "stroke": "#1e293b", "strokeWidth": 1.5, "opacity": 0.85 },
                "encoding": {
                    "longitude": { "field": "lon", "type": "quantitative" },
                    "latitude": { "field": "lat", "type": "quantitative" },
                    "size": { "field": "migrants", "type": "quantitative", "scale": { "range": sizeRange }, "title": "Migrants" },
                    "color": { "field": "color", "type": "nominal", "scale": null, "legend": null },
                    "tooltip": [
                        { "field": "country", "title": "Country" },
                        { "field": "migrants", "title": "Migrants", "format": "," },
                        { "field": "region", "title": "Region" }
                    ]
                }
            }
        ],
        "config": vegaLightThemeConfig
    };
    vegaEmbed('#worldMap', mapSpec, { actions: false, renderer: 'svg' }).catch(console.error);
}

/* ============================
 Chart Renderers
 ============================ */
function renderStateChart() {
    const agg = {};
    migrationData.forEach(d => {
        const s = (d.settlement_state || '').trim();
        if (!s || s.toLowerCase() === 'nt' || s.toLowerCase() === 'unknown') return;
        agg[s] = (agg[s] || 0) + (+d.migrants || 0);
    });
    const rows = Object.keys(agg).map(k => ({ settlement_state: k, migrants: agg[k] }));

    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": "container", "height": 320,
        "data": { "values": rows },
        "mark": { "type": "bar", "cornerRadius": 4, "tooltip": true },
        "encoding": {
            "x": { "field": "settlement_state", "type": "nominal", "title": "Australian State", "sort": "-y" },
            "y": { "field": "migrants", "type": "quantitative", "title": "Number of Migrants" },
            "color": {
                "field": "settlement_state", "type": "nominal", "title": "State",
                "scale": { "domain": Object.keys(stateColors), "range": Object.values(stateColors) }
            }
        },
        "config": vegaLightThemeConfig
    };
    vegaEmbed('#stateChart', spec, { actions: false, renderer: 'svg' }).catch(console.error);
}

function renderRegionChart() {
    const agg = {};
    migrationData.forEach(d => {
        const r = d.region || 'Other';
        agg[r] = (agg[r] || 0) + (+d.migrants || 0);
    });
    const rows = Object.keys(agg).map(k => ({ region: k, migrants: agg[k] }));

    // Create consistent color mapping
    const regionDomain = rows.map(r => r.region);
    const regionRange = regionDomain.map(r => regionColorMap[r] || '#94a3b8');

    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": "container", "height": 320,
        "data": { "values": rows },
        "mark": { "type": "arc", "innerRadius": 70, "tooltip": true, "stroke": "#ffffff", "strokeWidth": 2 },
        "encoding": {
            "theta": { "field": "migrants", "type": "quantitative", "stack": true },
            "color": { 
                "field": "region", 
                "type": "nominal", 
                "scale": { "domain": regionDomain, "range": regionRange },
                "title": "Region" 
            },
            "tooltip": [
                { "field": "region", "title": "Region" },
                { "field": "migrants", "title": "Migrants", "format": "," }
            ]
        },
        "config": vegaLightThemeConfig
    };
    vegaEmbed('#regionChart', spec, { actions: false, renderer: 'svg' }).catch(console.error);
}

function renderCountryChart() {
    const sorted = (migrationData || []).slice().sort((a, b) => (b.migrants || 0) - (a.migrants || 0)).slice(0, 10);
    
    // Map each country to its region color with variations for same-region countries
    const rows = sorted.map((d, i) => {
        const baseColor = regionColorMap[d.region] || '#94a3b8';
        // Create shade variations for countries from the same region
        let color = baseColor;
        
        // Count how many previous countries share the same region
        const sameRegionIndex = sorted.slice(0, i).filter(prev => prev.region === d.region).length;
        
        // Apply lightness variation for same-region countries
        if (sameRegionIndex > 0) {
            // Convert hex to RGB, adjust lightness, convert back
            const hex = baseColor.replace('#', '');
            let r = parseInt(hex.substr(0, 2), 16);
            let g = parseInt(hex.substr(2, 2), 16);
            let b = parseInt(hex.substr(4, 2), 16);
            
            // Lighten by 15% for each duplicate
            const factor = 1 + (sameRegionIndex * 0.15);
            r = Math.min(255, Math.round(r * factor));
            g = Math.min(255, Math.round(g * factor));
            b = Math.min(255, Math.round(b * factor));
            
            color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
        
        return {
            country: d.country,
            migrants: +d.migrants,
            rank: i + 1,
            region: d.region,
            color: color
        };
    });

    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": "container", "height": 380,
        "data": { "values": rows },
        "mark": { "type": "bar", "cornerRadiusEnd": 4, "tooltip": true },
        "encoding": {
            "y": { "field": "country", "type": "nominal", "sort": "-x", "title": null },
            "x": { "field": "migrants", "type": "quantitative", "title": "Number of Migrants" },
            "color": { "field": "color", "type": "nominal", "scale": null, "legend": null },
            "tooltip": [
                { "field": "country", "title": "Country" },
                { "field": "migrants", "title": "Migrants", "format": "," },
                { "field": "region", "title": "Region" },
                { "field": "rank", "title": "Rank" }
            ]
        },
        "config": vegaLightThemeConfig
    };
    vegaEmbed('#countryChart', spec, { actions: false, renderer: 'svg' }).catch(console.error);
}

function renderTrendChart() {
    const selected = Array.from(document.querySelectorAll('input[name="trendSeries"]:checked')).map(c => c.value);
    if (!selected.length) {
        vegaEmbed('#trendChart', { data: { values: [] } }).catch(() => {});
        return;
    }

    let spec;
    if (selected.length === 1) {
        const metric = selected[0];
        spec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "width": "container", "height": 320,
            "data": { "values": migrationTrends },
            "mark": { "type": "bar", "cornerRadius": 4, "tooltip": true },
            "encoding": {
                "x": { "field": "year", "type": "ordinal", "title": "Year" },
                "y": { "field": metric, "type": "quantitative", "title": "Number (thousands)" },
                "color": { "value": trendColors[metric] }
            }
        };
    } else {
        const folded = migrationTrends.flatMap(r => selected.map(k => ({ year: r.year, type: k, value: r[k] })));
        spec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "width": "container", "height": 320,
            "data": { "values": folded },
            "mark": { "type": "line", "point": true, "strokeWidth": 2.5, "tooltip": true },
            "encoding": {
                "x": { "field": "year", "type": "ordinal", "title": "Year" },
                "y": { "field": "value", "type": "quantitative", "title": "Number (thousands)" },
                "color": { "field": "type", "type": "nominal", "title": "Metric", "scale": { "domain": Object.keys(trendColors), "range": Object.values(trendColors) } }
            }
        };
    }
    spec.config = vegaLightThemeConfig;
    vegaEmbed('#trendChart', spec, { actions: false, renderer: 'svg' }).catch(console.error);
}

function renderVisaChart(selectedVisaType = "All") {
    let spec;
    if (selectedVisaType === "All") {
        spec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "width": "container", "height": 320,
            "data": { "values": visaData },
            "transform": [{ "fold": visaColors.domain, "as": ["Visa Type", "value"] }],
            "mark": { "type": "area", "opacity": 0.8, "line": true, "point": false, "tooltip": true },
            "encoding": {
                "x": { "field": "year", "type": "ordinal", "title": "Year", "axis": { "labelAngle": -45 } },
                "y": { "field": "value", "type": "quantitative", "title": "Number (thousands)", "stack": "normalize" },
                "color": { "field": "Visa Type", "type": "nominal", "scale": visaColors }
            }
        };
    } else {
        spec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "width": "container", "height": 320,
            "data": { "values": visaData },
            "mark": { "type": "line", "point": { "filled": false, "fill": "#ffffff" }, "strokeWidth": 3, "tooltip": true },
            "encoding": {
                "x": { "field": "year", "type": "ordinal", "title": "Year", "axis": { "labelAngle": -45 } },
                "y": { "field": selectedVisaType, "type": "quantitative", "title": "Number (thousands)" },
                "color": { "value": visaColors.range[visaColors.domain.indexOf(selectedVisaType)] || cssVar('--primary') }
            }
        };
    }
    spec.config = vegaLightThemeConfig;
    vegaEmbed('#visaChart', spec, { actions: false, renderer: 'svg' }).catch(console.error);
}

function renderEducationChart() {
    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": "container", "height": 280,
        "data": { "values": educationData },
        "transform": [{ "fold": ["2015-2019", "2010-2014", "Before 2010", "Total"], "as": ["category", "percentage"] }],
        "mark": { "type": "rect", "tooltip": true, "stroke": "#ffffff", "strokeWidth": 2 },
        "encoding": {
            "x": { "field": "visaStream", "type": "nominal", "title": "Visa Stream" },
            "y": { "field": "category", "type": "nominal", "title": "Arrival Period", "sort": ["2015-2019", "2010-2014", "Before 2010", "Total"] },
            "color": { 
                "field": "percentage", 
                "type": "quantitative", 
                "scale": { "scheme": "oranges" }, 
                "title": "% Enrolled" 
            },
            "tooltip": [
                { "field": "visaStream", "title": "Visa Stream" },
                { "field": "category", "title": "Period" },
                { "field": "percentage", "title": "% Enrolled", "format": ".1f" }
            ]
        },
        "config": vegaLightThemeConfig
    };
    vegaEmbed('#educationChart', spec, { actions: false, renderer: 'svg' }).catch(console.error);
    setupEducationTable();
}

function setupEducationTable() {
    const tableContainer = document.getElementById('educationTableContainer');
    const dlBtn = document.getElementById('downloadEducationCSV');
    const toggleBtn = document.getElementById('showEducationTable');
    if (!tableContainer || !dlBtn || !toggleBtn) return;

    let tableHTML = `<table id="educationTable"><thead><tr>
        <th>Visa stream</th><th>2015–2019 (%)</th><th>2010–2014 (%)</th>
        <th>Before 2010 (%)</th><th>Total (%)</th>
        </tr></thead><tbody>`;
    educationData.forEach(r => {
        tableHTML += `<tr><td>${r.visaStream}</td><td>${r['2015-2019']}</td><td>${r['2010-2014']}</td><td>${r['Before 2010']}</td><td>${r.Total}</td></tr>`;
    });
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;

    dlBtn.onclick = () => {
        const headers = ['Visa stream', '2015-2019 (%)', '2010-2014 (%)', 'Before 2010 (%)', 'Total (%)'];
        const rows = educationData.map(r => [`"${r.visaStream}"`, r['2015-2019'], r['2010-2014'], r['Before 2010'], r.Total].join(','));
        const csv = [headers.join(',')].concat(rows).join('\n');
        downloadText('education_2019.csv', csv);
    };

    toggleBtn.onclick = () => {
        const isVisible = tableContainer.style.display === 'block';
        tableContainer.style.display = isVisible ? 'none' : 'block';
        toggleBtn.textContent = isVisible ? 'View as table' : 'Hide table';
    };
}

/* ============================
 Initializer & Event Binding
 ============================ */
function bindUI() {
    document.querySelectorAll('input[name="trendSeries"]').forEach(ch => ch.addEventListener('change', renderTrendChart));
    document.getElementById('visaTypeFilter')?.addEventListener('change', (e) => renderVisaChart(e.target.value));
    document.getElementById('mapFullscreenToggle')?.addEventListener('change', e => {
        mapIsFullscreen = e.target.checked;
        renderMap();
    });
}

function renderAllCharts() {
    renderMap();
    renderStateChart();
    renderRegionChart();
    renderCountryChart();
    renderTrendChart();
    renderVisaChart('All');
    renderEducationChart();
}

async function initialize() {
    bindUI();
    renderAllCharts();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(renderAllCharts, 250);
    });
}

document.addEventListener('DOMContentLoaded', initialize);