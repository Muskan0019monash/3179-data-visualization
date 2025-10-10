// main.js - No external libs required (uses fetch + vega-embed)

// Path to CSV (place migration.csv next to these files)
const CSV_PATH = "migration.csv";

// Utility: simple CSV parser (assumes no quoted commas)
function parseCSV(text) {
  const rows = text.trim().split(/\r?\n/).filter(r => r.trim() !== "");
  if (rows.length === 0) return [];
  const headers = rows[0].split(",").map(h => h.trim());
  return rows.slice(1).map(line => {
    const cols = line.split(",").map(c => c.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = cols[i] === undefined ? "" : cols[i]);
    return obj;
  });
}

// Normalize fields from your CSV to expected names (lowercase)
function normalizeRows(rows) {
  return rows.map(r => {
    return {
      country: (r.country || r.Country || "").trim(),
      settlement_state: (r.settlement_state || r.settlement_state || r.settlement_state || r.settlement_state) || r.settlement_state || r.settlement_state || (r.settlement_state) || (r.settlementState) || r.settlement_state,
      // fallback fields (CSV provided uses settlement_state)
      migrants: Number(r.migrants || r.Migrants || 0),
      age_group: (r.age_group || r.ageGroup || r.AgeGroup || "").trim(),
      gender_ratio: Number(r.gender_ratio || r.genderRatio || r.GenderRatio || 0),
      education_level: (r.education_level || r.educationLevel || "").trim(),
      region: (r.region || "").trim(),
      lon: Number(r.lon || 0),
      lat: Number(r.lat || 0),
      year: r.year ? Number(r.year) : r.Year ? Number(r.Year) : null
    };
  });
}

// When CSV loaded -> build UI & charts
async function init() {
  try {
    const resp = await fetch(CSV_PATH);
    if (!resp.ok) throw new Error("Failed to fetch " + CSV_PATH + " — check file location and server");
    const text = await resp.text();
    const raw = parseCSV(text);
    const data = normalizeRows(raw);

    // Build a gender-split dataset for the stacked demographics chart
    // For each row create two rows: {gender: 'Female', count: migrants * gender_ratio} and Male
    const splitRows = [];
    data.forEach(r => {
      const migrants = Number(r.migrants) || 0;
      const gr = Number(r.gender_ratio) || 0;
      const female = Math.round(migrants * gr);
      const male = migrants - female;
      // push female & male if > 0
      splitRows.push({
        country: r.country, age_group: r.age_group || "Unknown", gender: "Female",
        count: female, education_level: r.education_level || "Unknown", settlement_state: r.settlement_state || "Unknown"
      });
      splitRows.push({
        country: r.country, age_group: r.age_group || "Unknown", gender: "Male",
        count: male, education_level: r.education_level || "Unknown", settlement_state: r.settlement_state || "Unknown"
      });
    });

    // Populate top stats and country dropdown
    const countries = Array.from(new Set(data.map(d => d.country).filter(Boolean))).sort();
    const totalCountries = countries.length;
    const totalMigrants = data.reduce((s, r) => s + (Number(r.migrants) || 0), 0);

    document.getElementById("countryCount").innerText = totalCountries;
    document.getElementById("populationCount").innerText = totalMigrants.toLocaleString();

    const select = document.getElementById("countrySelect");
    countries.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    });

    // initial render
    renderAndWire(data, splitRows, "All");

    // on change
    select.addEventListener("change", (e) => {
      renderAndWire(data, splitRows, e.target.value);
    });

  } catch (err) {
    console.error(err);
    alert("Error initializing dashboard: " + err.message);
  }
}

// Render charts and the state breakdown table for the selected country
async function renderAndWire(originalRows, splitRows, selectedCountry) {
  // Filter data
  const filteredOriginal = selectedCountry === "All" ? originalRows : originalRows.filter(d => d.country === selectedCountry);
  const filteredSplit = selectedCountry === "All" ? splitRows : splitRows.filter(d => d.country === selectedCountry);

  // --- Demographics (stacked by gender) ---
  const demographicSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Stacked migrants by age group & gender",
    width: "container",
    height: 480,
    data: { values: filteredSplit },
    mark: { type: "bar", tooltip: true },
    encoding: {
      x: { field: "age_group", type: "nominal", title: "Age Group", axis: { labelAngle: 0 } },
      y: { aggregate: "sum", field: "count", type: "quantitative", title: "Migrants" },
      color: {
        field: "gender",
        type: "nominal",
        title: "Gender",
        scale: { domain: ["Female", "Male"], range: ["#e6550d", "#3182bd"] }
      },
      tooltip: [
        { field: "age_group", title: "Age Group" },
        { field: "gender", title: "Gender" },
        { aggregate: "sum", field: "count", title: "Migrants", format: "," }
      ]
    },
    config: { view: { stroke: "transparent" } }
  };

  // --- Flow to Australian states (aggregated bar chart) ---
  // use original filtered rows and aggregate in Vega-Lite via encodings
  const flowSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Migration to Australian states (aggregated)",
    width: "container",
    height: 420,
    data: { values: filteredOriginal },
    mark: { type: "bar", tooltip: true },
    encoding: {
      x: { field: "settlement_state", type: "nominal", title: "Australian State", axis: { labelAngle: 0 } },
      y: { aggregate: "sum", field: "migrants", type: "quantitative", title: "Migrants" },
      color: { value: "#6baed6" }, // single color — no legend
      tooltip: [
        { field: "settlement_state", title: "State" },
        { aggregate: "sum", field: "migrants", title: "Migrants", format: "," }
      ]
    },
    config: { view: { stroke: "transparent" } }
  };

  // Embed charts (replace existing)
  try {
    await vegaEmbed("#demographicChart", demographicSpec, { actions: false, theme: "quartz" });
    await vegaEmbed("#flowChart", flowSpec, { actions: false, theme: "quartz" });
  } catch (err) {
    console.error("vegaEmbed error:", err);
    document.getElementById("demographicChart").innerHTML = "<div style='padding:12px;color:#b00020'>Chart error — see console</div>";
    document.getElementById("flowChart").innerHTML = "<div style='padding:12px;color:#b00020'>Chart error — see console</div>";
  }

  // Build state breakdown table (aggregated)
  const stateAgg = {};
  filteredOriginal.forEach(r => {
    const s = (r.settlement_state || "Unknown");
    stateAgg[s] = (stateAgg[s] || 0) + (Number(r.migrants) || 0);
  });

  // Turn into sorted array
  const stateRows = Object.entries(stateAgg).map(([state, val]) => ({ state, migrants: val }))
    .sort((a, b) => b.migrants - a.migrants);

  const tbody = document.querySelector("#stateTable tbody");
  tbody.innerHTML = "";
  if (stateRows.length === 0) {
    tbody.innerHTML = "<tr><td colspan='2' style='padding:10px;color:#666'>No data for selected country</td></tr>";
  } else {
    stateRows.forEach(r => {
      const tr = document.createElement("tr");
      const tdState = document.createElement("td"); tdState.textContent = r.state;
      const tdVal = document.createElement("td"); tdVal.textContent = r.migrants.toLocaleString();
      tr.appendChild(tdState); tr.appendChild(tdVal);
      tbody.appendChild(tr);
    });
  }
}

// kick off
init();
