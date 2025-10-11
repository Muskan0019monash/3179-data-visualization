// ==============================
// Load and Prepare Migration Data
// ==============================

// Load the CSV file dynamically using Vega's built-in loader
const migrationCSV = "migration.csv";

// We'll store parsed datasets globally for charts.js to access
let migrationData = [];

vega.loader().load(migrationCSV).then(raw => {
    migrationData = vega.read(raw, { type: "csv" });

    // Once data is loaded, render charts
    createCharts(migrationData);
}).catch(err => {
    console.error("Error loading migration data:", err);
});
