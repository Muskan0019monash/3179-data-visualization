// script.js
// Updated: NT excluded from state chart; map bubbles styled like sample; education heatmap added

/* ============================
 Utilities
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

/* ============================
 Fallback data (embedded)
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

/* ============================
 Education heatmap data (from your sample)
 ============================ */
const educationData = [
 { visaStream: "Skilled", "2015-2019": 2.0, "2010-2014": 5.6, "Before 2010": 7.7, Total: 5.8 },
 { visaStream: "Family", "2015-2019": 1.2, "2010-2014": 4.1, "Before 2010": 4.4, Total: 3.4 },
 { visaStream: "Humanitarian", "2015-2019": 2.7, "2010-2014": 7.1, "Before 2010": 10.0, Total: 7.4 },
 { visaStream: "All permanent migrants", "2015-2019": 1.8, "2010-2014": 5.2, "Before 2010": 6.9, Total: 5.0 }
];

/* ============================
 Colors + state colors
 ============================ */
const top3Colors = ['#173a63','#7b2b2b','#1e5a3a']; // darker colors for top 3 countries
const otherColor = '#6c6f73'; // muted for others

const stateColors = {
 "NSW": cssVar('--nsw', '#3498db'),
 "VIC": cssVar('--vic', '#e74c3c'),
 "QLD": cssVar('--qld', '#f39c12'),
 "WA": cssVar('--wa', '#9b59b6'),
 "SA": cssVar('--sa', '#2ecc71')
};

/* ============================
 CSV loader (optional)
 ============================ */
async function fetchText(path) {
 const res = await fetch(path, {cache: 'no-cache'});
 if (!res.ok) throw new Error('fetch failed ' + res.status);
 return res.text();
}
function parseCSV(text) {
 const rows = text.trim().split(/\r?\n/);
 if (!rows.length) return [];
 const hdr = rows.shift().split(',').map(h=>h.trim());
 return rows.map(line => {
 const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
 return hdr.reduce((o,h,i)=> (o[h]= (cols[i] ? cols[i].replace(/^"|"$/g,'') : ''), o), {});
 });
}
async function tryLoadMigrationCSV() {
 try {
 const txt = await fetchText('migration.csv');
 const raw = parseCSV(txt);
 if (!raw.length) return;
 const norm = raw.map(r => {
 const lat = parseFloat(r.latitude || r.lat || r.Latitude || r.Lat || '');
 const lon = parseFloat(r.longitude || r.lon || r.Longitude || r.Long || '');
 return {
 country: r.country || r.Country || '',
 lat: isNaN(lat) ? null : lat,
 lon: isNaN(lon) ? null : lon,
 migrants: +(r.migrants || r.Migrants || 0),
 settlement_state: r.settlement_state || r.settlement || r.state || '',
 region: r.region || r.Region || 'Other',
 year: +(r.year || 2023)
 };
 }).filter(d=>d.country);
 if (norm.length) {
 migrationData = norm.map(d => ({
 country: d.country, lat: d.lat, lon: d.lon, migrants: d.migrants,
 settlement_state: d.settlement_state, region: d.region, year: d.year
 }));
 }
 } catch (e) {
 console.info('No migration.csv or parse failed — using embedded data.', e.message || e);
 }
}

/* ============================
 Map rendering (styled bubbles)
 ============================ */
let mapIsFullscreen = false;

// conservative but larger bubble sizes (area values)
// conservative but larger bubble sizes (area values)
function computeSizeRange(numPoints) {
 const vw = Math.max(document.documentElement.clientWidth || 900, 900);
 // base pixel area thresholds (increased by 40–50%)
 const baseMin = Math.max(16, Math.round(vw * 0.015)); // was 0.01 → bigger min
 const baseMax = Math.min(1600, Math.round(vw * 0.18)); // was 0.12 → bigger max

 // keep same divisor logic for overlap control
 const divisor = Math.max(1, Math.sqrt(Math.max(1, numPoints)) / 3);
 const minArea = baseMin;
 const maxArea = Math.round(baseMax / divisor);

 // multiplier to further enlarge visual bubble size
 const multiplier = 1.4; // was 1.1

 return [Math.round(minArea * multiplier), Math.round(maxArea * multiplier)];
}


function normalizePointsForMapWithColor() {
 // normalize and compute rank (by migrants) to pick colors for top 3
 const pts = (migrationData || []).map(d => {
 const lat = (d.lat !== undefined && d.lat !== null) ? +d.lat : (d.latitude !== undefined ? +d.latitude : NaN);
 const lon = (d.lon !== undefined && d.lon !== null) ? +d.lon : (d.longitude !== undefined ? +d.longitude : NaN);
 return {
 country: d.country || '',
 lat: isNaN(lat) ? null : lat,
 lon: isNaN(lon) ? null : lon,
 migrants: +(d.migrants || 0),
 region: d.region || 'Other',
 settlement_state: d.settlement_state || ''
 };
 }).filter(p => p.lat !== null && p.lon !== null);

 // assign rank by migrants
 const sorted = pts.slice().sort((a,b)=> b.migrants - a.migrants);
 const topCountries = sorted.slice(0,3).map(d=>d.country);

 // attach color attribute: top3 use top3Colors, others use muted purple
 return pts.map(p => {
 const idx = topCountries.indexOf(p.country);
 return Object.assign({}, p, {
 rank: idx >= 0 ? idx+1 : null,
 color: idx >= 0 ? top3Colors[idx] : '#7e6aa3' // muted purple for others
 });
 });
}

function renderMap() {
 const points = normalizePointsForMapWithColor();
 if (!points.length) {
 const empty = {
 "$schema":"https://vega.github.io/schema/vega-lite/v5.json",
 "description":"No geographic data available",
 "data":{"values":[{msg:"No geographic data available — check migration.csv or embedded dataset."}]},
 "mark":"text",
 "encoding":{"text":{"field":"msg"}}
 };
 vegaEmbed('#worldMap', empty, {actions:false}).catch(()=>{});
 return;
 }

 const sizeRange = computeSizeRange(points.length);

 // map with TopoJSON (attempt) but styled circles like sample
 const mapSpec = {
 "$schema":"https://vega.github.io/schema/vega-lite/v5.json",
 "description":"World map with styled bubbles (topo fallback to scatter).",
 "autosize":{"type":"fit","contains":"padding"},
 "width":"container",
 "height": mapIsFullscreen ? Math.max(420, window.innerHeight - 20) : 640,
 "layer":[
 {
 "data":{"url":"https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json","format":{"type":"topojson","feature":"countries"}},
 "projection":{"type":"equirectangular"},
 "mark":{"type":"geoshape","fill":"#f4f5f6","stroke":"#bfc6cc","strokeWidth":0.6}
 },
 {
 "data":{"values": points},
 "mark":{
 "type":"circle",
 "filled": true,
 "tooltip": true,
 "stroke": "#2b2b2b",
 "strokeWidth": 1.2,
 "opacity": 0.95
 },
 "encoding":{
 "longitude":{"field":"lon","type":"quantitative"},
 "latitude":{"field":"lat","type":"quantitative"},
 // size encodes migrants; range uses area-like values
 "size":{"field":"migrants","type":"quantitative","scale":{"range": sizeRange},"title":"Migrants"},
 // use the per-point color property (top3 colored, others muted)
 "color":{"field":"color","type":"nominal","scale": null},
 "tooltip":[
 {"field":"country","title":"Country"},
 {"field":"migrants","title":"Migrants","format":","},
 {"field":"region","title":"Region"},
 {"field":"settlement_state","title":"Settlement state"}
 ]
 }
 }
 ],
 "config":{"view":{"stroke":"transparent"}}
 };

 vegaEmbed('#worldMap', mapSpec, {actions:false, renderer:'svg'})
 .then(() => console.info('Map embedded (topo + bubbles).'))
 .catch(err => {
 console.warn('TopoJSON map failed; falling back to lon/lat scatter. Err:', err);
 // fallback scatter spec with same styling
 const scatter = {
 "$schema":"https://vega.github.io/schema/vega-lite/v5.json",
 "description":"Fallback lon/lat scatter with styled bubbles.",
 "autosize":{"type":"fit","contains":"padding"},
 "width":"container",
 "height": mapIsFullscreen ? Math.max(420, window.innerHeight - 20) : 640,
 "data":{"values": points},
 "mark":{
 "type":"circle",
 "filled": true,
 "tooltip": true,
 "stroke": "#2b2b2b",
 "strokeWidth": 1.2,
 "opacity": 0.95
 },
 "encoding":{
 "x":{"field":"lon","type":"quantitative","title":"Longitude"},
 "y":{"field":"lat","type":"quantitative","title":"Latitude"},
 "size":{"field":"migrants","type":"quantitative","scale":{"range": sizeRange},"title":"Migrants"},
 "color":{"field":"color","type":"nominal","scale": null},
 "tooltip":[
 {"field":"country","title":"Country"},
 {"field":"migrants","title":"Migrants","format":","},
 {"field":"region","title":"Region"},
 {"field":"settlement_state","title":"Settlement state"}
 ]
 },
 "config":{"view":{"stroke":"transparent"}}
 };
 vegaEmbed('#worldMap', scatter, {actions:false, renderer:'svg'}).catch(e => console.error('Scatter fallback embed failed', e));
 });
}

/* ============================
 State chart (exclude NT and empty/unknown)
 ============================ */
function renderStateChart() {
 const agg = {};
 migrationData.forEach(d => {
 const s = (d.settlement_state || '').toString().trim();
 if (!s) return;
 const lower = s.toLowerCase();
 // exclude NT explicitly and other placeholders
 if (lower === 'unknown' || lower === 'na' || lower === 'n/a' || lower === '-' || lower === 'nt') return;
 agg[s] = (agg[s] || 0) + (+d.migrants || 0);
 });

 const rows = Object.keys(agg)
 .filter(k => k && agg[k] > 0)
 .map(k => ({settlement_state: k, migrants: agg[k]}));

 const spec = {
 "$schema":"https://vega.github.io/schema/vega-lite/v5.json",
 "description":"Migration by Australian state (NT and empty states removed).",
 "autosize":{"type":"fit","contains":"padding"},
 "width":"container","height":360,
 "data":{"values": rows},
 "mark":{"type":"bar","cornerRadius":4},
 "encoding":{
 "x":{"field":"settlement_state","type":"nominal","title":"Australian State"},
 "y":{"field":"migrants","type":"quantitative","title":"Number of Migrants"},
 "color":{
 "field":"settlement_state",
 "type":"nominal",
 "scale":{"domain": Object.keys(stateColors), "range": Object.values(stateColors)},
 "legend": {"orient":"bottom"}
 },
 "tooltip":[{"field":"settlement_state","title":"State"},{"field":"migrants","title":"Migrants","format":","}]
 },
 "config":{"view":{"stroke":"transparent"}, "axis":{"grid":false}}
 };
 vegaEmbed('#stateChart', spec, {actions:false, renderer:'svg'}).catch(e => console.error('stateChart embed error', e));
}

/* ============================
 Region donut
 ============================ */
function renderRegionChart() {
 const agg = {};
 migrationData.forEach(d => {
 const r = d.region || 'Other';
 agg[r] = (agg[r] || 0) + (+d.migrants || 0);
 });
 const rows = Object.keys(agg).map(k => ({region:k, migrants: agg[k]}));
 const total = rows.reduce((s,r)=>s+r.migrants,0);

 const spec = {
 "$schema":"https://vega.github.io/schema/vega-lite/v5.json",
 "description":"Regional migration share (donut).",
 "autosize":{"type":"fit","contains":"padding"},
 "width":"container","height":360,
 "data":{"values":rows},
 "transform":[{"calculate": total === 0 ? "0" : "datum.migrants / " + total, "as":"share"}],
 "layer":[
 {
 "mark":{"type":"arc","innerRadius":60},
 "encoding":{
 "theta":{"field":"migrants","type":"quantitative"},
 "color":{"field":"region","type":"nominal","scale":{"scheme":"category10"}},
 "tooltip":[{"field":"region","title":"Region"},{"field":"migrants","title":"Migrants","format":","}]
 }
 },
 {
 "mark":{"type":"text","radius":90,"fontWeight":"600"},
 "encoding":{
 "text":{"signal":"format(datum.share, '.0%')"},
 "color":{"value":"#111"}
 }
 }
 ],
 "config":{"view":{"stroke":"transparent"}}
 };

 vegaEmbed('#regionChart', spec, {actions:false, renderer:'svg'}).catch(e=>console.error('regionChart embed error', e));
}

/* ============================
 Top source countries
 ============================ */
function renderCountryChart() {
 const sorted = (migrationData || []).slice().sort((a,b)=> (b.migrants||0) - (a.migrants||0)).slice(0,10);
 const rows = sorted.map((d,i)=>({
 country: d.country,
 migrants: +d.migrants,
 rank: i+1,
 color: i < 3 ? top3Colors[i] : otherColor
 }));

 const spec = {
 "$schema":"https://vega.github.io/schema/vega-lite/v5.json",
 "description":"Top 10 source countries; top 3 highlighted.",
 "autosize":{"type":"fit","contains":"padding"},
 "width":"container","height":360,
 "data":{"values": rows},
 "mark":{"type":"bar","cornerRadius":4},
 "encoding":{
 "x":{"field":"migrants","type":"quantitative","title":"Number of Migrants"},
 "y":{"field":"country","type":"nominal","sort":"-x"},
 "color":{"field":"color","type":"nominal","scale":null,"legend":null},
 "opacity":{"condition":{"test":"datum.rank <= 3","value":1},"value":0.55},
 "tooltip":[{"field":"country","title":"Country"},{"field":"migrants","title":"Migrants","format":","},{"field":"rank","title":"Rank"}]
 },
 "config":{"view":{"stroke":"transparent"}}
 };
 vegaEmbed('#countryChart', spec, {actions:false, renderer:'svg'}).catch(e=>console.error('countryChart embed error', e));
}

/* ============================
 Trends chart (single->bar toggle)
 ============================ */
function renderTrendChart() {
 const checkboxes = Array.from(document.querySelectorAll('input[name="trendSeries"]'));
 const selected = checkboxes.filter(c=>c.checked).map(c=>c.value);

 if (!selected.length) {
 const empty = {
 "$schema":"https://vega.github.io/schema/vega-lite/v5.json",
 "description":"No series selected",
 "data":{"values":[{msg:"Please select at least one series (arrivals/departures/net)."}]},
 "mark":"text",
 "encoding":{"text":{"field":"msg"}}
 };
 vegaEmbed('#trendChart', empty, {actions:false}).catch(()=>{});
 return;
 }

 if (selected.length === 1) {
 const metric = selected[0];
 const spec = {
 "$schema":"https://vega.github.io/schema/vega-lite/v5.json",
 "description":`Single-series bar for ${metric}`,
 "autosize":{"type":"fit","contains":"padding"},
 "width":"container","height":360,
 "data":{"values": migrationTrends},
 "mark":{"type":"bar","cornerRadius":4},
 "encoding":{
 "x":{"field":"year","type":"ordinal","title":"Year"},
 "y":{"field":metric,"type":"quantitative","title":"Number (thousands)"},
 "color":{"value": metric === 'arrivals' ? '#3498db' : metric === 'departures' ? '#e74c3c' : '#2ecc71'},
 "tooltip":[{"field":"year"},{"field":metric,"format":","}]
 },
 "config":{"view":{"stroke":"transparent"}}
 };
 vegaEmbed('#trendChart', spec, {actions:false, renderer:'svg'}).catch(e=>console.error('trendChart embed error', e));
 } else {
 const folded = [];
 migrationTrends.forEach(r => {
 ['arrivals','departures','net'].forEach(k => {
 if (selected.includes(k)) folded.push({year: r.year, type: k, value: r[k]});
 });
 });
 const spec = {
 "$schema":"https://vega.github.io/schema/vega-lite/v5.json",
 "description":"Multi-series trends (lines).",
 "autosize":{"type":"fit","contains":"padding"},
 "width":"container","height":360,
 "data":{"values": folded},
 "mark":{"type":"line","point":true,"strokeWidth":3},
 "encoding":{
 "x":{"field":"year","type":"ordinal","title":"Year"},
 "y":{"field":"value","type":"quantitative","title":"Number (thousands)"},
 "color":{"field":"type","type":"nominal","scale":{"domain":["arrivals","departures","net"],"range":["#3498db","#e74c3c","#2ecc71"]}},
 "tooltip":[{"field":"year"},{"field":"type"},{"field":"value","format":","}]
 },
 "config":{"view":{"stroke":"transparent"}}
 };
 vegaEmbed('#trendChart', spec, {actions:false, renderer:'svg'});
 }
}

/* ============================
 Visa chart
 ============================ */
function renderVisaChart(selectedVisaType = "All") {
 if (selectedVisaType === "All") {
 const spec = {
 "$schema":"https://vega.github.io/schema/vega-lite/v5.json",
 "description":"Visa & citizenship groups (stacked).",
 "autosize":{"type":"fit","contains":"padding"},
 "width":"container","height":360,
 "data":{"values": visaData},
 "transform":[{"fold":["temporary","australian","permanent","nz","unknown"], "as":["Visa Type","value"]}],
 "mark":{"type":"bar","cornerRadius":2},
 "encoding":{
 "x":{"field":"year","type":"ordinal","title":"Year","axis":{"labelAngle":-45}},
 "y":{"field":"value","type":"quantitative","title":"Number (thousands)"},
 "color":{"field":"Visa Type","type":"nominal","scale":{"domain":["temporary","australian","permanent","nz","unknown"],"range":["#3498db","#e74c3c","#f39c12","#9b59b6","#95a5a6"]}},
 "tooltip":[{"field":"year"},{"field":"Visa Type"},{"field":"value","format":","}]
 },
 "config":{"view":{"stroke":"transparent"}}
 };
 vegaEmbed('#visaChart', spec, {actions:false, renderer:'svg'}).catch(e=>console.error('visa chart embed error', e));
 } else {
 const labels = {temporary:"Temporary", australian:"Australian Citizens", permanent:"Permanent", nz:"New Zealand Citizens"};
 const spec = {
 "$schema":"https://vega.github.io/schema/vega-lite/v5.json",
 "description":"Visa single-series",
 "autosize":{"type":"fit","contains":"padding"},
 "width":"container","height":360,
 "data":{"values": visaData},
 "mark":{"type":"line","point":true,"strokeWidth":3},
 "encoding":{
 "x":{"field":"year","type":"ordinal","title":"Year","axis":{"labelAngle":-45}},
 "y":{"field":selectedVisaType,"type":"quantitative","title":"Number (thousands)"},
 "color":{"value": selectedVisaType === "temporary" ? "#3498db" : selectedVisaType === "australian" ? "#e74c3c" : selectedVisaType === "permanent" ? "#f39c12" : "#9b59b6"},
 "tooltip":[{"field":"year"},{"field":selectedVisaType,"title":labels[selectedVisaType],"format":","}]
 },
 "config":{"view":{"stroke":"transparent"}}
 };
 vegaEmbed('#visaChart', spec, {actions:false, renderer:'svg'}).catch(e=>console.error('visa chart embed error', e));
 }
}

/* ============================
 Education heatmap (your provided design)
 ============================ */
// Replace existing renderEducationChart() with this robust version
function renderEducationChart() {
 // 1) Heatmap spec (your original design)
 const spec = {
 "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
 "description": "Permanent migrants aged 15-64 years enrolled in education by visa stream and arrival period (2019)",
 "width": "container",
 "height": 320,
 "data": { "values": educationData },
 "mark": "rect",
 "encoding": {
 "x": {"field": "visaStream", "type": "nominal", "title": "Visa Stream"},
 "y": {"field": "category", "type": "nominal", "title": "Arrival Period", "sort": ["2015-2019", "2010-2014", "Before 2010", "Total"]},
 "color": {"field": "percentage", "type": "quantitative", "scale": {"scheme": "purples"}, "title": "% Enrolled"},
 "tooltip": [
 {"field": "visaStream", "title": "Visa Stream"},
 {"field": "category", "title": "Period"},
 {"field": "percentage", "title": "% Enrolled", "format": ".2f"}
 ]
 },
 "transform": [
 {"fold": ["2015-2019", "2010-2014", "Before 2010", "Total"], "as": ["category", "percentage"]}
 ],
 "config": { "view": {"stroke": "transparent"} }
 };

 // embed the heatmap
 vegaEmbed('#educationChart', spec, {actions: false, renderer: 'svg'})
 .catch(e => console.error('education heatmap embed error', e));

 // 2) Ensure control buttons exist (download + toggle)
 // If your HTML already contains elements with these IDs they will be reused.
 let controlsRow = document.getElementById('educationControlsRow');
 if (!controlsRow) {
 // create a small control row under the chart-container
 controlsRow = document.createElement('div');
 controlsRow.id = 'educationControlsRow';
 controlsRow.style.display = 'flex';
 controlsRow.style.gap = '8px';
 controlsRow.style.marginTop = '10px';
 // Try to insert the controls row into the DOM:
 // Prefer: insert after the chart-container inside the same chart-box
 const chartBox = document.querySelector('#educationChart')?.closest('.chart-box') || document.querySelector('#educationChart')?.parentNode;
 if (chartBox) {
 // find where to insert: place right after the chart-container element
 const chartContainerEl = document.getElementById('educationChart');
 if (chartContainerEl && chartContainerEl.nextSibling) chartBox.insertBefore(controlsRow, chartContainerEl.nextSibling);
 else chartBox.appendChild(controlsRow);
 } else {
 // fallback: append to body
 document.body.appendChild(controlsRow);
 }
 }

 // Download button
 let dlBtn = document.getElementById('downloadEducationCSV');
 if (!dlBtn) {
 dlBtn = document.createElement('button');
 dlBtn.id = 'downloadEducationCSV';
 dlBtn.textContent = 'Download table (CSV)';
 dlBtn.style.cursor = 'pointer';
 dlBtn.className = 'education-btn';
 // style lightly if you don't rely on CSS
 dlBtn.style.padding = '6px 10px';
 dlBtn.style.borderRadius = '6px';
 dlBtn.style.border = 'none';
 dlBtn.style.background = 'var(--primary)';
 dlBtn.style.color = '#fff';
 controlsRow.appendChild(dlBtn);
 } else {
 // ensure it is in the controls row
 if (dlBtn.parentNode !== controlsRow) controlsRow.appendChild(dlBtn);
 }

 // Toggle table button
 let toggleBtn = document.getElementById('showEducationTable');
 if (!toggleBtn) {
 toggleBtn = document.createElement('button');
 toggleBtn.id = 'showEducationTable';
 toggleBtn.textContent = 'Toggle table';
 toggleBtn.style.cursor = 'pointer';
 toggleBtn.className = 'education-btn';
 toggleBtn.style.padding = '6px 10px';
 toggleBtn.style.borderRadius = '6px';
 toggleBtn.style.border = '1px solid var(--border)';
 toggleBtn.style.background = '#fff';
 toggleBtn.style.color = 'var(--primary)';
 controlsRow.appendChild(toggleBtn);
 } else {
 if (toggleBtn.parentNode !== controlsRow) controlsRow.appendChild(toggleBtn);
 }

 // 3) Ensure the table container exists and populate it
 let tableContainer = document.getElementById('educationTableContainer');
 if (!tableContainer) {
 // create container (hidden by default)
 tableContainer = document.createElement('div');
 tableContainer.id = 'educationTableContainer';
 tableContainer.style.marginTop = '12px';
 tableContainer.style.display = 'none';
 tableContainer.style.overflowX = 'auto';
 tableContainer.style.background = 'var(--card-bg)';
 tableContainer.style.padding = '10px';
 tableContainer.style.borderRadius = '8px';
 // Insert after controlsRow if possible
 if (controlsRow && controlsRow.parentNode) {
 controlsRow.parentNode.insertBefore(tableContainer, controlsRow.nextSibling);
 } else {
 document.body.appendChild(tableContainer);
 }
 }

 // build table inside container
 function buildEducationTable() {
 tableContainer.innerHTML = '';
 const table = document.createElement('table');
 table.style.borderCollapse = 'collapse';
 table.style.width = '100%';
 table.style.maxWidth = '900px';
 table.style.fontSize = '0.95rem';

 const thead = document.createElement('thead');
 thead.innerHTML = `<tr>
 <th style="text-align:left;padding:8px 10px;border-bottom:1px solid var(--border)">Visa stream</th>
 <th style="text-align:right;padding:8px 10px;border-bottom:1px solid var(--border)">2015–2019 (%)</th>
 <th style="text-align:right;padding:8px 10px;border-bottom:1px solid var(--border)">2010–2014 (%)</th>
 <th style="text-align:right;padding:8px 10px;border-bottom:1px solid var(--border)">Before 2010 (%)</th>
 <th style="text-align:right;padding:8px 10px;border-bottom:1px solid var(--border)">Total (%)</th>
 </tr>`;
 table.appendChild(thead);

 const tbody = document.createElement('tbody');
 educationData.forEach(r => {
 const tr = document.createElement('tr');
 tr.innerHTML = `<td style="padding:8px 10px;border-top:1px solid var(--border)">${r.visaStream}</td>
 <td style="text-align:right;padding:8px 10px;border-top:1px solid var(--border)">${r['2015-2019']}</td>
 <td style="text-align:right;padding:8px 10px;border-top:1px solid var(--border)">${r['2010-2014']}</td>
 <td style="text-align:right;padding:8px 10px;border-top:1px solid var(--border)">${r['Before 2010']}</td>
 <td style="text-align:right;padding:8px 10px;border-top:1px solid var(--border)">${r.Total}</td>`;
 tbody.appendChild(tr);
 });
 table.appendChild(tbody);
 tableContainer.appendChild(table);
 }

 buildEducationTable();

 // 4) Wire up download button (creates CSV from educationData)
 dlBtn.onclick = () => {
 const headers = ['Visa stream','2015-2019 (%)','2010-2014 (%)','Before 2010 (%)','Total (%)'];
 const rows = educationData.map(r => [
 `"${r.visaStream.replace(/"/g,'""')}"`,
 r['2015-2019'],
 r['2010-2014'],
 r['Before 2010'],
 r.Total
 ].join(','));
 const csv = [headers.join(',')].concat(rows).join('\n');
 downloadText('education_2019.csv', csv);
 };

 // 5) Wire up toggle button
 // keep visible state in attribute data-visible for simplicity
 if (!toggleBtn.getAttribute('data-visible')) toggleBtn.setAttribute('data-visible', 'false');

 toggleBtn.onclick = () => {
 const isVisible = toggleBtn.getAttribute('data-visible') === 'true';
 if (isVisible) {
 tableContainer.style.display = 'none';
 toggleBtn.setAttribute('data-visible', 'false');
 toggleBtn.textContent = 'Toggle table';
 } else {
 tableContainer.style.display = 'block';
 toggleBtn.setAttribute('data-visible', 'true');
 toggleBtn.textContent = 'Hide table';
 // scroll into view slightly so user sees table on small screens
 tableContainer.scrollIntoView({behavior:'smooth', block:'center'});
 }
 };

 // Ensure initial state is hidden
 tableContainer.style.display = 'none';
 toggleBtn.setAttribute('data-visible', 'false');
 toggleBtn.textContent = 'Toggle table';
}


/* ============================
 Binding + init
 ============================ */
function bindUI() {
 Array.from(document.querySelectorAll('input[name="trendSeries"]')).forEach(ch => ch.addEventListener('change', renderTrendChart));
 const vs = document.getElementById('visaTypeFilter');
 if (vs) vs.addEventListener('change', ()=> renderVisaChart(vs.value));
 const mapToggle = document.getElementById('mapFullscreenToggle');
 if (mapToggle) {
 mapToggle.addEventListener('change', e => {
 mapIsFullscreen = e.target.checked;
 const box = document.getElementById('mapBox');
 if (mapIsFullscreen) {
 box.classList.add('fullscreen');
 document.documentElement.classList.add('map-fullscreen-mode');
 } else {
 box.classList.remove('fullscreen');
 document.documentElement.classList.remove('map-fullscreen-mode');
 }
 renderMap();
 });
 }
}

async function initialize() {
 await tryLoadMigrationCSV(); // optional CSV override if present
 bindUI();

 renderMap();
 renderStateChart();
 renderRegionChart();
 renderCountryChart();
 renderTrendChart();
 renderVisaChart('All');
 renderEducationChart();

 let t;
 window.addEventListener('resize', () => {
 clearTimeout(t);
 t = setTimeout(() => {
 renderMap();
 renderRegionChart();
 renderCountryChart();
 renderStateChart();
 renderTrendChart();
 renderVisaChart(document.getElementById('visaTypeFilter') ? document.getElementById('visaTypeFilter').value : 'All');
 renderEducationChart();
 }, 220);
 });
}

document.addEventListener('DOMContentLoaded', initialize);