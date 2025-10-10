// Load and render the dashboard
d3.csv("migration.csv").then(data => {
  // Ensure numeric values
  data.forEach(d => {
    d.Population = +d.Population;
  });

  // ====== Summary Cards ======
  const uniqueCountries = [...new Set(data.map(d => d.Country))];
  const totalPopulation = d3.sum(data, d => d.Population);
  document.getElementById("countryCount").innerText = uniqueCountries.length;
  document.getElementById("populationCount").innerText = totalPopulation.toLocaleString();

  // ====== Country Dropdown ======
  const dropdown = document.getElementById("countrySelect");
  uniqueCountries.sort().forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    dropdown.appendChild(opt);
  });

  // ====== Default Charts ======
  renderCharts("All");

  // ====== Update on Country Change ======
  dropdown.addEventListener("change", () => {
    renderCharts(dropdown.value);
  });

  // ====== Chart Rendering Function ======
  function renderCharts(selectedCountry) {
    let filtered = selectedCountry === "All"
      ? data
      : data.filter(d => d.Country === selectedCountry);

    // ----- Chart 1: Demographics -----
    const demographicSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Migration demographics by age and gender",
      width: "container",
      height: 400,
      data: { values: filtered },
      mark: "bar",
      encoding: {
        x: { field: "AgeGroup", type: "nominal", title: "Age Group", axis: { labelAngle: 0 } },
        y: { aggregate: "sum", field: "Population", title: "Total Migrants" },
        color: { field: "Gender", type: "nominal", legend: { title: "Gender" } },
        tooltip: [
          { field: "AgeGroup", title: "Age Group" },
          { field: "Gender", title: "Gender" },
          { aggregate: "sum", field: "Population", title: "Migrants" }
        ]
      },
      config: { view: { stroke: null }, axis: { labelFontSize: 12, titleFontSize: 13 } }
    };

    // ----- Chart 2: Flow to Australian States -----
    const flowSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Migration flows to Australian states",
      width: "container",
      height: 400,
      data: { values: filtered },
      mark: { type: "circle", opacity: 0.8 },
      encoding: {
        x: { field: "State", type: "nominal", title: "Australian State", axis: { labelAngle: 0 } },
        y: { aggregate: "sum", field: "Population", title: "Migrants" },
        size: { aggregate: "sum", field: "Population", legend: { title: "Population Size" } },
        color: { field: "State", type: "nominal", legend: { title: "State" } },
        tooltip: [
          { field: "Country", title: "Origin Country" },
          { field: "State", title: "State" },
          { aggregate: "sum", field: "Population", title: "Migrants" }
        ]
      },
      config: { view: { stroke: null }, axis: { labelFontSize: 12, titleFontSize: 13 } }
    };

    vegaEmbed("#demographicChart", demographicSpec, { actions: false });
    vegaEmbed("#flowChart", flowSpec, { actions: false });
  }
});
